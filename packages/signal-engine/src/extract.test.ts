import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { RawFeedItem, WorkflowConfig } from "@omo/shared-types";
import { parseWorkflow } from "@omo/shared-types";
import yaml from "js-yaml";
import { extractSignals } from "./extract.js";

function repoRoot(): string {
  if (process.env.OMO_ROOT) return resolve(process.env.OMO_ROOT);
  // packages/signal-engine → repo root
  return resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
}

describe("extractSignals", () => {
  it("detects Acme support hiring cluster from fixtures", async () => {
    const root = repoRoot();
    const workflowRaw = await readFile(join(root, "workflows/hiring-signals.yaml"), "utf-8");
    const workflow = parseWorkflow(yaml.load(workflowRaw)) as WorkflowConfig;

    const items = JSON.parse(
      await readFile(join(root, "datasets/hiring-signals/sample-raw-items.json"), "utf-8"),
    ) as RawFeedItem[];

    const results = await extractSignals(items, workflow, { noLlm: true });
    const acme = results.find((r) => r.signal.company_key === "acmeinsurance.example");
    expect(acme).toBeDefined();
    expect(acme!.signal.hire_count).toBeGreaterThanOrEqual(3);
    expect(acme!.trigger.type).toBe("hiring_surge");
  });
});
