import type { ConnectorFactory } from "../connector.js";
import { loadMockFeedItems } from "../mock/fixtures.js";

/** Stub until official API adapter — see docs/compliance.md */
export const linkedinJobsConnector: ConnectorFactory = () => ({
  id: "linkedin_jobs",
  async fetch(options) {
    if (options.mock || process.env.MOCK_FEEDS === "true") {
      const all = await loadMockFeedItems();
      return all.filter((i) => i.source === "linkedin_jobs").slice(0, options.limit);
    }
    return [];
  },
});
