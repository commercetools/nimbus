## Context

The three target components do not share a structure today:

| | chrome lives on | focus ring | clear/toggle | overlay width |
| --- | --- | --- | --- | --- |
| ComboBox | container `div` | `_focusWithin` (`combobox.recipe.ts:76`) | normal-flow grid children | measures own container (`combobox.root.tsx:1499-1504`) |
| SearchInput | container `div` | `_focusWithin` (`search-input.recipe.ts:21`) | normal-flow flex sibling | n/a |
| Select | the `<button>` | `focusRing` on button (`select.recipe.tsx:38`) | absolute overlay + 56px reserve | React Aria `--trigger-width` |

ComboBox and SearchInput already put the field chrome on a non-interactive container, so an interactive sibling is valid in both. Select's field **is** the React Aria `<button>` (`select.root.tsx:58`), so a button in a trailing slot would be nested interactive content.

Select's current structure is not something React Aria imposes. React Aria's Select is `Button` + `SelectValue` + `Popover`; the clear button is a Nimbus addition (`isClearable` defaults to `true`, `select.root.tsx:39`) and cannot live inside the trigger button. The three workarounds that follow from that are all load-bearing today:

- an absolutely-positioned overlay holding clear + chevron (`select.root.tsx:69-94`)
- `--button-safespace: sizes.1400`, a hand-computed 56px reserve applied as `marginRight` on the value label, which the recipe labels "*Magic*" (`select.recipe.tsx:61-69`)
- `ClearPressResponder` and `aria-labelledby=""` on the clear button, so it does not inherit the Select's press behavior or accessible name (`select.clear-button.tsx:28,34`)

The reserve is a static token. It cannot measure arbitrary consumer content, so placing a trailing element in that overlay would silently cover the value label.

## Goals / Non-Goals

**Goals:**

- One structural contract shared by all three components, so `trailingElement` behaves and is styled identically in each
- Interactive trailing content (buttons) valid in all three, including Select
- Select's public API source-compatible: no props added, removed or retyped by the restructure
- Select's overlay width and leading edge unchanged
- SearchInput's existing rendering preserved when `leadingElement` is not passed

**Non-Goals:**

- A shared component or hook abstracting the three field shells. Each has its own slot recipe and a genuinely different core (`Input`, `Input` + TagGroup, `Button` + `SelectValue`); a common component would fight the architecture. What is shared is the contract, not the code.
- Adding `trailingElement` to MultilineTextInput, or `leadingElement` to ScopedSearchInput or RichTextInput.
- Reworking Select's keyboard model, selection semantics or listbox behavior.
- Figma Code Connect mappings for leading/trailing props, which do not exist for any component today.

## Decisions

### The field container owns the chrome

A non-interactive container carries border, background, height, padding and radius, and shows the focus ring via `_focusWithin`. Children sit in normal flow in a fixed order:

```
leadingElement → core → trailingElement → clear → toggle
```

`core` is the only per-component part. Ordering follows the ticket ("before the dropdown trigger") and matches NumberInput, which already renders `trailingElement` before its stepper buttons (`number-input.tsx:88` vs `:101-112`).

ComboBox and SearchInput already satisfy this; only Select changes. That makes the restructure a convergence onto an in-repo precedent rather than a new invention.

**Alternative rejected — trailing element inside Select's button, decorative content only.** Smallest diff and intrinsic layout, but it cannot host a button, which the requirement demands.

**Alternative rejected — trailing element in Select's existing absolute overlay.** Keeps the current structure but inherits the static 56px reserve, so any trailing content overlaps the value label. Would have required consumers to hand-tune a CSS variable.

**Alternative rejected — full grid restructure of Select mirroring ComboBox's named areas.** Maximum consistency, but it moves the value out of the button, so the accessible name has to be rebuilt via `aria-labelledby`. Disproportionate to the requirement.

### Select keeps the value inside the trigger button

The button becomes a transparent `flex: 1` child holding `[leadingElement][valueLabel]`; trailing, clear and chevron become siblings. Keeping the value inside the button preserves its accessible name with no ARIA rewiring, and `flex: 1` preserves click-to-open across the whole field except the sibling controls. `--button-safespace` and the label's `marginRight` are deleted — layout becomes intrinsic, so the component ends up simpler than it started.

### Select's overlay is re-pointed at the field container

React Aria measures whichever element it is given, so a narrower button would shrink the overlay and shift its leading edge to the button's padding edge. Both are fixed by overriding `PopoverContext` with the container ref and a measured `--trigger-width`, exactly as ComboBox already does (`combobox.root.tsx:1499-1504`). React Aria honors an inline `--trigger-width` and skips its own measurement (`react-aria-components/dist/private/Popover.cjs:175,182`).

### Interactive siblings reuse the guards the clear button already needs

`ClearPressResponder` and `aria-labelledby=""` exist precisely because an interactive control sits next to the trigger inside `<RaSelect>`. A trailing element is the same case, so it reuses the same guards instead of inventing new ones.

### SearchInput's leading element defaults to the search icon

`leadingElement` defaults to `<Search />`. Because a default parameter only applies to `undefined`, `undefined` preserves today's rendering and explicit `null` removes the icon — configurable without a breaking change.

The leading slot's `pointerEvents: "none"` must be relaxed for interactive leading content. Click-to-focus survives: `useFocusInputOnFieldClick` already ignores clicks on `button` descendants (`use-focus-input-on-field-click.ts:31`), which is also how TextInput supports interactive adornments today.

### ComboBox's trailing slot must not use `display: contents`

ComboBox's leading slot sets `display: "contents"` (`combobox.recipe.ts:51`), which nullifies its own `gridArea`; the icon reaches the correct cell only through grid auto-placement. A second such slot would auto-place into the wrong cell, so the trailing slot uses `display: flex` with an explicit `gridArea`.

### The restructure is committed separately from the feature

Select's restructure changes painted surfaces without changing behavior, so it lands as its own commit with no new API. Its Chromatic diff then means "chrome moved" and nothing else, and the feature commit's diff is attributable to the feature.

## Risks / Trade-offs

- **Select's `nimbus-select__trigger` class moves from `<button>` to `<div>`.** Slot components are not exported (`select/index.ts` exports only `./select` and `./select.types`), so this is not part of the consumer API surface, but a consumer with a `button.nimbus-select__trigger` selector would be affected. Called out in the changeset.
- **Chromatic baseline churn on a heavily used component.** Accepted and deliberately isolated in its own commit. Verification includes comparing Select's overlay width, leading edge and focus ring against `main`.
- **Click-to-open surface shrinks by the width of the sibling controls.** Intended: those controls own their own clicks. `flex: 1` keeps the rest of the field opening the dropdown.
- **Trailing content competes with the value label for width in Select.** The label already truncates with ellipsis, so the trailing element wins and the value truncates. Covered by a spec scenario rather than left to chance.
- **Visual density.** The original leading-only decision for ComboBox and Select was motivated by icon overload; a field can now show a leading icon, trailing content, a clear button and a chevron at once. This is a documentation concern, addressed with a11y and usage guidance rather than a code constraint.
