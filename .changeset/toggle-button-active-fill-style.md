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
- Fixed: `colorPalette` now applies for every semantic palette on the group.
  Values other than `primary` / `critical` / `neutral` were previously ignored.
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

- New pressed-state feedback — a 1px downward nudge plus a darker fill — on top
  of the existing hover feedback.
- Hover and pressed text now use `colorPalette.12` for contrast on those fills.
- The open-state background for disclosure/menu triggers (`aria-expanded`, e.g.
  `Menu.Trigger`) was realigned to the new pressed fill so an open trigger reads
  like a held one: `solid` → a slightly darkened step 10; `subtle` / `outline` /
  `ghost` → step 5 with step-12 text. The open state keeps the fill only — no
  press nudge, which would otherwise persist for as long as the overlay is open.

### Visual changes to review after upgrading

- **`selectionMode="multiple"` groups now default to `tint`** instead of the
  previous solid fill. Pass `activeFillStyle="solid"` to keep the old look.
- The selected `tint` fill deepened (`colorPalette.3` → `.5`) and selected text
  moved to `colorPalette.12`, so **every already-selected `ToggleButton` and
  `IconToggleButton` changes appearance**. `IconToggleButton` wraps
  `ToggleButton`, so it inherits `activeFillStyle`, the group context
  inheritance, and this new selected fill.
- **Disclosure/menu-trigger `Button`s** paint a deeper open-state
  (`aria-expanded`) background than before — the `_expanded` fills were
  realigned to the new pressed fills (per variant above). The state itself is
  unchanged; only the shade shifts.
