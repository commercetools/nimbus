# Meter component research survey

Research question: how do design systems and component libraries implement a
"Meter" (WAI-ARIA `meter` role — a gauge for a measured scalar value in a known
range, e.g. disk usage — NOT task progress), and in particular, how do they
handle MULTIPLE segments/parts in one bar (e.g. storage split into "Photos /
Apps / System")? This is input for designing a Nimbus (React Aria Components +
Chakra UI v3) Meter component.

Rule followed throughout: every claim has a source URL (or MCP doc page name)
next to it. Where a claim could not be confirmed from a fetched primary source,
it is marked **not verified**.

---

## Part A — Foundational web standards

### A1. WAI-ARIA APG Meter pattern

Source: https://www.w3.org/WAI/ARIA/apg/patterns/meter/

- Definition: a meter is "a graphical display of a numeric value that varies
  within a defined range." Examples given: battery percentage, fuel level. The
  pattern explicitly warns against unbounded quantities like world population,
  "since it does not have a meaningful maximum limit."
- Attributes described: `aria-valuenow` ("set to a decimal value between
  `aria-valuemin` and `aria-valuemax`"), `aria-valuemin` less than
  `aria-valuemax`, `aria-valuemax` greater than `aria-valuemin`,
  `aria-valuetext` (used because "Assistive technologies often present
  `aria-valuenow` as a percentage" and a bare percentage is often unhelpful —
  example given: `aria-valuetext="50% (6 hours) remaining"`). A name is
  required, "provided by aria-label" or, if a visible label exists, "referenced
  by aria-labelledby."
- Keyboard interaction: "Not applicable" — a meter is not focusable/interactive.
- Meter vs. progressbar: **"The meter role should not be used to indicate
  progress, such as loading or percent completion of a task. ... use the
  progressbar role instead."** This is the canonical line design systems use to
  justify a separate Meter vs. Progress component.
- Multiple values/segments: **not mentioned anywhere on the page** — the pattern
  only ever describes one current value in one min/max range.

### A2. ARIA specification, `role=meter`

Sources: https://www.w3.org/TR/wai-aria-1.2/#meter,
https://www.w3.org/TR/wai-aria-1.3/#meter,
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/meter_role

- `meter` is categorized under "Document Structure Roles," not Widget Roles
  (where `progressbar` lives); structural roles "are not usually interactive."
  `meter` requires an author-supplied name ("meter (name required)"). Whether
  `meter` formally inherits from the abstract `range` role could not be
  confirmed from the primary spec text directly (the fetch was truncated before
  the alphabetical "meter" entry) — **not verified from the primary spec
  pages**, even though this is commonly stated in secondary sources.
- MDN (secondary source, directly quoted): "Each element with role="meter" must
  also have one of the following: An aria-label attribute. [or] An
  aria-labelledby attribute..." Also: browsers "automatically apply a role of
  presentation to all descendant elements of any element with the meter role"
  because "the meter role does not support semantic children" — i.e. **no child
  roles are exposed to assistive tech inside a single meter**. This is a key
  spec-level constraint for the multi-segment question (see A4).
- ARIA 1.2 spec text (via search, quoted): "Authors SHOULD NOT use the meter
  role to indicate progress; the progressbar role exists to address that need,"
  and critically: **"Presently, there are no WAI-ARIA properties corresponding
  to the low, optimum, and high attributes supported on the `<meter>` element in
  [HTML]. The addition of these properties will be considered for ARIA version
  1.3."** Open tracking issue: https://github.com/w3c/aria/issues/1336
  ("Consider supporting HTML low, optimum, high attributes on meter role"). Not
  verified whether ARIA 1.3 ultimately added them.
- No statement anywhere found about multiple values in one meter.

### A3. HTML `<meter>` element

Sources: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter,
https://html.spec.whatwg.org/multipage/form-elements.html#the-meter-element

- WHATWG (quoted): "The min attribute specifies the lower bound of the range,
  and the max attribute specifies the upper bound. The value attribute specifies
  the value... The other three attributes can be used to segment the gauge's
  range into 'low', 'medium', and 'high' parts, and to indicate which part... is
  the 'optimum' part." `optimum` higher than `high` means "the higher the value,
  the better"; lower than `low` means "lower values are better"; in between
  means "neither high nor low values are good."
- Exact gauge-region algorithm (quoted): if `optimum` sits between `low` and
  `high`, that whole band is the "optimum region" and the low/high ends are
  "suboptimal." If `optimum` is below `low`, the min→low band is optimum,
  low→high is suboptimal, and high→max is "even less good" (reversed if
  `optimum` is above `high`). This drives which of three built-in colors
  (green/amber/red-ish, browser dependent) the native `<meter>` renders.
- Multiple values/segments: **confirmed not supported.** The element "represents
  a scalar measurement within a known range, or a fractional value" (singular),
  defines exactly one `value` attribute, and per MDN, `<meter>` must not be
  nested inside another `<meter>`. There is exactly one value/gauge per element.

### A4. Is there authoritative guidance for segmented/multi-value meters?

Searched for guidance from the ARIA Working Group, WHATWG, or named experts
(Adrian Roselli, Sarah Higley, Scott O'Hara, TPGi/Deque). Result:

- **Open, unanswered GitHub issue**
  https://github.com/w3c/aria-practices/issues/1791 (opened 2021, zero replies,
  closed without resolution): "What if I want to create a progress bar indicator
  with multiple values? Kind of like a video progress with watched and buffered
  regions. Is there any accessibility guideline[s] for this use case?" This is
  the closest thing to an authoritative signal, and it confirms a gap rather
  than filling it.
- The structural reason no single-element pattern exists: because
  `meter`/`progressbar` "does not support semantic children," any segments or
  per-segment labels nested inside one meter/progressbar are invisible to
  assistive technology (browsers force `role=presentation` on descendants) — per
  the MDN meter-role page cited in A2.
- Component libraries have their own ad hoc answers (Bootstrap 5.3's
  `.progress-stacked` wrapping multiple separate `role="progressbar"` elements;
  PrimeNG/PrimeVue's `MeterGroup`), and Radix has an open, unresolved feature
  request for multi-segment progress
  (https://github.com/radix-ui/primitives/issues/3740,
  https://github.com/radix-ui/primitives/discussions/3741) — but none of these
  are ARIA-WG/WHATWG/named-expert published guidance.

**Conclusion: not verified — no public accessibility guidance exists for
segmented/multi-value meters from any standards body or named accessibility
expert.** Every implementation below that supports multiple segments has
invented its own approach.

---

## Part B — React Aria Components & React Spectrum S2

Source (MCP `react-aria-docs`): page "Meter" (React Aria Components), page
"Meter" (Spectrum S2), page "ProgressBar" (S2), page "StatusLight" (S2).

### React Aria Components `<Meter>`

- Description: "A meter represents a quantity within a known range, or a
  fractional value."
- Props: `value` (`number`, default `0`), `minValue` (`number`, default `0`),
  `maxValue` (`number`, default `100`), `valueLabel` (`ReactNode`, "the content
  to display as the value's label (e.g. 1 of 4)"), `formatOptions`
  (`Intl.NumberFormatOptions`, default `{ style: 'percent' }`), `children` as a
  function of render props, plus standard
  aria-label/labelledby/describedby/details passthrough. No `label` prop on
  `<Meter>` itself — labelling is via `<Meter><Label />...</Meter>` in the
  anatomy example.
- Render props available in `children`: `percentage` (used for fill width and
  color thresholds) and `valueText` (the formatted value string) — both seen in
  the two code examples on the page.
- A separate `useMeter` hook page is listed but returned HTTP 404 when fetched
  via the MCP tool, so the exact DOM/ARIA output (role, aria-valuenow etc.)
  could not be directly confirmed from docs text — **not verified** from this
  source, though role=meter is the expected implementation given the component's
  stated purpose.
- **Single-value only, confirmed**: `value`/`minValue`/`maxValue` are plain
  numbers; no array type, no segment sub-component anywhere in the API table or
  examples.

### Spectrum S2 `<Meter>`

- Variants: `variant`: `"informative" | "negative" | "notice" | "positive"`,
  default `'informative'`.
- Sizes: `"S" | "M" | "L" | "XL"`, default `'M'`.
- `staticColor`: `"auto" | "black" | "white"` — for use over colored/photo
  backgrounds.
- `label`, `labelPosition` (default `'top'`), `valueLabel`, `formatOptions`
  (default `{ style: 'percent' }`) — same `value`/`minValue`/`maxValue` shape as
  React Aria Components.
- Checked adjacent S2 pages for any multi-segment gauge: "ProgressBar" is also
  single-`value`-only; "StatusLight" is a single colored dot with a label, not a
  bar. No page titled anything chart/gauge-like exists in the S2 page list.
  **Not verified — no multi-segment gauge exists in Spectrum S2.**

**Conclusion**: Neither React Aria's `<Meter>` nor Spectrum S2's `<Meter>` has
any built-in mechanism for multiple segments in one bar. A Nimbus multi-segment
Meter is new design work, not an extension of a documented React Aria/Spectrum
option.

---

## Part C — Headless/primitive component libraries

### Chakra UI v3 (`@chakra-ui/react`)

Sources: https://chakra-ui.com/docs/components/progress,
https://chakra-ui.com/docs/components/progress-circle,
https://chakra-ui.com/docs/components/concepts/overview,
https://chakra-ui.com/changelog/v2.3.7

- **No dedicated Meter.** The full 114-component index lists "Progress" and
  "Progress Circle," no "Meter."
- `Progress` anatomy: `Progress.Root > Progress.Track > Progress.Range`, plus
  `Progress.Label`, `Progress.ValueText`. Props on Root: `value` (number or
  `null` for indeterminate), `defaultValue` (50), `min`/`max` (0/100),
  `onValueChange`, `formatOptions`, `locale`, `translations`, `orientation`,
  `colorPalette`, `variant` (outline/subtle), `shape` (rounded/square), `size`,
  `striped`, `animated`. `ProgressCircle` mirrors this with
  `Circle`/`Track`/`Range`.
- A v2 changelog entry shows the old (pre-rewrite) `Progress` accepted a
  `role="meter"` override as a manual escape hatch — not a real Meter widget,
  and not verified whether this override still works on v3's rewritten compound
  Progress.
- **Multi-segment: no.** Exactly one `Progress.Range` inside one
  `Progress.Track`; `value` is a single number. No section/array prop.

### Ark UI (`@ark-ui/react`)

Sources: https://ark-ui.com/docs/components/progress-linear,
https://ark-ui.com/docs/components/progress-circular,
https://ark-ui.com/docs/components/toc

- **No dedicated Meter** in the component table of contents.
- `Progress` anatomy (Linear):
  `Progress.Root > Progress.Label, Progress.ValueText, Progress.Track > Progress.Range`.
  Circular variant mirrors with
  `Progress.Circle > Progress.CircleTrack, Progress.CircleRange`.
  `RootProvider` + `useProgress` hook exist for external control.
- **Multi-segment: not found in docs.** Every anatomy example shows exactly one
  Range/CircleRange per Track/Circle.

### Radix (Primitives / Themes)

Sources: https://www.radix-ui.com/primitives/docs/components/progress,
https://www.radix-ui.com/themes/docs/components/progress,
https://github.com/radix-ui/primitives/issues/3740

- **No Meter, only Progress.** Primitives: `Progress.Root`
  (`value: number | null`, `max` default 100, `getValueLabel`, exposes
  `data-state` complete/indeterminate/loading) + `Progress.Indicator`. Themes
  adds `size`, `variant`, `color`, `highContrast`, `radius`, `duration`.
- **Multi-segment: no, and explicitly unresolved upstream.** Open GitHub feature
  request "[Feature Request] Progress bar multiple segments" (issue #3740 /
  discussion #3741) — the Radix maintainers themselves treat this as
  unimplemented, not merely undocumented.

### MUI Base UI (base-ui.com)

Source: https://base-ui.com/react/components/meter

- **Dedicated Meter: yes** — explicitly distinguished from Progress in the docs
  (Meter = static measurement within a known range, e.g. disk usage, score,
  battery; Progress = a task moving toward completion). This is the clearest
  modern precedent of a headless library treating Meter and Progress as
  genuinely separate primitives.
- Full compound API: `Meter.Root` (renders `<div>`; props: `value: number`
  **required**, `aria-valuetext`,
  `getAriaValueText: (formattedValue, value) => string`, `locale`, `min` default
  0, `max` default 100, `format: Intl.NumberFormatOptions`), `Meter.Track`
  (holds the indicator), `Meter.Indicator` (the filled portion), `Meter.Value`
  (renders `<span>`, displays the value as text), `Meter.Label` (renders
  `<span>`, accessible label). All parts support `className`/`style`/`render`
  for composition/element-swap.
- **Multi-segment: no.** `value` on Root is a single required number; exactly
  one Track and one Indicator in the anatomy; no array/segment prop on any part.

### shadcn/ui

Sources: https://ui.shadcn.com/docs/components/radix/progress,
https://ui.shadcn.com/docs/components/base/progress,
https://github.com/shadcn-ui/ui/discussions/3464

- **No dedicated Meter.** Only `Progress` (built on Radix or Base UI depending
  on version), composed of `Progress`, `ProgressLabel`, `ProgressValue`,
  `ProgressTrack`, `ProgressIndicator` — single value.
- **Multi-segment: community workaround only, not official.** GitHub discussion
  #3464 ("Multi-value progress bar") shows hand-rolled code rendering one
  `Indicator` per segment inside one `Root`, absolutely positioned by cumulative
  width, invoked as
  `<Progress segments={[{value: 10}, {value: 50, color: "bg-green-500"}, ...]} />`
  — with noted bugs (mutates the input array in place; math for segments summing
  to under 100% untested). Third-party block libraries (ReUI, UIAble, Shadcn
  Studio, Shadcnblocks) sell pre-built "multi-segment"/stacked-progress variants
  on top of shadcn/Radix.

---

## Part D — Enterprise design systems

### GitHub Primer — `ProgressBar` (important: multi-segment)

Sources: https://primer.style/components/progress-bar/react/alpha/,
https://primer.style/product/components/progress-bar/accessibility/

- No dedicated Meter; only `ProgressBar`, which **does support multiple
  segments** via child `ProgressBar.Item` components.
- `ProgressBar` props: `animated`, `progress` (number, default 0), `barSize`
  (`small`/`large`/`default`), `inline`, `bg` (default `bg.successInverse`).
- `ProgressBar.Item` props: `aria-label`, `bg` (default `success.emphasis`),
  `progress` (string|number, default 0).
- Example:
  ```jsx
  <ProgressBar aria-valuenow={50}>
    <ProgressBar.Item
      progress={30}
      aria-label="30%"
      style={{ backgroundColor: "var(--bgColor-success-emphasis)" }}
    />
    <ProgressBar.Item
      progress={15}
      aria-label="15%"
      style={{ backgroundColor: "var(--bgColor-accent-emphasis)" }}
    />
    <ProgressBar.Item
      progress={5}
      aria-label="5%"
      style={{ backgroundColor: "var(--bgColor-danger-emphasis)" }}
    />
  </ProgressBar>
  ```
- **Accessibility model: one `role="progressbar"` on the outer bar, with
  `aria-valuenow` manually set to the SUM of the segments** (50 = 30+15+5). Each
  `ProgressBar.Item` carries only its own `aria-label` (e.g. "30%") — no
  evidence Items get their own role or aria-valuenow. Docs pair this with a
  visible legend (`Stack` with `role="presentation"`) and say: "Use colors that
  are easy to tell apart and include a legend that identifies what each segment
  represents," and caution against overusing segments on narrow bars.
- Accessibility page requires 3:1 contrast between adjacent segments ("This
  contrast requirement extends to multiple segments within ProgressBar"), "Do
  not rely on color alone to convey progress," legends must not rely solely on
  color. `aria-valuetext` is **not mentioned anywhere** — not verified as
  supported.

### IBM Carbon Design System

Sources:
https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components,
https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/ProgressBar/ProgressBar.tsx,
https://svelte.carbondesignsystem.com/components/Meter,
https://github.com/carbon-design-system/carbon-components-svelte/blob/master/src/Meter/Meter.svelte,
https://github.com/carbon-design-system/carbon-charts/issues/2072

- **No `Meter` in `@carbon/react`** (core React package) — confirmed by browsing
  the source folder list directly; alphabetically between MenuButton and Modal,
  there is no Meter folder.
- `ProgressBar` (core, single value): `label` (required), `value`, `max`
  (default 100), `status` (active/finished/error), `size` (small/big), `type`,
  `helperText`, `hideLabel`. Confirmed single numeric value only.
- A genuine **`Meter`** exists only in the community-maintained **Carbon
  Components Svelte** package (not core `@carbon/react`): props `value`, `max`
  (default 100), `labelText`, `hideLabel`, `helperText`, `valueText` (feeds
  `aria-valuetext`), `warningText`/`errorText`, `thresholds`
  (`{warning?, error?}`), `status` override, `showThresholds` (draws tick
  marks), `size`. **Single value only** — renders `role="meter"` with
  `aria-valuemin={0}`, `aria-valuemax={max}`, `aria-valuenow`, `aria-valuetext`,
  plus a visually-hidden `aria-live="polite"` region for status changes.
- Carbon Charts' `MeterChart` (a proportional-bar chart, separate from this
  Meter) is the only Carbon artifact with ranges/segments — and a GitHub issue
  documents that it fails WCAG 1.4.1 because it relies on color alone to
  distinguish ranges (issue #2072).

### Atlassian Design System

Sources: https://atlassian.design/components/progress-bar,
https://atlaskit.atlassian.com/examples/design-system/progress-bar/basic,
https://atlassian.design/components/progress-bar/success-progress-bar/

- No "Meter" component; separate **Progress bar**, **Progress indicator** (a
  stepper/tracker, different concept), and **Progress tracker**.
- Progress bar props: `value` (0–1 fraction, 1 = complete), `appearance`
  (`inverse`, `success`), `isIndeterminate`, `ariaLabel` (e.g. "Done: 3 of 10
  work items"). A "Success progress bar" page appears to be a status _variant_,
  not a second segment.
- **No multi-segment or Meter functionality found** anywhere in Atlassian's
  docs.

### Shopify Polaris — `ProgressBar`

Source:
https://github.com/Shopify/polaris/blob/main/polaris-react/src/components/ProgressBar/ProgressBar.tsx

- Single-value only, confirmed from source: `progress` (default 0), `size`
  (small/medium/large), `animated` (default true), `ariaLabelledBy`, `tone`
  (highlight/primary/success/critical, default highlight).
- Renders a **native `<progress>` element** with `aria-labelledby`, `value`,
  `max="100"` — relies on native semantics rather than an explicit ARIA role. No
  `aria-label` prop; accessible name only via `ariaLabelledBy`. **No
  multi-segment support.**

### Ant Design — `Progress`

Sources: https://ant.design/components/progress/,
https://github.com/ant-design/ant-design/blob/master/components/progress/Steps.tsx

- `success` prop (`{ percent: number, strokeColor: string }`): renders a second,
  differently-colored fill inside the same bar representing a "successful"
  sub-portion of the overall value (e.g. confirmed vs. pending transfer).
- `steps` prop (`number | { count, gap }`): divides the bar into discrete
  blocks; filled-step count computed as `customRounding(steps * (percent/100))`,
  `rounding` overridable. `strokeColor` may be an **array**, giving each step
  its own color, e.g. `strokeColor={[green[6], green[6], red[5]]}`. The
  rail/track is not rendered in steps mode.
- **No ARIA-specific documentation found** for either `success` or `steps` —
  segments appear to be visual-only, not verified to have distinguishing
  accessibility semantics.

### Mantine — `Progress` (important: multi-segment, per-section roles)

Sources: https://mantine.dev/core/progress/,
https://github.com/mantinedev/mantine/blob/master/packages/@mantine/core/src/components/Progress/Progress.tsx

- Compound API: `Progress.Root`, `Progress.Section`, `Progress.Label`.
  ```tsx
  <Progress.Root size="xl">
    <Progress.Section value={35} color="cyan">
      <Progress.Label>Documents</Progress.Label>
    </Progress.Section>
    <Progress.Section value={28} color="pink">
      <Progress.Label>Photos</Progress.Label>
    </Progress.Section>
  </Progress.Root>
  ```
  Each `Progress.Section` has its own `value` and `color`; tooltips are added by
  wrapping an individual Section in a `<Tooltip>`, not a built-in prop.
  `orientation="vertical"` and `autoContrast` supported on Root.
- **Accessibility model — the inverse of Primer's**: quoted from the docs,
  "Progress section has `role="progressbar"` attribute" and "Progress section
  has `aria-valuenow` attribute [with the] current value" — i.e. **each
  individual `Progress.Section` gets its own `role="progressbar"` and
  `aria-valuenow`**, not one summarizing role on the Root.
  `aria-valuemin`/`aria-valuemax` are "always set to 0 and 100" regardless of
  the actual data range. Docs instruct setting `aria-label` per section. In
  pre-compound Mantine versions (v1–v4), multiple sections were passed via an
  array prop instead, and `value` was ignored in that mode.

### Twilio Paste — `Meter` (dedicated, single-value)

Sources:
https://github.com/twilio-labs/paste/blob/main/packages/paste-website/src/pages/components/meter/index.mdx,
https://github.com/twilio-labs/paste/blob/main/packages/paste-core/components/meter/src/Meter.tsx

- **Dedicated `Meter`, distinct from any progress bar**, quoted: "A Meter is a
  visual representation to indicate how full something is." "Use Meter when you
  need to show capacity... A Progress Bar represents only task completion... If
  you're not displaying progress on a particular task, use Meter."
- API: `minValue`/`maxValue` (default 0/100), `minLabel`/`maxLabel`, `value`
  (default 0), `id` (required), `aria-label`/`aria-describedby`/
  `aria-labelledby`. A separate `MeterLabel` component takes `htmlFor` (must
  equal Meter's `id`) and `valueLabel` (displayed value text, e.g. "75%").
- **Accessibility**: the outer element gets `role="meter"` directly, with
  `aria-labelledby` resolved from an explicit prop or a generated
  `${id}${LABEL_SUFFIX}` fallback. `aria-valuenow`/min/max/text are delegated to
  React Spectrum's `useMeter` hook internally — exact strings not verified from
  Paste's own source.
- **Multi-segment: not supported.** `value` is a single number; no
  "stack"/"segment"/"array" anywhere in the docs; no `MultiMeter` or
  `StackedMeter` component exists. Also **no color/variant prop** at all — one
  visual style.

### Salesforce Lightning Design System

Sources:
https://developer.salesforce.com/docs/platform/lightning-component-reference/guide/lightning-progress-bar.html,
https://developer.salesforce.com/docs/platform/lightning-component-reference/guide/lightning-progress-indicator.html

- `lightning-progress-bar`: `aria-label`, `size` (x-small/small/medium/ large),
  `value` (percentage), `variant` (base = rectangular, circular = rounded ends).
  No min/max, no multi-segment, no "meter" naming or `role="meter"` used
  anywhere in the fetched docs.
- `lightning-progress-indicator` (Beta) is a **step-based wizard tracker**
  (`current-step`, `has-error`, `type` base/path, `variant` base/shade) —
  unrelated to a scalar meter.
- SLDS2 (zeroheight-hosted) docs could not be rendered (JS shell only) — **not
  verified** beyond the LWC docs above.

### Microsoft Fluent UI 2 / React

Sources: `@fluentui/react-progress` source on
https://github.com/microsoft/fluentui,
https://microsoft.github.io/fluentui-charting-contrib/docs/Charting-Concepts/GaugeChart

- `ProgressBar` type: `shape` (rounded default/square), `value` (undefined =
  indeterminate), `max` (default 1), `thickness` (medium default/large), `color`
  (brand default/success/warning/error). No `min`, no label prop, no
  multi-segment.
- A **multi-segment gauge exists, but in a separate charting package**:
  `GaugeChart` (`@fluentui/react-charting`), with a `GaugeChartVariant` of
  `SingleSegment` or `MultipleSegments` (default) — a needle over arc segments.
  Each segment gets its own `aria-label`, e.g.
  `"{segmentLegend}, {segmentStart} - {segmentEnd}"` (MultipleSegments) or
  `"{segmentLegend}, {segmentSize} out of {totalSizeOfSegments} or {segmentSizeInPercent}%"`
  (SingleSegment), with an `accessibilityData` prop for overrides; the whole
  chart is exposed as `role="img"` with
  `aria-label="Current value: {formattedChartValue}"`. This is a radial/needle
  chart, not a linear meter, and lives outside core `react-components`.

### Material Design 3

Sources: https://m3.material.io/components/progress-indicators/guidelines,
https://material-web.dev/components/progress/

- **No distinct "meter"/gauge widget exists.** The guidelines page never
  mentions "meter" or "gauge" — only Linear/Circular progress indicators,
  determinate or indeterminate.
- Framing is explicitly process-oriented, quoted: "Progress indicators
  communicate status of an ongoing process." "Use progress indicators to show
  the status of ongoing processes, like loading an app, submitting a form, or
  saving updates." Every stated use case is process/loading related, not
  arbitrary scalar values.
- **Guidance leans against multi-segment for groups**, quoted: "When multiple
  items are loading, use a single progress indicator to show progress for the
  group." "Don't show progress [for each item] in [a] group [unless they're
  activated independently]."
- Material Web implementation: `value` (default 0), `max` (default 1),
  `indeterminate`, `fourColor` (indeterminate-only color cycling), `buffer` (a
  secondary "buffered" level — not a colored value segment).

### SAP Fiori / UI5

Sources: https://sap.github.io/ui5-webcomponents (mirror
ui5.github.io/webcomponents/components/ProgressIndicator/)

- `ProgressIndicator`: `value` (percent), `displayValue` (text override),
  `hideValue`, `accessibleName`, `valueState` (semantic-color enum, confirmed
  values include Critical/Information/Negative; full enum truncated in fetch,
  **not verified** beyond that). **No min/max, no multi-segment prop** — single
  value only.
- SAP's Radial Micro Chart / Bullet Chart are gauge-adjacent but only
  search-snippet summaries were available, not fetched primary text — **not
  verified** in depth. One third-party SAP Community blog post describes the
  bullet chart as intended to replace dashboard gauges/meters — this is a
  third-party characterization, not an official Fiori guideline statement.

### GOV.UK Design System

Source: https://design-system.service.gov.uk/components/

- **Does not appear to exist.** The live components index lists all 37
  components by name; none is a progress bar, progress indicator, or meter.
  Closest are Task List, Pagination, Phase banner — none a value gauge. A
  related "Progress tracker" component exists on the separate **MOJ Design
  System** (design-patterns.service.justice.gov.uk), a different department's
  system, not GOV.UK core, and was not directly fetched — **not verified**.

### Elastic EUI

Sources: https://eui.elastic.co/docs/components/display/progress/,
https://github.com/elastic/eui/blob/main/packages/eui/src/components/progress/progress.tsx

- **No dedicated Meter.** Only `EuiProgress`: `size` (xs/s/m/l), `color` (EUI
  palette `vis0`–`vis9` or CSS color, default success), `position`
  (fixed/absolute/static), `label`, `valueText` (boolean or custom node).
  `value`/`max` are inherited from wrapping the native `<progress>` element;
  omitting them makes it indeterminate (no separate boolean prop).
- **Multi-segment: not supported.** Docs never use "stacked"/"segment"; the
  "Progress charts" example shows several separate `EuiProgress` bars side by
  side, not one bar divided into parts. A separate Elastic Charts library
  reportedly has Goal/Gauge chart types — **not verified** against a primary doc
  page.

### Zendesk Garden

Source: https://garden.zendesk.com/components/progress/,
https://garden.zendesk.com/components/

- **No dedicated Meter** (the initial research premise that Garden has one
  distinct from Progress could not be confirmed and is likely incorrect against
  the current site). `Progress` is listed under the "Loaders" group, explicitly
  framed as a loading indicator, quoted: "A Progress loader communicates
  progress downloading uploading content."
- API: `color` (semantic token, default `border.successEmphasis`), `size`
  (small/medium/large), `value` (0–100, default 0). No thresholds, no
  multi-segment/multi-value support documented.

### Braid (SEEK)

Source: https://seek-oss.github.io/braid-design-system/components/,
https://seek-oss.github.io/braid-design-system/components/Box/props/

- **No Progress, Meter, or ProgressBar component** in the full 58-entry
  component list. Closest are Loader (indeterminate spinner) and Stepper
  (multi-step flow) — neither a scalar meter.
- Only the low-level `Box` primitive offers an escape hatch: its `role` prop's
  typed options explicitly include `"progressbar"` (plus an open string fallback
  that would accept `"meter"` untyped), and its `component` prop's allowed
  values explicitly include both `"progress"` and `"meter"` raw HTML tags — i.e.
  a consumer must hand-build a meter from atomic styles; no compound API, no
  multi-segment mechanism.

### Gestalt (Pinterest)

Source: https://github.com/pinterest/gestalt/tree/master/packages/gestalt/src

- **No ProgressBar or Meter component** — confirmed directly against the source
  directory listing (no `ProgressBar.tsx` or `Meter.tsx`). Adjacent components:
  `Spinner` (indeterminate) and `Datapoint` (a single at-a-glance metric
  display, not a filled/segmented bar). No multi-segment support, since no such
  component exists.

### Orbit (Kiwi.com)

Source:
https://github.com/kiwicom/orbit/tree/master/packages/orbit-components/src,
https://raw.githubusercontent.com/kiwicom/orbit/master/packages/orbit-components/src/Loading/README.md

- The docs site itself could not be reached (DNS resolution failed in the
  research environment) — site-level claims are **not verified**. Source repo
  confirms only `Loading` and `Skeleton` folders exist; no `Progress`,
  `ProgressBar`, `Meter`, or `Gauge` folder. `Loading`'s props are
  boolean/indeterminate only (`loading`, `type`, `customSize`, etc.) — no
  `value`/`max`, so it cannot represent a scalar value at all, let alone
  segments.

### Workday Canvas Design System

Source: https://canvas.workday.com/ (blocked — HTTP 403),
https://github.com/Workday/canvas-kit

- **Not verified.** The docs site blocked automated fetches; a GitHub code
  search of `Workday/canvas-kit` for "progress" returned no matches (logged-out
  search, so cannot fully rule out a Labs/Preview component).
  Related-but-distinct components exist: Loading Dots, Skeleton, Status
  Indicator — none represents a scalar value in a range.

### Porsche Design System

Source: https://designsystem.porsche.com/ (not directly fetchable in this
research), https://github.com/porsche-design-system/porsche-design-system

- **Not verified.** No `p-progress` or meter-named component found via search.
  Closest related: `p-spinner` (indeterminate loading, docs state "loading
  progress cannot [be] determined") and `p-stepper-horizontal` (step-through
  progress, max 9 steps) — neither a scalar meter.

### Morningstar Design System

Source: https://designsystem.morningstar.com/components/component-status/,
https://designsystem.morningstar.com/components/loader/

- Component sidebar lists all current components; the only related entry is
  "Loader." Nothing named Meter, Progress, or Gauge appears. The Loader page's
  body did not load in plain-text fetch (client-rendered) — its API is **not
  verified**.

---

## Part D2 — Headless SolidJS & web-component systems

### Kobalte (SolidJS) — dedicated `Meter`

Source: https://kobalte.dev/docs/core/components/meter/

- Dedicated headless `Meter`, import
  `import { Meter } from "@kobalte/core/meter"`. Description: "Displays a
  numeric value that varies within a defined range," following the WAI-ARIA
  Meter pattern. Available "Since v0.13.8."
- Compound anatomy:
  `Meter > Meter.Label, Meter.ValueLabel, Meter.Track > Meter.Fill`.
- Props (Root only): `value: number`, `minValue: number` (default 0),
  `maxValue: number` (default 100),
  `getValueLabel: (params: {value, min, max}) => string` — without it, "the
  value label is read as a percentage of the max value."
- Exact data-attribute/ARIA names were not enumerated in the fetched content
  (the table was empty; the page only says the parts "share data-attributes" and
  that the component is "Exposed to assistive technology... via ARIA") — **not
  verified** beyond that.
- **Multi-segment: confirmed single-value only.** One value/min/max, one Fill
  inside one Track in every example, no array/segment API.

### Nordhealth (Nord Design System) — dedicated `nord-meter`

Sources: https://nordhealth.design/components/,
https://nordhealth.design/components/meter/,
https://nordhealth.design/components/progress-bar/

- Has **both** a dedicated `<nord-meter>` and a separate `<nord-progress-bar>`,
  listed under "Feedback & status." Meter is described as "A graphical display
  of a numeric value within a known range, such as disk usage, a battery level
  or a score" — and is tagged **New / Alpha / Light DOM**, i.e. a recent,
  not-yet-stable addition matching exactly this research's premise.
- `nord-meter` props: `value` (default 0, "Must be between min and max"), `min`
  (default 0), `max` (default 100; min/max are swapped if min > max), `label`
  (default `''`, "Shown above the meter and exposed to assistive technology"),
  `locale`.
- `nord-progress-bar` props (separate component): `value` (omitted =
  indeterminate), `max` (default 100), `label` (default `'Current progress'`,
  visually hidden but exposed to assistive tech). CSS custom properties:
  `--n-progress-size`, `--n-progress-border-radius`, `--n-progress-color`.
- **Multi-segment: not verified.** Neither prop table shows an array-of-segments
  prop or multiple Fill parts; no live rendered example was checked for an
  undocumented multi-color mode.

---

## Part E — Comparison table

| System                          | Dedicated Meter?                                     | Role used                               | Multi-segment support                   | Multi-segment mechanism                                                                                                    | Source                                        |
| ------------------------------- | ---------------------------------------------------- | --------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| WAI-ARIA APG / spec             | — (defines role)                                     | `meter` (single value)                  | Not addressed                           | n/a                                                                                                                        | w3.org/WAI/ARIA/apg/patterns/meter/           |
| HTML `<meter>`                  | —                                                    | native                                  | No                                      | n/a                                                                                                                        | html.spec.whatwg.org                          |
| React Aria Components           | Yes — `Meter`                                        | `meter` (assumed; not verified)         | No                                      | n/a                                                                                                                        | react-aria-docs MCP                           |
| Spectrum S2                     | Yes — `Meter`                                        | (same)                                  | No                                      | n/a                                                                                                                        | react-aria-docs MCP                           |
| Chakra UI v3                    | No (`Progress`/`ProgressCircle`)                     | `progressbar` (assumed)                 | No                                      | n/a                                                                                                                        | chakra-ui.com                                 |
| Ark UI                          | No (`Progress`)                                      | `progressbar` (assumed)                 | No                                      | n/a                                                                                                                        | ark-ui.com                                    |
| Radix                           | No (`Progress`)                                      | `progressbar` (assumed)                 | No — open feature request               | n/a                                                                                                                        | radix-ui.com, GH #3740                        |
| MUI Base UI                     | **Yes — `Meter`** (Root/Track/Indicator/Value/Label) | not stated in fetched text              | No                                      | n/a                                                                                                                        | base-ui.com                                   |
| shadcn/ui                       | No (`Progress`)                                      | inherited from Radix/Base               | Community-only                          | consumer-composed array of Indicators                                                                                      | GH discussion #3464                           |
| GitHub Primer                   | No (`ProgressBar`)                                   | one `progressbar`                       | **Yes**                                 | `ProgressBar.Item` children; one summed `aria-valuenow`, per-item `aria-label`, visible legend recommended                 | primer.style                                  |
| IBM Carbon (`@carbon/react`)    | No                                                   | `progressbar`-like (not stated)         | No                                      | n/a                                                                                                                        | github.com/carbon-design-system               |
| Carbon Components Svelte        | **Yes — `Meter`**                                    | `meter`                                 | No                                      | thresholds only (warning/error), not multi-value                                                                           | svelte.carbondesignsystem.com                 |
| Atlassian                       | No                                                   | not stated                              | No                                      | n/a                                                                                                                        | atlassian.design                              |
| Shopify Polaris                 | No (`ProgressBar`)                                   | native `<progress>`                     | No                                      | n/a                                                                                                                        | github.com/Shopify/polaris                    |
| Ant Design                      | No (`Progress`)                                      | not documented                          | **Yes (visual only)**                   | `success` sub-segment prop; `steps` + `strokeColor[]`                                                                      | ant.design                                    |
| Mantine                         | No (`Progress`)                                      | **each section**: `progressbar`         | **Yes**                                 | `Progress.Root`/`Progress.Section` compound; each Section its own `role=progressbar`+`aria-valuenow` (min/max fixed 0–100) | mantine.dev                                   |
| Twilio Paste                    | **Yes — `Meter`**                                    | `meter` (direct)                        | No                                      | n/a                                                                                                                        | github.com/twilio-labs/paste                  |
| Salesforce Lightning            | No (`lightning-progress-bar`)                        | not stated                              | No                                      | n/a                                                                                                                        | developer.salesforce.com                      |
| Fluent UI 2 core                | No (`ProgressBar`)                                   | not stated                              | No                                      | n/a                                                                                                                        | github.com/microsoft/fluentui                 |
| Fluent UI charting `GaugeChart` | separate radial chart                                | `img` (whole chart)                     | **Yes**                                 | Segments in a needle/arc gauge; each segment has its own `aria-label` text built into one summarizing `role="img"`         | microsoft.github.io/fluentui-charting-contrib |
| Material Design 3               | No                                                   | not applicable                          | No (guidance discourages per-item bars) | n/a                                                                                                                        | m3.material.io                                |
| SAP Fiori/UI5                   | No (`ProgressIndicator`)                             | not stated                              | No                                      | n/a                                                                                                                        | sap.github.io/ui5-webcomponents               |
| GOV.UK                          | Does not exist                                       | —                                       | —                                       | —                                                                                                                          | design-system.service.gov.uk                  |
| Elastic EUI                     | No (`EuiProgress`)                                   | native `<progress>`                     | No                                      | n/a                                                                                                                        | eui.elastic.co                                |
| Zendesk Garden                  | No (`Progress`, under Loaders)                       | not stated                              | No                                      | n/a                                                                                                                        | garden.zendesk.com                            |
| Braid (SEEK)                    | No component at all                                  | consumer-typed via `Box`                | No                                      | n/a                                                                                                                        | seek-oss.github.io                            |
| Gestalt (Pinterest)             | No component at all                                  | —                                       | —                                       | —                                                                                                                          | github.com/pinterest/gestalt                  |
| Orbit (Kiwi.com)                | No component at all                                  | —                                       | —                                       | —                                                                                                                          | github.com/kiwicom/orbit                      |
| Workday Canvas                  | Not verified                                         | —                                       | Not verified                            | —                                                                                                                          | canvas.workday.com (blocked)                  |
| Kobalte (SolidJS)               | **Yes — `Meter`**                                    | `meter` (assumed; not verified exactly) | No                                      | n/a                                                                                                                        | kobalte.dev                                   |
| Nordhealth                      | **Yes — `nord-meter`** (Alpha)                       | not stated                              | Not verified                            | —                                                                                                                          | nordhealth.design                             |
| Porsche Design System           | Not verified                                         | —                                       | Not verified                            | —                                                                                                                          | designsystem.porsche.com                      |
| Morningstar                     | Not verified (only "Loader" found)                   | —                                       | Not verified                            | —                                                                                                                          | designsystem.morningstar.com                  |

---

## Part F — Synthesis

### F1. Common patterns / consensus

1. **Meter vs. Progress is a real, recognized distinction, but most systems
   don't bother building both.** Only React Aria/Spectrum, MUI Base UI, Twilio
   Paste, Kobalte, Carbon Components Svelte, and Nordhealth ship a component
   actually named/typed as a Meter. Everyone else (Chakra, Ark, Radix, shadcn,
   Primer, Atlassian, Polaris, Fluent, SAP, EUI, Zendesk Garden) has only a
   Progress-shaped component, and several explicitly fold "static measurement"
   use cases into it informally. The dividing line stated everywhere it's
   discussed (APG, Base UI, Twilio Paste) is the same: Meter = static, ongoing
   measurement (disk usage, score); Progress = a task moving toward completion.
   Sources: APG (w3.org/WAI/ARIA/apg/patterns/meter/), Base UI
   (base-ui.com/react/ components/meter), Twilio Paste
   (github.com/twilio-labs/paste).

2. **Every single-value Meter/Progress API shares the same three scalar props**:
   `value`, `min(Value)`, `max(Value)`, near-universally defaulting to 0/100.
   This is true across React Aria, Spectrum S2, Chakra, Ark, Radix, Base UI,
   Twilio Paste, Kobalte, Nord, Carbon, Polaris, SAP, Fluent, EUI. No system
   deviates from this shape for the single-value case.

3. **No system, including the standards bodies, has a native multi-value API on
   the primitive `meter`/`progressbar` role itself.** HTML `<meter>` and ARIA
   `role=meter`/`role=progressbar` are single-value by design, and — per the
   open, unanswered w3c/aria-practices#1791 issue — there is no
   accessibility-community consensus pattern for a composite meter. Every
   multi-segment implementation found is a library-level invention layered on
   top of (or around) the single-value primitive.

4. **Where multi-segment support exists, exactly two accessibility strategies
   were found, and they are mutually exclusive**:
   - **(a) One role, summarized value.** GitHub Primer: a single
     `role="progressbar"` on the outer container, `aria-valuenow` set to the
     _sum_ of all segment values, each segment (`ProgressBar.Item`) given only a
     plain `aria-label` describing its own share, plus an explicit
     recommendation to add a **visible legend** and meet 3:1 contrast between
     adjacent segments. Source: primer.style/components/ progress-bar.
   - **(b) Multiple roles, one per segment.** Mantine: every `Progress.Section`
     gets its **own** `role="progressbar"` and `aria-valuenow`, with
     `aria-valuemin`/`aria-valuemax` hard-coded to 0/100 regardless of the real
     data range, and per-section `aria-label` set by the consumer. Source:
     mantine.dev/core/progress.
   - A third pattern exists one level removed, in a chart rather than a bar:
     Fluent UI's `GaugeChart` exposes the **whole gauge as one `role="img"`**
     with a single generated `aria-label`, and per-segment text is baked into
     that one label or into a customizable `accessibilityData` object — i.e.,
     segments are described in prose, not exposed as separate ARIA nodes at all.
     Source: microsoft.github.io/fluentui-charting-contrib.
   - Ant Design's `success`/`steps` segments, by contrast, appear to be **purely
     visual** — no ARIA documentation was found distinguishing them for
     assistive tech. Source: ant.design/components/progress.

5. **A visible legend is the one piece of advice repeated wherever multi-segment
   guidance exists at all** (Primer's docs explicitly call for it; Mantine's
   per-section `aria-label` instruction implicitly assumes a human-readable name
   per segment exists somewhere). No system proposes that color alone, or
   `aria-valuetext` alone, is sufficient to convey a composite breakdown.

6. **Compound / sub-component APIs (`X.Root` / `X.Track` / `X.Section` or
   `.Item`) are the dominant shape for anything richer than a bare `value`
   prop**, seen in Chakra, Ark, Base UI, Kobalte (single-value) and Primer,
   Mantine (multi-value). No system was found using a plain `segments={[...]}`
   array prop as its _official_, ARIA-considered API — the only array-prop
   precedent found is the shadcn community workaround, which is unofficial and
   has known bugs. Sources: mantine.dev, base-ui.com, primer.style,
   github.com/shadcn-ui/ui/discussions/3464.

7. **Several well-known, mature systems simply don't have this component at
   all** (Braid, Gestalt, Orbit, GOV.UK, and — not verified but likely — Workday
   Canvas, Porsche, Morningstar). This suggests the multi-segment scalar-meter
   use case is a genuine gap in the industry, not something Nimbus would be
   reinventing against a settled convention.

### F2. Recommended API directions for Nimbus

All three options assume a base single-value `Meter` matching the near-universal
`value`/`minValue`/`maxValue`/`valueLabel`/`formatOptions` shape (React Aria
Components' own shape, since Nimbus is built on React Aria — react-aria-docs MCP
page "Meter"), rendering `role="meter"` per the APG pattern
(w3.org/WAI/ARIA/apg/patterns/meter/). They differ only in how multi-segment is
added.

**Option 1 — Single `Meter` with a `segments` array prop**

```tsx
<Meter
  label="Storage"
  maxValue={100}
  segments={[
    { value: 40, label: "Photos", colorPalette: "blue" },
    { value: 25, label: "Apps", colorPalette: "purple" },
    { value: 10, label: "System", colorPalette: "gray" },
  ]}
/>
```

- Pros: simplest consumer-facing API; easy to derive the summed `aria-valuenow`
  and a generated `aria-valuetext` automatically (e.g. "75% used: Photos 40%,
  Apps 25%, System 10%") in one place, matching the "one role, summarized value"
  strategy Primer uses (primer.style/components/progress-bar) but going further
  by using `aria-valuetext` rather than only a legend, addressing the actual
  content of aria-practices#1791 head-on.
- Cons: least composable — consumers can't slot in custom per-segment content
  (tooltips, icons) without an escape hatch; doesn't match Nimbus's general
  compound-component convention elsewhere in the library (per
  docs/component-guidelines.md — not fetched in this research, but referenced by
  the project's own CLAUDE.md as the source of Nimbus patterns).

**Option 2 — Compound `Meter.Root` / `Meter.Track` / `Meter.Segment`**

```tsx
<Meter.Root label="Storage" maxValue={100}>
  <Meter.Track>
    <Meter.Segment value={40} label="Photos" colorPalette="blue" />
    <Meter.Segment value={25} label="Apps" colorPalette="purple" />
    <Meter.Segment value={10} label="System" colorPalette="gray" />
  </Meter.Track>
  <Meter.ValueText />
</Meter.Root>
```

- Pros: matches the shape MUI Base UI (base-ui.com/react/components/meter) and
  Chakra v3 itself (chakra-ui.com/docs/components/progress) already use for the
  _single-value_ case, so it's the most idiomatic fit for a Chakra-v3-based
  library; each `Meter.Segment` can carry a tooltip, custom render, or
  `render`/`asChild` prop the way Base UI's parts do; naturally extends to
  Mantine's "each segment gets its own `role=progressbar`" strategy
  (mantine.dev/core/progress) OR to Primer's "one summarizing role" strategy —
  the choice is an internal implementation detail, not baked into the public
  shape.
- Cons: more boilerplate for the common two-or-three-segment case; the
  single-value `Meter` and the multi-segment `Meter.Root`/`Segment` need careful
  API reconciliation so `<Meter value={40} />` and
  `<Meter.Root> <Meter.Segment value={40}/></Meter.Root>` don't feel like two
  unrelated components.

**Option 3 — Separate `MeterGroup` component (distinct from `Meter`)**

```tsx
<MeterGroup label="Storage" maxValue={100}>
  <MeterGroup.Item value={40} label="Photos" colorPalette="blue" />
  <MeterGroup.Item value={25} label="Apps" colorPalette="purple" />
  <MeterGroup.Item value={10} label="System" colorPalette="gray" />
</MeterGroup>
```

- Pros: keeps the plain `Meter` component maximally simple and spec-literal (one
  scalar `role=meter`, nothing else), avoiding any risk of the base component's
  API growing complicated just to accommodate the multi-value case; mirrors
  precedent from adjacent domains — PrimeNG/PrimeVue ship a distinct
  `MeterGroup` for exactly this (noted, but not primarily fetched, in the
  ARIA-guidance search — flagged as **not verified** in depth here since it
  wasn't a primary target of this survey), and Fluent UI's `GaugeChart` also
  lives in a wholly separate package/concept from its plain `ProgressBar`
  (microsoft.github.io/fluentui-charting-contrib).
- Cons: two component names for what a consumer may think of as "one thing with
  one or many segments"; documentation and discovery cost of explaining when to
  reach for `Meter` vs `MeterGroup`.

**Cross-cutting accessibility question for all three options**: which strategy
to use for the underlying ARIA — Primer's "one role, summed value, per-item
aria-label, visible legend" vs. Mantine's "one role per segment" — is
independent of which public API shape (1, 2, or 3) Nimbus picks, but must be
decided explicitly, because (per w3c/aria-practices#1791 and the "no semantic
children" constraint on `role=meter`/`role=progressbar` described in A2/A4)
there is no ratified standard to defer to.

### F3. Open questions

1. **Which ARIA strategy for the composite value — Primer's single summed
   `role=meter` + `aria-valuetext` describing all segments, or Mantine's one
   `role=progressbar`-equivalent per segment?** Not resolved by any standard
   (A4). This needs its own accessibility review/decision, likely with real
   screen-reader testing, before implementation — this research surfaced only
   what existing libraries chose, not evidence for which is better for users.
2. **Is `role="meter"` even valid to repeat on multiple sibling elements inside
   one widget**, the way Mantine repeats `role="progressbar"` per
   `Progress.Section`? The ARIA spec text this research could retrieve did not
   address multiple sibling meter/progressbar roles grouped together; this
   should be checked against a fuller reading of the ARIA 1.2/1.3 spec
   (truncated in this research, A2) before committing to option 2's "per-segment
   role" implementation.
3. **Should Nimbus's `Meter` support the HTML `low`/`high`/`optimum`
   three-region semantics** (A3) for the single-value case (useful for things
   like "storage getting full" thresholds), given ARIA itself has no equivalent
   properties yet (w3c/aria#1336) and Carbon Components Svelte's
   `thresholds`/`status` prop is the only comparable precedent found
   (svelte.carbondesignsystem.com/components/Meter)? This is separate from, and
   simpler than, the multi-segment question, but overlaps visually (both add
   "zones" of color to a bar) and should not be conflated with it in the API
   design.
4. **Legend**: should a legend be a built-in sub-component (e.g. `Meter.Legend`)
   or left entirely to the consumer? Primer recommends one but does not appear
   to ship a built-in legend sub-component as part of `ProgressBar` itself
   (primer.style/components/progress-bar) — not verified whether Primer has a
   dedicated legend part vs. just guidance text recommending consumers build
   one.
5. **Carbon's real Carbon Charts `MeterChart` reportedly fails WCAG 1.4.1** for
   relying on color alone to distinguish ranges
   (github.com/carbon-design-system/carbon-charts/issues/2072) — this is a
   concrete cautionary precedent Nimbus should actively avoid repeating, but the
   specific fix Carbon ultimately shipped (if any) was not researched here and
   should be checked before finalizing Nimbus's segment-distinguishing strategy
   (color + pattern? color + legend text? color + tooltip?).
6. **Workday Canvas, Porsche Design System, and Morningstar could not be
   verified** due to bot-blocking or lack of public docs; if these are
   considered important comparators, they would need a manual/authenticated
   check outside this research's tooling.
