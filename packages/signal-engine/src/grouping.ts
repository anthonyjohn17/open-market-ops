import type { RawFeedItem } from "@omo/shared-types";

export function companyKeyFromItem(item: RawFeedItem): string {
  if (item.company_domain) {
    return item.company_domain.toLowerCase().replace(/^www\./, "");
  }
  const name = item.company_name?.trim().toLowerCase();
  return name ? `name:${name}` : `unknown:${item.id}`;
}
