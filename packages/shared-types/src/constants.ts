export const WEDGE_IDS = [
  "hiring-signals",
  "distressed-saas",
  "local-closures",
  "ai-agency-prospecting",
  "expired-domains",
  "market-triggers",
] as const;

export type WedgeId = (typeof WEDGE_IDS)[number];

export const MONETIZATION_ARCHETYPES = [
  "flip",
  "broker",
  "retainer",
  "relaunch",
  "lead_generation",
  "data_product",
] as const;

export type MonetizationArchetype = (typeof MONETIZATION_ARCHETYPES)[number];

export const TRIGGER_TYPES = [
  "hiring_surge",
  "urgency_language",
  "closure",
  "rank_decline",
  "founder_burnout",
  "price_drop",
  "domain_expiry",
  "other",
] as const;

export type TriggerType = (typeof TRIGGER_TYPES)[number];

export const SCORING_EVAL_VERSION = "scoring/v1";

/** MVP: false until buyer-matching + monetization-engine populate runtime fields. */
export function isFrameworkComplete(flags: {
  buyerEngine?: boolean;
  monetizationEngine?: boolean;
}): boolean {
  return Boolean(flags.buyerEngine && flags.monetizationEngine);
}
