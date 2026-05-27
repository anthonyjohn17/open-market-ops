import { readFile } from "node:fs/promises";
import yaml from "js-yaml";
import { parseWorkflow } from "@omo/shared-types";

export async function loadWorkflow(path: string) {
  const raw = await readFile(path, "utf-8");
  return parseWorkflow(yaml.load(raw));
}
