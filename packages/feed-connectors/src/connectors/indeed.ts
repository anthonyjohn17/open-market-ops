import type { ConnectorFactory } from "../connector.js";
import { loadMockFeedItems } from "../mock/fixtures.js";

export const indeedConnector: ConnectorFactory = () => ({
  id: "indeed",
  async fetch(options) {
    if (options.mock || process.env.MOCK_FEEDS === "true") {
      const all = await loadMockFeedItems();
      return all.filter((i) => i.source === "indeed").slice(0, options.limit);
    }
    throw new Error(
      "Indeed live fetch not implemented in v0.1 scaffold. Set MOCK_FEEDS=true or implement connector.",
    );
  },
});
