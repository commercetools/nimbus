## Why

Nimbus has no component to show a measured value within a known range (storage
used, quota consumed, a rate limit, a score). Teams use `ProgressBar` for this,
but the WAI-ARIA Authoring Practices say "The meter role should not be used to
indicate progress" (https://www.w3.org/WAI/ARIA/apg/patterns/meter/), so the
progress semantics are wrong for screen reader users. Teams also need to show
several measurements that share one total (for example "Images 30 GB + Videos 20
GB of 100 GB"), which no Nimbus component supports today.

## What Changes

- Add a new compound `Meter` component, built on React Aria Components `<Meter>`
  (`role="meter"`): `Meter.Root` holds all data, and the parts `Meter.Label`,
  `Meter.Value`, `Meter.Track` and `Meter.Legend` show it. Consumers choose
  which parts to render and style each part.
- `Meter.Root` props: `value` / `minValue` / `maxValue`, `formatOptions`,
  `valueLabel`, `size` (`sm` | `md` | `lg`), `layout` (`stacked` | `inline`),
  `colorPalette`. Visual shape matches `ProgressBar`, but uses a flat fill (no
  gradient, no animation).
- Multi-segment mode: a `segments` array (`{ id, label, value, colorPalette? }`)
  on `Meter.Root` draws several parts inside one track, with a visible legend
  from `Meter.Legend`. One `role="meter"` whose `aria-valuenow` is the sum of
  the segments and whose `aria-valuetext` is a generated, locale-formatted
  summary of all segments.
- Semantic color (for example `positive` / `warning` / `critical`) is set by the
  consumer through `colorPalette`, or changes with the value through
  `thresholds` (single value only).
- Register the `nimbusMeter` slot recipe and export `Meter` from
  `@commercetools/nimbus`.
- No breaking changes. `ProgressBar` is not changed.

## Capabilities

### New Capabilities

- `nimbus-meter`: Accessible linear meter that shows one measured value, or
  several segments of one total, within a known range, with legend, value
  formatting, sizes, layouts and consumer-controlled color.

### Modified Capabilities

(none)

## Impact

- New directory `packages/nimbus/src/components/meter/` (component, types,
  recipe, slots, utils, stories, docs, docs spec).
- `packages/nimbus/src/theme/slot-recipes/index.ts` — new recipe registration;
  theme typings regenerated.
- `packages/nimbus/src/components/index.ts` — new export.
- No new dependencies (`react-aria-components` `Meter` and `react-aria`
  `useNumberFormatter` are already available). No i18n message file: all visible
  words come from the consumer or from `Intl`.
- Research that informed this proposal (survey of 25+ design systems) is
  summarized in `design.md`.
