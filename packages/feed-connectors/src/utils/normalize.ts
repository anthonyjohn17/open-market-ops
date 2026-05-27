import type { RawFeedItem } from "@omo/shared-types";

/** Ensure required fields and stable ids for connector output. */
export function normalizeFeedItem(
  partial: Omit<RawFeedItem, "id" | "fetched_at"> & {
    id?: string;
    fetched_at?: string;
  },
): RawFeedItem {
  const fetched_at = partial.fetched_at ?? new Date().toISOString();
  const external_id = partial.external_id ?? partial.id;
  const id =
    partial.id ??
    `${partial.source}_${external_id ?? Buffer.from(partial.url).toString("base64url").slice(0, 12)}`;

  return {
    ...partial,
    id,
    external_id,
    fetched_at,
    company_domain: partial.company_domain ?? null,
    description: partial.description ?? "",
    title: partial.title ?? "Untitled",
  };
}
