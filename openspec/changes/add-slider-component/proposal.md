## Why

Nimbus has no slider control today. Consumers need an accessible way to select a
single numeric value (volume, opacity, zoom) or a `[min, max]` range (price
filters, numeric ranges) via direct manipulation, with full keyboard, pointer,
touch, RTL, and WCAG 2.1 AA support. The design was captured across two separate
documents (base component + visual variants/centering fix) that lived outside
OpenSpec; this change consolidates them into a single tracked capability
reconciled against the shipped implementation.

## What Changes

- Add **`Slider`** — a single-thumb control selecting one `number`.
- Add **`RangeSlider`** — a two-thumb control selecting a `[number, number]`
  tuple; the two public components share one internal `SliderBase`.
- Add the `nimbusSlider` slot recipe (slots: `root`, `track`, `fill`, `thumb`,
  `tick`, `tickLabel`) with `size` (`sm`/`md`, default `md`), `orientation`
  (`horizontal`/`vertical`), and cosmetic `variant` (`filled` default, `minimal`,
  `enclosed`) variants.
- Add a per-thumb **value tooltip** shown while the thumb is hovered, focused, or
  dragged (dismissible with Escape), honoring `formatOptions`.
- Add opt-in **tick marks** (`showTicks` / `tickStep`), always placing a tick at
  `maxValue`, with region-aware tick coloring.
- Add **FormField integration** (label association via `aria-labelledby`,
  description, and a Nimbus-only `isInvalid` → `data-invalid` seam, since React
  Aria's `Slider` has no native validation state).
- Add localized default thumb labels for `RangeSlider` (`Minimum` / `Maximum`).
- Reconcile the stale visual-variants design: three variants ship — **`filled`**
  (default), **`minimal`** (uncolored, for neutral controls like a thumbnail-size
  picker), and **`enclosed`** — dropping the `solid` and `outline` variants from
  the originally-drafted four (`solid`/`outline`/`minimal`/`enclosed`), plus the
  thumb cross-axis centering fix.

## Capabilities

### New Capabilities

- `nimbus-slider`: Accessible single-value (`Slider`) and two-thumb range
  (`RangeSlider`) numeric selection controls, including sizes, orientation,
  cosmetic variants, per-thumb value tooltip, tick marks, disabled/invalid
  states, FormField integration, and i18n thumb labels.

### Modified Capabilities

<!-- None — this introduces a new capability only. -->

## Impact

- **New source**: `packages/nimbus/src/components/slider/` (recipe, slots, types,
  `slider-base`, `Slider`, `RangeSlider`, stories, i18n, docs).
- **Recipe registration**: `nimbusSlider` added to
  `src/theme/slot-recipes/index.ts`; theme typings regenerated.
- **Barrel export**: `Slider` / `RangeSlider` exported from
  `src/components/index.ts`.
- **i18n**: new `Nimbus.Slider.minimumThumb` / `Nimbus.Slider.maximumThumb`
  message keys.
- **No breaking changes** — net-new components; no existing API is altered.
- **Docs cleanup**: the superseded `docs/superpowers/` plan/spec files are
  removed in favor of this OpenSpec change.
