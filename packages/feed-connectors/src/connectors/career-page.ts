import type { ConnectorFactory } from "../connector.js";
import { loadMockFeedItems } from "../mock/fixtures.js";

export const careerPageConnector: ConnectorFactory = () => ({
  id: "career_page",
  async fetch(options) {
    if (options.mock || process.env.MOCK_FEEDS === "true") {
      const all = await loadMockFeedItems();
      return all.filter((i) => i.source === "career_page").slice(0, options.limit);
    }
    const urls = (options.connectorConfig?.urls as string[] | undefined) ?? [];
    if (urls.length === 0) return [];
    throw new Error("Career page live fetch not implemented in v0.1 scaffold.");
  },
});
