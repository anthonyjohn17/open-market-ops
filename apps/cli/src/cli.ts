#!/usr/bin/env node
import { resolve } from "node:path";
import { Command } from "commander";
import { listConnectors } from "@omo/feed-connectors";
import { runPipeline } from "./pipeline.js";
import { loadWorkflow } from "./load-workflow.js";

const program = new Command();

program.name("omo").description("OpportunityOS CLI — liquidity intelligence").version("0.1.0");

program
  .command("run")
  .argument("<workflow>", "Path to workflow YAML")
  .option("-o, --output <dir>", "Output directory", "./out")
  .option("--limit <n>", "Max raw items per connector", "100")
  .option("--min-score <n>", "Minimum opportunity score to write", "60")
  .option("--dry-run", "Validate and exit without fetch")
  .option("--no-llm", "Disable LLM classification (deterministic only)")
  .action(async (workflowPath: string, opts) => {
    try {
      const result = await runPipeline({
        workflowPath: resolve(workflowPath),
        outputDir: resolve(opts.output),
        limit: Number(opts.limit),
        minScore: Number(opts.minScore),
        dryRun: opts.dryRun ?? false,
        noLlm: opts.noLlm ?? false,
      });
      if (result.dryRun) {
        console.log("Workflow valid:", result.workflow.name, `(${result.workflow.wedge})`);
        process.exit(0);
      }
      console.log(`Run ${result.manifest.run_id}: ${result.opportunities.length} opportunities`);
      console.log(`Output: ${opts.output}`);
      for (const o of result.opportunities) {
        console.log(
          `  ${o.meta.id} score=${o.scores.opportunity_score} ${o.asset.company?.name ?? "unknown"}`,
        );
      }
      process.exit(0);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      process.exit(2);
    }
  });

program
  .command("validate")
  .argument("<workflow>", "Path to workflow YAML")
  .action(async (workflowPath: string) => {
    try {
      const wf = await loadWorkflow(resolve(workflowPath));
      console.log("OK:", workflowPath, `— wedge: ${wf.wedge}`);
      process.exit(0);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command("connectors")
  .description("List registered feed connectors")
  .action(() => {
    console.log("Registered connectors:");
    for (const id of listConnectors()) {
      console.log(`  - ${id}`);
    }
    process.exit(0);
  });

program.parse();
