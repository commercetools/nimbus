---
"@commercetools/nimbus": minor
---

Add `ScrollableRegion` component for accessible scrollable containers. Detects
overflow via ResizeObserver and conditionally adds `tabIndex` and a
keyboard-only focus ring. Accepts all Box style props and renders as `<section>`
for `role="region"` or `<div>` for `role="group"` by default, overridable via
`as`.
