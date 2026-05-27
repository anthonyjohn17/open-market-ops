# Schemas — OpportunityOS contracts

JSON Schema is the **source of truth** for workflows and opportunity objects. TypeScript types in `@omo/shared-types` mirror these files.

## Files

| Schema | Purpose |
|--------|---------|
| [opportunity.schema.json](./opportunity.schema.json) | Output: five-step opportunity + scores |
| [workflow.schema.json](./workflow.schema.json) | Input: workflow-as-asset (moat) |
| [raw-feed-item.schema.json](./raw-feed-item.schema.json) | Connector normalized row |
| [signal.schema.json](./signal.schema.json) | Signal-engine cluster output |

## Validate locally

```bash
# Install ajv-cli globally or use npx
npx ajv-cli validate -s schemas/workflow.schema.json -d workflows/hiring-signals.yaml --spec=draft2020 -c yaml

npx ajv-cli validate -s schemas/opportunity.schema.json -d examples/sample-opportunity.json
```

## Versioning

- Breaking changes bump workflow `version` and `scores.eval_version`
- Prefer **additive** opportunity fields; see [docs/FUTURE-EXPANSION.md](../docs/FUTURE-EXPANSION.md)

## Moat

Contributors ship **workflows** that validate against `workflow.schema.json` without forking core packages. See [workflows/_template.yaml](../workflows/_template.yaml).
