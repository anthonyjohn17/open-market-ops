# Changelog

## [0.1.0] — 2026-05-27

### Added

- OpportunityOS monorepo scaffold (MVP pipeline)
- Wedge: `hiring-signals` workflow (runnable with `MOCK_FEEDS=true`)
- Packages: `@omo/shared-types`, `feed-connectors`, `signal-engine`, `opportunity-scoring`, `output-writers`, `@omo/cli`
- JSON Schemas + workflow registry + `pnpm validate:workflows`
- Stub workflows for five additional OSS wedges
- Eval: 52 labeled clusters + precision/recall regression test
- Examples: `sample-opportunity.json`, `examples/run-output/`
- Docs: PRD (with audit), architecture, future expansion, compliance, demo script
- Product site skeleton under `src/` (GitHub Pages workflow)
- CI: build, test, E2E mock run

### Known limitations

- Live job-board connectors not implemented (fixtures only)
- `framework_complete: false` until buyer/monetization engines (v0.2)
- LLM classification hook only; deterministic default
