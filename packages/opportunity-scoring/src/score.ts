import {
  SCORING_EVAL_VERSION,
  type OpportunityScores,
  type PipelineTrigger,
  type Signal,
  type WorkflowConfig,
} from "@omo/shared-types";

export interface ScoreInput {
  signal: Signal;
  trigger: PipelineTrigger;
}

/**
 * MVP scoring uses proxy dimensions until buyer-matching and monetization-engine ship.
 * - buyer_density: fixed high for hiring-signals wedge
 * - competition: moderate baseline
 * - spread_estimate: derived from composite score bands
 */
const DEFAULT_WEIGHTS = {
  urgency: 0.25,
  buyer_density: 0.2,
  monetization_potential: 0.25,
  competition: 0.15,
  liquidity_speed: 0.15,
};

export function scoreExtraction(
  input: ScoreInput,
  workflow: WorkflowConfig,
): OpportunityScores {
  const weights = { ...DEFAULT_WEIGHTS, ...workflow.scoring?.weights };

  const urgencyLevel = mapTriggerStrength(input.trigger.strength);
  const hireCount = input.signal.hire_count;
  const hasUrgencyLang = (input.signal.urgency_hits?.length ?? 0) > 0;

  const urgencyScore = urgencyLevel === "high" ? 90 : urgencyLevel === "medium" ? 65 : 40;
  const buyerDensityScore = 80; // MVP proxy: agencies abundant for hiring-signals
  const monetizationScore = Math.min(95, 50 + hireCount * 8);
  const competitionScore = 70; // MVP proxy: moderate
  const liquidityScore = hasUrgencyLang || urgencyLevel === "high" ? 85 : 60;

  const composite =
    (urgencyScore * (weights.urgency ?? 0.25) +
      buyerDensityScore * (weights.buyer_density ?? 0.2) +
      monetizationScore * (weights.monetization_potential ?? 0.25) +
      (100 - competitionScore) * (weights.competition ?? 0.15) +
      liquidityScore * (weights.liquidity_speed ?? 0.15)) /
    1;

  const spread =
    composite >= 80 ? "medium-high" : composite >= 65 ? "medium" : "low";

  const confidence = Math.min(
    0.95,
    0.5 + input.signal.evidence.length * 0.05 + (hasUrgencyLang ? 0.1 : 0),
  );

  return {
    opportunity_score: Math.round(Math.min(100, composite)),
    confidence: Math.round(confidence * 100) / 100,
    spread_estimate: spread as OpportunityScores["spread_estimate"],
    urgency: urgencyLevel,
    buyer_density: "high",
    monetization_potential: monetizationScore >= 75 ? "high" : "medium",
    competition: "medium",
    liquidity_speed: liquidityScore >= 80 ? "fast" : "medium",
    eval_version: SCORING_EVAL_VERSION,
  };
}

function mapTriggerStrength(s: "low" | "medium" | "high"): "low" | "medium" | "high" {
  return s;
}
