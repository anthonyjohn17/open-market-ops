import type { MonetizationArchetype, TriggerType, WedgeId } from "./constants.js";

export interface RawFeedItem {
  id: string;
  source: string;
  external_id?: string;
  fetched_at: string;
  company_name?: string;
  company_domain?: string | null;
  title: string;
  description: string;
  location?: string;
  posted_at?: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export interface Signal {
  id: string;
  company_key: string;
  pain_category: string;
  role_cluster: string;
  hire_count: number;
  evidence: string[];
  urgency_hits?: string[];
}

export interface PipelineAsset {
  type: string;
  summary: string;
  company?: { name: string; domain?: string | null };
  role_cluster?: string;
  hire_count?: number;
  pain_category?: string;
}

export interface PipelineTrigger {
  type: TriggerType;
  strength: "low" | "medium" | "high";
  detected_at: string;
  reasons: string[];
  window_days?: number;
}

export interface WorkflowConfig {
  name: string;
  version: string;
  description?: string;
  wedge: WedgeId | string;
  feed: {
    connectors: Array<{ id: string; config?: Record<string, unknown> }>;
    schedule?: string;
  };
  detect: {
    rules?: string[];
    urgency_keywords?: string[];
    llm_classify?: {
      enabled?: boolean;
      taxonomy?: string[];
      prompt_version?: string;
    };
  };
  asset: { type: string; extract?: string[] };
  trigger: {
    min_similar_roles?: number;
    window_days?: number;
    boost_if?: string[];
  };
  buyer: { segments: string[]; match?: string };
  monetize: { recommended: MonetizationArchetype[]; scoring?: string };
  scoring?: {
    min_opportunity_score?: number;
    weights?: Record<string, number>;
  };
  output?: {
    formats?: string[];
    min_score?: number;
  };
}

export interface OpportunityScores {
  opportunity_score: number;
  confidence: number;
  spread_estimate?: "low" | "medium" | "medium-high" | "high";
  urgency: "low" | "medium" | "high";
  buyer_density: "low" | "medium" | "high";
  monetization_potential: "low" | "medium" | "high";
  competition: "low" | "medium" | "high";
  liquidity_speed: "slow" | "medium" | "fast";
  eval_version: string;
}

export interface Opportunity {
  meta: {
    id: string;
    run_id: string;
    workflow_id: string;
    workflow_version?: string;
    wedge: string;
    created_at: string;
    framework_complete: boolean;
  };
  feed: {
    sources: string[];
    item_count?: number;
    evidence: Array<{ url: string; title?: string; posted_at?: string }>;
  };
  asset: PipelineAsset;
  trigger: PipelineTrigger;
  buyer: {
    source: "workflow_stub" | "buyer_matching_engine";
    segments: string[];
    top_buyers?: Array<{ segment: string; fit_score?: number; rationale?: string }>;
    buyer_density?: "low" | "medium" | "high";
  };
  monetization: {
    source: "workflow_stub" | "monetization_engine";
    recommended: MonetizationArchetype[];
    primary?: string;
    rationale?: string;
    monetization_speed?: "slow" | "medium" | "fast";
  };
  scores: OpportunityScores;
  signal?: Signal;
}

export interface RunManifest {
  run_id: string;
  workflow_id: string;
  workflow_version: string;
  wedge: string;
  started_at: string;
  finished_at: string;
  connector_ids: string[];
  opportunity_count: number;
  mock_feeds: boolean;
}
