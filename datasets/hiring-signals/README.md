# Hiring signals eval dataset

## Files

| File | Purpose |
|------|---------|
| `sample-raw-items.json` | Fixture `RawFeedItem` rows for unit tests and `MOCK_FEEDS=true` |
| `labeled-clusters.json` | Positive/negative labels for regression evals |

## Labeling rubric

**Positive**

- ≥3 similar support-class roles within `window_days` (default 14), OR  
- ≥2 roles with strong urgency language  

**Negative**

- Single unrelated role  
- Staffing-agency noise (future rule)  
- Roles outside workflow taxonomy when strict mode enabled  

## Eval baseline

- **52** labeled rows in `labeled-clusters.json`  
- CI regression: `packages/signal-engine/src/eval-hiring.test.ts`  
- Documented floors: precision ≥ 0.75, recall ≥ 0.75 (synthetic labels)  
- Baseline record: [`../baselines/hiring-signals-eval.json`](../baselines/hiring-signals-eval.json)
