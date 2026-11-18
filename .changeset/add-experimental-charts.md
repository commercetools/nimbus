---
"@commercetools/nimbus": minor
---

`BarChart`, `LineChart`, `AreaChart`, `PieChart`, `RadarChart` and `RadialChart`
(Experimental): six new chart components to show data. They are experimental in
this first release and may change in a later version.

- `recharts` (`^3.10.1`) is now a peer dependency of `@commercetools/nimbus`.
  Install it, together with its own peer dependency `react-is`, to use the
  charts: `pnpm add recharts react-is`. Your package manager warns when
  `recharts` is missing, also if you do not use the charts.
- `BarChart`, `LineChart` and `AreaChart`: pass the rows as `data`, the x axis
  field as `xAxisKey`, and the data keys to draw as `series`. Set a `label` and
  a color `palette` for each series in `config`. `aria-label` is required.
- `RadarChart` also takes `xAxisKey` (the field that names each spoke) and
  `series` (the polygons to draw). Use `showGrid` to show or hide the polar
  grid.
- `PieChart` and `RadialChart` take `nameKey` (the field that holds the category
  name) and `valueKey` (the field that holds the value). `config` is keyed by
  the category name, and a category that is missing in `config` is not drawn.
- Use `stacked` on `BarChart` and `AreaChart` to put the series on top of each
  other. Use `showGrid`, `showTooltip` and `showLegend` to show or hide parts of
  the chart, and `isLoading` for a loading state. An empty `data` array shows an
  empty state. Its text ("No data to display") is sent for translation and is
  shown in English until the translations are added.
- `isAnimationActive` turns the draw animation on or off. Without it, charts
  draw without animation when the user prefers reduced motion.
- Colors come from 23 chart palettes, adapted to have at least 3:1 contrast
  against the `bg` color in light and dark mode. Place charts on `bg`. Series
  and categories without a `palette` get colors from a default order.
- The legend is always shown for two or more series or categories. The tooltip
  is announced by screen readers, and the arrow keys move between data points.
