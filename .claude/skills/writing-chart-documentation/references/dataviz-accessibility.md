# Data-visualization accessibility (the `## Accessibility` section)

This is the section that most differentiates a chart page from a UI-component
page, and the one freestyle docs most often skip. It has four parts, in this
order. Document only what the specific chart actually implements — verify every
claim against `{chart}.tsx`.

## 1. The alt-text to write (required)

Charts are **complex images** (W3C WAI): a short label is not enough. Give the
consumer a concrete `ariaLabel` to write, using **Amy Cesal's formula**:

> **`[Chart type] of [type of data], where [the point / what it shows].`**

Seed it from the frontmatter `title` + `description`. Example for BarChart:

```tsx
<BarChart
  ariaLabel="Bar chart of revenue by channel, where Web leads and Email trails"
  width={width}
  height={height}
  data={data}
/>
```

Tell the consumer: **always pass an `ariaLabel` that states what the chart shows
and its takeaway** — not just "bar chart". Do not describe individual data
points in the label; the data-table fallback (below) carries the values.

## 2. What nimbus-viz gives you automatically

State which of these the chart actually has (check the source — most flow
through `ChartContainer`, but hooks like `useReducedMotion`/`useForcedColors`
are per-chart):

- **Labeled graphic.** The SVG is `role="img"` with your `ariaLabel` (a sensible
  default is generated if you omit it).
- **Data-table fallback (WCAG 1.1.1).** `ChartContainer` renders a
  **visually-hidden `DataTable`** of the underlying values into the a11y tree,
  so a screen-reader user gets the numbers, not just the one-line label. This is
  automatic when the chart passes `table` to `ChartContainer` — most do; confirm
  in the source and name the columns it exposes.
- **CVD-safe, validated palette.** The chart theme palette passes the library's
  legibility checks (color-vision-deficiency ΔE, lightness band, chroma floor,
  contrast). Colors are not chosen ad hoc.
- **Non-color encoding.** Meaning is carried by position/length/shape, not color
  alone; where series rely on fills, the library provides pattern fills
  (`patterns.tsx`). Only claim patterns if the chart uses them.
- **Reduced motion / forced colors.** Only if the component calls
  `useReducedMotion` / `useForcedColors`. If it has no animation, say so rather
  than implying motion handling.

## 3. The consumer's responsibilities

- Pass a meaningful `ariaLabel` (part 1).
- Keep the chart inside a `ChartThemeProvider` (a validated palette; the chart
  throws without one).
- In surrounding copy, don't rely on color alone ("the green line") — name the
  series. Provide the data elsewhere too when the chart is the only source.

## 4. The checklist (required, end of the section)

Close the section with a compact WCAG + **Chartability (POUR+CAF)** checklist so
reviewers can self-audit. POUR+CAF = Perceivable, Operable, Understandable,
Robust, plus Compromising, Assistive, Flexible (Elavsky et al., EuroVis 2022).

```markdown
Accessibility checklist:

- [ ] `ariaLabel` states what the chart shows and its takeaway (Cesal formula)
- [ ] Underlying values are available as text (the built-in data-table fallback)
- [ ] Meaning does not depend on color alone (length/position/shape/patterns)
- [ ] Palette meets contrast + CVD checks (built-in theme; don't override to
      un-validated colors)
- [ ] Surrounding copy names series/values rather than colors
- [ ] Motion respected where present (`useReducedMotion`) — N/A if no animation
```

Reference links to include under `## Resources` (or inline): WCAG complex images
(<https://www.w3.org/WAI/tutorials/images/complex/>), Chartability
(<https://chartability.fizz.studio/>), Amy Cesal on alt text for data viz.

## Discipline

Never claim an accessibility feature the chart doesn't implement. An inaccurate
a11y section is worse than a short one — it tells consumers they're covered when
they aren't. When in doubt, read the component and the `ChartContainer` call.
