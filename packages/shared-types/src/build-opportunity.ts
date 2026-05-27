import { randomUUID } from "node:crypto";
import { SCORING_EVAL_VERSION } from "./constants.js";
import type {
  Opportunity,
  OpportunityScores,
  PipelineAsset,
  PipelineTrigger,
  Signal,
  WorkflowConfig,
} from "./types.js";

export interface BuildOpportunityInput {
  runId: string;
  workflow: WorkflowConfig;
  signal: Signal;
  asset: PipelineAsset;
  trigger: PipelineTrigger;
  scores: OpportunityScores;
  feedSources: string[];
  evidence: Opportunity["feed"]["evidence"];
  frameworkComplete?: boolean;
}

/** Merge pipeline outputs with workflow buyer/monetize stubs (MVP default). */
export function buildOpportunityFromPipeline(input: BuildOpportunityInput): Opportunity {
  const {
    runId,
    workflow,
    signal,
    asset,
    trigger,
    scores,
    feedSources,
    evidence,
    frameworkComplete = false,
  } = input;

  const primaryMonetization = workflow.monetize.recommended[0];

  return {
    meta: {
      id: `opp_${randomUUID().replace(/-/g, "").slice(0, 12)}`,
      run_id: runId,
      workflow_id: workflow.name,
      workflow_version: workflow.version,
      wedge: workflow.wedge,
      created_at: new Date().toISOString(),
      framework_complete: frameworkComplete,
    },
    feed: {
      sources: feedSources,
      item_count: signal.evidence.length,
      evidence,
    },
    asset,
    trigger,
    buyer: {
      source: frameworkComplete ? "buyer_matching_engine" : "workflow_stub",
      segments: workflow.buyer.segments,
      buyer_density: scores.buyer_density,
    },
    monetization: {
      source: frameworkComplete ? "monetization_engine" : "workflow_stub",
      recommended: workflow.monetize.recommended,
      primary: primaryMonetization,
      rationale: `Workflow-declared paths for wedge ${workflow.wedge}. Enable monetization-engine in v0.2+.`,
      monetization_speed: scores.liquidity_speed,
    },
    scores: {
      ...scores,
      eval_version: scores.eval_version ?? SCORING_EVAL_VERSION,
    },
    signal,
  };
}
