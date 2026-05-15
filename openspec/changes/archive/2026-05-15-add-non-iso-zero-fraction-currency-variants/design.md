## Context

The commercetools platform can return currency codes that are not part of ISO
4217. Specifically, for currencies whose customary subunit (e.g. fillér for HUF,
kuruş for TRY) is no longer used in practice, the API may emit a non-ISO variant
suffixed with `0` — `HUF0`, `TRY0`, `CZK0`, `ILS0`, `KZT0`, `TWD0` — to signal
"this money value has zero fraction digits."

`MoneyInput` keys all of its parsing, formatting, and validation off a
`currencies` lookup table in
`packages/nimbus/src/components/money-input/utils/currencies.ts`. That table
only contained ISO 4217 codes, so any platform payload using a non-ISO variant
fell through `fractionDigits` lookups and broke the static helpers:
`convertToMoneyValue`, `parseMoneyValue`, and `isHighPrecision`. Consumers using
those helpers against real platform data would crash on otherwise-valid money
values.

## Approach

The `currencies` table is the single source of truth for both formatting
pipelines documented at the top of the file:

1. The NumberInput live-typing format options.
2. The MoneyInput static-method path used by API integrations.

Because both paths read the same table, the smallest correct fix is to extend
the table with six new entries — `CZK0`, `HUF0`, `ILS0`, `KZT0`, `TRY0`, `TWD0`
— each mapped to `{ fractionDigits: 0 }`. No new code paths, types, or
configuration surface are added; the variants behave like any other
zero-fraction currency (e.g. `JPY`, `KRW`) from the component's perspective.

Tests in `money-input.spec.ts` cover `convertToMoneyValue` / `parseMoneyValue` /
`isHighPrecision` against the new codes to lock in the contract.

## Alternatives Considered

- A separate non-ISO lookup table or a runtime suffix-stripping helper.
  Rejected: both add code surface for what is structurally identical to existing
  zero-fraction handling, and would force every call site to branch on
  ISO-vs-non-ISO.

## Risks / Trade-offs

- The `currencies` data shape (`Record<string, { fractionDigits: number }>`) is
  now slightly looser than "ISO 4217 codes." The architecture note at the top
  of `currencies.ts` already documents shared usage; readers expecting strict
  ISO membership need to consult the table.
- If the platform later introduces additional non-ISO variants, the table must
  be extended again — this is an explicit, additive maintenance step rather
  than an automatic rule.
