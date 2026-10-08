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
- Look and API close to `ProgressBar`, so the two feel like a family.

**Non-Goals:**

- Automatic thresholds / `low`-`high`-`optimum` color logic (consumer sets
  `colorPalette`; can be added later).
- Circular / radial gauges.
- Interactive segments (hover tooltips, click handlers).
- Indeterminate state (a meter always has a known value).

## Decisions

### D1: One flat-props component with a `segments` array

`<Meter value={…} />` or `<Meter segments={[…]} />`, typed as a discriminated
union so both cannot be set.

- Why: all values are in one place, so the component can compute the one correct
  `aria-valuetext` and render the legend itself. Same shape as `ProgressBar`.
- Alternative — compound `Meter.Root / Track / Segment / Legend` (Base UI
  shape): more layout freedom, but the root must collect values from children to
  build the summary, which is fragile. Rejected.
- Alternative — separate `MeterGroup`: clean split, but two components to learn
  and document. Rejected.

### D2: One meter, sum, generated summary

`aria-valuenow` = `minValue` + sum of clamped segment amounts. `aria-valuetext`
= `"<total> (<label>: <value>, <label>: <value>)"`, values formatted with
`useNumberFormatter(formatOptions)` from `react-aria`, list joined with
`Intl.ListFormat(locale, { type: "unit" })`. Each segment value is its drawn
(clamped) amount, so the parts always add up to the total. React Aria clamps
before formatting (`useProgressBar`), and Base UI changed its Meter to do the
same (https://github.com/mui/base-ui/pull/5409).

- Why not one role per segment (Primer, Mantine): in ARIA, the children of
  `meter` are presentational, so nested meters would be hidden from assistive
  technology.
- No i18n message file: all words come from the consumer (`label`, segment
  labels) or from `Intl`. The separator between total and list is parentheses,
  not a word. NVDA does not speak them and VoiceOver only pauses, but JAWS says
  "left paren" and "right paren" at its default punctuation level
  (https://www.deque.com/blog/dont-screen-readers-read-whats-screen-part-1-punctuation-typographic-symbols/,
  tested with 2014 versions). Revisit after the screen-reader test (task 5.8):
  the wrapper can move into an i18n message or become a separator that no screen
  reader speaks.
- The summary must go through React Aria's `valueLabel`: `useProgressBar` merges
  its own `aria-valuetext` last, so a consumer-level `aria-valuetext` is
  overwritten (`react-aria/dist/private/progress/useProgressBar.mjs`). The
  component therefore renders the visible value text itself. `valueLabel` is
  typed as `string` because it becomes an ARIA attribute.
- React Aria renders `role="meter progressbar"`
  (`react-aria/dist/private/meter/useMeter.mjs`, fallback for browsers without
  `meter`). axe's `aria-allowed-attr` rule reads the list as one invalid role,
  so the stories skip only `[role~="meter"]` for that rule.

### D3: Legend is always shown and `aria-hidden`

Primer's guidance asks for a legend that does not rely on color alone. It is
`aria-hidden="true"` because it repeats `aria-valuetext`; without that, screen
readers would read each segment twice.

### D4: One render path

A single `value` is turned into one internal segment
(`{ id: "value", value, colorPalette }`), so there is one drawing code path. The
legend is rendered only when `segments` is given.

### D5: Pure util for geometry

`getMeterSegments(segments, minValue, maxValue)` in
`utils/get-meter-segments.ts` (project convention for component utils) returns
`{ total, hasOverflow, hasNegative, items: [{ …segment, clampedValue, widthPercent }] }`.
It clamps negatives to 0, cuts at `maxValue`, and returns 0% when
`minValue === maxValue`. Dev warnings are logged in the component, not the util,
so the util stays pure and easy to unit test. The missing-name warning is React
Aria's own (`useLabel`), so the component does not add a second one.

### D6: Recipe

Slots:
`root, header, label, value, track, segment, legend, legendItem, legendSwatch`
(`header` holds label and value in the stacked and minimal layouts; in minimal
it is hidden but still names the meter via `aria-labelledby`). Layouts copy the
`ProgressBar` CSS variables (`--meter-height`, `--meter-radius`, …).

Sizing uses two independent axes. `size` (`sm` 4px, `md` 8px, `lg` 12px, all
spacing tokens, corner radius `radii.50` = 2px) sets only the bar; `textStyle`
(`xs`, `sm`, `md`, `inherit`) sets only the text, and spacing and legend
swatches are in `em` so they follow the text. Without `textStyle`, the text
follows `size` (`sm` → `xs`, `md` → `sm`, `lg` → `md`). Three bar sizes follow
the three uses named in other systems' guidance (GitLab Pajamas: dense layouts
such as a "table row or narrow sidebar widget", standard content, and the
"primary focal point"; Spectrum: "Use the small size … in tables or cards").
Other systems ship 2–4 bar sizes (Spectrum Meter 2, Carbon 2, Primer 3, Spectrum
2 4). A first prototype with 5 × 6 combinations was reduced to 3 × 4, because
adding values later is not breaking but removing them is. Segment fill:
`colorPalette.9` (the regular solid step, same as `ProgressBar`), flat, with a
width transition that is removed under `prefers-reduced-motion`. Step 11 was
used first to reach 3:1 against the track for every palette; it was changed to
step 9 so the fill uses the regular solid color, not the dark one. Measured
against the track, step 9 is below 3:1 for some palettes (for example `warning`
1.38:1 in light mode, `primary` 2.65:1 in dark mode), so meaning is carried by
the legend and value text, not by the fill color. The `minimal` layout hides the
value text, so the guidelines ask for the same value as visible text near the
meter. Segments may shrink
(`flex-shrink: 1`) so the gaps fit when the track is full. Track: same
background as the `ProgressBar` track. Gap between segments: `{spacing.50}`
(2px) using flex `gap`. Each segment sets `colorPalette` through a class or
`data-` attribute so the recipe can color it. Default segment sequence
(`constants/meter.constants.ts`): primary, teal, orange, pink, blue, brown,
repeated. Semantic state palettes are left out so a default segment does not
look like a status.

## Risks / Trade-offs

- [Legend `aria-hidden` may be the wrong choice for some screen readers] →
  Manual test with VoiceOver (macOS) and NVDA (Windows) before release; if
  `aria-valuetext` is read poorly, make the legend readable and drop segment
  detail from `aria-valuetext`.
- [JAWS may speak the parentheses in `aria-valuetext`] → Include JAWS in the
  screen-reader test if a Windows machine with JAWS is available.
- [React Aria renders `role="meter progressbar"`, so older assistive technology
  may announce a progress bar] → Part of the screen-reader test.
- [React Aria `<Meter>` DOM output is not verified from docs] → The first story
  test asserts `role`, `aria-valuemin/max/now/valuetext`.
- [Long `aria-valuetext` with many segments] → Document a recommended maximum
  (about 5 segments) in the guidelines.
- [Default color sequence could fail contrast in dark mode] → Verify all
  sequence colors in both themes as part of the recipe task.
- [The user has general reservations about the design] → Treat this as a first
  version; revise after review.

## Open Questions

1. Legend readable vs `aria-hidden` — to be settled by screen-reader testing.
2. Should automatic thresholds be added later, and with what API?
3. Exact default segment color sequence (needs designer input).
