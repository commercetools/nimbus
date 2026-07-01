# Change: Allow Tooltips on disabled Buttons (`allowFocusWhenDisabled`)

## Why

Consumers want to attach a `Tooltip` to a disabled `Button` — almost always to
explain **why** the action is unavailable ("Complete required fields first",
"You don't have permission"). This is one of the highest-value places a tooltip
can appear, and today it is impossible.

The reason is mechanical. `Button` delegates disabled state to React Aria's
`useButton`, which for a native `<button>` applies the **native `disabled`
attribute**. A natively-disabled element:

- is removed from the tab order (cannot be focused), and
- does not fire pointer or focus events.

`TooltipTrigger` (react-aria-components) shows on hover **and** focus and
requires a **focusable** trigger. A natively-disabled button gives it neither,
so the tooltip never opens — for mouse or keyboard users. The control that most
needs an explanation is the one that can't carry one.

Telling consumers "no" pushes them toward worse workarounds: wrapping the button
in an extra focusable `<span>` (tooltip describes the wrong element, no
`aria-disabled` semantics), or faking a disabled look with full interactivity
left live (the action still fires). Both are accessibility regressions we'd
rather not see in the wild.

## What Changes

Add an opt-in boolean prop **`allowFocusWhenDisabled`** to `Button` (default
`false`). It only has an effect together with `isDisabled` (or the deprecated
`disabled`). When both are set, the button is **soft-disabled**:

- **Stays focusable and in the natural tab order** (`tabIndex` unchanged) — so
  keyboard users can Tab to it and the tooltip opens on focus.
- **Stays hoverable** — so the tooltip opens on hover.
- **Exposes `aria-disabled="true"`** instead of the native `disabled` attribute,
  so assistive tech announces it as disabled and the existing disabled recipe
  styling (`_disabled`, which matches `[aria-disabled=true]`) still applies — no
  visual change.
- **Cannot be activated** — press, click, `Enter`/`Space`, form submit/reset,
  and link navigation (`as="a"`) are all suppressed. `onPress`/`onClick` do not
  fire. It looks and behaves disabled; it is merely reachable.

Default behavior (`allowFocusWhenDisabled` omitted or `false`) is **completely
unchanged**: `isDisabled` continues to apply the native `disabled` attribute via
`useButton`. This is a purely additive, non-breaking change.

The Tooltip docs gain a documented "Tooltip on a disabled Button" pattern that
pairs `isDisabled` with `allowFocusWhenDisabled`, so the supported path is
discoverable.

## What does NOT change

- `IconButton` / other button-derived components are out of scope for this
  change; they can adopt the same prop in a follow-up if demand exists.
- No automatic detection of a wrapping `Tooltip` — the behavior is explicit and
  opt-in, because silently changing disabled semantics based on ancestry would
  be surprising and fragile.
- `excludeFromTabOrder` still works and composes: a consumer may keep a
  soft-disabled button focusable-but-out-of-sequence if they have a reason to.

## Impact

- **Affected specs:** `nimbus-button` (modified — Disabled State, useButton
  integration, ARIA attributes; new requirement for focusable-disabled
  behavior).
- **Affected code:**
  - **MODIFIED**: `packages/nimbus/src/components/button/button.tsx` —
    soft-disable branch (withhold native `disabled` from `useButton`, set
    `aria-disabled`, suppress activation).
  - **MODIFIED**: `packages/nimbus/src/components/button/button.types.ts` — add
    `allowFocusWhenDisabled` to the public props with JSDoc.
  - **MODIFIED**: `packages/nimbus/src/components/button/button.stories.tsx` —
    play-function coverage for the soft-disabled behavior + Tooltip pairing.
  - **MODIFIED**: `packages/nimbus/src/components/button/button.docs.spec.tsx` —
    consumer example for a Tooltip on a disabled Button.
  - **MODIFIED**: `packages/nimbus/src/components/tooltip/tooltip.dev.mdx` (and
    `button.dev.mdx` as appropriate) — documented disabled-Button pattern.
- **Breaking:** No — additive opt-in prop; default behavior is identical.
- **Consumers:** unblocks tooltips-on-disabled-buttons across the Merchant
  Center frontends; no migration required.
