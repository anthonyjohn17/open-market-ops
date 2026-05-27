# @omo/buyer-matching (Phase 2 — stub)

Ranks buyer segments and produces `top_buyers[]` with fit scores. Replaces workflow stubs and sets `framework_complete: true` when combined with monetization-engine.

See [docs/FUTURE-EXPANSION.md](../../docs/FUTURE-EXPANSION.md#1-buyer-matching-omobuyer-matching).

```typescript
// Planned interface
interface BuyerMatcher {
  match(input: { opportunity: Partial<Opportunity>; workflow: WorkflowBuyerConfig }): Promise<BuyerMatchResult>;
}
```
