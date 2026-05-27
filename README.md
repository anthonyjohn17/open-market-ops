# OpportunityOS · Open Market Ops

[![CI](https://github.com/anthonyjohn17/open-market-ops/actions/workflows/ci.yml/badge.svg)](https://github.com/anthonyjohn17/open-market-ops/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**A framework for detecting economic asymmetry from public signals.**

OpportunityOS turns messy feeds into ranked **opportunity objects** using liquidity intelligence:

> **Signal → Spread → Match → Monetize**

Not a generic scraper — a **workflow-driven** pipeline where vertical intelligence lives in versioned YAML assets ([`workflows/`](workflows/)) and JSON schemas ([`schemas/`](schemas/)).

Docs: [Concept](concept.md) · [Product vision](ideas.md) · [MVP PRD](docs/PRD-MVP.md) · [Roadmap](docs/FUTURE-EXPANSION.md) · [Architecture](docs/ARCHITECTURE.md)

---

## MVP wedge: Hiring Signal → AI Agency Lead Engine

**One-liner:** Convert job postings into scored opportunities for AI automation agencies.

```bash
git clone https://github.com/anthonyjohn17/open-market-ops.git
cd open-market-ops
pnpm install
pnpm build

# Validate workflow (moat asset)
pnpm omo validate workflows/hiring-signals.yaml

# Run with fixture data (no live scrape)
MOCK_FEEDS=true pnpm omo run workflows/hiring-signals.yaml --output ./out --min-score 50
```

Outputs:

- `out/opportunities/*.json` — opportunity cards  
- `out/opportunities.csv` — CRM-friendly export  
- `out/alerts.jsonl` — alert stream (MVP: file-based)  
- `out/manifest.json` — run metadata  

---

## OSS wedge catalog

| Wedge | Status | Workflow | Pitch |
|-------|--------|----------|-------|
| **hiring-signals** | **MVP** | [hiring-signals.yaml](workflows/hiring-signals.yaml) | Job postings → AI agency leads |
| distressed-saas | Stub | [distressed-saas.yaml](workflows/distressed-saas.yaml) | Under-maintained SaaS acquisitions |
| local-closures | Stub | [local-business-closures.yaml](workflows/local-business-closures.yaml) | Distressed local assets |
| ai-agency-prospecting | Stub | [ai-agency-prospecting.yaml](workflows/ai-agency-prospecting.yaml) | Companies needing automation |
| expired-domains | Stub | [expired-domains.yaml](workflows/expired-domains.yaml) | Underpriced SEO / lead-gen domains |
| market-triggers | Stub | [market-triggers.yaml](workflows/market-triggers.yaml) | Operational change events |

Registry: [`workflows/registry.json`](workflows/registry.json)

**Add a wedge:** copy [`workflows/_template.yaml`](workflows/_template.yaml) → [CONTRIBUTING.md](CONTRIBUTING.md)

---

## The moat: workflows as assets

```yaml
# workflows/hiring-signals.yaml (excerpt)
wedge: hiring-signals
feed:
  connectors:
    - id: indeed
detect:
  rules:
    - repeated_hiring_same_role
trigger:
  min_similar_roles: 3
  window_days: 14
buyer:
  segments:
    - ai_support_agencies
monetize:
  recommended:
    - lead_generation
    - retainer
```

Core engines stay stable; **vertical logic ships as workflows** validated against [`schemas/workflow.schema.json`](schemas/workflow.schema.json).

---

## Monorepo (MVP)

```txt
packages/
  shared-types/         # Opportunity + workflow types (Zod)
  feed-connectors/      # Feed layer ★
  signal-engine/        # Asset + trigger extraction ★
  opportunity-scoring/  # Spread proxy + rank ★
  output-writers/       # JSON / CSV / jsonl ★
  buyer-matching/       # Phase 2 stub
  monetization-engine/  # Phase 2 stub
apps/
  cli/                  # omo run | validate | connectors ★
workflows/              # Wedge assets ★
schemas/                # JSON Schema contracts ★
```

★ = MVP v0.1 · See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Opportunity object

Every output validates against [`schemas/opportunity.schema.json`](schemas/opportunity.schema.json):

| Section | Meaning |
|---------|---------|
| `feed` | Sources + evidence URLs |
| `asset` | Mispriced / latent value (e.g. operational pain) |
| `trigger` | Why now (urgency) |
| `buyer` | Who pays (MVP: workflow stub) |
| `monetization` | How to cash out (MVP: workflow stub) |
| `scores` | `opportunity_score`, confidence, proxies |

Example: [`examples/sample-opportunity.json`](examples/sample-opportunity.json)

`framework_complete: false` in MVP until buyer-matching and monetization-engine ship ([v0.2 roadmap](docs/FUTURE-EXPANSION.md)).

---

## CLI

| Command | Description |
|---------|-------------|
| `omo run <workflow>` | Execute pipeline |
| `omo validate <workflow>` | Schema-check workflow YAML |
| `omo connectors` | List registered feed connectors |

Options: `--output`, `--limit`, `--min-score`, `--dry-run`, `--no-llm`

---

## Product site (optional)

Static concept site for GitHub Pages: [`src/`](src/)

```bash
pnpm dev:site
```

React + Tailwind — explains liquidity intelligence (not required for pipeline MVP).

---

## Environment

```bash
cp .env.example .env
# MOCK_FEEDS=true  — use datasets/hiring-signals fixtures
# OPENAI_API_KEY=  — optional LLM classify (workflow flag)
```

Compliance: [docs/compliance.md](docs/compliance.md)

---

## Roadmap

| Version | Focus |
|---------|--------|
| **v0.1** | Hiring wedge — feeds, signals, scoring, outputs |
| v0.2 | buyer-matching + monetization-engine |
| v0.3+ | Additional wedges, worker, API, graph |

Full detail: [docs/FUTURE-EXPANSION.md](docs/FUTURE-EXPANSION.md)

---

## License

MIT — see [LICENSE](LICENSE)
