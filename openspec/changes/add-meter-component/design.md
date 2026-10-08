## Context

Nimbus has `ProgressBar` (React Aria `ProgressBar`, slots
`root / track / fill / label / value`, layouts `minimal / inline / stacked`,
sizes `2xs / md`, gradient fill with animation). There is no component for a
measured value.

A survey of 25+ design systems was done before this change. Key findings (each
with a source):

- APG separates the roles: "The meter role should not be used to indicate
  progress" (https://www.w3.org/WAI/ARIA/apg/patterns/meter/).
- `role="meter"` and HTML `<meter>` are single-value. ARIA has no equivalent of
  HTML `low` / `high` / `optimum` (https://github.com/w3c/aria/issues/1336).
- No standard covers multi-value meters. The W3C question about it has had no
  answer since 2021 (https://github.com/w3c/aria-practices/issues/1791).
- Systems with a real Meter use the same `value` / `min` / `max` API: React Aria
  Components, Spectrum S2
  (`variant: informative | positive | notice | negative`), MUI Base UI, Twilio
  Paste, Kobalte. Chakra UI v3, Ark UI and Radix have no Meter.
- Only two libraries support segments, and both give each segment its own role:
  - Primer `ProgressBar.Item`: each Item renders its own `role="progressbar"`
    and the container has no role
    (https://github.com/primer/react/blob/main/packages/react/src/ProgressBar/ProgressBar.tsx).
    Primer's guidance asks for a text alternative such as "Tasks: 80 done, 14 in
    progress, 6 open" and a legend that does not rely on color alone
    (https://primer.style/product/components/progress-bar/accessibility/).
  - Mantine `Progress.Section`: one `role="progressbar"` per section
    (https://mantine.dev/core/progress/).

## Goals / Non-Goals

**Goals:**

- Correct `meter` semantics for a single measured value.
- Several segments of one total in one bar, accessible as one summary.
- Look close to `ProgressBar` (same track, same layout names), so the two feel
  like a family.
- Consumers can choose which parts to show and style each part, without a new
  prop for every case.

**Non-Goals:**

- Circular / radial gauges.
- Interactive segments (hover tooltips, click handlers).
- Indeterminate state (a meter always has a known value).

## Decisions

### D1: Compound component, all data on `Meter.Root`

```tsx
<Meter.Root segments={[…]} layout="stacked">
  <Meter.Label>Storage</Meter.Label>
  <Meter.Value />
  <Meter.Track />
  <Meter.Legend />
</Meter.Root>
```

`Meter.Root` takes `value` or `segments` (a discriminated union, so both cannot
be set), `minValue`, `maxValue`, `formatOptions`, `valueLabel` and
`colorPalette`. The parts `Meter.Label`, `Meter.Value`, `Meter.Track` and
`Meter.Legend` hold no values. They read what they show from a context that
Root fills.

- Why data on Root: all values are in one place, so Root computes the one
  correct `aria-valuetext` (D2), no matter which parts are rendered.
- Why parts: consumers choose what to show by adding or leaving out a part, and
  style each part with style props (for example `textStyle` on `Meter.Value`
  only). A flat component needs a new prop for each of these cases.
- Segments stay an array on Root. There is no `Meter.Segment` part, because a
  value on a child would make Root collect values from children to build the
  summary, which is fragile.
- Alternative — one flat component (`<Meter label value segments layout />`):
  the first version of this change. It needed a `minimal` layout to hide text
  and a separate `textStyle` axis to size it, and consumers could not place a
  value or label of their own next to the bar without losing the link to the
  meter. Replaced.
- Alternative — separate `MeterGroup`: clean split, but two components to learn
  and document. Rejected.

### D2: One meter, sum, generated summary

`aria-valuenow` = sum of clamped segment amounts. With `segments`, `minValue` is
typed as `0`, so the parts always add up to the total; with a non-zero
`minValue` the shown total would include it and the parts would not add up.
`aria-valuetext` = `"<total> (<label>: <value>, <label>: <value>)"`, values
formatted with `useNumberFormatter(formatOptions)` from `react-aria`, list joined
with `Intl.ListFormat(locale, { type: "unit" })`. Each segment value is its drawn
(clamped) amount, so the text matches the bar. Each value is rounded on its own
(three parts of `33%` give `100%`). React Aria clamps before formatting
(`useProgressBar`), and Base UI changed its Meter to do the same
(https://github.com/mui/base-ui/pull/5409).

- Why not one role per segment (Primer, Mantine): in ARIA, the children of
  `meter` are presentational, so nested meters would be hidden from assistive
  technology.
- No i18n message file: all words come from the consumer (`label`, segment
  labels) or from `Intl`. The separator between total and list is parentheses,
  not a word. NVDA does not speak them and VoiceOver only pauses, but JAWS says
  "left paren" and "right paren" at its default punctuation level
  (https://www.deque.com/blog/dont-screen-readers-read-whats-screen-part-1-punctuation-typographic-symbols/,
  tested with 2014 versions). If this is reported as a problem, the wrapper can
  move into an i18n message or become a separator that no screen reader speaks.
- The summary must go through React Aria's `valueLabel`: `useProgressBar` merges
  its own `aria-valuetext` last, so a consumer-level `aria-valuetext` is
  overwritten (`react-aria/dist/private/progress/useProgressBar.mjs`). Root
  therefore builds the value text itself and `Meter.Value` shows it. `valueLabel` is
  typed as `string` because it becomes an ARIA attribute.
- React Aria renders `role="meter progressbar"`
  (`react-aria/dist/private/meter/useMeter.mjs`, fallback for browsers without
  `meter`). axe's `aria-allowed-attr` rule reads the list as one invalid role,
  so the stories skip only `[role~="meter"]` for that rule.

### D3: Legend is a part, `aria-hidden`, and expected with segments

Primer's guidance asks for a legend that does not rely on color alone.
`Meter.Legend` is `aria-hidden="true"` because it repeats `aria-valuetext`;
without that, screen readers would read each segment twice.

Because the legend is now a part, a consumer can leave it out. With `segments`
and no `Meter.Legend`, Root logs a development warning, so segments are not
told apart by color only. `Meter.Legend` registers itself with Root in a layout
effect, and Root checks the count in an effect (same pattern as
`Splitter.Pane`). `Meter.Legend` renders nothing for a single `value`.

### D4: One render path

A single `value` is turned into one internal segment
(`{ id: "value", value, colorPalette }`), so `Meter.Track` has one drawing code
path. `Meter.Legend` renders only when `segments` is given.

### D5: Pure util for geometry

`getMeterSegments(segments, minValue, maxValue)` in
`utils/get-meter-segments.ts` (project convention for component utils) returns
`{ total, hasOverflow, hasNegative, items: [{ …segment, clampedValue, widthPercent }] }`.
It clamps negatives to 0, cuts at `maxValue`, and returns 0% when
`minValue === maxValue`. Dev warnings are logged in `Meter.Root`, not the util,
so the util stays pure and easy to unit test. The missing-name warning is React
Aria's own (`useLabel`), and its text already names `aria-label` and
`aria-labelledby`, so Root does not add a second one.

### D6: Recipe

Slots:
`root, label, value, track, segment, legend, legendItem, legendSwatch`. The CSS
variables follow `ProgressBar` (`--meter-height`, `--meter-radius`, …).

Layout uses fixed grid areas, so the result does not depend on the order in
which the parts are written. `layout="stacked"` (default) uses the areas
`"label value" "track track" "legend legend"`; `layout="inline"` uses
`"label track value" "legend legend legend"`. The same pattern sets
`FormField`'s `direction` (`form-field.recipe.ts`). Spacing comes from margins
on the parts, not from grid `gap`, so a part that is left out leaves no empty
gap. A meter without `Meter.Label` and `Meter.Value` shows only the bar, so no
separate `minimal` layout is needed. Visual order and DOM order may differ,
which is safe here: the children of `meter` are presentational (D2) and the
legend is `aria-hidden`. Other content belongs outside `Meter.Root`, because
only the Meter parts have a grid area.

`size` (`sm` 4px, `md` 8px, `lg` 12px, all spacing tokens, corner radius
`radii.50` = 2px) sets the bar and a matching text style on Root (`sm` → `xs`,
`md` → `sm`, `lg` → `md`; same pattern as `date-input.recipe.ts`). Consumers
change the text with the `textStyle` style prop, on Root for all parts or on one
part. Spacing and legend swatches are in `em`, so they follow the text. Three
bar sizes follow
the three uses named in other systems' guidance (GitLab Pajamas: dense layouts
such as a "table row or narrow sidebar widget", standard content, and the
"primary focal point"; Spectrum: "Use the small size … in tables or cards").
Other systems ship 2–4 bar sizes (Spectrum Meter 2, Carbon 2, Primer 3, Spectrum
2 4). A first prototype with 5 bar sizes and 6 text styles was reduced to 3
bar sizes, because adding values later is not breaking but removing them is.
Segment fill:
`colorPalette.9` (the regular solid step, same as `ProgressBar`), flat, with a
width transition that is removed under `prefers-reduced-motion`. Step 11 was
used first to reach 3:1 against the track for every palette; it was changed to
step 9 so the fill uses the regular solid color, not the dark one. Measured
against the track, step 9 is below 3:1 for some palettes (for example `warning`
1.38:1 in light mode, `primary` 2.65:1 in dark mode), so meaning is carried by
the legend and value text, not by the fill color. Without `Meter.Value`, the
guidelines ask for the same value as visible text near the meter. Segments may
not shrink: each segment's width subtracts its share of the gaps (in proportion
to its width), so the fill ends exactly at the value. Track: same background as the `ProgressBar` track. Gap between segments:
`{spacing.50}` (2px) using flex `gap`. Each segment sets `colorPalette` through
a class or `data-` attribute so the recipe can color it. Default segment
sequence (`constants/meter.constants.ts`): primary, orange, teal, gold, pink,
brown, repeated. It was chosen by computing CIEDE2000 distances between the
step-9 colors, under normal vision and simulated protanopia, deuteranopia and
tritanopia (Machado et al. 2009), so the first colors are as far apart as
possible: the first four colors keep a worst-case distance of 12.8 (the earlier
order: 6.1). Step 9 is the same in light and dark mode for these palettes.
Semantic state palettes are left out so a default segment does not look like a
status, and so are palettes with the same step 9 (`blue` = `info`, `red` =
`critical`) and palettes below 2:1 against the light track (amber, yellow,
lime, mint, sky). Datawrapper advises against more than seven colors in one
chart (https://www.datawrapper.de/academy/what-to-consider-when-choosing-colors-for-data-visualization),
so the sequence has six.

### D7: Thresholds for a single value

`thresholds={[{ from: 80, colorPalette: "warning" }, { from: 95, colorPalette: "critical" }]}`
on `Meter.Root` changes the fill color when the value reaches a threshold. The
threshold with the highest `from` that the value reaches wins (value greater
than or equal to `from`, after clamping); below all thresholds, `colorPalette`
is used. The order in the array does not matter. The pure util
`getThresholdPalette` picks the palette.

- Only for a single `value`: the type does not allow `thresholds` together with
  `segments`, because segments have their own colors.
- Why not the HTML names `low` / `high` / `optimum`: they only describe three
  regions with fixed meanings, and ARIA has no equivalent
  (https://github.com/w3c/aria/issues/1336), so they would not reach assistive
  technology anyway. A list of thresholds lets the consumer choose any number
  of steps and any palette.
- The color is visual only. The value text carries the meaning, and the
  consumer can add the state to `valueLabel` (for example "92% – almost full").

## Risks / Trade-offs

- [Legend `aria-hidden` may be the wrong choice for some screen readers] → If
  `aria-valuetext` is reported to be read poorly, make the legend readable and
  drop segment detail from `aria-valuetext`.
- [JAWS may speak the parentheses in `aria-valuetext`] → See D2.
- [React Aria renders `role="meter progressbar"`, so older assistive technology
  may announce a progress bar] → Accepted: this is React Aria's fallback for
  browsers without `meter` support.
- [React Aria `<Meter>` DOM output is not verified from docs] → The first story
  test asserts `role`, `aria-valuemin/max/now/valuetext`.
- [A consumer leaves out `Meter.Legend` with segments, so segments differ by
  color only] → Root logs a development warning (D3).
- [Parts used outside `Meter.Root`] → The context hook throws an error that
  names `Meter.Root`.
- [Long `aria-valuetext` with many segments] → Document a recommended maximum
  (about 5 segments) in the guidelines.
- [Some sequence colors are below 3:1 against the track (orange 2.57 and teal
  2.69 in light mode, primary 2.63 in dark mode)] → Meaning is carried by the
  legend and value text (see the fill color note above).
- [The user has general reservations about the design] → Treat this as a first
  version; revise after review.

## Open Questions

1. Legend readable vs `aria-hidden` — revisit if screen-reader users report
   problems.
2. Should designers review the default segment color sequence? It was chosen
   by computed distance, not by visual review.
