import { z } from "zod";
import { MONETIZATION_ARCHETYPES, TRIGGER_TYPES } from "./constants.js";

export const RawFeedItemSchema = z.object({
  id: z.string(),
  source: z.string(),
  external_id: z.string().optional(),
  fetched_at: z.string(),
  company_name: z.string().optional(),
  company_domain: z.string().nullable().optional(),
  title: z.string(),
  description: z.string(),
  location: z.string().optional(),
  posted_at: z.string().optional(),
  url: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export const WorkflowConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  wedge: z.string(),
  feed: z.object({
    connectors: z.array(
      z.object({
        id: z.string(),
        config: z.record(z.unknown()).optional(),
      }),
    ),
    schedule: z.string().optional(),
  }),
  detect: z
    .object({
      rules: z.array(z.string()).optional(),
      urgency_keywords: z.array(z.string()).optional(),
      llm_classify: z
        .object({
          enabled: z.boolean().optional(),
          taxonomy: z.array(z.string()).optional(),
          prompt_version: z.string().optional(),
        })
        .optional(),
    })
    .optional()
    .default({}),
  asset: z.object({
    type: z.string(),
    extract: z.array(z.string()).optional(),
  }),
  trigger: z.object({
    min_similar_roles: z.number().optional(),
    window_days: z.number().optional(),
    boost_if: z.array(z.string()).optional(),
  }),
  buyer: z.object({
    segments: z.array(z.string()),
    match: z.string().optional(),
  }),
  monetize: z.object({
    recommended: z.array(z.enum(MONETIZATION_ARCHETYPES)),
    scoring: z.string().optional(),
  }),
  scoring: z
    .object({
      min_opportunity_score: z.number().optional(),
      weights: z.record(z.number()).optional(),
    })
    .optional(),
  output: z
    .object({
      formats: z.array(z.string()).optional(),
      min_score: z.number().optional(),
    })
    .optional(),
});

export const OpportunitySchema = z.object({
  meta: z.object({
    id: z.string().startsWith("opp_"),
    run_id: z.string(),
    workflow_id: z.string(),
    workflow_version: z.string().optional(),
    wedge: z.string(),
    created_at: z.string(),
    framework_complete: z.boolean(),
  }),
  feed: z.object({
    sources: z.array(z.string()),
    item_count: z.number().optional(),
    evidence: z.array(
      z.object({
        url: z.string(),
        title: z.string().optional(),
        posted_at: z.string().optional(),
      }),
    ),
  }),
  asset: z.object({
    type: z.string(),
    summary: z.string(),
    company: z
      .object({
        name: z.string(),
        domain: z.string().nullable().optional(),
      })
      .optional(),
    role_cluster: z.string().optional(),
    hire_count: z.number().optional(),
    pain_category: z.string().optional(),
  }),
  trigger: z.object({
    type: z.enum(TRIGGER_TYPES),
    strength: z.enum(["low", "medium", "high"]),
    detected_at: z.string(),
    reasons: z.array(z.string()),
    window_days: z.number().optional(),
  }),
  buyer: z.object({
    source: z.enum(["workflow_stub", "buyer_matching_engine"]),
    segments: z.array(z.string()),
    top_buyers: z
      .array(
        z.object({
          segment: z.string(),
          fit_score: z.number().optional(),
          rationale: z.string().optional(),
        }),
      )
      .optional(),
    buyer_density: z.enum(["low", "medium", "high"]).optional(),
  }),
  monetization: z.object({
    source: z.enum(["workflow_stub", "monetization_engine"]),
    recommended: z.array(z.enum(MONETIZATION_ARCHETYPES)),
    primary: z.string().optional(),
    rationale: z.string().optional(),
    monetization_speed: z.enum(["slow", "medium", "fast"]).optional(),
  }),
  scores: z.object({
    opportunity_score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(1),
    spread_estimate: z.enum(["low", "medium", "medium-high", "high"]).optional(),
    urgency: z.enum(["low", "medium", "high"]),
    buyer_density: z.enum(["low", "medium", "high"]),
    monetization_potential: z.enum(["low", "medium", "high"]),
    competition: z.enum(["low", "medium", "high"]),
    liquidity_speed: z.enum(["slow", "medium", "fast"]),
    eval_version: z.string(),
  }),
});

export function parseWorkflow(data: unknown) {
  return WorkflowConfigSchema.parse(data);
}

export function parseOpportunity(data: unknown) {
  return OpportunitySchema.parse(data);
}
