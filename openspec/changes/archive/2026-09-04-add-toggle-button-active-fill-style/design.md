# Design

## Decision 1: Split "resting look" from "selected weight"

`variant` and `activeFillStyle` are orthogonal. `variant` styles only the
resting (unselected) chrome and is always neutral; `activeFillStyle` sets the
weight of the selected fill and draws from `colorPalette`. This lets a
multi-select set use a light `tint` (several buttons on at once stay legible) and
a single-select set use a bold `solid` (one choice stands out) without changing
the resting appearance.

Consequence: `colorPalette` no longer tints the resting toggle button. It was
previously used for resting borders/backgrounds; it now applies only to the
active state. This is the one consumer-visible behaviour shift.

## Decision 2: `ToggleButtonGroup.Button` is the standard `ToggleButton`

Rather than maintain a second implementation of the button visuals inside the
group recipe, the group renders the real `ToggleButton` through the button slot's
`withContext`. `ToggleButtonGroupButtonProps` is therefore just `ToggleButtonProps`.

Sharing configuration uses a small React context, `ToggleButtonContext`, that the
Root provides with `variant` / `activeFillStyle` / `size` / `colorPalette`. Each
`ToggleButton` reads the context as a default only when its own corresponding
prop is `undefined`, so a prop set directly on a button always wins.

Why a React context and not React Aria's own `ToggleButtonContext`: RAC's context
is consumed by its inner button and is not typed for our recipe props; routing
recipe props through it would be type-unsafe and conflate two concerns. A
dedicated context keeps the channel typed and Nimbus-owned.

## Decision 3: `activeFillStyle` default resolves from `selectionMode`

Single-selection groups (radio-like) default to `solid`; multiple-selection
groups (checkbox-like) default to `tint`. The Root resolves this default before
providing the context and passing it to the slot recipe, so both the visual and
the shared default agree. An explicit `activeFillStyle` on the Root overrides the
resolution.

## Decision 4: Segmentation without `!important`

Two same-single-class recipes (the group's `button` slot and the toggle button's
own class) tie on specificity and resolve by cascade order, which is unreliable —
the toggle button's border-radius won the tie. Scoping the segmentation to
`& > .nimbus-toggle-button-group__button` on the **root** raises specificity to
(0,2,1), which out-specifies the toggle button's own (0,1,0) rule, so
segmentation wins without `!important`. Scoping to the button class (not a bare
`button` selector) also leaves bare-toggle (selection-manager) children
un-segmented, mirroring the toolbar's `:has(> .__button)` detection. The
selected-segment divider stays in the `button`-slot compound because it targets
the following sibling (`& + button`), which already gains combinator specificity.

## Decision 5: Press feedback, and dropping `_expanded`

`Button` gains a base `_pressed` `translateY(1px)` — a translate only, so glyphs
stay crisp and layout never reflows — keyed off React Aria's `data-pressed`. The
`subtle` / `outline` / `ghost` variants additionally deepen their fill and text
while pressed. The visual state is intentionally shown only after the press
resolves into a toggle, not while the button is held down.

The `_expanded` variant styling was removed from the button. It was unwired dead
styling (no `aria-expanded`/`data-expanded` path in `button.tsx`, and no doc or
story referenced it); hover and pressed feedback now cover interaction states.

## Decision 6: `_pressed` / `_selected` conditions

`data-react-aria-pressable` is emitted by React Aria's `usePress` on all
button-family components. The `_pressed` / `_selected` conditions map to
`&[data-react-aria-pressable]&[data-pressed='true']` /
`&[data-react-aria-pressable]&[data-selected='true']`, giving the recipes named
conditions instead of raw data-attribute selectors.
