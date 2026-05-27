import { randomUUID } from "node:crypto";
import type {
  PipelineAsset,
  PipelineTrigger,
  RawFeedItem,
  Signal,
  TriggerType,
  WorkflowConfig,
} from "@omo/shared-types";
import { companyKeyFromItem } from "./grouping.js";
import { llmClassifyRole } from "./llm-classify.js";
import { normalizeRoleCluster } from "./taxonomy.js";

export interface ExtractOptions {
  noLlm?: boolean;
}

export interface ExtractionResult {
  signal: Signal;
  asset: PipelineAsset;
  trigger: PipelineTrigger;
  evidence: Array<{ url: string; title?: string; posted_at?: string }>;
  feedSources: string[];
}

export async function extractSignals(
  items: RawFeedItem[],
  workflow: WorkflowConfig,
  options: ExtractOptions = {},
): Promise<ExtractionResult[]> {
  const minRoles = workflow.trigger.min_similar_roles ?? 3;
  const windowDays = workflow.trigger.window_days ?? 14;
  const urgencyKeywords =
    workflow.detect.urgency_keywords ?? [
      "immediate",
      "urgent",
      "asap",
      "start immediately",
      "hiring multiple",
    ];

  const llmEnabled = workflow.detect.llm_classify?.enabled === true;
  const groups = new Map<string, RawFeedItem[]>();
  for (const item of items) {
    const deterministic = normalizeRoleCluster(item.title, item.description);
    const role = await llmClassifyRole(
      item,
      workflow.detect.llm_classify?.taxonomy ?? [],
      { enabled: llmEnabled, noLlm: options.noLlm ?? false },
      deterministic,
    );
    if (workflow.detect.llm_classify?.taxonomy?.length) {
      const allowed = workflow.detect.llm_classify.taxonomy;
      if (!allowed.includes(role) && role !== "other") {
        // keep other for non-matching when taxonomy is strict
      }
      if (role === "other" && allowed.length > 0) continue;
    }
    const key = `${companyKeyFromItem(item)}::${role}`;
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  const results: ExtractionResult[] = [];
  const now = Date.now();

  for (const [groupKey, groupItems] of groups) {
    const recent = filterByWindow(groupItems, windowDays, now);
    if (recent.length < minRoles) continue;

    const sample = recent[0]!;
    const roleCluster = groupKey.split("::")[1] ?? "other";
    const urgencyHits = findUrgencyHits(recent, urgencyKeywords);

    const triggerType: TriggerType =
      recent.length >= minRoles ? "hiring_surge" : "urgency_language";
    const strength =
      recent.length >= minRoles + 2 || urgencyHits.length > 0 ? "high" : "medium";

    const companyName = sample.company_name ?? companyKeyFromItem(sample);
    const signal: Signal = {
      id: `sig_${randomUUID().replace(/-/g, "").slice(0, 10)}`,
      company_key: companyKeyFromItem(sample),
      pain_category: roleCluster,
      role_cluster: roleCluster,
      hire_count: recent.length,
      evidence: recent.map((i) => i.id),
      urgency_hits: urgencyHits,
    };

    const asset: PipelineAsset = {
      type: workflow.asset.type,
      summary: `${companyName} hiring ${recent.length} ${roleCluster.replace(/_/g, " ")} roles in ${windowDays}d`,
      company: {
        name: companyName,
        domain: sample.company_domain ?? null,
      },
      role_cluster: roleCluster,
      hire_count: recent.length,
      pain_category: roleCluster,
    };

    const reasons: string[] = [
      `${recent.length} similar roles in ${windowDays} days (min ${minRoles})`,
    ];
    if (urgencyHits.length) reasons.push(`Urgency language: ${urgencyHits.join(", ")}`);

    const trigger: PipelineTrigger = {
      type: triggerType,
      strength,
      detected_at: new Date().toISOString(),
      reasons,
      window_days: windowDays,
    };

    results.push({
      signal,
      asset,
      trigger,
      evidence: recent.map((i) => ({
        url: i.url,
        title: i.title,
        posted_at: i.posted_at,
      })),
      feedSources: [...new Set(recent.map((i) => i.source))],
    });
  }

  return results;
}

function filterByWindow(items: RawFeedItem[], windowDays: number, now: number): RawFeedItem[] {
  const ms = windowDays * 86400000;
  return items.filter((i) => {
    if (!i.posted_at) return true;
    const t = Date.parse(i.posted_at);
    return Number.isNaN(t) || now - t <= ms;
  });
}

function findUrgencyHits(items: RawFeedItem[], keywords: string[]): string[] {
  const hits = new Set<string>();
  const blob = items.map((i) => `${i.title} ${i.description}`.toLowerCase()).join(" ");
  for (const kw of keywords) {
    if (blob.includes(kw.toLowerCase())) hits.add(kw);
  }
  return [...hits];
}
