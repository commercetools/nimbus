# Slider + RangeSlider — Design

**Date:** 2026-07-12 **Status:** Approved (brainstorming), pending
implementation plan **Author:** Michael Salzmann (with Claude Code)

## Summary

Add two new Nimbus components for selecting numeric values on a continuous
scale:

- **`Slider`** — a single-thumb slider selecting one `number`.
- **`RangeSlider`** — a two-thumb slider selecting a `[number, number]` min–max
  tuple.

Both wrap React Aria Components' `Slider` primitive and share a single internal
implementation (`SliderBase`). They follow the standard Nimbus component
patterns (slot recipe, React Aria wrapping, FormField integration, token-driven
styling).

## Motivation

Nimbus has no slider today. Consumers need an accessible control for selecting a
value (e.g. volume, opacity, zoom) or a range (e.g. price filters, date-agnostic
numeric ranges) via direct manipulation, with full keyboard, pointer, RTL, and
WCAG 2.1 AA support.

## Decisions

### Two public components, one shared internal implementation

React Aria uses the **same primitive** for single and multi-thumb sliders: a
single slider is `value={30}`; a range slider is `value={[20, 60]}` with two
`<SliderThumb>`s. The track, fill, ticks, per-thumb value tooltip, and
interaction are identical. The differences are exactly three:

1. Value type (`number` vs `number[]`).
2. Number of thumbs rendered.
3. Which segment of the track is filled — and React Aria's `<SliderFill>`
   already handles this automatically (start→thumb for single, thumb↔thumb for
   range).

A single unified public component would force a `value: number | number[]`
union, which is awkward to consume in TypeScript (every `onChange` hands the
consumer a union to narrow). Therefore:

- **`Slider`** and **`RangeSlider`** are thin public wrappers with clean,
  non-union APIs.
- Each normalizes its value prop to React Aria's shape and renders a single
  internal **`SliderBase`** that owns the recipe, slots, orientation, the
  per-thumb value tooltip, ticks, and thumb rendering. ~95% of the logic is
  shared.

This matches the Adobe Spectrum / React Aria convention (`Slider` +
`RangeSlider` as siblings) that Nimbus already tracks closely.

### Scope

- **Orientation:** both `horizontal` (default) and `vertical`, via an
  `orientation` prop → recipe variant.
- **Built-in features:** per-thumb value tooltip (shows the current formatted
  value while the handle is hovered, focused, or dragged), tick marks, and
  FormField integration.
- **No built-in visible label and no static value output.** The label is not the
  slider's responsibility — it comes from `FormField.Label`, or, for standalone
  use, from an `aria-label` / `aria-labelledby` (invisible, accessible name
  only). The current value is surfaced by the thumb tooltip, not a static
  readout beside the track.
- **Not in scope:** min/max bound labels at the track ends (can be a later
  follow-up).
- **Sizes:** two — `sm` and `md` (default `md`) — varying track thickness and
  thumb diameter via tokens.
- **Ticks:** opt-in via `showTicks` / `tickStep` so dense scales don't
  over-render.
- **Design source:** designed against existing Nimbus design tokens (no Figma
  reference); patterns drawn from `number-input`, `switch`, and `radio-input`.

## Public API

```tsx
// Single
<Slider defaultValue={30} minValue={0} maxValue={100} step={5} />

// Range (tuple, not loose array — tighter DX)
<RangeSlider defaultValue={[20, 60]} minValue={0} maxValue={100} />
```

### Shared props (both components)

| Prop                     | Type                                                 | Notes                                               |
| ------------------------ | ---------------------------------------------------- | --------------------------------------------------- |
| `value` / `defaultValue` | `number` (Slider) / `[number, number]` (RangeSlider) | controlled / uncontrolled                           |
| `onChange`               | `(value) => void`                                    | fires during interaction                            |
| `onChangeEnd`            | `(value) => void`                                    | fires when interaction settles                      |
| `minValue`               | `number`                                             | default `0`                                         |
| `maxValue`               | `number`                                             | default `100`                                       |
| `step`                   | `number`                                             | default `1`                                         |
| `orientation`            | `"horizontal" \| "vertical"`                         | default `"horizontal"`                              |
| `size`                   | `"sm" \| "md"`                                       | default `"md"`                                      |
| `isDisabled`             | `boolean`                                            |                                                     |
| `formatOptions`          | `Intl.NumberFormatOptions`                           | formats the value shown in the thumb tooltip        |
| `showTicks`              | `boolean`                                            | opt-in tick marks                                   |
| `tickStep`               | `number`                                             | tick interval (defaults to `step` when `showTicks`) |
| `aria-label`             | `string`                                             | accessible name for standalone use (invisible)      |
| `name`                   | `string`                                             | form submission                                     |
| Nimbus style props       |                                                      | forwarded to root slot                              |

No `label` prop renders a visible label, and there is no static value output —
see below.

The **only** type difference between the two components is the shape of `value`
/ `defaultValue` / the `onChange`/`onChangeEnd` argument: `number` for `Slider`,
`[number, number]` for `RangeSlider`.

## Anatomy & slots

Slot recipe key: `nimbusSlider`. Slots:

- **root** — the track container (holds the track full-width/height; no label or
  output areas).
- **track** — the rail.
- **fill** — the filled portion (`SliderFill`); auto start→thumb (single) or
  thumb↔thumb (range).
- **thumb** — one per value; each is wrapped in a Nimbus `Tooltip` whose content
  is that thumb's current formatted value.
- **tick** — a mark at each tick interval (rendered from step math).
- **tickLabel** — optional label under/beside a tick.

There is **no `output` and no `label` slot** — the value is shown in the thumb
tooltip and the label is owned by `FormField` / `aria-label`.

### Value tooltip

Each thumb is wrapped in `Tooltip.Root` with `Tooltip.Content` rendering the
thumb's current value (`state.getThumbValueLabel(index)`, which honors
`formatOptions`). The tooltip is **controlled**: it is open when the thumb is
**hovered**, **keyboard-focused**, or **being dragged** —
`isOpen = isHovered || isFocused || state.isThumbDragging(index)`. Hover/focus
are tracked via the thumb's `onHoverChange` / `onFocusChange`; dragging is read
from slider state. For `RangeSlider`, each of the two thumbs has its own tooltip
showing its own value.

### Visual design (token-driven)

- **Track:** thin rounded rail, neutral `colorPalette` token.
- **Fill:** primary color token.
- **Thumb:** circular; border/elevation token; focus ring token; grows/darkens
  on hover and while dragging.
- **Ticks:** small marks at each `tickStep`; optional labels.
- **Orientation:** `horizontal` is width-based, `vertical` is height-based;
  driven by a recipe variant, with thumb positioning flipped accordingly.
- **Sizes:** `sm` / `md` vary track thickness and thumb diameter via tokens.

## FormField & accessibility

A slider is a **labelable group** (not a single input), so it associates with
its label via `aria-labelledby` rather than `htmlFor`. It plugs into
`FormField.Root` the same way other Nimbus inputs do:

- Label, description, and error are **owned by FormField** and injected into the
  slider (FormField clones the control and passes `aria-labelledby` etc.).
- The slider renders **no visible label and no static value output** of its own
  — the current value lives in the thumb tooltip.
- The invalid state flows in from FormField context and is applied via
  `data-invalid`.

It is also usable standalone by passing an `aria-label` (or `aria-labelledby`)
for the accessible name — no visible label is rendered. All keyboard (arrows /
Home / End / PageUp / PageDown), pointer, touch, RTL, and ARIA behavior is
provided by React Aria.

## States

`default`, `hover`, `focus-visible`, `dragging`, `disabled`, `invalid`. All
token-driven and applied via `data-*` attributes, consistent with existing
components.

## File set (per Nimbus conventions)

Both components live in a **single directory**,
`packages/nimbus/src/components/slider/`, because they share the recipe and
slots. `RangeSlider` is exported from the same package barrel as `Slider` (no
separate `range-slider/` directory):

- `*.types.ts` — types for `Slider`, `RangeSlider`, `SliderBase`, and slots.
- `*.recipe.ts` — the `nimbusSlider` slot recipe (sizes, orientation variants).
- `*.slots.tsx` — slot components wrapping React Aria `Slider` primitives.
- `slider.tsx` / `range-slider.tsx` — the public wrappers.
- `slider-base.tsx` — the shared internal implementation.
- `*.stories.tsx` — Storybook stories with play functions.
- `*.i18n.ts` / `*.messages.ts` — any localized strings (e.g. thumb aria
  labels).
- `*.dev.mdx`, `*.docs.spec.tsx`, `*.guidelines.mdx`, `*.a11y.mdx`,
  `*.figma.tsx` — docs per the standard file set.
- `index.ts` — barrel exports.

## Testing

Storybook `.stories.tsx` play functions covering:

- Keyboard stepping (arrows, Home, End, PageUp/PageDown).
- Pointer / touch drag.
- Range thumbs cannot cross each other.
- Min/max clamping and `step` snapping.
- Disabled state.
- Vertical orientation.
- Value tooltip: appears on hover, on keyboard focus, and while dragging; shows
  the formatted value (including `formatOptions`); each range thumb shows its
  own value.
- Tick rendering when `showTicks` is set.
- FormField integration: label association, invalid state.

Plus the `.docs.spec.tsx` consumer examples.

## Out of scope / future follow-ups

- Min/max bound labels at track ends.
- More than two thumbs (React Aria supports N thumbs, but there is no current
  use case).
- Non-linear scales (logarithmic, etc.).
