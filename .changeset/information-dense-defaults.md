---
"@commercetools/nimbus-tokens": major
"@commercetools/nimbus": major
---

**BREAKING**: Default component density reduced by ~25-30% for information-dense
layouts.

`@commercetools/nimbus-tokens`:

- `fontSize` and `lineHeight` tokens now use `rem` instead of `px`, enabling
  browser font-size scaling (WCAG 1.4.4 compliance). At the default 16px base,
  rendered output is identical.
- Tightened line heights on semantic text styles: `body` (26px → 22px),
  `detail`/`sm` (22px → 20px), `caption`/`xs` (18px → 16px).

`@commercetools/nimbus`:

- All component spacing reduced by ~1 token stop. For example, a component using
  `spacing.400` (16px) padding now uses `spacing.300` (12px).
- No API changes — all props, types, and component interfaces are unchanged.

**Density control**: Set `html { font-size: 14px }` to tighten further, or
`html { font-size: 18px }` to restore looser spacing. Typography scales
proportionally with the browser's base font size.
