import type { RawFeedItem } from "@omo/shared-types";

/**
 * Optional LLM classification (MVP: disabled unless workflow + env allow).
 * v0.2 may call OpenAI; MVP returns deterministic taxonomy result when skipped.
 */
export async function llmClassifyRole(
  item: RawFeedItem,
  taxonomy: string[],
  options: { enabled: boolean; noLlm: boolean },
  deterministicFallback: string,
): Promise<string> {
  if (!options.enabled || options.noLlm) {
    return deterministicFallback;
  }
  if (!process.env.OPENAI_API_KEY) {
    return deterministicFallback;
  }
  // Placeholder: wire OpenAI in v0.2; keep deterministic for reproducible OSS CI.
  void item;
  void taxonomy;
  return deterministicFallback;
}
