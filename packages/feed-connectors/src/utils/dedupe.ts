import type { RawFeedItem } from "@omo/shared-types";

export function dedupeFeedItems(items: RawFeedItem[]): RawFeedItem[] {
  const seen = new Set<string>();
  const out: RawFeedItem[] = [];

  for (const item of items) {
    const key = `${item.source}:${item.external_id ?? item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}
