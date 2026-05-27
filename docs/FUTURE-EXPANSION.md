# Future Expansion Paths — OpportunityOS / Open Market Ops

**Version:** 1.0  
**Status:** Roadmap (post-MVP)  
**Last updated:** May 2026  
**Prerequisite:** [PRD-MVP.md](./PRD-MVP.md) v0.1.0 complete  

**Related:** [concept.md](./concept.md) · [ideas.md](./ideas.md)

---

## Executive summary

MVP deliberately ships **four runtime layers** (feed connectors → signal extraction → opportunity scoring → outputs) plus **workflow/schema moat**. Everything in this document extends the same monorepo and dependency graph without breaking wedge contracts.

**Recommended expansion order:**

```txt
1. buyer-matching + monetization-engine  (complete the five-step loop)
2. Second wedge workflow (distressed-saas OR local-closures)
3. Economic evals + simulation layer
4. apps/worker + apps/api (operationalize)
5. Multi-agent orchestration (agents/)
6. Vector memory + RAG
7. Open Opportunity Graph (graph-memory / Neo4j)
8. apps/dashboard + src/ site (live liquidity UI)
9. Workflow marketplace
```

Each section below defines **what**, **why**, **dependencies**, **interfaces**, **acceptance criteria**, and **risks**.

---

## 1. Buyer matching (`@omo/buyer-matching`)

### 1.1 Purpose

Replace workflow **stubs** with ranked buyer segments and evidence. Implements concept step **Buyer — Who Pays**: pain, money, urgency, authority, trust path.

### 1.2 Why now (Phase 2)

MVP sets `framework_complete: false` because buyer fields are declarative only. Agencies and portfolio reviewers need **“who pays”** to trust opportunity quality. Matching is the highest-leverage completion of the ontology.

### 1.3 Dependencies

- `@omo/shared-types` — extend `BuyerMatch`, `BuyerSegment`  
- `@omo/opportunity-scoring` — consume `buyer_density` as real metric, not proxy  
- Workflow `buyer.segments`, `buyer.match` version  

### 1.4 Functional scope

| Capability | Description |
|------------|-------------|
| Segment registry | Built-in segments: `ai_support_agencies`, `automation_consultancies`, `bpo_operators`, etc. |
| Rule matcher | Map `pain_category` + `company_size_proxy` + geography → segments |
| Optional LLM ranker | Score fit 0–1 with rationale (feature-flagged) |
| Buyer list output | Top-N buyers with `fit_score`, `rationale`, `suggested_pitch_angle` |
| Density metric | Count addressable buyers per niche/region for scoring |

### 1.5 Interface sketch

```typescript
interface BuyerMatcher {
  match(input: {
    opportunity: Partial<Opportunity>;
    workflow: WorkflowBuyerConfig;
  }): Promise<BuyerMatchResult>;
}

interface BuyerMatchResult {
  segments: BuyerSegmentMatch[];
  buyer_density: 'low' | 'medium' | 'high';
  top_buyers: RankedBuyer[];
}
```

### 1.6 Pipeline insertion

```txt
signal-engine → opportunity-scoring → buyer-matching → monetization-engine → output-writers
```

### 1.7 Acceptance criteria

- [ ] Hiring-signals workflow produces `framework_complete: true` when buyer engine enabled  
- [ ] `buyer.top_buyers.length >= 1` for positive labeled clusters  
- [ ] Eval: buyer match quality ≥ baseline on human-labeled sample  

### 1.8 Risks

- Hallucinated buyer names — use segment templates, not invented companies, unless sourced from directory API  

---

## 2. Monetization engine (`@omo/monetization-engine`)

### 2.1 Purpose

Recommend concept **Monetization archetypes A–F** with reasoning and `monetization_speed` score.

| Archetype | ID |
|-----------|-----|
| Flip | `flip` |
| Broker | `broker` |
| Retainer | `retainer` |
| Relaunch | `relaunch` |
| Lead generation | `lead_generation` |
| Data product | `data_product` |

### 2.2 Dependencies

- Buyer match output (density affects broker vs retainer)  
- Workflow `monetize.recommended` as allowlist  
- Scoring engine weights update  

### 2.3 Functional scope

| Capability | Description |
|------------|-------------|
| Archetype classifier | Rules + optional LLM chooser among allowlisted types |
| Speed estimate | `fast` \| `medium` \| `slow` based on asset type and buyer type |
| Revenue model hints | e.g. “sell lead $X–Y”, “retainer intelligence” |
| Conflict resolution | When multiple archetypes fit, rank by workflow priority |

### 2.4 Hiring-signals defaults

Primary: `lead_generation`, `retainer`  
Secondary: `data_product` (package feed as agency alert product)

### 2.5 Acceptance criteria

- [ ] Every opportunity has `monetization.recommended[]` with ≥1 archetype + reason  
- [ ] Aligns with [concept.md](./concept.md) archetype table for Example 3  

---

## 3. Entity extraction package (`@omo/entity-extraction`)

### 3.1 Purpose

Split asset resolution from signal-engine when wedges need rich entities (companies, domains, apps, filings).

### 3.2 Migration plan

- MVP: asset embedded in signal-engine  
- Phase 2+: extract `CompanyEntity`, `DigitalAsset`, `PhysicalAsset` types  
- Signal-engine emits references; entity-extraction resolves and enriches  

### 3.3 Wedge-specific entities

| Wedge | Entity types |
|-------|--------------|
| distressed-saas | `SaaSProduct`, `Founder`, `MRREstimate` |
| local-closures | `BusinessLocation`, `LiquidationAsset` |
| expired-domains | `Domain`, `BacklinkProfile` |

### 3.4 Enrichment sources (future)

- Clearbit-style domain → company (API)  
- Wayback / DNS for domains  
- Public filing parsers  

---

## 4. Additional feed connectors

### 4.1 Connector roadmap

| Connector ID | Wedge | Priority | Notes |
|--------------|-------|----------|-------|
| `linkedin_jobs` | hiring | P1 | Official API or partner data; no ToS violations |
| `greenhouse` | hiring | P2 | Public board URLs |
| `lever` | hiring | P2 | Public board URLs |
| `acquire_com` | distressed-saas | P1 | Listings feed |
| `indie_hackers` | distressed-saas | P2 | Forum/RSS |
| `google_maps` | local-closures | P1 | Status changes |
| `yelp` | local-closures | P2 | Closure signals |
| `state_filings` | local-closures | P2 | Per-state adapters |
| `expireddomains` | expired-domains | P1 | Auction/expiry |
| `app_store` | app-decline | P3 | Rankings + reviews |

### 4.2 Connector contract (unchanged)

All connectors implement `FeedConnector` → `RawFeedItem`. New sources never require changes to output-writers.

### 4.3 Compliance program

Expand [`docs/compliance.md`](./compliance.md) per connector: robots.txt, API terms, rate limits, attribution.

---

## 5. Second and third wedge workflows

### 5.1 distressed-saas

**Feed:** Acquire.com, Indie Hackers, Product Hunt, GitHub, app reviews  
**Asset:** Small SaaS with users, weak growth  
**Trigger:** Burnout language, review decline, stale releases  
**Buyer:** Micro-PE, founders, search funds  
**Monetization:** Alerts subscription, brokerage, acquire-relaunch  

**New packages touched:** entity-extraction, financial estimate module (optional)

### 5.2 local-business-closures

**Feed:** Maps, Yelp, state filings, bankruptcy notices  
**Asset:** Equipment, domain, phone, lease, demand  
**Trigger:** Closure, liquidation  
**Buyer:** Competitors, equipment resellers, restaurant groups  
**Monetization:** Broker fee, lead-gen site, monthly report  

**Complexity:** Higher than hiring — geo + multi-source fusion. Target after buyer/monetization engines proven.

### 5.3 expired-domains

**Feed:** Expiry lists, auctions, rank trackers  
**Asset:** Domain + authority  
**Trigger:** Expiration, rank decay  
**Monetization:** Flip, lead-gen relaunch  

### 5.4 market-triggers (horizontal)

Cross-cutting workflow: trigger types without full asset resolution — alert product MVP for “operational change events.”

### 5.5 Wedge documentation standard

Each wedge gets `docs/wedges/<id>.md`: I/O contract, example opportunity, eval dataset path, compliance notes.

---

## 6. Economic evals & quality system

### 6.1 Purpose

Quant-style discipline for signal and scoring quality ([ideas.md](./ideas.md)).

### 6.2 Package: `@omo/evals` (new)

| Eval | Method |
|------|--------|
| Framework completeness | Automated schema + engine presence checks |
| False positive rate | Labeled negatives in datasets |
| Trigger precision | Event detected vs ground truth |
| Monetization calibration | Historical or synthetic outcomes |
| Buyer match quality | Human or LLM-judge on sample |
| Score stability | Same input → same score (deterministic mode) |

### 6.3 CLI

```bash
omo eval run --workflow hiring-signals --dataset datasets/hiring-signals/labeled-clusters.json
omo eval report --format md
```

### 6.4 CI integration

PR gate: eval regression must not drop precision/recall below baseline stored in `datasets/baselines/`.

### 6.5 Prompt versioning (`prompts/`)

- Versioned prompts for LLM classify steps  
- Eval per prompt version  
- Lock winning prompt in workflow YAML: `detect.llm_classify.prompt_version: v2`

---

## 7. Simulation & backtest layer

### 7.1 Purpose

Replay historical feed snapshots; measure how scoring changes would have affected outcomes.

### 7.2 Components

| Component | Role |
|-----------|------|
| Snapshot store | Frozen `RawFeedItem[]` by date |
| Replay runner | Feed connectors bypassed; inject snapshot |
| Counterfactual scoring | A/B weight sets |
| Report generator | Precision/recall curves, score distributions |

### 7.3 Use cases

- Tune `min_similar_roles` without live scraping  
- Portfolio narrative: “backtested on 90 days of fixtures”  

### 7.4 Package

`packages/simulation/` or `apps/research-cli/`

---

## 8. Worker & scheduling (`apps/worker`)

### 8.1 Purpose

Run workflows on cron from `workflow.feed.schedule` (e.g. `0 */6 * * *`).

### 8.2 Features

| Feature | Description |
|---------|-------------|
| Scheduler | node-cron or external (GitHub Actions for OSS demo) |
| Run state | SQLite or JSON run log |
| Deduplication | Skip opportunities seen in prior run |
| Alert threshold | Only write jsonl when `opportunity_score >= workflow.output.min_score` |

### 8.3 Deployment options

- Docker container  
- Fly.io / Railway for demo SaaS  
- GitHub Actions scheduled workflow (free tier OSS pattern)  

---

## 9. HTTP API (`apps/api`)

### 9.1 Purpose

Expose opportunities and runs to external tools; embed in agency dashboards.

### 9.2 Endpoints (v1 sketch)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/opportunities` | List with filters (wedge, min_score, since) |
| GET | `/v1/opportunities/:id` | Single card |
| POST | `/v1/runs` | Trigger workflow async |
| GET | `/v1/runs/:id` | Run status + manifest |
| GET | `/v1/workflows` | List bundled workflows |
| GET | `/health` | Health check |

### 9.3 Auth (future)

API keys for SaaS; OSS local mode open.

### 9.4 Stack options

Fastify or Hono; OpenAPI spec generated from schemas.

---

## 10. Multi-agent orchestration (`agents/`)

### 10.1 Purpose

**Option 2** from [ideas.md](./ideas.md): specialized agents per concept layer for complex wedges and demos.

### 10.2 Agent roster (maps to concept.md)

| Agent | Package hook |
|-------|--------------|
| feed-agent | feed-connectors |
| asset-agent | entity-extraction |
| trigger-agent | signal-engine |
| buyer-agent | buyer-matching |
| strategist-agent | monetization + scoring synthesis |
| outreach-agent (future) | new package |
| crm-agent (future) | new package |

### 10.3 Orchestration patterns

- **Sequential:** MVP-style pipeline; agents wrap existing functions  
- **Supervisor:** strategist delegates to sub-agents  
- **Human-in-the-loop:** approval gate before outreach-agent  

### 10.4 Implementation options

- LangGraph / custom state machine  
- Workflow YAML gains optional `agents:` block overriding deterministic path  

### 10.5 When to adopt

After deterministic pipeline is stable — agents add variance and cost; use for distressed-saas narrative and portfolio depth.

---

## 11. Vector memory & RAG (`packages/graph-memory` — vector mode)

### 11.1 Purpose

- Find **similar historical opportunities**  
- Retrieve past evidence for scoring calibration  
- Power “why this looks like deal X” explanations  

### 11.2 Architecture

| Store | Content |
|-------|---------|
| Vector index | Embedding of job cluster text / opportunity summary |
| Metadata | wedge, score, outcome label (if known) |

### 11.3 Adapters

- LanceDB / Chroma (local OSS-friendly)  
- pgvector (production)  
- Optional: same package hosts graph edges later  

### 11.4 RAG use cases

| Use case | Query |
|----------|-------|
| Dedup | Near-duplicate company cluster in 30 days |
| Explain | Top-3 similar won/lost opportunities |
| Classify | k-NN role taxonomy before LLM |

### 11.5 Dependencies

Embedding model choice documented; `OPENAI_API_KEY` or local model.

---

## 12. Open Opportunity Graph (Neo4j / graph-memory)

### 12.1 Purpose

**Option 3** — knowledge graph of entities and relationships ([ideas.md](./ideas.md)).

### 12.2 Entity nodes

`Company`, `Domain`, `Founder`, `JobPosting`, `Signal`, `Trigger`, `Opportunity`, `BuyerSegment`, `SaaSProduct`, `Filing`, `ReviewEvent`

### 12.3 Relationship examples

```txt
(Company)-[:POSTED]->(JobPosting)
(Company)-[:HAS_TRIGGER]->(Trigger)
(Opportunity)-[:MATCHES]->(BuyerSegment)
(Domain)-[:EXPIRES_ON]->(Date)
(Company)-[:COMPETES_WITH]->(Company)
```

### 12.4 Queries

- “Closures in Austin last 30 days with domain authority > X”  
- “Companies with hiring surge AND recent funding event”  

### 12.5 Sync model

- Worker ingests → upsert graph  
- API serves Cypher or pre-built views  

### 12.6 UI tie-in

Force-directed graph in `src/` or `apps/dashboard` using Cytoscape.js / react-force-graph.

### 12.7 When to adopt

After 2+ wedges produce stable entities; avoid empty graph anti-pattern.

---

## 13. Dashboard & liquidity UI (`apps/dashboard` + `src/`)

### 13.1 Purpose

Communicate **liquidity intelligence visually** — not generic AI chat UI.

### 13.2 Surfaces

| Surface | MVP site (`src/`) | Full dashboard |
|---------|-------------------|----------------|
| Marketing / concept | Static pages | — |
| Opportunity terminal | — | Filterable table + detail drawer |
| Feed health | — | Ingest volume, errors |
| Trigger timeline | — | Event stream per company |
| Liquidity heatmap | — | monetization_speed × buyer_density |
| Graph explorer | Placeholder | Neo4j-backed |

### 13.3 Stack (from ideas.md)

React, Tailwind, Cytoscape or react-force-graph, **SSE or WebSockets** for live triggers.

### 13.4 Live triggers

```txt
worker detects trigger → event bus → SSE /ws → dashboard toast + timeline
```

Event schema: `TriggerEvent` in `shared-types`.

### 13.5 GitHub Pages vs app

| Path | Role |
|------|------|
| `src/` | Public product story, framework docs, wedge catalog |
| `apps/dashboard` | Operator tool (optional hosted) |

---

## 14. Browser automation & deep research

### 14.1 Purpose

Post-score due diligence: pricing pages, founder LinkedIn, Wayback, acquisition history.

### 14.2 Scope

- Playwright in isolated worker  
- Only on flagged opportunities (`score >= threshold`)  
- Human-in-the-loop for legal/ethical bounds  

### 14.3 Outputs

Attach `research[]` evidence blobs to opportunity — never auto-send outreach.

---

## 15. Financial & social signal modules

### 15.1 Financial APIs

- Estimate MRR for distressed-saas (public signals + heuristics)  
- Improve `spread_estimate` from guess to band  

### 15.2 Social signals

- Founder burnout / exit intent from public posts  
- Trigger booster: `founder_burnout_detected`  

### 15.3 Packages

`packages/enrichment-financial/`, `packages/enrichment-social/` — optional plugins.

---

## 16. Outreach & CRM agents (late phase)

### 16.1 outreach-agent

Draft seller/buyer messages from opportunity card — **draft only** in OSS; send via user CRM.

### 16.2 crm-agent

Export to HubSpot/Salesforce APIs; track deal stage.

### 16.3 Ethics

Opt-in only; CAN-SPAM / GDPR notes in compliance doc.

---

## 17. Workflow marketplace

### 17.1 Purpose

Community shares wedge workflows — moat compounds ([ideas.md](./ideas.md)).

### 17.2 Mechanics

| Feature | Description |
|---------|-------------|
| Registry index | `workflows/registry.json` with metadata, author, version |
| Validation CI | All registered workflows pass `omo validate` |
| Versioning | Semver per workflow; breaking schema migrations documented |
| Discovery | Website page + `omo workflow search` |

### 17.3 Trust model

- Official wedges: maintained in repo  
- Community: separate repo or PR-based submission  

### 17.4 Monetization (project-level, optional)

- Hosted runs SaaS  
- Premium connectors  
- Private workflows  

---

## 18. Packaging & distribution evolution

| Stage | Distribution |
|-------|--------------|
| MVP | GitHub + `pnpm` monorepo |
| v0.2 | npm packages `@omo/*` |
| v0.3 | Docker `ghcr.io/.../omo-cli` |
| v1.0 | Hosted API + dashboard SaaS (optional) |

---

## 19. Cross-phase dependency matrix

| Module | Depends on | Blocks |
|--------|------------|--------|
| buyer-matching | shared-types, scoring | framework_complete |
| monetization-engine | buyer-matching | full monetization scores |
| entity-extraction | signal-engine | distressed-saas, closures |
| worker | cli pipeline | scheduled OSS demos |
| api | output schema | dashboard, SaaS |
| evals | datasets | CI quality gates |
| simulation | snapshots | tuning without scrape |
| agents | all core packages | portfolio demos |
| vector memory | opportunities history | RAG explain |
| graph | entity-extraction | graph UI |
| dashboard | api or local db | visual product |
| marketplace | workflow schema stable | community growth |

---

## 20. Version roadmap (suggested)

| Version | Theme | Deliverables |
|---------|-------|--------------|
| **v0.1.0** | MVP | Feeds, signals, scoring, outputs, hiring wedge |
| **v0.2.0** | Complete loop | buyer-matching, monetization-engine, `framework_complete` |
| **v0.3.0** | Second wedge | distressed-saas OR local-closures + evals package |
| **v0.4.0** | Operate | worker, api, webhook HTTP |
| **v0.5.0** | Intelligence++ | simulation, vector memory, prompt evals |
| **v0.6.0** | Agents | agents/ orchestration |
| **v0.7.0** | Graph | Neo4j integration, graph UI |
| **v1.0.0** | Product | dashboard, marketplace, docs site live |

Timelines are team-dependent; order matters more than dates.

---

## 21. Principles for all expansions

1. **Workflow schema backward compatibility** — version workflows; migrate with scripts  
2. **Opportunity schema additive** — new fields optional; never break parsers  
3. **Wedge isolation** — new verticals add workflow + connectors, not forks  
4. **Honest completeness** — `framework_complete` reflects engine truth  
5. **Deterministic default** — LLM enhancements opt-in  
6. **Compliance first** — no expansion connector without ToS doc  

---

## 22. Document maintenance

Update this roadmap when:

- MVP PRD checklist completes (mark Phase 2 in progress)  
- A module ships (move to “Released” section in CHANGELOG)  
- Wedge priorities change based on community demand  

**Owner:** Project maintainers  
**Review cadence:** Each release
