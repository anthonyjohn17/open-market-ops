import { describe, expect, it } from "vitest";
import type { RawFeedItem } from "@omo/shared-types";
import { dedupeFeedItems } from "./utils/dedupe.js";
import { normalizeFeedItem } from "./utils/normalize.js";

describe("feed-connectors utils", () => {
  it("dedupes by source and external_id", () => {
    const a: RawFeedItem = {
      id: "1",
      source: "indeed",
      external_id: "x",
      fetched_at: new Date().toISOString(),
      title: "A",
      description: "",
      url: "https://a",
    };
    const b = { ...a, id: "2" };
    expect(dedupeFeedItems([a, b])).toHaveLength(1);
  });

  it("normalizes required fields", () => {
    const item = normalizeFeedItem({
      source: "indeed",
      title: "Support",
      description: "desc",
      url: "https://example.com/job",
    });
    expect(item.id).toBeTruthy();
    expect(item.fetched_at).toBeTruthy();
  });
});
