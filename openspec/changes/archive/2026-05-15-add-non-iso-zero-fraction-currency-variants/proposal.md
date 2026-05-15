# Change: Add Non-ISO Zero-Fraction Currency Variants

## Why
The commercetools platform may return non-ISO currency codes (e.g. `HUF0`, `TRY0`) as money type currency codes where the trailing `0` signals zero fraction digits. These codes are not in the ISO 4217 standard, so MoneyInput had no entry for them in the currencies table — causing crashes when trying to parse or display money values with these codes.

## What Changes
- Extends the `currencies` lookup table with 6 non-ISO zero-fraction variants: `CZK0`, `HUF0`, `ILS0`, `KZT0`, `TRY0`, `TWD0`, each with `fractionDigits: 0`
- MoneyInput static methods (`convertToMoneyValue`, `parseMoneyValue`, `isHighPrecision`) now work correctly with these codes

## Impact
- Affected specs: `nimbus-money-input`
- Affected code: `packages/nimbus/src/components/money-input/utils/currencies.ts`
- Non-breaking: existing ISO currency behaviour is unchanged
