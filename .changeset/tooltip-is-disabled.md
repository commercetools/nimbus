---
"@commercetools/nimbus": minor
---

`Tooltip`: document and test the `isDisabled` prop on `Tooltip.Root`.

The prop (from React Aria's `TooltipTrigger`) was already forwarded via the
rest-spread but was not explicitly surfaced, tested, or documented. When
`isDisabled` is `true`, hover/focus listeners are inactive, the overlay never
opens, and no `aria-describedby` is added to the trigger. Children render
unchanged with the same DOM, focus order, and ref forwarding.
