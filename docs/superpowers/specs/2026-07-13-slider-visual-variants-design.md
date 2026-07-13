# Slider Visual Variants + Thumb Centering Fix

**Date:** 2026-07-13 **Component:** `packages/nimbus/src/components/slider`
**Status:** Approved (design), pending implementation plan

## Summary

Add a cosmetic `variant` prop to the Slider slot recipe with four values —
`solid` (default), `outline`, `minimal`, `enclosed` — applying to both `Slider`
and `RangeSlider` (they share `slider.recipe.ts`). Bundle in a bug fix for the
thumb, which currently renders slightly off-center on both axes.

Variant names are used **verbatim** from the design mockup (`outline`, not the
Nimbus-conventional `outlined`), per explicit product decision.

## Motivation

- The design mockup specifies four visual treatments; none exist today (the
  recipe only has `size` and `orientation`).
- The thumb (knob/handle) is visibly mis-centered — high on horizontal sliders,
  toward the inline-start on vertical ones.

## Non-goals

- No behavioral, API-surface, or accessibility change beyond the new cosmetic
  prop. `variant` composes orthogonally with `size`, `orientation`, `showTicks`,
  the per-thumb value tooltip, and the `disabled` / `invalid` states.
- No new tokens; only existing tokens/CSS vars are used.

## Design

### 1. API & structure

- Add a `variant` enum to `sliderSlotRecipe` in `slider.recipe.ts`.
- `defaultVariants: { size: "md", variant: "solid" }`. `solid` reproduces the
  current look exactly, so existing consumers see no visual change.
- No changes to `slider.types.ts`:
  `SliderRecipeProps = SlotRecipeProps<"nimbusSlider">` already flows into
  `SliderRootSlotProps`, so `variant` appears on `SliderProps` /
  `RangeSliderProps` automatically once the recipe declares it (and theme
  typings are regenerated).

### 2. Per-variant styling

`solid` is the base look (no overrides). Others override only appearance slots:

| Variant    | Track                                              | Fill (progress)                                | Thumb                                                             |
| ---------- | -------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| `solid`    | `neutral.6`, filled                                | `colorPalette.9` solid                         | white (`neutral.1`) + `colorPalette.9` border (current)           |
| `outline`  | transparent + `solid-25` border (`colorPalette.7`) | transparent + `colorPalette.9` border (hollow) | white + `colorPalette.9` border                                   |
| `minimal`  | hairline (thin track thickness), `neutral.6`       | `colorPalette.9`                               | small **solid** `colorPalette.9` dot, no border, no white         |
| `enclosed` | thick pill (track ≈ thumb height), `neutral.6`     | `colorPalette.9`                               | white circle **contained inside** the bar + `shadow.1`, no border |

**Dimensional changes must compose with `size` (sm/md).** Track thickness and
thumb size come from `--slider-track-thickness` / `--slider-thumb-size`, set
per-`size` on `root`. `minimal`/`enclosed` do **not** redefine those root vars
(which would race with the `size` group, since cascade order between two variant
groups is not guaranteed). Instead they set the dimension **directly on the
consuming slot** as a `calc()` against the existing size var:

- `minimal` — `thumb` `boxSize: calc(var(--slider-thumb-size) * 0.6)`; `track`
  `height` (and vertical `width`) set to a hairline thickness.
- `enclosed` — `track` `height` (vertical `width`) = `var(--slider-thumb-size)`
  so the bar is as thick as the thumb; `thumb` `boxSize` =
  `calc(var(--slider-thumb-size) - {a small inset})` so it sits contained.

A slot-level property in the `variant` group wins over the base slot rule and
does not collide with the `size` group (which only sets root vars), while the
`calc()` reference keeps sm/md scaling intact. Both `disabled`
(`layerStyle: disabled` on root) and `invalid` (`critical.7` thumb border via
`[data-invalid] &`) already live on shared selectors and must keep winning for
every variant — the invalid border in particular must override each variant's
own thumb border.

### 3. Thumb centering fix

Root cause (verified against `react-aria` `useSliderThumb.mjs`): React Aria
positions the thumb on the **main axis only** and defers cross-axis centering to
CSS:

```js
style: {
  position: 'absolute',
  [isVertical ? 'top' : 'left']: `${thumbPosition * 100}%`,
  transform: 'translate(-50%, -50%)',
}
```

The recipe's `thumb` slot never sets the cross axis, so `translate(-50%, -50%)`
is applied from the thumb's flex static position — pulling it half-a-thumb
off-center (up on horizontal, inline-start on vertical). Fix by supplying the
cross axis, orientation-scoped on the thumb itself (the thumb is a RA element
carrying `data-orientation`, so no ancestor selector is needed):

```ts
thumb: {
  // ...existing...
  top: "50%",                                // horizontal cross-axis center
  '&[data-orientation="vertical"]': {
    insetInlineStart: "50%",                 // vertical cross-axis center
  },
}
```

React Aria's inline main-axis value wins over these via inline-style
specificity, so this only fills the cross axis and stays RTL-safe.

## Testing

- Storybook play-function stories per variant (both `Slider` and `RangeSlider`),
  asserting render + basic interaction, across `sm`/`md` and both orientations.
- A story/assertion covering thumb centering (e.g. thumb box center aligns with
  track center) to lock the fix against regression.
- `variant="solid"` visual parity with today (no regression for existing usage).

## Files touched

- `slider.recipe.ts` — add `variant` variants + thumb cross-axis centering.
- `slider.stories.tsx` / `range-slider.stories.tsx` — variant stories + tests.
- Docs (`slider.dev.mdx`, `slider.mdx`, `slider.docs.spec.tsx`) — document the
  new prop and show each variant.
- Regenerate theme typings (`build-theme-typings`).
