import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { RawFeedItem } from "@omo/shared-types";

function resolveRepoRoot(): string {
  if (process.env.OMO_ROOT) return resolve(process.env.OMO_ROOT);
  const cwd = process.cwd();
  if (cwd.includes("open-market-ops")) {
    const idx = cwd.lastIndexOf("open-market-ops");
    return resolve(cwd.slice(0, idx + "open-market-ops".length));
  }
  return resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
}

/** Resolve dataset path from repo root (CLI runs with cwd = repo root). */
export async function loadMockFeedItems(): Promise<RawFeedItem[]> {
  const root = resolveRepoRoot();
  const path = join(resolve(root), "datasets/hiring-signals/sample-raw-items.json");
  const raw = await readFile(path, "utf-8");
  return JSON.parse(raw) as RawFeedItem[];
}
