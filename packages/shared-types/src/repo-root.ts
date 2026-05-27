import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Resolve monorepo root (works from packages and apps). */
export function findRepoRoot(fromDir?: string): string {
  if (process.env.OMO_ROOT) return resolve(process.env.OMO_ROOT);
  const start = fromDir ?? process.cwd();
  // Walk up looking for pnpm-workspace.yaml would be ideal; MVP: known relative from packages/*
  return resolve(start.includes("apps/cli") ? resolve(start, "../..") : start);
}

export function repoRootFromImportMeta(metaUrl: string): string {
  if (process.env.OMO_ROOT) return resolve(process.env.OMO_ROOT);
  const dir = dirname(fileURLToPath(metaUrl));
  return resolve(dir, "../../..");
}
