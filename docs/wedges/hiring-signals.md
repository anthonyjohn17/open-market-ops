# Wedge: hiring-signals

**Pitch:** Convert job postings into AI automation agency leads.  
**Workflow:** [`workflows/hiring-signals.yaml`](../../workflows/hiring-signals.yaml)  
**Status:** MVP (runnable with `MOCK_FEEDS=true`)

## Concept mapping

| Step | Implementation |
|------|----------------|
| Feed | indeed, career_page, linkedin_jobs (stub) |
| Asset | `operational_pain_signal` — role cluster + hire count |
| Trigger | `hiring_surge` when ≥3 similar roles in 14d |
| Buyer | Workflow stub → agencies, consultancies, BPO |
| Monetization | Workflow stub → lead_generation, retainer |

## Demo

```bash
MOCK_FEEDS=true pnpm omo run workflows/hiring-signals.yaml --output ./out --min-score 50
```

## Eval

See [`datasets/hiring-signals/`](../../datasets/hiring-signals/).
