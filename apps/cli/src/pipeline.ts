import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import yaml from "js-yaml";
import { fetchAllFeeds, dedupeFeedItems } from "@omo/feed-connectors";
import { extractSignals } from "@omo/signal-engine";
import { scoreExtraction } from "@omo/opportunity-scoring";
import { writeOutputs } from "@omo/output-writers";
import {
  buildOpportunityFromPipeline,
  parseWorkflow,
  type Opportunity,
  type RunManifest,
  type WorkflowConfig,
} from "@omo/shared-types";

export interface PipelineOptions {
  workflowPath: string;
  outputDir: string;
  limit: number;
  minScore: number;
  dryRun: boolean;
  noLlm?: boolean;
}

export interface PipelineResult {
  dryRun?: boolean;
  workflow: WorkflowConfig;
  manifest: RunManifest;
  opportunities: Opportunity[];
}

export async function runPipeline(options: PipelineOptions): Promise<PipelineResult> {
  const raw = await readFile(options.workflowPath, "utf-8");
  const workflow = parseWorkflow(yaml.load(raw));
  const mock = process.env.MOCK_FEEDS === "true";

  if (options.dryRun) {
    return {
      dryRun: true,
      workflow,
      manifest: emptyManifest(workflow, mock),
      opportunities: [],
    };
  }

  const runId = `run_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
  const started = new Date().toISOString();

  const rawItems = dedupeFeedItems(
    await fetchAllFeeds(workflow, { limit: options.limit, mock }),
  );

  const extractions = await extractSignals(rawItems, workflow, {
    noLlm: options.noLlm ?? process.env.OMO_NO_LLM === "true",
  });
  const opportunities: Opportunity[] = [];

  for (const ext of extractions) {
    const scores = scoreExtraction(
      { signal: ext.signal, trigger: ext.trigger },
      workflow,
    );
    if (scores.opportunity_score < (workflow.scoring?.min_opportunity_score ?? 0)) continue;

    opportunities.push(
      buildOpportunityFromPipeline({
        runId,
        workflow,
        signal: ext.signal,
        asset: ext.asset,
        trigger: ext.trigger,
        scores,
        feedSources: ext.feedSources,
        evidence: ext.evidence,
        frameworkComplete: false,
      }),
    );
  }

  const manifest: RunManifest = {
    run_id: runId,
    workflow_id: workflow.name,
    workflow_version: workflow.version,
    wedge: workflow.wedge,
    started_at: started,
    finished_at: new Date().toISOString(),
    connector_ids: workflow.feed.connectors.map((c) => c.id),
    opportunity_count: opportunities.length,
    mock_feeds: mock,
  };

  const formats = workflow.output?.formats ?? ["opportunity_cards", "csv"];
  await writeOutputs(opportunities, manifest, {
    outputDir: options.outputDir,
    formats,
    minScore: options.minScore,
  });

  return { workflow, manifest, opportunities };
}

function emptyManifest(workflow: WorkflowConfig, mock: boolean): RunManifest {
  return {
    run_id: "dry_run",
    workflow_id: workflow.name,
    workflow_version: workflow.version,
    wedge: workflow.wedge,
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    connector_ids: workflow.feed.connectors.map((c) => c.id),
    opportunity_count: 0,
    mock_feeds: mock,
  };
}
