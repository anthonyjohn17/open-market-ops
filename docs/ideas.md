# Open Market Ops — Product & Repository Vision

**Version:** 1.0  
**Status:** Ideation / architecture exploration  
**Last updated:** May 2026  
**Related:** [concept.md](./concept.md) — liquidity intelligence framework (Feed → Asset → Trigger → Buyer → Monetization)

---

## Executive Summary

Open Market Ops is the seed of an **open-source economic opportunity intelligence system**: a modular architecture for detecting hidden liquidity, distressed assets, operational pain, and monetizable asymmetries across public data.

This is not positioned as “AI agents that scrape stuff.” The repository implements the operating model defined in [concept.md](./concept.md):

> A modular market-intelligence architecture for detecting hidden liquidity, distressed assets, operational pain, and monetizable asymmetries across the internet.

The compressed operational loop from the concept document applies directly to software design:

> **Signal → Spread → Match → Monetize.**

The repository should make that loop **programmable, observable, and extensible**—so builders can run narrow wedges (distressed SaaS, hiring signals, closure radar) on shared infrastructure without reinventing ingestion, scoring, or buyer matching.

---

## Strategic Positioning

### What this is not

| Weak framing | Why it fails |
|--------------|--------------|
| “AI business finder” | Sounds shallow and gimmicky; no systems story |
| “General AI opportunity finder” | Too broad for OSS adoption, demos, or GTM |
| “The scraper” | Scraping is commodity; not defensible |

### What this is

**Open Market Ops** (working name) is an **open-source economic opportunity intelligence framework**: software that turns messy public feeds into ranked, buyer-matched, monetization-aware opportunity objects.

Alternative positioning labels (internal / marketing exploration):

| Name | Emphasis |
|------|----------|
| **OpenMarketOps** | Primary repo identity; aligns with project name |
| OpportunityOS | Modular framework; portfolio-friendly |
| LiquidityOS | Liquidity and spread detection |
| SignalStack | Pipeline / ingestion focus |
| TriggerFlow | Event-driven urgency layer |
| AssetRadar | Asset detection and mispricing |
| LatentAlpha | Economic asymmetry / edge |
| Economic Signal Engine | Systems / infrastructure tone |
| Opportunity Intelligence Layer | Platform / embeddable layer |
| Signal-to-Liquidity Engine | End-to-end loop naming |

**Canonical positioning statement:**

> A framework for detecting economic asymmetry from public signals—and routing it through spread detection, buyer matching, and monetization strategy.

That framing supports a repo that is intellectually coherent, extensible, demoable, monetizable, open-source friendly, portfolio-grade, technically credible, and commercially legible.

---

## Alignment with the Concept Framework

The [concept.md](./concept.md) ontology already maps to implementable software layers. The ideas document specifies *how the repository embodies* that ontology.

### Framework-to-software mapping

| Concept layer | Software layer | Responsibility |
|---------------|----------------|----------------|
| **Feed** | Data ingestion | Connectors, schedulers, normalization, deduplication |
| **Asset** | Entity extraction | Identify mispriced or latent objects in raw signals |
| **Trigger** | Event detection | Classify urgency; time-bound state changes |
| **Buyer** | Graph / relevance matching | Rank counterparty fit (pain, budget, authority) |
| **Monetization** | Strategy engine | Recommend flip, broker, retainer, relaunch, lead-gen, data product |
| **Spread** | Scoring / ranking | Quantify gap between current price and best-use value |
| **Liquidity** | Conversion workflows | Outreach, CRM, alerts, API export, human-in-the-loop |

### Technical paradigms in play

The system sits at the intersection of:

- **OSINT** — public, fragmented, pre-consensus sources  
- **Event-driven systems** — triggers as first-class events  
- **Economic graph analysis** — entities and relationships over time  
- **AI reasoning** — classification, extraction, synthesis  
- **Workflow orchestration** — repeatable vertical pipelines  
- **Retrieval systems** — historical signal similarity, RAG over corpora  
- **Agentic pipelines** — specialized agents per layer ([concept.md](./concept.md) reference stack)

Merged, these produce a single artifact: **liquidity intelligence as software**, not a one-off scraper.

---

## Repository Value Proposition

### Existing conceptual assets (from ideation)

The project already encodes building blocks sufficient for a serious systems repo:

| Asset | Role in the repo |
|-------|------------------|
| Ontology | Feed, asset, trigger, buyer, monetization, spread |
| Workflow structure | Vertical pipelines (e.g. distressed SaaS, hiring signals) |
| Agentic reasoning layers | Per-step agents with clear boundaries |
| Economic model | Spread, liquidity, buyer economics |
| Signal processing | Ingest → classify → score → output |
| Entity relationships | Graph-ready domain model |
| Monetization logic | Strategy engine tied to opportunity type |
| Event-driven potential | Triggers drive prioritization and alerts |

### What the repo can become

From that foundation, the same codebase can support multiple surfaces:

| Surface | Description |
|---------|-------------|
| **Framework** | Core packages + types + extension points |
| **Toolkit** | Connectors, scorers, matchers for custom workflows |
| **Research engine** | Batch analysis, reports, backtests |
| **Simulation environment** | Replay feeds; evaluate scoring changes |
| **Agentic orchestration** | Multi-agent runs over opportunity pipelines |
| **Visual intelligence platform** | Dashboards, graphs, timelines, heatmaps |
| **Developer ecosystem** | Shared workflows, connectors, evals |
| **Market radar OS** | Continuous monitoring + alerting product |

These are not separate products on day one—they are **expansion paths** on one architecture.

---

## The Core Technical Insight

**The repository is not the scraper. The scraper is commodity.**

Defensible value lives in **intelligence orchestration**:

| Layer | Function |
|-------|----------|
| Signal interpretation | Raw text/events → economic meaning |
| Entity relationships | Who/what connects to whom; context over time |
| Economic reasoning | Spread, buyer value, monetization fit |
| Prioritization | Urgency × spread × buyer density |
| Opportunity synthesis | Complete five-step opportunity object |
| Monetization mapping | Archetype A–F from [concept.md](./concept.md) |

Ingestion gets data in the door; orchestration turns chaos into **actionable, ranked opportunity**.

---

## Repository Direction Options

Three viable directions share the same conceptual core but emphasize different audiences and depth. They can converge over time (e.g. Option 1 MVP → Option 2 engineering depth → Option 3 graph scale).

### Option 1: OpportunityOS — Practical & portfolio-friendly

**Tagline:** A modular framework that scans feeds and surfaces monetizable opportunities.

**Primary audience:** Builders, indie hackers, agencies, portfolio reviewers.

#### Feed connectors (initial catalog)

| Source | Typical signal |
|--------|----------------|
| LinkedIn / job boards | Hiring pain, automation leads |
| Craigslist | Local assets, equipment, distressed listings |
| Flippa / Acquire.com | Digital asset and SaaS listings |
| Reddit / forums | Pre-market pain and intent |
| App stores | Decline, neglect, acquisition targets |
| Expired / auction domains | SEO and lead-gen assets |
| Google Maps / Yelp | Closures, status changes |
| SEC / court filings | Distress, bankruptcy, asset movement |

Connectors implement the **Feed** layer only; downstream packages own asset/trigger/buyer logic.

#### Signal extraction

Agents (or deterministic + LLM hybrid steps) extract:

- Operational **pain** (role clusters, complaint patterns)  
- **Hiring urgency** (volume, reposting, “immediate start”)  
- **Shutdown indicators** (closures, filings, listing removals)  
- **Acquisition potential** (stale SaaS, founder burnout language)  
- **Neglected assets** (domains, apps, directories with latent value)  
- **Operational inefficiencies** (manual workflows implied by job text)

#### Opportunity scoring

A scoring engine ranks candidates on dimensions aligned with [concept.md](./concept.md):

| Dimension | Maps to |
|-----------|---------|
| Monetization potential | Spread × monetization archetype fit |
| Urgency | Trigger strength and recency |
| Buyer demand density | Count and quality of likely buyers |
| Competition | How crowded the niche or deal type is |
| Liquidity speed | Time-to-cash for chosen monetization path |

#### Outputs

| Output | Use case |
|--------|----------|
| Dashboards | Human review and pipeline management |
| Alerts | Real-time trigger-driven notifications |
| Opportunity cards | Single object with all five framework fields |
| Acquisition / lead exports | CRM, outbound, agency resale |
| API feeds | Downstream products and integrations |
| Research reports | Batch narrative + tabular summaries |

**Best for:** First public release, demos, documentation, and proving Signal → Spread → Match → Monetize in one vertical.

---

### Option 2: Agentic Market Intelligence Stack — Engineering-first

**Tagline:** Experimental infrastructure for economic signal intelligence.

**Primary audience:** AI systems engineers, agent builders, RAG/orchestration practitioners.

Emphasizes:

- Multi-agent orchestration with clear agent boundaries (per [concept.md](./concept.md))  
- RAG over historical opportunities and source corpora  
- Workflow definitions as versioned artifacts  
- Graph memory for entity continuity  
- Retrieval pipelines for similar past signals  
- **Evals** for signal quality and scoring calibration  

#### Suggested monorepo layout (engineering-oriented)

```txt
open-market-ops/
├── apps/
│   ├── dashboard/
│   ├── api/
│   ├── cli/
│   └── worker/
├── packages/
│   ├── feed-connectors/
│   ├── signal-engine/
│   ├── opportunity-scoring/
│   ├── entity-extraction/
│   ├── buyer-matching/
│   ├── monetization-engine/
│   ├── graph-memory/
│   └── shared-types/
├── agents/
│   ├── feed-agent/
│   ├── trigger-agent/
│   ├── asset-agent/
│   ├── buyer-agent/
│   └── strategist-agent/
├── workflows/
│   ├── distressed-saas.yaml
│   ├── local-business-closures.yaml
│   ├── hiring-signals.yaml
│   └── expired-domains.yaml
├── prompts/
├── datasets/
├── docs/
└── examples/
```

Maps to concept agents:

| Repo agent | Concept role |
|------------|--------------|
| feed-agent | Feed Collector |
| asset-agent | Asset Detector |
| trigger-agent | Trigger Classifier |
| buyer-agent | Buyer Matcher |
| strategist-agent | Valuation + Monetization + outreach synthesis |

**Best for:** Portfolio narrative around AI systems architecture, RAG, and agentic design—not only “another scraper.”

---

### Option 3: Open Opportunity Graph — Ambitious / visionary

**Tagline:** A knowledge graph of economic opportunity.

**Primary audience:** Researchers, data platform builders, long-horizon OSS contributors.

#### Entity types

- Businesses, domains, founders  
- Assets (digital, physical, relational)  
- Closures, filings, funding events  
- Signals and triggers (typed events)  
- Buyers (segmented counterparty types)  
- Reviews, technologies, geographic anchors  

#### Relationship examples

| Relationship | Interpretation |
|--------------|----------------|
| Company → hiring aggressively | Trigger + pain signal |
| Founder → burnout detected | Acquisition trigger |
| Domain → SEO decline | Asset deterioration trigger |
| Market → consolidation | Buyer/set dynamics |
| Business → equipment liquidation | Asset + trigger bundle |
| Jurisdiction → new compliance | Regulation trigger |

A **live, evolving opportunity graph** (e.g. Neo4j) enables:

- Palantir-lite / OSINT-lite exploration  
- Path queries: “all distressed SaaS in vertical X with micro-PE buyer density”  
- Temporal triggers: “closure in last 30 days within 50mi of buyer Y”  

**Best for:** Phase 2+ after Option 1 proves wedge PMF and data model stability—not day-one scope.

---

## Recommended Monorepo Architecture

Unified structure supporting Options 1–3 without forked codebases:

```txt
open-market-ops/
│
├── apps/
│   ├── dashboard/          # Opportunity review, graphs, timelines
│   ├── api/                # REST/GraphQL for opportunities and alerts
│   ├── cli/                # Run workflows, score one-off feeds
│   └── worker/             # Scheduled ingestion and pipeline execution
│
├── packages/
│   ├── feed-connectors/    # Feed layer
│   ├── signal-engine/      # Extraction + classification
│   ├── entity-extraction/  # Asset layer
│   ├── opportunity-scoring/# Spread + composite rank
│   ├── buyer-matching/     # Buyer layer
│   ├── monetization-engine/# Monetization archetypes A–F
│   ├── graph-memory/       # Optional graph + vector store adapters
│   └── shared-types/       # Opportunity, Trigger, Buyer, etc.
│
├── agents/                 # Agent implementations (Option 2)
├── workflows/              # Vertical YAML/JSON pipelines
├── prompts/                # Versioned prompts per agent/step
├── datasets/               # Fixtures, golden sets for evals
├── docs/                   # Architecture, concept alignment, wedges
└── examples/               # End-to-end wedge demos
```

### Package dependency flow (concept-aligned)

```txt
feed-connectors
      ↓
signal-engine → entity-extraction
      ↓              ↓
trigger (events)   asset (entities)
      ↓              ↓
      └──→ opportunity-scoring ←──┘
                  ↓
           buyer-matching
                  ↓
         monetization-engine
                  ↓
         apps (dashboard / api / worker)
```

Every **opportunity** record should be serializable with five required fields plus derived scores—enforcing [concept.md](./concept.md) completeness before surfacing to users.

---

## Open Source Strategy: Wedges, Not Generality

OSS adoption requires a **sharp wedge**. Each wedge is one full loop: one feed family, one asset type, one buyer segment, one monetization path ([concept.md](./concept.md) GTM).

### Recommended OSS wedges

| # | Wedge | One-line pitch | Concept mapping |
|---|-------|----------------|-----------------|
| 1 | **Distressed SaaS intelligence** | Find under-maintained SaaS acquisition opportunities | Feeds: IH, Acquire, reviews; Asset: SaaS; Trigger: burnout/stale |
| 2 | **Hiring signal intelligence** | Convert job postings into AI automation leads | Feed: job boards; Asset: pain in JDs; Buyer: agencies |
| 3 | **Local business closure radar** | Track distressed local assets and operational gaps | Feed: maps, filings; Trigger: closure; Asset: equipment, domain |
| 4 | **AI agency prospecting engine** | Surface companies likely needing automation | Same as #2; GTM toward automation vendors |
| 5 | **Expired domain intelligence** | Discover underpriced SEO and lead-gen assets | Feed: auctions, expiry; Asset: domain; Monetization: flip/lead-gen |
| 6 | **Market trigger detection** | Monitor operational change events across public data | Trigger-first; multi-vertical alert product |

Each wedge ships as a **`workflows/*.yaml`** plus minimal connectors—not the entire connector universe.

### Positioning contrast (OSS README)

| Avoid | Prefer |
|-------|--------|
| “General AI opportunity finder” | “Hiring-signal → AI agency lead engine” |
| “We scrape the internet” | “Signal → Spread → Match → Monetize for job-board operational pain” |

---

## Moat: Workflows as Assets

The long-term moat is not a single data source—it is **reusable, shareable workflows** that encode vertical intelligence.

### Workflow schema (illustrative)

Workflows declare the full five-step loop in configuration:

```yaml
name: ai_support_agency_leads
version: 1.0
wedge: hiring-signals

feed:
  connectors:
    - linkedin_jobs
    - indeed
  schedule: "0 */6 * * *"

detect:
  rules:
    - repeated_hiring_same_role
    - urgency_language
  llm_classify:
    - customer_support
    - claims_processing

asset:
  type: operational_pain_signal
  extract:
    - company
    - role_cluster
    - hire_count

trigger:
  min_similar_roles: 3
  window_days: 14
  boost_if: recently_funded

buyer:
  segments:
    - ai_support_agencies
    - automation_consultancies
  match: buyer-matching/v1

monetize:
  recommended:
    - lead_generation
    - retainer
  scoring: monetization-engine/v1

output:
  - opportunity_cards
  - crm_export
  - webhook_alerts
```

This makes the repo **programmable economic intelligence**: contributors add workflows without forking core engines.

### Workflow catalog (aligned with concept examples)

| Workflow file | Concept reference |
|---------------|-------------------|
| `distressed-saas.yaml` | Example 1 — Distressed SaaS Finder |
| `local-business-closures.yaml` | Example 2 — Closure Asset Agent |
| `hiring-signals.yaml` | Example 3 — Hiring-Signal Automation Agent |
| `expired-domains.yaml` | Example 4 — Domain + SEO Decay Scanner |

Additional workflows (app store decline, equipment liquidation) extend the same pattern.

---

## Economic Evals & Decision Intelligence

To differentiate as **AI systems engineering** (not prompt demos), the repo should include eval harnesses for opportunity quality.

### Scoring output schema (example)

```json
{
  "opportunity_id": "opp_8f3a2b",
  "framework_complete": true,
  "opportunity_score": 82,
  "spread_estimate": "medium-high",
  "buyer_density": "high",
  "trigger_urgency": "medium",
  "monetization_speed": "fast",
  "recommended_monetization": ["lead_generation", "retainer"],
  "competition": "low",
  "confidence": 0.78,
  "eval_version": "scoring/v1"
}
```

### Eval dimensions

| Eval | Purpose |
|------|---------|
| Framework completeness | All five steps populated with evidence |
| False positive rate | Alert fired but no viable buyer/spread |
| Monetization probability | Historical or labeled outcomes by archetype |
| Liquidity likelihood | Time-to-first-dollar by wedge |
| Trigger precision | Event detected vs. ground truth |
| Buyer match quality | Human or LLM-judged fit of top-N buyers |

This introduces **quant-style discipline**: confidence ratings, regression on scoring weights, benchmark datasets per wedge.

---

## User Interface & Experience Surfaces

UI is not required for MVP but defines the **portfolio and product ceiling**.

| Surface | Description | Concept tie-in |
|---------|-------------|----------------|
| Opportunity terminal | Dense list + detail cards; filter by wedge, trigger, score | Full five-step cards |
| OSINT-style dashboards | Source health, ingest volume, signal rate | Feed layer observability |
| Graph visualizations | Entity-relationship exploration | Option 3 graph |
| Trigger timelines | Urgency events on a company/asset | Trigger layer |
| Geographic maps | Closures, local assets, regional buyers | Local closure wedge |
| Acquisition radar | SaaS/app/distressed digital assets | Asset + spread |
| Liquidity heatmaps | Monetization speed × buyer density | Monetization + buyer |

**Suggested stack (non-binding):** React, Tailwind, graph libraries (e.g. force-directed or Cytoscape), server-sent events or WebSockets for live triggers.

Goal: communicate **liquidity intelligence** visually—not generic “AI chat” chrome.

---

## Recommended MVP

**Do not overbuild.** The first release should prove one complete loop end-to-end with production-quality scoring and evals—not three options and a graph DB.

### MVP: Hiring Signal → AI Agency Lead Engine

| Criterion | Rationale |
|-----------|-----------|
| Feed accessibility | Job boards and career pages are well understood APIs/HTML |
| Asset clarity | Pain is encoded in job descriptions (role clusters, volume) |
| Trigger observability | Repeated roles, urgency language, funding signals |
| Buyer obviousness | AI automation agencies, consultancies, outbound teams |
| Monetization | Lead sale, agency retainer, campaign export—matches concept Example 3 |
| Demo strength | “Eight support hires in one week” is instantly legible |
| Infra complexity | Lower than graph-first or multi-source closure fusion |
| Portfolio fit | Agentic pipeline + scoring + CRM export in one story |

### MVP pipeline

```txt
Job Board (Feed)
      ↓
Signal Extraction (pain, role, volume)
      ↓
Asset + Trigger Classification
      ↓
Opportunity Scoring (spread, urgency, buyer density)
      ↓
Buyer Matching (agency segments)
      ↓
Monetization Recommendation (lead-gen / retainer)
      ↓
Output (cards, alerts, CRM export)
```

### MVP deliverables checklist

- [ ] 2–3 feed connectors (e.g. LinkedIn, Indeed, public career pages)  
- [ ] `workflows/hiring-signals.yaml` as reference workflow  
- [ ] Opportunity schema with five framework fields + scores  
- [ ] CLI: run workflow once; export JSON/CSV  
- [ ] Minimal dashboard or static report generator  
- [ ] Eval set: 50+ labeled job clusters (positive/negative)  
- [ ] README wedge positioning (no generic “AI finder”)  

---

## Future Expansion Paths

Once MVP architecture and types stabilize:

| Module | Expansion | Concept / option link |
|--------|-----------|------------------------|
| Neo4j (or similar) | Opportunity relationship mapping | Option 3 — Open Opportunity Graph |
| Vector memory | Similar historical signals; RAG over past deals | Option 2 — retrieval |
| Multi-agent orchestration | Full agent roster from concept.md | Option 2 — agents/ |
| Browser automation | Deep acquisition research on flagged assets | Asset due diligence |
| Financial APIs | Revenue/MRR estimation for SaaS wedge | Spread quantification |
| Social signals | Founder intent, burnout, exit language | Trigger detection |
| LLM evals | Benchmark prompts and classifiers per wedge | Economic evals |
| Simulation layer | Backtest scoring on historical feed snapshots | Research engine |
| Workflow marketplace | Share/community workflows | Workflows as moat |

Expansion order (suggested): **hiring MVP → second wedge workflow → scoring/evals hardening → graph (optional) → marketplace**.

---

## Why This Project Fits the Builder Profile

Open Market Ops sits at a rare intersection—one artifact instead of disconnected demos:

| Strength area | How the repo expresses it |
|---------------|---------------------------|
| AI systems architecture | Layered packages, agents, clear boundaries |
| Agentic orchestration | Multi-step pipelines with strategist agent |
| Market / liquidity intelligence | Direct implementation of [concept.md](./concept.md) |
| Portfolio strategy | Demoable wedge, evals, terminal-style UI path |
| OSINT / public data | Feed-first, pre-consensus sources |
| Product mindset | Opportunity cards, alerts, buyer-first filtering |
| Workflow engineering | YAML workflows as first-class assets |
| RAG systems | Similarity over past opportunities and sources |
| Economic systems thinking | Spread, triggers, monetization archetypes |

**Contrast with typical portfolio projects:**

| Common | Open Market Ops |
|--------|-----------------|
| Random chatbots | Structured opportunity objects |
| Toy agents | Framework-bound agents per layer |
| Generic RAG demos | RAG in service of spread and buyer matching |
| No economic model | Signal → Spread → Match → Monetize |

The repo is a **philosophy-backed intelligence system**—memorable because the concept doc and code share one ontology.

---

## Higher-Order Framing

### The machine

You are not building “an AI tool.” You are building **a machine for compressing chaos into opportunity**:

| Stage | Role |
|-------|------|
| Feeds | Chaos — fragmented, noisy, pre-consensus |
| Agents / engines | Interpretation — signals, assets, triggers |
| Graphs (optional) | Context — relationships and history |
| Scoring | Prioritization — spread and liquidity |
| Monetization engine | Liquidity — how value exits |

### The cognition stack

```txt
Chaos (feeds)
    → Signals (extraction)
    → Assets + Triggers (entities + events)
    → Spread (scoring)
    → Match (buyers)
    → Monetize (strategy)
    → Opportunity (output)
```

The repository is an **economic cognition engine**: software that implements liquidity intelligence at scale.

---

## Document Map

| Document | Purpose |
|----------|---------|
| [concept.md](./concept.md) | Business framework: five steps, monetization archetypes, example businesses, operating principles |
| **ideas.md** (this file) | Product/repo vision: positioning, architecture options, OSS wedges, MVP, expansion |

**Next concrete steps:** lock MVP wedge (`hiring-signals`), define `shared-types` opportunity schema, implement `workflows/hiring-signals.yaml` against two connectors, ship CLI + eval fixture set.

---

## Summary

Open Market Ops the **repository** implements Open Market Ops the **concept**: public feeds in, complete opportunity objects out—each with feed, asset, trigger, buyer, monetization, and spread-aware scores. Scrapers are necessary but not sufficient; **intelligence orchestration and workflows-as-assets** are the moat. Ship Option 1 depth first (OpportunityOS + hiring wedge), grow Option 2 engineering story (agents, evals, RAG), and treat Option 3 (opportunity graph) as a validated expansion—not day-one scope.
