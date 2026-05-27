# Product Requirements Document — OpportunityOS MVP

**Product:** OpportunityOS (Open Market Ops)  
**Version:** 0.1.0 (MVP)  
**Status:** MVP scaffold complete (v0.1.0-rc)  
**Last updated:** May 2026  
**Implementation audit:** [§18](#18-implementation-audit-may-2026)  

**Related documents**

| Document | Purpose |
|----------|---------|
| [concept.md](./concept.md) | Liquidity intelligence framework (5 steps + monetization archetypes) |
| [ideas.md](./ideas.md) | Repository vision, monorepo architecture, OSS wedges |
| [FUTURE-EXPANSION.md](./FUTURE-EXPANSION.md) | Post-MVP modules and roadmap |
| [schemas/README.md](../schemas/README.md) | JSON Schema contracts |

---

## 1. Overview

### 1.1 Product summary

**OpportunityOS** is an open-source framework that implements **Signal → Spread → Match → Monetize** as executable software. The MVP ships as a **portfolio-grade, wedge-focused OSS project**: one reference vertical (**Hiring Signal → AI Agency Lead Engine**) with shared infrastructure that future wedges plug into via **workflows-as-assets**.

MVP implements four runtime layers only:

1. **Feed connectors** — ingest normalized job postings  
2. **Signal extraction** — pain, role clusters, urgency, company entities  
3. **Opportunity scoring** — spread proxy, urgency, composite rank  
4. **Outputs** — opportunity cards (JSON), CSV/CRM export, webhook/file alerts  

**Explicitly out of MVP implementation** (schema + folder stubs only):

- `buyer-matching` package (rank buyers; workflow defines segments)  
- `monetization-engine` package (archetype A–F recommendations)  
- `entity-extraction` as standalone package (merged into signal-engine for MVP)  
- `graph-memory`, `agents/`, `apps/dashboard`, `apps/api`  
- Live UI (optional standalone site lives under `src/` for documentation only)

Workflow YAML still declares **buyer** and **monetize** blocks so contributors and future releases share one contract. MVP populates those fields with **declarative defaults** from the workflow file, not a separate engine.

### 1.2 Positioning (OSS)

| Avoid | Ship |
|-------|------|
| “General AI opportunity finder” | “**Hiring-signal → AI agency lead engine**” |
| “We scrape job boards” | “**Liquidity intelligence**: messy feeds → ranked opportunity objects” |
| Scraper-as-product | **Workflows + schemas** as the moat |

**Canonical tagline:** *A framework for detecting economic asymmetry from public signals.*

**MVP wedge ID:** `hiring-signals`  
**Reference workflow:** [`workflows/hiring-signals.yaml`](../workflows/hiring-signals.yaml)

### 1.3 Success criteria (MVP complete)

| # | Criterion | Measurement |
|---|-----------|-------------|
| S1 | End-to-end CLI run | `omo run workflows/hiring-signals.yaml` produces scored opportunities |
| S2 | ≥2 feed connectors | Indeed + public career-page connector (LinkedIn optional / stub) |
| S3 | Framework-shaped output | Every opportunity validates against `schemas/opportunity.schema.json` |
| S4 | Workflow-driven | Changing YAML changes connectors, rules, thresholds without core fork |
| S5 | OSS clarity | README, CONTRIBUTING, schemas, one golden workflow, wedge docs |
| S6 | Eval fixtures | ≥50 labeled job clusters in `datasets/hiring-signals/` |
| S7 | No false “complete” | `framework_complete` false until buyer/monetize engines exist (honest flag) |

---

## 2. Problem & opportunity

### 2.1 Problem

AI automation agencies and operators manually scan job boards for hiring clusters that imply budget and pain. That work is slow, inconsistent, and not composable. Generic scrapers return rows, not **opportunity objects** tied to an economic model.

### 2.2 Opportunity

Job postings are a **pre-consensus feed** ([concept.md](./concept.md)): pain and budget appear before vendors pitch. A narrow wedge with sharp I/O (jobs in → scored leads out) demonstrates liquidity intelligence without boiling the ocean.

### 2.3 User personas (MVP)

| Persona | Goal |
|---------|------|
| **OSS contributor** | Add connector or workflow for a new wedge |
| **AI agency operator** | Export high-score companies for outbound |
| **Portfolio reviewer** | Run CLI demo; read schemas and workflow |
| **Future product builder** | Embed opportunity JSON via API (post-MVP) |

---

## 3. Goals & non-goals

### 3.1 Goals

- Prove **OpportunityOS architecture** with real ingestion, extraction, scoring, output  
- Encode **five-step ontology** in schemas and opportunity records  
- Make **workflows** the unit of vertical intelligence (moat)  
- Ship **hiring-signals** wedge as reference implementation  
- Stub monorepo packages for **future dependency flow** per [ideas.md](./ideas.md)  
- Provide `src/` skeleton for a future GitHub Pages product site (concept + liquidity narrative)

### 3.2 Non-goals (MVP)

- Production dashboard, SSE/WebSockets, graph visualizations  
- Neo4j / vector DB  
- Multi-agent orchestration in `agents/`  
- Automated outreach or CRM write-back (export only)  
- LinkedIn scraping that violates ToS (use official APIs or documented stubs)  
- Implementing all six OSS wedges (only `hiring-signals` is runnable)  
- `buyer-matching` / `monetization-engine` runtime logic  

---

## 4. Concept alignment

### 4.1 Five-step mapping (MVP)

| Step | MVP implementation | Package |
|------|----------------------|---------|
| **Feed** | Connectors fetch + normalize `RawFeedItem` | `@omo/feed-connectors` |
| **Asset** | `operational_pain_signal` extracted from jobs | `@omo/signal-engine` |
| **Trigger** | Rules: role count, window, urgency language | `@omo/signal-engine` |
| **Buyer** | Workflow-declared segments only (no matcher) | workflow YAML → opportunity stub |
| **Monetization** | Workflow-declared recommendations only | workflow YAML → opportunity stub |

### 4.2 Compressed pipeline (MVP runtime)

```txt
Workflow YAML
      ↓
Feed Connectors ──→ RawFeedItem[]
      ↓
Signal Engine ──→ Signal[] + Asset + Trigger
      ↓
Opportunity Scoring ──→ Scores + opportunity_score
      ↓
Output Writers ──→ JSON cards | CSV | webhook file
```

### 4.3 Future pipeline (unchanged package boundaries)

```txt
… Scoring …
      ↓
Buyer Matching (Phase 2)
      ↓
Monetization Engine (Phase 2)
      ↓
Output Writers
```

See [FUTURE-EXPANSION.md](./FUTURE-EXPANSION.md).

---

## 5. System architecture

### 5.1 Monorepo layout (MVP-active vs stub)

```txt
open-market-ops/
├── apps/
│   ├── cli/                 ★ MVP — workflow runner
│   └── worker/              ○ stub — scheduled runs
│   ├── api/                 ○ stub
│   └── dashboard/           ○ stub
├── packages/
│   ├── shared-types/        ★ MVP
│   ├── feed-connectors/     ★ MVP
│   ├── signal-engine/       ★ MVP
│   ├── opportunity-scoring/ ★ MVP
│   ├── output-writers/      ★ MVP
│   ├── entity-extraction/   ○ stub → merge later
│   ├── buyer-matching/      ○ stub
│   ├── monetization-engine/ ○ stub
│   └── graph-memory/        ○ stub
├── workflows/               ★ MVP — hiring-signals + wedge stubs
├── schemas/                 ★ MVP
├── datasets/                ★ MVP — eval fixtures
├── prompts/                 ○ stub — LLM classify templates
├── agents/                  ○ stub
├── examples/                ★ MVP — sample output
├── src/                     ★ skeleton — product docs site
└── docs/                    ★ PRD + expansion
```

★ = MVP deliverable · ○ = placeholder for future flow alignment

### 5.2 Package dependency graph (MVP)

```txt
@omo/shared-types
        ↑
@omo/feed-connectors
        ↑
@omo/signal-engine
        ↑
@omo/opportunity-scoring
        ↑
@omo/output-writers
        ↑
@omo/cli (apps/cli)
```

No circular dependencies. Workflow loader lives in `apps/cli` or `@omo/workflow-loader` inside `shared-types` if needed.

### 5.3 Technology stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Language | TypeScript 5.x | Shared across packages |
| Runtime | Node.js ≥20 | CLI and workers |
| Package manager | pnpm workspaces | `pnpm-workspace.yaml` |
| Build | tsup or unbuild | Per-package ESM builds |
| Validation | Zod + JSON Schema | Schemas are source of truth; Zod generated or hand-mirrored |
| Testing | Vitest | Unit + fixture integration |
| CLI | Commander.js | `omo` binary |
| Config | YAML workflows | `js-yaml` |
| LLM (optional) | OpenAI-compatible API | Feature-flagged classification in signal-engine |
| Docs site | Vite + React + Tailwind (`src/`) | Static GitHub Pages; not MVP blocker |

---

## 6. Functional requirements

### 6.1 Workflow loader (`apps/cli`)

| ID | Requirement | Priority |
|----|-------------|----------|
| W-01 | Load and validate workflow against `schemas/workflow.schema.json` | P0 |
| W-02 | Resolve connector list → instantiate feed connectors | P0 |
| W-03 | Pass workflow `detect`, `asset`, `trigger`, `scoring` config to engines | P0 |
| W-04 | Support `--dry-run` (validate only) | P1 |
| W-05 | Support `--limit N` for dev runs | P0 |
| W-06 | Support `--output dir` and format flags (`json`, `csv`) | P0 |
| W-07 | Emit run manifest (workflow version, connector versions, timestamp) | P1 |

**CLI commands (MVP)**

```bash
omo run <workflow>              # full pipeline
omo validate <workflow>         # schema + connector registry check
omo connectors list             # registered connectors
omo version
```

### 6.2 Feed connectors (`@omo/feed-connectors`)

| ID | Requirement | Priority |
|----|-------------|----------|
| F-01 | Export `FeedConnector` interface: `id`, `fetch(options)`, `normalize()` | P0 |
| F-02 | Output `RawFeedItem` per schema | P0 |
| F-03 | **Indeed connector** — search by title/location params from workflow | P0 |
| F-04 | **Career-page connector** — fetch public JSON/HTML career pages (configurable URL list) | P0 |
| F-05 | **LinkedIn connector** — stub or official API adapter behind feature flag | P2 |
| F-06 | Rate limiting + retry with backoff | P1 |
| F-07 | Dedupe by `(source, external_id)` | P0 |
| F-08 | Connector registry: `registerConnector(id, factory)` | P0 |

**RawFeedItem fields (minimum)**

- `id`, `source`, `fetched_at`  
- `company_name`, `company_domain` (nullable)  
- `title`, `description`, `location`, `posted_at`  
- `url`, `metadata` (source-specific)

### 6.3 Signal engine (`@omo/signal-engine`)

| ID | Requirement | Priority |
|----|-------------|----------|
| S-01 | Group items by `company_key` (domain || normalized name) | P0 |
| S-02 | Apply workflow `detect.rules` (deterministic) | P0 |
| S-03 | `repeated_hiring_same_role` — same normalized title cluster ≥ `min_similar_roles` in `window_days` | P0 |
| S-04 | `urgency_language` — keyword list from workflow | P0 |
| S-05 | Optional `llm_classify` — map description to workflow role taxonomy | P1 |
| S-06 | Emit `Signal` with `pain_category`, `role_cluster`, `hire_count`, `evidence[]` | P0 |
| S-07 | Emit `Asset` type `operational_pain_signal` per concept | P0 |
| S-08 | Emit `Trigger` with `type`, `strength`, `detected_at`, `reasons[]` | P0 |
| S-09 | Attach workflow buyer/monetize **stubs** to downstream opportunity builder | P0 |

**Deterministic rules (hiring-signals defaults)**

| Rule | Default |
|------|---------|
| `min_similar_roles` | 3 |
| `window_days` | 14 |
| Urgency keywords | immediate, urgent, asap, start immediately, hiring multiple |
| Role taxonomy | customer_support, claims_processing, data_entry, virtual_assistant |

### 6.4 Opportunity scoring (`@omo/opportunity-scoring`)

| ID | Requirement | Priority |
|----|-------------|----------|
| O-01 | Input: Signal + Asset + Trigger + workflow scoring weights | P0 |
| O-02 | Output `OpportunityScores` per schema | P0 |
| O-03 | Dimensions: `urgency`, `buyer_density_proxy`, `monetization_potential_proxy`, `competition_proxy`, `liquidity_speed_proxy` | P0 |
| O-04 | Composite `opportunity_score` 0–100 (weighted sum, configurable) | P0 |
| O-05 | `confidence` 0–1 based on evidence count + source diversity | P1 |
| O-06 | `spread_estimate` enum: low \| medium \| medium-high \| high (heuristic for MVP) | P1 |
| O-07 | `framework_complete: false` when buyer/monetize engines absent | P0 |

**MVP heuristic notes**

- `buyer_density_proxy`: fixed high for hiring-signals wedge (agencies abundant) unless workflow overrides  
- `monetization_potential_proxy`: function of hire_count and role seniority keywords  
- `liquidity_speed_proxy`: high when urgency trigger fires  

### 6.5 Output writers (`@omo/output-writers`)

| ID | Requirement | Priority |
|----|-------------|----------|
| OUT-01 | Build `Opportunity` object (validate against schema) | P0 |
| OUT-02 | **JSON cards** — one file per opportunity + `manifest.json` | P0 |
| OUT-03 | **CSV export** — flat columns for CRM import | P0 |
| OUT-04 | **Webhook file** — JSON lines append to `alerts.jsonl` (stand-in for HTTP webhook) | P1 |
| OUT-05 | Include `workflow_id`, `wedge`, `run_id` on every record | P0 |
| OUT-06 | Pretty-print human-readable summary to stdout | P1 |

### 6.6 Shared types (`@omo/shared-types`)

| ID | Requirement | Priority |
|----|-------------|----------|
| T-01 | Export TypeScript types mirroring JSON schemas | P0 |
| T-02 | Export Zod validators for runtime | P0 |
| T-03 | Export constants: wedge IDs, monetization archetypes, trigger types | P0 |

---

## 7. Data contracts

### 7.1 Opportunity object (canonical)

Every output record MUST validate against [`schemas/opportunity.schema.json`](../schemas/opportunity.schema.json).

Required sections:

- `meta` (id, run, workflow, wedge, timestamps)  
- `feed` (sources, sample evidence URLs)  
- `asset`  
- `trigger`  
- `buyer` (workflow stub in MVP)  
- `monetization` (workflow stub in MVP)  
- `scores`  

### 7.2 Workflow object

Validated against [`schemas/workflow.schema.json`](../schemas/workflow.schema.json). See reference [`workflows/hiring-signals.yaml`](../workflows/hiring-signals.yaml).

### 7.3 Moat: workflows as assets

Contributors add verticals by:

1. Copy `workflows/_template.yaml`  
2. Configure connectors + detect rules  
3. Tune scoring weights  
4. Register wedge in `docs/wedges/` (future)  

No changes to scoring core required for new **deterministic** wedges.

---

## 8. OSS wedge strategy (MVP + stubs)

### 8.1 Shipped wedge (P0)

| Wedge ID | Workflow | Status |
|----------|----------|--------|
| `hiring-signals` | `hiring-signals.yaml` | **Runnable MVP** |

### 8.2 Stub workflows (documentation + schema validation only)

| Wedge ID | Workflow file | Concept reference |
|----------|---------------|-------------------|
| `distressed-saas` | `distressed-saas.yaml` | Distressed SaaS Finder |
| `local-closures` | `local-business-closures.yaml` | Closure Asset Agent |
| `ai-agency-prospecting` | `ai-agency-prospecting.yaml` | Same feed as hiring; GTM variant |
| `expired-domains` | `expired-domains.yaml` | Domain + SEO Decay |
| `market-triggers` | `market-triggers.yaml` | Cross-vertical trigger alerts |

Each stub MUST validate against workflow schema and include commented connector placeholders.

### 8.3 README wedge table

Published in root README: one-line pitch per wedge, MVP status badge, link to workflow file.

---

## 9. Non-functional requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NF-01 | CLI cold start | < 3s excluding network |
| NF-02 | Single workflow run (limit 100 jobs) | < 2 min on broadband |
| NF-03 | Test coverage (MVP packages) | ≥ 70% lines |
| NF-04 | License | MIT |
| NF-05 | No secrets in repo | `.env.example` only |
| NF-06 | Connector ToS | Document compliance per source in `docs/compliance.md` |
| NF-07 | Deterministic mode | `--no-llm` runs without API keys |

---

## 10. Testing & datasets

### 10.1 Eval dataset (`datasets/hiring-signals/`)

| File | Purpose |
|------|---------|
| `labeled-clusters.json` | ≥50 company clusters: positive / negative |
| `sample-raw-items.json` | Fixture RawFeedItems for unit tests |
| `README.md` | Labeling rubric |

**Labeling rubric (summary)**

- **Positive:** ≥3 similar support-class roles in 14 days OR strong urgency + ≥2 roles  
- **Negative:** single role, unrelated title, stale posting, staffing agency noise  

### 10.2 Test types

| Type | Scope |
|------|-------|
| Unit | Rules, scoring weights, normalizers |
| Schema | Golden opportunities + workflows |
| Integration | Fixture files → CLI → output validates |
| Regression | Opportunity score within tolerance for labeled set |

---

## 11. Documentation deliverables

| Artifact | Location |
|----------|----------|
| Root README (OSS positioning) | `README.md` |
| Contributing | `CONTRIBUTING.md` |
| Architecture | `docs/ARCHITECTURE.md` |
| Compliance / ToS notes | `docs/compliance.md` |
| Wedge: hiring-signals | `docs/wedges/hiring-signals.md` |
| Schema guide | `schemas/README.md` |
| PRD (this doc) | `docs/PRD-MVP.md` |
| Future expansion | `docs/FUTURE-EXPANSION.md` |
| Product site (optional) | `src/` → GitHub Pages |

---

## 12. Release plan

### Phase 0 — Scaffold (Week 0)

Monorepo, schemas, stub packages, workflow YAML, CLI skeleton, README.

### Phase 1 — Feed layer (Week 1–2)

Indeed + career-page connectors, registry, fixtures.

### Phase 2 — Signal layer (Week 2–3)

Grouping, rules, asset/trigger emission, optional LLM classify.

### Phase 3 — Scoring + output (Week 3–4)

Scoring engine, opportunity builder, JSON/CSV/jsonl writers.

### Phase 4 — Hardening (Week 4–5)

Eval dataset, integration tests, docs, examples, `omo validate`.

### Phase 5 — OSS publish (Week 5)

npm optional; GitHub release v0.1.0; product site deploy optional.

---

## 13. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Job board ToS / blocking | Public APIs; rate limits; career-page allowlist; document stubs |
| LLM cost / variance | Default deterministic; `--no-llm` |
| Over-scoping | Enforce MVP package list; stubs elsewhere |
| False “buyer match” claims | `framework_complete: false`; honest README |
| Low OSS traction | Sharp wedge README; workflow template; good fixtures |

---

## 14. MVP implementation checklist

Use this as the authoritative build tracker. Status reviewed May 2026 against repo `main` scaffold.

**Legend:** `[x]` done · `[~]` partial (documented) · `[ ]` not done

### 14.1 Repository & OSS foundation

- [x] **R-01** pnpm workspace + root `package.json` scripts (`build`, `test`, `lint`)  
- [x] **R-02** `LICENSE` (MIT)  
- [x] **R-03** `README.md` — positioning, wedge table, quickstart, architecture diagram  
- [x] **R-04** `CONTRIBUTING.md` — workflow contribution path  
- [x] **R-05** `.github/workflows/ci.yml` — build + test on PR  
- [x] **R-06** `.env.example` — optional `OPENAI_API_KEY`, connector keys  
- [x] **R-07** `.gitignore` — node, dist, .env, output/  

### 14.2 Schemas & moat (workflows as assets)

- [x] **SC-01** `schemas/opportunity.schema.json` — full five-step shape + scores  
- [x] **SC-02** `schemas/workflow.schema.json` — feed, detect, asset, trigger, buyer, monetize, output  
- [x] **SC-03** `schemas/raw-feed-item.schema.json`  
- [x] **SC-04** `schemas/signal.schema.json`  
- [x] **SC-05** `schemas/README.md` — validation instructions (`ajv` CLI example)  
- [x] **SC-06** `workflows/hiring-signals.yaml` — reference MVP workflow  
- [x] **SC-07** `workflows/_template.yaml` — copy for new wedges  
- [x] **SC-08** Stub workflows for five other wedges (validate only)  

### 14.3 `@omo/shared-types`

- [x] **ST-01** TypeScript types for all schemas  
- [x] **ST-02** Zod validators + `parseOpportunity`, `parseWorkflow`  
- [x] **ST-03** Constants: `WedgeId`, `MonetizationArchetype`, `TriggerType`  
- [x] **ST-04** `buildOpportunityFromPipeline()` — merges engine outputs + workflow stubs  
- [x] **ST-05** Unit tests: golden parse fixtures  

### 14.4 `@omo/feed-connectors`

- [x] **FC-01** `FeedConnector` interface + registry  
- [~] **FC-02** `indeed` connector — **mock/fixture complete**; live API/scrape deferred (compliance)  
- [~] **FC-03** `career_page` connector — **mock complete**; live URL fetch deferred  
- [x] **FC-04** `linkedin_jobs` stub — returns fixture when `MOCK_FEEDS=true`  
- [x] **FC-05** Normalization to `RawFeedItem` (`normalizeFeedItem`)  
- [x] **FC-06** Dedupe + rate limit utilities  
- [x] **FC-07** Unit tests (dedupe + normalize)  

### 14.5 `@omo/signal-engine`

- [x] **SE-01** Company grouping key resolver  
- [x] **SE-02** `repeated_hiring_same_role` rule  
- [x] **SE-03** `urgency_language` rule  
- [x] **SE-04** Role taxonomy normalizer (deterministic keywords)  
- [~] **SE-05** Optional LLM classifier — **hook + `--no-llm`**; OpenAI call deferred to v0.2  
- [x] **SE-06** Emit `Signal`, `Asset`, `Trigger`  
- [x] **SE-07** Unit + eval tests (extract + 52-label regression)  

### 14.6 `@omo/opportunity-scoring`

- [x] **OS-01** Weighted scoring from workflow `scoring.weights`  
- [x] **OS-02** Composite `opportunity_score` 0–100  
- [x] **OS-03** Proxy dimensions documented in code comments  
- [x] **OS-04** `framework_complete` logic (`isFrameworkComplete` + pipeline `false`)  
- [x] **OS-05** Unit tests — score ordering  

### 14.7 `@omo/output-writers`

- [x] **OW-01** `writeJsonCards(outputDir, opportunities)`  
- [x] **OW-02** `writeCsv(outputDir, opportunities)`  
- [x] **OW-03** `appendAlertsJsonl` → `alerts.jsonl`  
- [x] **OW-04** Schema validation before every write  
- [x] **OW-05** `manifest.json` with run metadata  

### 14.8 `apps/cli`

- [x] **CLI-01** `omo run <workflow>` orchestrates pipeline  
- [x] **CLI-02** `omo validate <workflow>`  
- [x] **CLI-03** `omo connectors list`  
- [x] **CLI-04** Flags: `--limit`, `--output`, `--dry-run`, `--no-llm`, `--min-score`  
- [x] **CLI-05** Exit codes: 0 success, 1 validation, 2 runtime  
- [x] **CLI-06** Integration test: fixture mode end-to-end  

### 14.9 Datasets & evals

- [x] **DS-01** `labeled-clusters.json` ≥50 entries (52)  
- [x] **DS-02** Labeling rubric in `datasets/hiring-signals/README.md`  
- [x] **DS-03** Regression test + baseline (`datasets/baselines/hiring-signals-eval.json`)  

### 14.10 Examples & docs

- [x] **D-01** `examples/sample-opportunity.json` — golden card  
- [x] **D-02** `examples/run-output/` — committed sanitized CLI sample  
- [x] **D-03** `docs/ARCHITECTURE.md` — package graph + sequence diagram  
- [x] **D-04** `docs/wedges/hiring-signals.md` — wedge playbook  
- [x] **D-05** `docs/compliance.md` — connector ToS notes  

### 14.11 Future-aligned stubs (no runtime logic)

- [x] **STUB-01** `packages/buyer-matching/README.md` — Phase 2 interface sketch  
- [x] **STUB-02** `packages/monetization-engine/README.md`  
- [x] **STUB-03** `packages/entity-extraction/README.md` — merge plan  
- [x] **STUB-04** `packages/graph-memory/README.md`  
- [x] **STUB-05** `apps/api`, `apps/dashboard`, `apps/worker` — README only  
- [x] **STUB-06** `agents/README.md` — maps to concept agent roster  

### 14.12 Product site skeleton (`src/`)

- [x] **WEB-01** Vite + React + Tailwind scaffold  
- [x] **WEB-02** Pages: Home, Framework, Wedges, Roadmap, Docs (in-app nav)  
- [x] **WEB-03** `src/content/` — markdown summaries  
- [x] **WEB-04** GitHub Actions workflow for Pages deploy  
- [x] **WEB-05** Roadmap page — graph/SSE/dashboard placeholders  

### 14.13 Release v0.1.0

- [~] **REL-01** All P0 items complete except live connector fetch (intentionally deferred)  
- [x] **REL-02** CHANGELOG.md for v0.1.0  
- [ ] **REL-03** Git tag `v0.1.0` — **maintainer action** after GitHub push  
- [x] **REL-04** Demo script in `docs/demo.md`  

---

## 15. Acceptance demo script

```bash
# Install
pnpm install
pnpm build

# Validate workflow
pnpm omo validate workflows/hiring-signals.yaml

# Run with fixtures (no network)
MOCK_FEEDS=true pnpm omo run workflows/hiring-signals.yaml \
  --limit 50 \
  --output ./out \
  --min-score 60

# Inspect
ls out/opportunities/
cat out/manifest.json
head out/opportunities.csv
```

**Expected:** ≥1 opportunity card with `wedge: hiring-signals`, `scores.opportunity_score ≥ 60`, `framework_complete: false`, buyer/monitize populated from workflow stubs.

---

## 16. Glossary

| Term | Definition |
|------|------------|
| Wedge | Narrow OSS vertical (feed + asset + buyer + monetization story) |
| Workflow | YAML asset declaring full pipeline config |
| Opportunity | Canonical output object (five steps + scores) |
| Proxy score | MVP heuristic until dedicated engine ships |
| Framework complete | All five steps computed by runtime engines, not stubs |

---

## 17. Approval & revision history

| Version | Date | Notes |
|---------|------|-------|
| 0.1.0 | May 2026 | Initial MVP PRD — OpportunityOS hiring-signals wedge |
| 0.1.0-rc | May 2026 | Implementation audit; checklist synced to repo scaffold |

**Next document:** [FUTURE-EXPANSION.md](./FUTURE-EXPANSION.md)

---

## 18. Implementation audit (May 2026)

### 18.1 Success criteria (§1.3)

| # | Status | Evidence |
|---|--------|----------|
| S1 | **Pass** | `MOCK_FEEDS=true pnpm omo run workflows/hiring-signals.yaml` |
| S2 | **Partial** | 3 connectors registered; live HTTP only with fixtures |
| S3 | **Pass** | `parseOpportunity` on all writes; golden example |
| S4 | **Pass** | `workflows/hiring-signals.yaml` drives connectors, rules, weights |
| S5 | **Pass** | README, CONTRIBUTING, schemas, wedge docs, CI |
| S6 | **Pass** | 52 labels + eval test |
| S7 | **Pass** | `framework_complete: false` on MVP output |

### 18.2 Gaps before “production OSS” (not blocking first GitHub push)

| Gap | Priority | Target |
|-----|----------|--------|
| Live Indeed / career-page fetch | P1 | v0.1.1 per compliance.md |
| OpenAI LLM classify when `enabled: true` | P2 | v0.2 |
| buyer-matching + monetization-engine | P0 for “complete loop” | v0.2 per FUTURE-EXPANSION |
| Expand fixture job corpus (realistic variety) | P2 | Ongoing |
| output-writers unit tests | P3 | v0.1.1 |

### 18.3 Commands verified in CI

```bash
pnpm install && pnpm build && pnpm test
pnpm validate:workflows
MOCK_FEEDS=true pnpm omo run workflows/hiring-signals.yaml --output /tmp/omo-out --min-score 50
```
