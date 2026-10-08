---
"@commercetools/nimbus": minor
---

`Meter`: new component that shows a measured value within a known range, such as
storage used or a quota consumed. Use it instead of `ProgressBar` when the value
is not the progress of a task. `Meter.Root` takes `value` for one measurement,
or `segments` to show several parts of one total in one bar, plus
`formatOptions`, `valueLabel`, `size`, `layout` (`stacked` or `inline`) and
`colorPalette` (for example `positive`, `warning`, or `critical` to show a
state). With one value, `thresholds` changes the color when the value reaches a
threshold, for example `warning` from 80 and `critical` from 95. Render the
parts you need: `Meter.Label`, `Meter.Value`, `Meter.Track` and, with segments,
`Meter.Legend`. Each part accepts style props, so you can, for example, give
`Meter.Value` a larger `textStyle`.
