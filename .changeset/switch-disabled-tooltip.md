---
"@commercetools/nimbus": minor
---

feat(switch): support disabled styling and tooltip on aria-disabled switches

When `aria-disabled` is set on a Switch, the component now applies disabled
visual styles (`data-disabled`) and disables the hidden input to prevent
toggling, while keeping pointer events enabled so tooltips can trigger on hover.
