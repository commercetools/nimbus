---
"@commercetools/nimbus-viz": minor
---

Initial release of `@commercetools/nimbus-viz` — a data-visualization library
for Nimbus. Ships 47 React chart components spanning the
[FT Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary)
families: trend (line, area, streamgraph, sparkline, control, candlestick),
magnitude (bar, grouped bar, lollipop, radial bar, histogram, pareto),
part-to-whole (stacked bar, donut, treemap, sunburst, waffle, marimekko,
funnel), deviation (diverging bar, diverging stacked/Likert bar, population
pyramid), compare/delta (dumbbell, slope, waterfall, bullet), rank (bump),
relationship (scatter, bubble, connected scatter, radar, parallel coordinates),
distribution (box plot, violin, beeswarm, cumulative curve), matrix/retention
(heatmap, calendar heatmap, cohort triangle, RFM grid), flow (sankey, chord),
timeline (gantt), spatial (tile-grid map), single value (stat card, gauge), and
a data-table fallback. Each is themed from Nimbus design tokens with light and
dark palettes, ships a hover tooltip on every plot with inspectable marks, has
`role="img"` accessibility, and sizes via `ResponsiveContainer` (fluid or
aspect-ratio). Composable overlays (reference line, target marker, trend line,
threshold/confidence bands, error bars, benchmark series) layer annotations over
the axis-based charts.
