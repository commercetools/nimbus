---
"@commercetools/nimbus": minor
---

`Popover`: new compound component for interactive content anchored to a trigger
— `Popover.Root`, `Popover.Trigger` and `Popover.Content`. Use it for filter
panels, short edit forms, and context-sensitive actions; `Tooltip` still covers
plain hints, and `Dialog` a flow that should block the page.

- `Popover.Content` supplies its own dialog, so give it an `aria-label` or
  `aria-labelledby` whenever the content has no visible heading.
- Pass a function as the content to receive a `close` callback for dismissing
  the popover from inside.
- `Popover.Trigger` renders a button by default; with `asChild` it applies
  trigger behavior to your own pressable element, which then carries its own
  props.
- Position with `placement`, `offset` and `crossOffset` on `Popover.Content`.
  Focus is contained and an outside press dismisses it, which `isNonModal`
  relaxes.
