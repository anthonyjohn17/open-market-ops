import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseOpportunity, parseWorkflow } from "./schemas.js";

function repoRoot(): string {
  return process.env.OMO_ROOT ?? resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
}

describe("schema validators", () => {
  it("parses golden opportunity fixture", async () => {
    const root = repoRoot();
    const raw = await readFile(join(root, "examples/sample-opportunity.json"), "utf-8");
    const opp = parseOpportunity(JSON.parse(raw));
    expect(opp.meta.wedge).toBe("hiring-signals");
    expect(opp.meta.framework_complete).toBe(false);
  });

  it("parses hiring-signals workflow YAML", async () => {
    const root = repoRoot();
    const yaml = await import("js-yaml");
    const raw = await readFile(join(root, "workflows/hiring-signals.yaml"), "utf-8");
    const wf = parseWorkflow(yaml.load(raw));
    expect(wf.wedge).toBe("hiring-signals");
    expect(wf.feed.connectors.length).toBeGreaterThanOrEqual(2);
  });
});
