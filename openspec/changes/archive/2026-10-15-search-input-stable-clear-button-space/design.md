## Context

`SearchInput` renders, inside one `inline-flex` root: the leading element, the
input, the optional `trailingElement`, and the clear button. Before this change
the clear button was always in the DOM and hidden with `opacity: 0`, which keeps
its place in the layout. In an empty field a `trailingElement` therefore sat one
button width away from the field's trailing edge (#2057).

Removing the button from the DOM fixes the alignment, but a field without a set
width is sized by its content. It then became 32px narrower (md; 28px in sm)
when empty and grew again with the first typed character.

The input has no explicit width. Its default width comes from the browser
(`size=20`): 187px in md and 166px in sm in Chromium with the Nimbus font.

## Goals / Non-Goals

**Goals:**

- A `trailingElement` sits at the trailing edge of an empty field.
- The field's outline keeps its width when the clear button appears or goes
  away, with the browser's default width and with a width the consumer sets.
- An empty field's placeholder is not cut while free space is visible after it.
- In a field narrower than the input's default width, everything stays inside
  the field.

**Non-Goals:**

- The `trailingElement` does not keep its position while typing. With a value,
  the clear button comes after it, so it moves left by the button's space. This
  follows from the first goal and the existing order (`trailingElement`, then
  clear button).
- No change to the clear button's size, focus behavior or tab order.

## Decisions

### Render the clear button only while the field has a value

The condition uses React Aria's `isEmpty` render prop from `SearchField`. The
button still gets React Aria's clear-button props through `ButtonContext`
(`excludeFromTabOrder`, `preventFocusOnPress`, an `onPressStart` that focuses
the input), so removing it after a clear does not lose focus.

Alternative: keep it in the DOM with `visibility: hidden` or `opacity: 0`.
Rejected: any element that stays in the flex flow keeps its space after the
`trailingElement`, which is the bug.

### Hold the button's space in a wrapper, and let the input reach into it

The input sits in a new `inputWrapper` slot. While the field is empty, the root
sets `--search-input-clear-button-space` to the clear button's width plus the
root's gap (`sizes.600` plus `spacing.200` in md, `spacing.100` in sm). The
wrapper uses it as `paddingInlineEnd`. The input is
`width: calc(100% + var(--search-input-clear-button-space, 0px))`, so it covers
the wrapper's padding.

This works because of how CSS Sizing 3 §5.2.1 handles cyclic percentages: for
a box's max-content contribution, a width that contains a cyclic percentage is
treated as `auto`. So the wrapper's natural width is the input's default width
plus the padding, the same width the field has with the button. In layout, the
percentage resolves against the wrapper, and the input fills it including the
padding, so a placeholder can use the space.

The empty state is set in one place per size (the root's `data-empty`
selector); the wrapper and the input only read the variable, with a `0px`
fallback when the field has a value.

Alternatives considered, each measured in Chromium:

- **Padding on the input while empty.** Keeps the width, but text is never drawn
  into padding, so a placeholder was cut 32px before the field's edge.
- **A fixed input width per size and state** (for example `sizes.5600` empty,
  32px less with a value). Works in every case, but replaces the browser's
  default width with a design value and changes the default outline width
  (279px to 284px in md). Rejected: the field must keep the browser default or
  the consumer's width.
- **A spacer with `width` but `flex-basis: 0`.** Expected to count for the
  natural width and take no space in layout. Chromium does not count it: the
  outline was 247px empty and 279px filled.
- **A spacer that keeps its width but shrinks first** (high `flex-shrink`). Same
  result in fields without a set width (247px vs 279px).
- **`:placeholder-shown` instead of `data-empty`.** Matches only when a
  placeholder exists, so an empty field without one would be treated as filled.
  `:empty` never applies to an input value. `data-empty` follows React Aria's
  `isEmpty`, which also decides whether the clear button is rendered.

### Let the wrapper shrink in narrow fields

The wrapper has `flexGrow: 1` and `minWidth: 0`. Before this change, the input
kept its default width as a flex item's automatic minimum, so in a 192px field
the clear button was drawn up to 71px outside the outline.

In Chromium, the wrapper alone already shrinks, because CSS Sizing 3 §5.2.2
lets an input with a cyclic percentage width compress its min-content
contribution. `minWidth: 0` is kept because the same section allows a browser to
set a minimum for usability; it makes the shrinking explicit.

## Risks / Trade-offs

- [Only Chromium was tested] → The behavior relies on CSS Sizing 3 §5.2.1 and
  §5.2.2. Story tests (`StableWidth`, `NarrowField`) run in Chromium; Firefox
  and Safari were not tested.
- [The clear button's space is duplicated in the recipe] → The variable is
  `sizes.600` (the 2xs IconButton) plus the root's gap. If the button size or
  the gap changes, the variable must change too. `StableWidth` fails if the
  outline width changes while typing or clearing.
- [The input is no longer a direct child of the root] → Code that found the
  root with `parentElement` breaks. The repo's tests now use
  `closest(".nimbus-search-input__root")`. Slot components are not exported, and
  the slot class names are unchanged.
- [`SearchInputInputWrapperSlotProps` is a new exported type] → It is exported
  only because `index.ts` re-exports the types file; nothing exported accepts it.
