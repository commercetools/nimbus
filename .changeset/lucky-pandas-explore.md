---
"@commercetools/nimbus": minor
---

`Popover`: new public compound component for anchored, interactive overlay
content — `Popover.Root`, `Popover.Trigger` and `Popover.Content`.

Use it when the content is interactive and belongs to a specific element: a
filter panel, a short edit form, a set of context-sensitive actions. For plain
text hints reach for `Tooltip`; for a flow that should block the page, `Dialog`.

```tsx
<Popover.Root>
  <Popover.Trigger>Filters</Popover.Trigger>
  <Popover.Content aria-label="Filters">
    <Checkbox>Only active</Checkbox>
  </Popover.Content>
</Popover.Root>
```

- `Popover.Content` renders its own dialog, so you do not add one yourself. Give
  it an `aria-label` or `aria-labelledby` whenever the content has no visible
  heading — that is the one accessibility detail the component cannot supply for
  you.
- Pass a function as the content to receive a `close` callback, so an action
  inside the popover can dismiss it: `{({ close }) => <Button onPress={close}>…`
- `Popover.Root` renders no DOM element, so it will not disturb the layout
  around your trigger.
- `Popover.Trigger` renders a button by default; pass `asChild` to apply trigger
  behavior to your own pressable element instead.
- Positioning is available on `Popover.Content` via `placement`, `offset` and
  `crossOffset`, and the popover flips to stay inside the viewport.
- Focus is contained within the popover and an outside press dismisses it. Pass
  `isNonModal` to relax that, though most popovers should not need to.
