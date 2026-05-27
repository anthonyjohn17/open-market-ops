import { describe, expect, it } from "vitest";
import type { PipelineTrigger, Signal } from "@omo/shared-types";
import { scoreExtraction } from "./score.js";

const baseSignal: Signal = {
  id: "sig_test",
  company_key: "test.co",
  pain_category: "customer_support",
  role_cluster: "customer_support",
  hire_count: 4,
  evidence: ["a", "b", "c", "d"],
  urgency_hits: ["urgent"],
};

const baseTrigger: PipelineTrigger = {
  type: "hiring_surge",
  strength: "high",
  detected_at: new Date().toISOString(),
  reasons: ["4 roles"],
};

const workflow = {
  scoring: {
    weights: {
      urgency: 0.25,
      buyer_density: 0.2,
      monetization_potential: 0.25,
      competition: 0.15,
      liquidity_speed: 0.15,
    },
  },
};

describe("scoreExtraction", () => {
  it("scores high cluster above low cluster", () => {
    const high = scoreExtraction(
      { signal: baseSignal, trigger: baseTrigger },
      workflow as never,
    );
    const low = scoreExtraction(
      {
        signal: { ...baseSignal, hire_count: 1, evidence: ["a"] },
        trigger: { ...baseTrigger, strength: "low" },
      },
      workflow as never,
    );
    expect(high.opportunity_score).toBeGreaterThan(low.opportunity_score);
  });
});
