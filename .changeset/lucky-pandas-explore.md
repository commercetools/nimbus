---
"@commercetools/nimbus": minor
---

`Popover`: new compound component for interactive content anchored to a trigger
— `Popover.Root`, `Popover.Trigger` and `Popover.Content`. Reach for it for
filter panels, short edit forms and context-sensitive actions; `Tooltip` still
covers plain hints, and `Dialog` covers flows that should block the page.

- `Popover.Content` supplies its own dialog element, so give it an `aria-label`
  or `aria-labelledby` whenever the content has no visible heading.
- Pass a function as the content to receive a `close` callback for dismissing
  the popover from inside it.
- `Popover.Trigger` renders a bare `button` by default. Pass `asChild` to apply
  the trigger behavior to your own pressable element — use it with `Button` or
  `IconButton` for Nimbus styling.
- `Popover.Root` is the single configuration surface: open state, placement,
  dismissal, animation and portal container are all set there. `Popover.Content`
  takes only its own styling and labelling props.
- Focus is contained while the popover is open and an outside press dismisses
  it. `isNonModal` relaxes both.

Beta. See the
[Popover docs](https://nimbus-documentation.vercel.app/components/feedback/popover)
for the full prop reference.
