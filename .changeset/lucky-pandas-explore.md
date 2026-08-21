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
- `Popover.Trigger` renders a bare `button` by default; with `asChild` it
  applies trigger behavior to your own pressable element, which then carries its
  own props. Reach for `asChild` with a `Button` or `IconButton` when you want
  Nimbus styling.
- `Popover.Root` is where you configure the popover — all of it, and the only
  place. Besides `isOpen`, `defaultOpen` and `onOpenChange`, it takes the
  overlay's behavior: placement (`placement`, `offset`, `crossOffset`,
  `shouldFlip`, `containerPadding`, `boundaryElement`, `maxHeight`,
  `shouldUpdatePosition`, `scrollRef`, `getTargetRect`), dismissal
  (`isNonModal`, `isKeyboardDismissDisabled`, `shouldCloseOnInteractOutside`),
  anchoring (`triggerRef`, `trigger`), animation (`isEntering`, `isExiting`,
  `shouldSkipAnimation`), focus tracking (`onFocusWithin`, `onBlurWithin`,
  `onFocusWithinChange`), `UNSTABLE_portalContainer`, and `role` for
  `"alertdialog"`. `arrowRef` and `arrowBoundaryOffset` are accepted too, but do
  nothing until Nimbus renders an arrow.
- `Popover.Content` carries only its own styling and labelling. Behavior props
  are rejected there, so there is exactly one place to look for any given
  setting.
- Two names mean different things on the two parts. On `Popover.Root`,
  `maxHeight` and `offset` are React Aria's numeric positioning inputs, which
  feed the placement and flip calculation. On `Popover.Content` they are the
  ordinary CSS style props.
- `Popover.Root` renders no element of its own, so style props and DOM
  attributes belong on `Popover.Trigger` or `Popover.Content`.
- On `Popover.Content`, style props apply to the positioned surface while `id`,
  `className`, `data-*` and click handlers apply to the dialog inside it. An
  `id` you supply keeps the trigger's `aria-controls` pointing at the overlay.
- Focus is contained and an outside press dismisses it, which `isNonModal`
  relaxes.
