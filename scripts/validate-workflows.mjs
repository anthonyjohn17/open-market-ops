#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

import { fileURLToPath } from "node:url";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const workflowsDir = join(root, "workflows");

const files = (await readdir(workflowsDir)).filter(
  (f) => f.endsWith(".yaml") && !f.startsWith("_"),
);

let failed = 0;
for (const file of files) {
  const path = join(workflowsDir, file);
  const code = await new Promise((res) => {
    const child = spawn("node", ["apps/cli/dist/cli.js", "validate", path], {
      cwd: root,
      stdio: "inherit",
    });
    child.on("close", res);
  });
  if (code !== 0) failed++;
}

if (failed) process.exit(1);
console.log(`Validated ${files.length} workflows.`);
