import { mkdir, writeFile, appendFile } from "node:fs/promises";
import { join } from "node:path";
import { parseOpportunity, type Opportunity, type RunManifest } from "@omo/shared-types";

export interface OutputOptions {
  outputDir: string;
  formats: string[];
  minScore?: number;
}

export interface OutputResult {
  manifestPath: string;
  paths: string[];
}

export async function writeOutputs(
  opportunities: Opportunity[],
  manifest: RunManifest,
  options: OutputOptions,
): Promise<OutputResult> {
  const minScore = options.minScore ?? 0;
  const filtered = opportunities.filter((o) => o.scores.opportunity_score >= minScore);

  for (const o of filtered) {
    parseOpportunity(o);
  }

  await mkdir(options.outputDir, { recursive: true });
  const paths: string[] = [];

  const manifestPath = join(options.outputDir, "manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  paths.push(manifestPath);

  if (options.formats.includes("opportunity_cards")) {
    const dir = join(options.outputDir, "opportunities");
    await mkdir(dir, { recursive: true });
    for (const o of filtered) {
      const p = join(dir, `${o.meta.id}.json`);
      await writeFile(p, JSON.stringify(o, null, 2));
      paths.push(p);
    }
  }

  if (options.formats.includes("csv")) {
    const csvPath = join(options.outputDir, "opportunities.csv");
    await writeFile(csvPath, opportunitiesToCsv(filtered));
    paths.push(csvPath);
  }

  if (options.formats.includes("alerts_jsonl")) {
    const jsonlPath = join(options.outputDir, "alerts.jsonl");
    await writeFile(jsonlPath, "");
    for (const o of filtered) {
      await appendFile(jsonlPath, `${JSON.stringify({ id: o.meta.id, score: o.scores.opportunity_score, wedge: o.meta.wedge, company: o.asset.company?.name })}\n`);
    }
    paths.push(jsonlPath);
  }

  return { manifestPath, paths };
}

function opportunitiesToCsv(rows: Opportunity[]): string {
  const header = [
    "id",
    "wedge",
    "opportunity_score",
    "company",
    "role_cluster",
    "hire_count",
    "trigger_type",
    "framework_complete",
  ];
  const lines = rows.map((o) =>
    [
      o.meta.id,
      o.meta.wedge,
      o.scores.opportunity_score,
      escapeCsv(o.asset.company?.name ?? ""),
      o.asset.role_cluster ?? "",
      o.asset.hire_count ?? "",
      o.trigger.type,
      o.meta.framework_complete,
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
