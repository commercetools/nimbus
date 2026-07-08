---
"@commercetools/nimbus": minor
---

`Button`: add `allowFocusWhenDisabled` to support tooltips on disabled buttons.

A disabled button normally can't host a `Tooltip` because the native `disabled`
attribute removes it from the tab order and stops hover/focus events — exactly
when a tooltip explaining _why_ the action is unavailable is most useful. Pass
`allowFocusWhenDisabled` alongside `isDisabled` to keep the button focusable and
hoverable: it is announced as disabled via `aria-disabled` (not the native
`disabled` attribute), stays in the tab order, and its action stays fully
suppressed (press, click, `Enter`/`Space`, form submit/reset, and link
navigation).

```tsx
<Tooltip.Root>
  <Button isDisabled allowFocusWhenDisabled>
    Publish
  </Button>
  <Tooltip.Content>Complete all required fields to publish.</Tooltip.Content>
</Tooltip.Root>
```

Default disabled behavior is unchanged — omit the prop and `isDisabled` works
exactly as before.
