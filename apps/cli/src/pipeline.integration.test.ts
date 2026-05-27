import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runPipeline } from "./pipeline.js";

function repoRoot(): string {
  return process.env.OMO_ROOT ?? resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
}

describe("pipeline integration", () => {
  it("runs hiring-signals with MOCK_FEEDS", async () => {
    process.env.MOCK_FEEDS = "true";
    process.env.OMO_ROOT = repoRoot();
    const out = await mkdtemp(join(tmpdir(), "omo-test-"));
    try {
      const result = await runPipeline({
        workflowPath: join(repoRoot(), "workflows/hiring-signals.yaml"),
        outputDir: out,
        limit: 50,
        minScore: 50,
        dryRun: false,
        noLlm: true,
      });
      expect(result.opportunities.length).toBeGreaterThanOrEqual(1);
      const manifest = JSON.parse(await readFile(join(out, "manifest.json"), "utf-8"));
      expect(manifest.mock_feeds).toBe(true);
      expect(result.opportunities[0]!.meta.framework_complete).toBe(false);
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });
});
