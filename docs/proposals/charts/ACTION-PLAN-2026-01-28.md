# Charting Proposals: Required Amendments

> **Date**: 2026-01-28 **Status**: Action Items for Implementation Readiness
> **Scope**: Amendments to proposals 00-foundation.md through 06-funnel-chart.md

---

## Overview

Following technical review, this document provides **concrete, copy-paste-ready
amendments** for each proposal file. Changes are organized by priority and file.

### Change Summary

| Priority | Issue                          | Files Affected                 |
| -------- | ------------------------------ | ------------------------------ |
| Critical | Invalid ARIA structure         | All chart proposals (02-06)    |
| Critical | Tab key for internal nav       | 03-bar-chart.md                |
| High     | Color overflow (8+ categories) | 00-foundation.md               |
| High     | Motion preference support      | 00-foundation.md, all recipes  |
| High     | KPI i18n direction+sentiment   | 01-kpi-card.md                 |
| Document | Legend behavior rationale      | 00-foundation.md, 05-pie-chart |

### Not Changing (Intentional Design)

- **Legend interaction model**: Pie uses highlight, others use toggle. This is
  intentional—pie segments are parts of a whole and "hiding" breaks the mental
  model.
- **Data shape divergence**: Time-series (`index`+`categories`) vs categorical
  (`dataKey`+`nameKey`) are fundamentally different. Good API design.

---

## Critical Changes

### 1. Fix ARIA Structure Pattern

**Problem**: `role="img"` cannot contain semantic child roles like `listitem`.

**Affected Files**: 02-line-chart.md, 03-bar-chart.md, 04-area-chart.md,
05-pie-chart.md, 06-funnel-chart.md

#### 1.1 Update 00-foundation.md — Add Canonical ARIA Pattern

**Location**: After the `useChartA11y` hook section (around line 217)

**Add new section**:

````markdown
### ARIA Structure Pattern

All SVG-based charts MUST use the following accessible structure:

```tsx
// ✅ Correct: figure role allows semantic children
<div
  role="figure"
  aria-labelledby={labelId}
  aria-describedby={descriptionId}
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  {/* Hidden accessible description */}
  <VisuallyHidden id={labelId}>{chartTitle}</VisuallyHidden>
  <VisuallyHidden id={descriptionId}>{chartDescription}</VisuallyHidden>

  {/* SVG is presentational - semantics come from the wrapper */}
  <svg role="presentation" aria-hidden="true">
    {/* Visual elements have no ARIA roles */}
    {dataPoints.map((point) => (
      <circle key={point.id} /* no role */ />
    ))}
  </svg>

  {/* Screen reader data table (hidden visually) */}
  <VisuallyHidden>
    <table>
      <caption>{chartTitle}</caption>
      <thead>
        <tr>
          <th>{indexLabel}</th>
          {categories.map((cat) => (
            <th key={cat}>{config[cat].label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row[index]}>
            <td>{row[index]}</td>
            {categories.map((cat) => (
              <td key={cat}>{valueFormatter(row[cat])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </VisuallyHidden>
</div>

// ❌ Invalid: role="img" with semantic children
<div role="img" aria-label="...">
  <svg role="presentation">
    <element role="listitem" /> {/* ARIA violation! */}
  </svg>
</div>
```

**Rationale**:

- `role="figure"` is a grouping role that supports `aria-labelledby` and allows
  child content
- SVG elements are `aria-hidden` — all semantics come from the hidden data table
- Data table provides screen reader users with full data access in familiar
  format
- Focus management and keyboard nav operate on the figure container, not SVG
  elements
````

#### 1.2 Update Each Chart's Accessibility Section

**For 02-line-chart.md** (replace lines 228-236):

````markdown
### Accessibility Implementation

```tsx
<div
  ref={containerRef}
  role="figure"
  aria-labelledby={titleId}
  aria-describedby={descId}
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className={styles.container}
>
  <VisuallyHidden id={titleId}>{config.title || "Line chart"}</VisuallyHidden>
  <VisuallyHidden id={descId}>
    {generateDescription(data, categories, config)}
  </VisuallyHidden>

  <svg role="presentation" aria-hidden="true">
    {/* All visual chart elements */}
  </svg>

  {/* Hidden data table for screen readers */}
  <ChartDataTable
    data={data}
    index={index}
    categories={categories}
    config={config}
  />
</div>
```
````

````

**For 03-bar-chart.md** (replace lines 406-437):

```markdown
### Accessibility Implementation

```tsx
<div
  ref={containerRef}
  role="figure"
  aria-labelledby={titleId}
  aria-describedby={descId}
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className={styles.container}
>
  <VisuallyHidden id={titleId}>
    {config.title || "Bar chart"}
  </VisuallyHidden>
  <VisuallyHidden id={descId}>
    {generateBarDescription(data, categories, config, layout)}
  </VisuallyHidden>

  <svg role="presentation" aria-hidden="true">
    {/* Bars, axes, grid - no ARIA roles on SVG elements */}
  </svg>

  <ChartDataTable
    data={data}
    index={index}
    categories={categories}
    config={config}
    layout={layout}
  />
</div>
````

````

**For 04-area-chart.md** (replace lines 408-442):

```markdown
### Accessibility Implementation

```tsx
<div
  ref={containerRef}
  role="figure"
  aria-labelledby={titleId}
  aria-describedby={descId}
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className={styles.container}
>
  <VisuallyHidden id={titleId}>
    {config.title || "Area chart"}
  </VisuallyHidden>
  <VisuallyHidden id={descId}>
    {generateAreaDescription(data, categories, config, layout)}
  </VisuallyHidden>

  <svg role="presentation" aria-hidden="true">
    {/* Areas, gradients, axes - no ARIA roles */}
  </svg>

  <ChartDataTable
    data={data}
    index={index}
    categories={categories}
    config={config}
    showTotals={layout === "stacked" || layout === "percentStacked"}
  />
</div>
````

````

**For 05-pie-chart.md** (replace lines 340-366):

```markdown
### Accessibility Implementation

```tsx
<div
  ref={containerRef}
  role="figure"
  aria-labelledby={titleId}
  aria-describedby={descId}
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className={styles.container}
>
  <VisuallyHidden id={titleId}>
    {config.title || "Pie chart"}
  </VisuallyHidden>
  <VisuallyHidden id={descId}>
    {generatePieDescription(data, dataKey, nameKey, config)}
  </VisuallyHidden>

  <svg role="presentation" aria-hidden="true">
    {/* Pie segments - no ARIA roles */}
  </svg>

  {/* Pie uses simple list format, not table */}
  <VisuallyHidden as="ul">
    {data.map((item) => (
      <li key={item[nameKey]}>
        {item[nameKey]}: {valueFormatter(item[dataKey])},
        {percentageFormatter(item[dataKey] / total)} of total
      </li>
    ))}
  </VisuallyHidden>
</div>
````

````

**For 06-funnel-chart.md** (replace lines 370-396):

```markdown
### Accessibility Implementation

```tsx
<div
  ref={containerRef}
  role="figure"
  aria-labelledby={titleId}
  aria-describedby={descId}
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className={styles.container}
>
  <VisuallyHidden id={titleId}>
    {config.title || "Funnel chart"}
  </VisuallyHidden>
  <VisuallyHidden id={descId}>
    {generateFunnelDescription(data, dataKey, nameKey)}
  </VisuallyHidden>

  <svg role="presentation" aria-hidden="true">
    {/* Funnel stages - no ARIA roles */}
  </svg>

  <VisuallyHidden as="ol">
    {data.map((stage, i) => (
      <li key={stage[nameKey]}>
        {stage[nameKey]}: {valueFormatter(stage[dataKey])}
        {i > 0 && `, ${percentageFormatter(stage[dataKey] / data[i-1][dataKey])} conversion from previous`}
        {i > 0 && `, ${percentageFormatter(stage[dataKey] / data[0][dataKey])} overall conversion`}
      </li>
    ))}
  </VisuallyHidden>
</div>
````

````

---

### 2. Fix Bar Chart Tab Navigation

**File**: 03-bar-chart.md
**Location**: Lines 363-370 (keyboard navigation table)

**Replace the keyboard table with**:

```markdown
| Key       | Action                                              |
| --------- | --------------------------------------------------- |
| `←` / `→` | Move between bars (vertical orientation)            |
| `↑` / `↓` | Move between bars (horizontal orientation)          |
| `↑` / `↓` | Move between series within category (grouped, vertical) |
| `←` / `→` | Move between series within category (grouped, horizontal) |
| `Home`    | Jump to first bar                                   |
| `End`     | Jump to last bar                                    |
| `Escape`  | Clear focus, hide tooltip                           |

**Navigation order for grouped bars:**

- Primary axis (between categories): Arrow keys matching orientation
- Secondary axis (between series): Arrow keys perpendicular to orientation
- Example (vertical grouped): `←`/`→` moves between categories, `↑`/`↓` moves
  between series within a category
````

**Also update the navigation code block** (around line 380) to remove Tab
references:

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  const { key } = e;
  const isVertical = orientation === "vertical";

  switch (key) {
    case "ArrowLeft":
      isVertical ? moveToPrevCategory() : moveToPrevSeries();
      break;
    case "ArrowRight":
      isVertical ? moveToNextCategory() : moveToNextSeries();
      break;
    case "ArrowUp":
      isVertical ? moveToPrevSeries() : moveToPrevCategory();
      break;
    case "ArrowDown":
      isVertical ? moveToNextSeries() : moveToNextCategory();
      break;
    case "Home":
      moveToFirst();
      break;
    case "End":
      moveToLast();
      break;
    case "Escape":
      clearFocus();
      break;
  }
};
```

---

## High Priority Changes

### 3. Add Color Overflow Strategy

**File**: 00-foundation.md **Location**: After the color token table (around
line 40)

**Add new section**:

````markdown
### Color Overflow Behavior (8+ Categories)

When data exceeds 7 categories, colors cycle with a development warning:

```typescript
const getSeriesColor = (index: number, totalSeries: number): string => {
  const colorIndex = (index % 7) + 1; // 1-indexed tokens

  if (
    process.env.NODE_ENV === "development" &&
    totalSeries > 7 &&
    index === 7 // Warn once when first overflow occurs
  ) {
    console.warn(
      `[nimbus-charts] ${totalSeries} series exceeds recommended maximum of 7. ` +
        `Colors will cycle, which may reduce distinguishability. ` +
        `Consider: (1) aggregating smaller categories, (2) using custom colors via config, ` +
        `or (3) splitting into multiple charts.`
    );
  }

  return `chart.${colorIndex}`;
};
```

**Consumer override for custom colors**:

```tsx
<LineChart
  data={data}
  index="date"
  categories={["a", "b", "c", "d", "e", "f", "g", "h", "i"]}
  config={{
    // First 7 use defaults, override 8th and 9th
    h: { label: "Series H", color: "violet.9" },
    i: { label: "Series I", color: "lime.9" },
  }}
/>
```

Config colors take precedence over cycling defaults.
````

---

### 4. Add Motion Preference Support

**File**: 00-foundation.md **Location**: In the "Out of Scope" section, update
the Animations row and add a new section

**Update line ~150** (Out of Scope table):

```markdown
| Item               | Deferred To | Rationale                          |
| ------------------ | ----------- | ---------------------------------- |
| Complex animations | Phase 2     | Entrance/exit animations, morphing |
| ~~Animations~~     | ~~Phase 2~~ | ~~Polish, not core~~               |
```

**Add new section after the table**:

````markdown
### Motion Preferences (Phase 1 Requirement)

All transition properties in recipes MUST respect `prefers-reduced-motion`:

```typescript
// In each chart recipe, wrap transitions:
const transition = {
  base: "opacity 0.15s ease-out, transform 0.15s ease-out",
  reduced: "none",
};

// Recipe usage:
bar: {
  transition: "var(--nimbus-chart-transition)",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}
```

**Foundation provides a CSS custom property**:

```css
:root {
  --nimbus-chart-transition: opacity 0.15s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --nimbus-chart-transition: none;
  }
}
```

**All recipes must use this variable** instead of hardcoded transitions.
````

**Update each chart recipe** to use the CSS variable. Example for Bar Chart
(03-bar-chart.md line ~521):

```typescript
// Before
bar: {
  transition: "filter 0.15s ease-out, opacity 0.15s ease-out",
}

// After
bar: {
  transition: "var(--nimbus-chart-transition)",
}
```

Apply same change to:

- Line Chart: line ~268 (`markerHighlight`)
- Area Chart: line ~523 (`area`)
- Pie Chart: line ~401 (`segment`)
- Funnel Chart: line ~433 (`stage`)

---

### 5. Fix KPI Card i18n for Direction + Sentiment

**File**: 01-kpi-card.md **Location**: Lines 172-186 (i18n messages section)

**Replace with**:

```typescript
// kpi-card.i18n.ts
export const kpiCardMessages = defineMessages({
  // Direction announcements
  trendIncreased: {
    id: "nimbus-charts.kpi-card.trend-increased",
    defaultMessage: "increased by {value}",
  },
  trendDecreased: {
    id: "nimbus-charts.kpi-card.trend-decreased",
    defaultMessage: "decreased by {value}",
  },
  trendUnchanged: {
    id: "nimbus-charts.kpi-card.trend-unchanged",
    defaultMessage: "unchanged at {value}",
  },

  // Sentiment qualifiers (appended to direction)
  sentimentPositive: {
    id: "nimbus-charts.kpi-card.sentiment-positive",
    defaultMessage: ", which is positive",
  },
  sentimentNegative: {
    id: "nimbus-charts.kpi-card.sentiment-negative",
    defaultMessage: ", which is negative",
  },
  sentimentNeutral: {
    id: "nimbus-charts.kpi-card.sentiment-neutral",
    defaultMessage: "",
  },
});

// Usage in component:
// "increased by +12.5%, which is negative" (for bounce rate going up)
const announcement = useMemo(() => {
  const directionMsg =
    direction === "up"
      ? formatMessage(messages.trendIncreased, { value: children })
      : direction === "down"
        ? formatMessage(messages.trendDecreased, { value: children })
        : formatMessage(messages.trendUnchanged, { value: children });

  const sentimentMsg =
    sentiment === "positive"
      ? formatMessage(messages.sentimentPositive)
      : sentiment === "negative"
        ? formatMessage(messages.sentimentNegative)
        : "";

  return `${directionMsg}${sentimentMsg}`;
}, [direction, sentiment, children, formatMessage]);
```

This ensures screen reader users hear both the direction AND the semantic
meaning (is this change good or bad?).

---

## Documentation-Only Changes

### 6. Document Legend Interaction Rationale

**File**: 00-foundation.md **Location**: Add new section in "Key Decisions" or
create "Behavioral Patterns" section

**Add**:

```markdown
### Legend Interaction Patterns

Legend click behavior intentionally differs by chart type:

| Chart Type | Legend Click | Rationale                                    |
| ---------- | ------------ | -------------------------------------------- |
| Line       | Toggle       | Series are independent; hiding one is valid  |
| Bar        | Toggle       | Series are independent; hiding one is valid  |
| Area       | Toggle       | Series are independent; hiding one is valid  |
| Pie        | Highlight    | Segments are parts of whole; hiding breaks % |
| Funnel     | N/A          | No legend (sequential stages)                |

**Why Pie uses Highlight instead of Toggle**:

Pie charts represent parts of a whole (100%). "Hiding" a segment creates
ambiguity:

- Does the pie now show 100% of remaining data? (misleading—totals changed)
- Does it show a gap? (visually confusing)
- Do percentages recalculate? (unexpected data transformation)

Highlighting (dimming others) preserves the whole-to-part relationship while
allowing focus on a specific segment. This matches user expectations from tools
like Google Analytics and Tableau.

If consumers need toggle behavior for categorical data, they should use a Bar or
Area chart instead.
```

**File**: 05-pie-chart.md **Location**: In the Legend section or Key Decisions

**Add cross-reference**:

```markdown
> **Note**: Pie chart legend uses highlight mode (dims other segments) rather
> than toggle (hide/show). See Foundation § Legend Interaction Patterns for
> rationale.
```

---

## Validation Checklist

After applying all changes, verify:

- [ ] **ARIA**: No `role="img"` with semantic children in any proposal
- [ ] **Keyboard**: No Tab key for intra-component navigation
- [ ] **Colors**: Overflow behavior documented in Foundation
- [ ] **Motion**: CSS variable approach documented, recipe examples updated
- [ ] **KPI i18n**: Direction + sentiment messages separated
- [ ] **Legend**: Rationale documented in Foundation, cross-referenced in Pie

---

## Files Modified Summary

| File               | Sections Changed                             |
| ------------------ | -------------------------------------------- |
| 00-foundation.md   | ARIA pattern, color overflow, motion, legend |
| 01-kpi-card.md     | i18n messages                                |
| 02-line-chart.md   | Accessibility Implementation                 |
| 03-bar-chart.md    | Keyboard nav table, Accessibility, recipe    |
| 04-area-chart.md   | Accessibility Implementation, recipe         |
| 05-pie-chart.md    | Accessibility Implementation, legend note    |
| 06-funnel-chart.md | Accessibility Implementation, recipe         |
