---
"@commercetools/nimbus": minor
---

`Tooltip`: add `isDisabled` prop to `Tooltip.Root` that suppresses tooltip
rendering without requiring conditional JSX wrappers.

When `isDisabled` is `true`, hover/focus listeners are inactive, the overlay
never opens, and no `aria-describedby` is added to the trigger. Children render
unchanged with the same DOM, focus order, and ref forwarding.
