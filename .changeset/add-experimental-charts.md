---
"@commercetools/nimbus": minor
---

`BarChart`, `LineChart` and `AreaChart` (Experimental): three new chart
components to show data. They are experimental in this first release and may
change in a later version.

- Install the peer dependencies `recharts` and `react-is` to use them:
  `pnpm add recharts react-is`.
- Pass the rows as `data`, the x axis field as `xAxisKey`, and the data keys to
  draw as `series`. Set a `label` and a color `palette` for each series in
  `config`. `aria-label` is required.
- Use `stacked` on `BarChart` and `AreaChart` to put the series on top of each
  other. Use `showGrid`, `showTooltip` and `showLegend` to show or hide parts of
  the chart, and `isLoading` for a loading state. An empty `data` array shows an
  empty state.
- Colors come from 23 chart palettes, adapted to have at least 3:1 contrast
  against the `bg` color in light and dark mode. Place charts on `bg`. Series
  without a `palette` get colors from a default order.
- The legend is always shown for two or more series. The tooltip is announced by
  screen readers, and the arrow keys move between data points.
