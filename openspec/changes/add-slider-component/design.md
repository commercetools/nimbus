## Context

Nimbus lacked a slider control. The design was explored in two separate
documents — a base `Slider` + `RangeSlider` design and a follow-up "visual
variants + thumb centering" design — both of which lived under
`docs/superpowers/` outside the OpenSpec workflow. The components have since been
implemented on the `feat/slider-component` branch. This design consolidates both
documents into one record and reconciles them with what actually shipped.

React Aria Components uses the **same** `Slider` primitive for single- and
multi-thumb sliders: a single slider is `value={30}`; a range is
`value={[20, 60]}` with two `<SliderThumb>`s. Track, fill, ticks, per-thumb value
tooltip, and interaction are identical. The only real differences are the value
type, the number of thumbs, and which track segment is filled — and React Aria's
`<SliderFill>` handles the fill automatically.

## Goals / Non-Goals

**Goals:**

- Two clean public APIs (`Slider`: `number`; `RangeSlider`: `[number, number]`)
  over one shared internal `SliderBase`, avoiding a `number | number[]` union in
  the public surface.
- Token-driven styling via a `nimbusSlider` slot recipe with `size`,
  `orientation`, and cosmetic `variant` variants.
- Value surfaced through a per-thumb tooltip (hover/focus/drag), not a static
  output.
- WCAG 2.1 AA via React Aria: keyboard, pointer, touch, RTL, ARIA slider
  semantics, focus management.
- FormField integration for label/description/invalid state.

**Non-Goals:**

- Min/max bound labels at the track ends (possible future follow-up).
- More than two thumbs (React Aria supports N, but there is no use case).
- Non-linear scales (logarithmic, etc.).
- The `solid` / `outline` variants from the earlier draft — see Decisions.

## Decisions

**Two public wrappers, one `SliderBase`.** `Slider` and `RangeSlider` are thin
wrappers that both render `SliderBase`, which owns the recipe, React Aria wiring,
orientation, ticks, thumb rendering, and the per-thumb tooltip (~95% shared).
_Alternative considered:_ a single unified component with a
`value: number | number[]` union — rejected because every `onChange` would hand
consumers a union to narrow. This mirrors the Adobe Spectrum / React Aria
`Slider` + `RangeSlider` sibling convention Nimbus already tracks.

**Variants: `filled` (default), `minimal`, and `enclosed`.** The earlier
visual-variants draft specified four cosmetic variants (`solid`, `outline`,
`minimal`, `enclosed`). The shipped set keeps three, all look-descriptive:
**`filled`** (default — a thin track with a colored progress fill, reproducing
the base look), **`minimal`** (understated at rest — a thin neutral track line
with a normal-size knob painted a single solid palette color, `colorPalette.9` —
that comes alive on hover/focus/drag: the track bar grows to the normal
thickness and the knob shifts to `colorPalette.10`, resizing and recoloring only
painted layers so the DOM box, hit target, and thumb-size grid never change; the
knob's size is constant and the focus ring stays brand-colored. A single
`Slider` shows no progress fill, keeping it a bare handle on a neutral track; a
`RangeSlider` paints its range segment the same `colorPalette.9` → `.10` so the
selected span still reads), and **`enclosed`** (iOS-style bar as thick as the
thumb). _Rationale:_ `solid` and `outline` added surface area without demand and
were dropped; the surviving low-emphasis variant kept the draft's `minimal`
name. The default was renamed from the interim `plain` to `filled` so the name
describes the look (a colored fill) and pairs with `minimal` as filled ↔
minimal.

**Value tooltip is controlled.** Each thumb is wrapped in `Tooltip.Root` with
`isOpen = isHovered || isFocused || isThumbDragging(index)` and a no-op
`onOpenChange`, bypassing React Aria's hover delay so the value appears the
instant the thumb is engaged. Escape dismisses it. _Alternative:_ a static
`SliderOutput` beside the track — rejected as the label/value ownership belongs
to FormField and the thumb, keeping the root a simple flex track container.

**Invalid state is a Nimbus-only seam.** React Aria's `Slider` has no validation
state, so `isInvalid` is intentionally **not** forwarded to `RaSlider`; instead
it surfaces as `data-invalid` on the root for styling. This exists so
`FormField.Input` can clone its React-Aria-named `isInvalid` onto the control.
The invalid thumb border re-asserts both width and color so it wins over the
`enclosed` variant (which drops the thumb border).

**Inset interactive track + `::before` bar.** The interactive track is inset by
half a thumb on each end and the visible bar is painted by `::before`. React Aria
measures this element to map pointer→value and position thumbs, so insetting it
makes clicks, drags, ticks, and thumbs share one coordinate system — thumbs never
overhang, and clicking a tick lands the thumb on it with no JS compensation.

**Thumb cross-axis centering in CSS.** React Aria positions the thumb on the main
axis only (inline `left`/`top`) and defers cross-axis centering to CSS. The recipe
supplies `top: 50%` (horizontal) and `inset-inline-start: 50%` (vertical,
ancestor-scoped since the thumb carries no `data-orientation`); React Aria's inline
main-axis value wins by inline-style specificity, so this fills only the cross axis
and stays RTL-safe.

**Size vars on `root`.** `--slider-track-thickness` / `--slider-thumb-size` /
`--slider-tick-length` are declared on `root` (an ancestor) because CSS custom
properties cascade downward only; track/thumb/fill consume them. `enclosed` sets
dimensions directly on the consuming slot via `calc()` against these vars rather
than redefining root vars, so it never races with the `size` variant group.

**i18n default thumb labels.** `RangeSlider` applies localized `Minimum` /
`Maximum` (`Nimbus.Slider.*`) when `thumbLabels` is absent; a single `Slider` gets
none (its own `aria-label` / FormField label names it).

## Risks / Trade-offs

- **React Aria SliderState API drift** (`getThumbValueLabel`, `isThumbDragging`)
  → pinned via the workspace React Aria version; covered by story play-function
  tests that fail loudly if behavior changes.
- **Tooltip portals to `document.body`** → tests must query the tooltip on the
  body, not the canvas; documented in stories.
- **Variant/size cascade ordering** → mitigated by keeping size on root vars and
  variant dimensions as slot-level `calc()`, so the two variant groups never set
  the same property.
- **Recipe not registered** → no styles at runtime; registration in
  `theme/slot-recipes/index.ts` is an explicit task.

## Migration Plan

Net-new components; no rollback of existing behavior needed. The superseded
`docs/superpowers/` plan/spec files are removed as part of this change. On
archive, `specs/nimbus-slider/spec.md` becomes the canonical capability spec
under `openspec/specs/`.

## Open Questions

- None outstanding — the implementation is shipped and this change records it.
  Bound labels at track ends remain a possible future follow-up.
