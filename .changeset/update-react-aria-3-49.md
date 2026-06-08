---
"@commercetools/nimbus": patch
---

Update the bundled React Aria dependencies to the 3.49 release train
(`react-aria` 3.49, `react-aria-components` 1.18, `react-stately` 3.47, and the
related `@react-aria/*` / `@internationalized/*` packages).

Behavior change to note: in line with native HTML semantics, `Checkbox` now
toggles on **Space** (and on click), not on **Enter** — Enter submits the
surrounding form. Mouse, keyboard (Space), and pointer interactions are
otherwise unchanged.
