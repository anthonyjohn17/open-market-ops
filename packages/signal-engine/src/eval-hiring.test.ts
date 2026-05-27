import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { RawFeedItem, WorkflowConfig } from "@omo/shared-types";
import { parseWorkflow } from "@omo/shared-types";
import yaml from "js-yaml";
import { extractSignals } from "./extract.js";
import { companyKeyFromItem } from "./grouping.js";

function repoRoot(): string {
  return process.env.OMO_ROOT ?? resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
}

interface LabelRow {
  id: string;
  company_key: string;
  role_cluster: string;
  expected: "positive" | "negative";
  synthetic_hire_count: number;
  urgency_language?: boolean;
}

function syntheticItems(label: LabelRow): RawFeedItem[] {
  const titles: Record<string, string> = {
    customer_support: "Customer Support Specialist",
    claims_processing: "Insurance Claims Processor",
    data_entry: "Data Entry Clerk",
    virtual_assistant: "Virtual Assistant",
    other: "Senior Software Engineer",
  };
  const title = titles[label.role_cluster] ?? "Customer Support Agent";
  const urgency = label.urgency_language ? " Immediate start. Urgent hiring." : "";
  const items: RawFeedItem[] = [];
  for (let i = 0; i < label.synthetic_hire_count; i++) {
    items.push({
      id: `${label.id}_${i}`,
      source: "eval",
      external_id: `${label.id}-${i}`,
      fetched_at: new Date().toISOString(),
      company_name: label.company_key.split(".")[0] ?? label.company_key,
      company_domain: label.company_key.includes(".") ? label.company_key : null,
      title,
      description: `Role for ${label.role_cluster}.${urgency}`,
      url: `https://eval.example/${label.id}/${i}`,
      posted_at: new Date().toISOString(),
    });
  }
  return items;
}

describe("hiring-signals eval", () => {
  it("meets precision/recall baseline on labeled-clusters.json", async () => {
    const root = repoRoot();
    const workflow = parseWorkflow(
      yaml.load(await readFile(join(root, "workflows/hiring-signals.yaml"), "utf-8")),
    ) as WorkflowConfig;
    const dataset = JSON.parse(
      await readFile(join(root, "datasets/hiring-signals/labeled-clusters.json"), "utf-8"),
    ) as { labels: LabelRow[] };

    expect(dataset.labels.length).toBeGreaterThanOrEqual(50);

    let tp = 0;
    let fp = 0;
    let tn = 0;
    let fn = 0;

    for (const label of dataset.labels) {
      const items = syntheticItems(label);
      const results = await extractSignals(items, workflow, { noLlm: true });
      const hit = results.some(
        (r) =>
          r.signal.company_key === label.company_key ||
          companyKeyFromItem(items[0]!) === r.signal.company_key,
      );

      if (label.expected === "positive") {
        if (hit) tp++;
        else fn++;
      } else {
        if (hit) fp++;
        else tn++;
      }
    }

    const precision = tp / (tp + fp || 1);
    const recall = tp / (tp + fn || 1);

    // Documented MVP baseline (synthetic labels)
    expect(precision).toBeGreaterThanOrEqual(0.75);
    expect(recall).toBeGreaterThanOrEqual(0.75);

    // Written to test output for docs/PRD reference
    expect(tp + fp + tn + fn).toBe(dataset.labels.length);
  });
});
