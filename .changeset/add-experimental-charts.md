---
"@commercetools/nimbus": minor
---

`BarChart`, `LineChart`, `AreaChart`, `PieChart`, `RadarChart` and `RadialChart`
(Experimental): six new chart components to show data, and a `Chart` namespace
to compose your own. They are experimental in this first release and may change
in a later version.

- `recharts` (`^3.10.1`) and `react-is` are now dependencies of
  `@commercetools/nimbus`. Your package manager installs them with Nimbus, so
  you do nothing extra, and you never import from them.
- `BarChart`, `LineChart` and `AreaChart`: pass the rows as `data`, the x axis
  field as `xAxisKey`, and the data keys to draw as `series`. Set a `label` and
  a color `palette` for each series in `config`. `aria-label` or
  `aria-labelledby` is required.
- `Chart` (Experimental): a set of parts for charts that the six components
  cannot draw, for example bars and a line in one chart. Use `Chart.Root`,
  `Chart.Plot`, `Chart.Grid`, `Chart.XAxis`, `Chart.Tooltip`, `Chart.Bar`,
  `Chart.Line` and `Chart.Area`. Colors, tooltip, legend and states are the same
  as in the six charts. You never import from `recharts`. `PieChart`,
  `RadarChart` and `RadialChart` cannot be composed.
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
- Colors come from 23 chart palettes. A series uses the solid color of its
  palette, in light and dark mode. Series and categories without a `palette` get
  colors from a default order.
- The legend is always shown for two or more series or categories. The tooltip
  is announced by screen readers, and the arrow keys move between data points.
