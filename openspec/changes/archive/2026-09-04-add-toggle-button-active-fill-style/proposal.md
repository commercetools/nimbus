# Change: ToggleButton `activeFillStyle` + neutral resting chrome (and group unification)

## Why

The toggle button's selected appearance was hard-coded per variant, and its
resting chrome was tinted by `colorPalette`. That coupled two independent
decisions — "how does the control look at rest" and "how strong is the selected
fill" — and made single-select vs. multi-select sets look the same when they
should not. `ToggleButtonGroup` compounded the problem: it re-implemented the
button visuals in its own recipe, so `variant`/`colorPalette` set on the group
only styled the group's `button` slot and drifted from the standalone
`ToggleButton`. Reviewers flagged that group-level style props were a no-op for
standalone children.

This change was captured on branch `FEC-1170-toggle-button-group-variant`
(PR #1950). It reconciles the specs against the shipped implementation.

## What Changes

- Add **`activeFillStyle`** to `ToggleButton` (`tint` default | `solid`): the
  weight of the active/selected fill, independent of the resting `variant`.
  `tint` = `colorPalette.5` fill + `colorPalette.12` text (hover `.6`); `solid` =
  `colorPalette.9` fill + contrast text (hover `.10`). For `outline`, the
  selected border tracks the fill (`.8` tint / `.9` solid).
- Add a **`subtle`** variant to `ToggleButton` (filled neutral chip at rest),
  alongside `outline` (default) and `ghost`.
- Make the **resting chrome always neutral** for every variant. `colorPalette`
  now applies only to the active (selected) state, not the resting button.
- Unify **`ToggleButtonGroup.Button`** to render the standard `ToggleButton`
  (via the button slot's `withContext`) instead of a bespoke component built on a
  bare React Aria `ToggleButton`. The group recipe drops the duplicated visuals
  and keeps only segmentation.
- Add **`variant`** and **`activeFillStyle`** to `ToggleButtonGroup.Root`, shared
  with every child through a new **`ToggleButtonContext`**; a child's own prop
  still wins. `activeFillStyle` defaults from `selectionMode`
  (`single` → `solid`, `multiple` → `tint`).
- Give `Button` **tactile press feedback**: a base `_pressed` `translateY(1px)`,
  plus deepened fill/text (`colorPalette.5` / `.12`) on `subtle`, `outline`, and
  `ghost` while pressed; remove the unwired `_expanded` styling from the button
  variants.
- Add the `_pressed` / `_selected` theme **conditions** (mapping to
  `[data-react-aria-pressable][data-pressed='true']` /
  `[data-selected='true']`) and use them in the recipes in place of raw
  data-attribute selectors.
- Keep the **Toolbar** integration: a segmented `ToggleButtonGroup` (built with
  `ToggleButtonGroup.Button`) sits flush inside a `Toolbar`, while bare-toggle
  (selection-manager) groups keep the normal toolbar gap.

## Capabilities

### Modified Capabilities

- `nimbus-toggle-button`: neutral resting chrome for all variants, new `subtle`
  variant, new `activeFillStyle` prop, and `colorPalette` scoped to the active
  state.
- `nimbus-toggle-button-group`: `variant` + `activeFillStyle` on the Root shared
  via `ToggleButtonContext`; `Button` is the standard `ToggleButton`; the recipe
  is scoped to segmentation only; per-button overrides supported.
- `nimbus-button`: tactile press feedback (`translateY(1px)` + pressed fill),
  removal of the unwired `_expanded` variant styling.

### New Capabilities

<!-- None — this modifies existing capabilities only. -->

## Impact

- **Modified source:**
  - `packages/nimbus/src/components/toggle-button/` — `toggle-button.recipe.ts`
    (neutral chrome, `subtle`, `activeFillStyle`, compound variants),
    `toggle-button.tsx` (consume `ToggleButtonContext`, child prop wins),
    `toggle-button.types.ts` (`activeFillStyle` JSDoc), and new
    `toggle-button.context.ts`.
  - `packages/nimbus/src/components/toggle-button-group/` — `*.root.tsx`
    (provide context + resolve `activeFillStyle` default), `*.slots.tsx`
    (render `ToggleButton`), `*.recipe.tsx` (segmentation only), `*.types.tsx`
    (`ToggleButtonGroupButtonProps = ToggleButtonProps`).
  - `packages/nimbus/src/components/button/button.recipe.ts` — base `_pressed`,
    per-variant pressed fills, `_expanded` removal.
  - `packages/nimbus/src/components/toolbar/toolbar.recipe.ts` — flush segmented
    group inside a toolbar.
  - `packages/nimbus/src/theme/conditions.ts` — `_pressed` / `_selected`
    conditions.
- **Docs & stories:** `toggle-button.{mdx,dev.mdx,stories.tsx,docs.spec.tsx}`,
  `toggle-button-group.{mdx,dev.mdx,stories.tsx,playground.stories.tsx}`, and
  `toolbar.dev.mdx` updated to document/demonstrate `subtle`, `activeFillStyle`,
  the `.Button` = `ToggleButton` inheritance model, and the flush toolbar
  integration. Generated Chakra theme typings regenerated.
- **Breaking:** No new required props. Two behavioural shifts consumers may
  notice: (1) `colorPalette` no longer tints the *resting* toggle button (only
  the selected state); (2) a `Button` used as a disclosure/menu trigger no longer
  paints a distinct `_expanded` background (hover + pressed feedback remain).
- **Consumers:** standalone `ToggleButton` and grouped buttons now render
  identically; group-level `variant`/`activeFillStyle`/`colorPalette`/`size`
  reach every child.
