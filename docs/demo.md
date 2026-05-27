# Demo script — OpportunityOS v0.1

Record or live-demo the hiring-signals wedge in under five minutes.

## Prerequisites

- Node.js 20+
- pnpm 9+
- Repo cloned locally

## Script

```bash
# 1. Install
pnpm install
pnpm build

# 2. Show wedge positioning
cat workflows/hiring-signals.yaml | head -20

# 3. Validate workflow (moat asset)
pnpm omo validate workflows/hiring-signals.yaml

# 4. List connectors
pnpm omo connectors

# 5. Run pipeline on fixtures (no live scrape)
MOCK_FEEDS=true pnpm omo run workflows/hiring-signals.yaml \
  --output ./out \
  --min-score 50 \
  --no-llm

# 6. Inspect opportunity card
cat out/manifest.json
ls out/opportunities/
cat out/opportunities/opp_*.json | head -80

# 7. CRM export
head out/opportunities.csv

# 8. Highlight framework honesty
# framework_complete: false — buyer/monetize from workflow stubs until v0.2
```

## Talking points

1. **Not a scraper** — workflows + schemas are the moat.  
2. **Five-step object** — feed, asset, trigger, buyer, monetize, scores.  
3. **Signal → Spread → Match → Monetize** — Match/Monetize engines ship in v0.2.  
4. **OSS wedges** — six workflows; one runnable MVP.  

## Optional: product site

```bash
pnpm dev:site
```
