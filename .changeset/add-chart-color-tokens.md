---
"@commercetools/nimbus-tokens": minor
---

New chart color tokens `color.chart.<palette>` for 23 palettes (for example
`color.chart.ctviolet` and `color.chart.orange`). Each token has a light and a
dark value. The value is the solid color of the palette, changed only in
lightness where needed, so that it has at least 3:1 contrast against the `bg`
color of its color mode.

In CSS they are the variables `--color-chart-<palette>-light-default` and
`--color-chart-<palette>-dark-default`. Palettes with a black contrast color
(`amber`, `lime`, `mint`, `sky`, `yellow`, `ctyellow`, `ctteal`) have no chart
token. The new chart components in `@commercetools/nimbus` use these tokens.
