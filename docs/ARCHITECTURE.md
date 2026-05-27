# Architecture — OpportunityOS

## Pipeline (MVP v0.1)

```txt
workflows/*.yaml
       │
       ▼
┌──────────────────┐
│  apps/cli        │  omo run | validate | connectors
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     RawFeedItem[]
│ feed-connectors  │ ◄── indeed, career_page, linkedin_jobs (stub)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     Signal + Asset + Trigger
│  signal-engine   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     OpportunityScores
│ opportunity-     │
│ scoring          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     buyer/monetize stubs from workflow
│ shared-types     │     buildOpportunityFromPipeline()
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     JSON cards | CSV | alerts.jsonl
│ output-writers   │
└──────────────────┘
```

## Future insertion points (v0.2+)

```txt
opportunity-scoring → buyer-matching → monetization-engine → output-writers
```

## Moat

- **schemas/** — JSON Schema contracts  
- **workflows/** — vertical intelligence as YAML assets  
- **workflows/registry.json** — wedge catalog for OSS discovery  

## Package dependency rule

Dependencies flow **upward only** (no cycles). See [ideas.md](../ideas.md).
