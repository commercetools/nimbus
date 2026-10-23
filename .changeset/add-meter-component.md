---
"@commercetools/nimbus": minor
---

`Meter` (Beta): new component that shows a measured value within a known range,
such as storage used or a quota consumed. Use it instead of `ProgressBar` when
the value is not the progress of a task. `Meter.Root` takes `value` for one
measurement, or `segments` to show several parts of one total in one bar, plus
`formatOptions`, `valueLabel`, `size` and `layout` (`stacked` or `inline`). With
one value, `colorPalette` sets the fill color (for example `positive`,
`warning`, or `critical` to show a state), and `thresholds` changes the color
when the value reaches a threshold, for example `warning` from 80 and `critical`
from 95. Each segment sets its own `colorPalette`. Render the parts you need:
`Meter.Label`, `Meter.Value`, `Meter.Track` and, with segments, `Meter.Legend`.
Each part accepts style props, so you can, for example, give `Meter.Value` a
larger `textStyle`. To show rich content, such as a number in bold, pass
children to `Meter.Value` and set `valueLabel` to the same words for screen
readers.
