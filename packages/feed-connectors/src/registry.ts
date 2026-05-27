import type { RawFeedItem, WorkflowConfig } from "@omo/shared-types";
import type { FetchOptions } from "./connector.js";
import { getConnector } from "./registry-store.js";
import { rateLimitDelay } from "./utils/rate-limit.js";

export { registerConnector, getConnector, listConnectors } from "./registry-store.js";

export async function fetchAllFeeds(
  workflow: WorkflowConfig,
  options: FetchOptions = {},
): Promise<RawFeedItem[]> {
  const items: RawFeedItem[] = [];
  const mock = options.mock ?? process.env.MOCK_FEEDS === "true";

  for (const { id, config } of workflow.feed.connectors) {
    if (config?.enabled === false && !mock) continue;

    await rateLimitDelay(mock ? 0 : 250);

    const connector = getConnector(id, config);
    if (!connector) {
      throw new Error(`Unknown connector: ${id}. Register it or check workflow YAML.`);
    }

    const batch = await connector.fetch({
      ...options,
      mock,
      connectorConfig: config,
    });
    items.push(...batch);
  }

  return items;
}
