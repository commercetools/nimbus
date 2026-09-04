---
"@commercetools/nimbus": minor
---

`ToggleButtonGroup` and `ToggleButton` gain an `activeFillStyle` prop and a
shared neutral-at-rest visual model, and `Button` gains pressed-state feedback.

### `ToggleButtonGroup`

- New `variant` prop (`outline` | `subtle`, default `outline`) sets the resting
  chrome of the buttons. Resting chrome is neutral; `colorPalette` applies to
  the selected (active) state.
- New `activeFillStyle` prop (`tint` | `solid`) sets the weight of the selected
  fill. It defaults from `selectionMode` — `single` uses `solid`, `multiple`
  uses `tint` — and can be overridden per group or per button.
- `ToggleButtonGroup.Button` is the standard `ToggleButton`: it inherits the
  group's `variant`, `activeFillStyle`, `size` and `colorPalette` (each
  overridable per button) and accepts the same style props and `css` as other
  Nimbus components.

### `ToggleButton`

- New `activeFillStyle` prop (`tint` | `solid`, default `tint`) sets the weight
  of the selected fill.
- New `subtle` variant.
- Resting chrome is neutral and `colorPalette` applies to the selected state, so
  the accent shows when the button is selected.

### `Button`

- New pressed-state feedback — a 1px downward nudge with a darker fill — on top
  of the existing hover feedback. A button used as a menu or disclosure trigger
  no longer paints a separate background while its overlay is open; hover and
  pressed feedback cover the interaction.
