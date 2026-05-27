# Contributing to OpportunityOS

Thank you for helping build open-source liquidity intelligence.

## Primary contribution path: workflows

1. Copy [`workflows/_template.yaml`](workflows/_template.yaml)  
2. Configure connectors, detect rules, scoring weights  
3. Run `pnpm omo validate workflows/your-wedge.yaml`  
4. Add `docs/wedges/your-wedge.md`  
5. Register in [`workflows/registry.json`](workflows/registry.json)  

You do **not** need to fork core packages for deterministic wedges.

## Code contributions

- MVP packages: `feed-connectors`, `signal-engine`, `opportunity-scoring`, `output-writers`, `shared-types`, `apps/cli`  
- Follow existing TypeScript + ESM patterns  
- Add tests with Vitest  
- Run `pnpm build && pnpm test` before PR  

## Compliance

Read [docs/compliance.md](docs/compliance.md) before adding connectors.

## Docs

- [PRD-MVP.md](docs/PRD-MVP.md) — scope and checklist  
- [FUTURE-EXPANSION.md](docs/FUTURE-EXPANSION.md) — roadmap  
