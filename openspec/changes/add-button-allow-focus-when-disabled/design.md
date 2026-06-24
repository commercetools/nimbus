# Design: `allowFocusWhenDisabled` on Button

## Problem framing

A disabled `Button` cannot host a `Tooltip`. `useButton` applies the native
`disabled` attribute to `<button>` elements; natively-disabled elements are
non-focusable and emit no pointer/focus events, so `TooltipTrigger` (which opens
on hover and focus and needs a focusable trigger) has nothing to bind to.

The accessibility-correct fix is the well-established **"disabled but
focusable"** pattern: render `aria-disabled="true"` instead of the native
`disabled` attribute, keep the element focusable, and suppress activation. WAI-
ARIA explicitly allows `aria-disabled` elements to remain focusable so that
their state — and any associated explanation — is reachable by all users.

## Why not React Aria's `useButton({ allowFocusWhenDisabled })` directly

`useButton` already accepts an (undocumented) `allowFocusWhenDisabled` option,
but it does **not** solve our case for native buttons:

```js
// useButton.mjs — native button branch
if (elementType === 'button') additionalProps = { type, disabled: isDisabled, ... };
// ...
if (allowFocusWhenDisabled) focusableProps.tabIndex = isDisabled ? -1 : tabIndex;
```

Two problems:

1. For a native `<button>`, `disabled: isDisabled` is **still applied**. The
   native `disabled` attribute overrides `tabIndex` entirely — the element
   remains non-focusable and event-silent. So RA's option doesn't actually make
   a native button focusable; it only helps non-native element types.
2. Even where it helps, it sets `tabIndex = -1` — focusable programmatically but
   **removed from the tab order**. For a tooltip whose job is to explain why an
   action is unavailable, keyboard users must be able to **Tab to it**; `-1`
   defeats the purpose.

So we keep React Aria's term (familiarity) but implement the behavior ourselves
as a correct superset that works for native buttons and preserves the natural
tab order.

## Approach

Compute a single derived flag in `button.tsx`:

```ts
const isDisabled = contextProps.isDisabled ?? contextProps.disabled;
const softDisabled = Boolean(isDisabled && allowFocusWhenDisabled);
```

Then branch:

- **`softDisabled === false`** → today's path, untouched. Pass `isDisabled`
  straight to `useButton`; native `disabled` attribute applied as before.

- **`softDisabled === true`** → tell `useButton` the button is **enabled**
  (`isDisabled: false`) so it does NOT emit the native `disabled` attribute and
  the element stays focusable + hoverable. Then layer the disabled semantics and
  activation-suppression back on ourselves:

  1. **Withhold activation handlers** from `useButton` (`onPress`,
     `onPressStart`, `onPressEnd`, `onPressUp`, `onPressChange`, `onClick`) so
     no consumer press/click logic fires. `useButton` thinks it's enabled, but
     there is nothing for it to invoke.
  2. **Suppress the default action** with an `onClick` handler that calls
     `event.preventDefault()` and `event.stopPropagation()`. Keyboard activation
     (`Enter`/`Space`) on a native button dispatches a click, so a single click
     guard covers mouse, touch, keyboard, **form submit/reset**
     (`type="submit"`/`"reset"`), and **link navigation** (`as="a"` with
     `href`).
  3. **Set `aria-disabled="true"`** on the rendered element. The button recipe's
     `_disabled` condition matches `[aria-disabled=true]`, so the disabled
     styling (reduced opacity via `layerStyle: "disabled"`) applies with no
     recipe change. `isPressed` stays `false`, so no `data-pressed`.

This keeps the existing "delegate to `useButton`" architecture intact for the
common path and confines the new behavior to one well-labeled branch.

## Tab order

Soft-disabled buttons keep their natural `tabIndex` (typically `0`) so keyboard
users discover them and the tooltip opens on focus. Consumers who explicitly
pass `excludeFromTabOrder` still get `-1` — the prop composes and is not
overridden.

## Why a boolean and not `disabledBehavior="…"`

A union prop (`disabledBehavior="all" | "keepFocusable"`) was considered.
Rejected: it collides conceptually with React Aria collections'
`disabledBehavior="selection" | "all"` (different meaning), and a boolean that
pairs with `isDisabled` reads clearly at the call site:

```tsx
<Tooltip>
  <Tooltip.Trigger>
    <Button isDisabled allowFocusWhenDisabled>
      Publish
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content>Complete all required fields to publish.</Tooltip.Content>
</Tooltip>
```

## Why suppress activation, rather than visual-only `aria-disabled`

A simpler model was considered: just let consumers set `aria-disabled` (which
`Button` already accepts), show the disabled styling, and stop there — no
focusability handling, no activation suppression. In fact that path **already
works today**: `<Button aria-disabled>` renders the disabled look (the recipe's
`_disabled` matches `[aria-disabled=true]`), stays a normal enabled button
underneath, and so is focusable + hoverable and can host a tooltip.

The reason that is not enough — and why suppression is the substance of this
feature, not an add-on — is that `aria-disabled="true"` is a promise to
assistive tech and keyboard users that the control is *non-operable*. Without
suppression, the button still fires `onPress`, and a `type="submit"` button
still **submits its form on click/Enter even with no handler wired**. That
produces a control that is announced as disabled but still acts (and looks
disabled but still submits) — a worse defect than the original limitation, and
precisely the case consumers ship, because the dangerous path (form submit /
Enter) needs no handler at all, so "just don't wire `onPress`" does not cover
it. Doing it correctly means guarding press, click, keydown, submit, and link
navigation together — identical for every consumer, so it belongs in the
component. The component's job is to keep the announced disabled state and the
actual behavior in agreement by default. The visual-only behavior remains
available as the deprecated `aria-disabled` escape hatch for consumers who
deliberately want to own activation themselves.

## Why explicit opt-in, not automatic when wrapped in a Tooltip

Auto-switching disabled semantics based on whether a `Tooltip` ancestor exists
would be implicit, hard to discover, and fragile (context plumbing, surprising
behavior when a tooltip is conditionally rendered). An explicit prop keeps the
disabled contract predictable and self-documenting.

## Accessibility notes

- `aria-disabled="true"` is announced as "dimmed/disabled" by screen readers
  while the element remains in the accessibility tree and focusable — the
  intended outcome.
- The tooltip content is associated via `aria-describedby` by `TooltipTrigger`
  as usual, so the explanation is announced on focus.
- Suppressing activation (not just visually disabling) is essential: a focusable
  button that still fired its action would be a worse bug than the original
  limitation.

## Testing strategy

- **Stories (play functions)** are the source of truth for behavior:
  - soft-disabled button is focusable (receives focus via Tab) and exposes
    `aria-disabled="true"` with no native `disabled` attribute;
  - `onPress`/`onClick` do **not** fire on click or `Enter`/`Space`;
  - a `type="submit"` soft-disabled button does **not** submit its form;
  - paired with `Tooltip`, the tooltip opens on hover and on focus;
  - default disabled (no `allowFocusWhenDisabled`) is unchanged: native
    `disabled`, not focusable, tooltip does not open.
- **Docs spec** adds a copyable consumer example of a tooltip on a disabled
  button.
