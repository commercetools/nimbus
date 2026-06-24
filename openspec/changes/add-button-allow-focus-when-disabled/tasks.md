# Tasks: Allow Tooltips on disabled Buttons (`allowFocusWhenDisabled`)

## 1. Types

- [x] 1.1 Add `allowFocusWhenDisabled?: boolean` to the public `ButtonProps` in
      `button.types.ts` with JSDoc explaining: pairs with `isDisabled`, keeps
      the button focusable + hoverable + in the tab order, renders
      `aria-disabled` instead of native `disabled`, suppresses activation, and
      is purpose-built for tooltips on disabled buttons. Default `false`.

## 2. Implementation

- [x] 2.1 In `button.tsx`, derive `isDisabled` (from `isDisabled` ?? `disabled`)
      and `softDisabled = Boolean(isDisabled && allowFocusWhenDisabled)`.
- [x] 2.2 When `softDisabled`, call `useButton` with `isDisabled: false` and the
      activation handlers withheld (`onPress`, `onPressStart`, `onPressEnd`,
      `onPressUp`, `onPressChange`, `onClick`) so no native `disabled` attribute
      is emitted and nothing fires. Keep the default path untouched otherwise.
- [x] 2.3 When `softDisabled`, set `aria-disabled={true}` on the rendered
      element and add an `onClick` guard that calls `preventDefault()` +
      `stopPropagation()` to suppress activation, form submit/reset, and link
      navigation. Ensure `excludeFromTabOrder` still composes (do not force
      `tabIndex`).
- [x] 2.4 Strip `allowFocusWhenDisabled` from the props forwarded to the DOM /
      slot so it never reaches the underlying element.

## 3. Stories (behavior is tested here)

- [x] 3.1 `FocusableDisabled` story: soft-disabled button is focusable via Tab,
      exposes `aria-disabled="true"`, has no native `disabled` attribute, and
      `onPress`/`onClick` do not fire on click or `Enter`/`Space`.
- [x] 3.2 `FocusableDisabledFormSubmit` story: a `type="submit"` soft-disabled
      button inside a `<form>` does not submit.
- [x] 3.3 `DisabledWithTooltip` story: pairing with `Tooltip`, the tooltip opens
      on hover and on keyboard focus of the soft-disabled button.
- [x] 3.4 Regression: default disabled button (no `allowFocusWhenDisabled`)
      keeps the native `disabled` attribute, is not focusable, and a tooltip
      does not open.

## 4. Documentation

- [x] 4.1 Add a "Tooltip on a disabled Button" section to `tooltip.dev.mdx` (and
      reference from `button.dev.mdx` as appropriate) showing the `isDisabled` +
      `allowFocusWhenDisabled` pattern and explaining the accessibility
      rationale (`aria-disabled`, explain _why_ it's disabled).
- [x] 4.2 Add a consumer example to `button.docs.spec.tsx` (a disabled button
      with a tooltip explaining why) so it ships as copyable docs.

## 5. Validation

- [x] 5.1 TypeScript compiles cleanly
      (`pnpm --filter @commercetools/nimbus typecheck`).
- [x] 5.2 Storybook tests pass against source
      (`pnpm test:storybook:dev packages/nimbus/src/components/button/button.stories.tsx`).
- [x] 5.3 Lint passes (`pnpm lint -- packages/nimbus/src/components/button/`).
- [x] 5.4 Add a changeset (minor bump on `@commercetools/nimbus`) describing the
      new `allowFocusWhenDisabled` prop and the tooltip-on-disabled use case
      from the consumer's perspective.
