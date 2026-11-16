---
"@commercetools/nimbus": minor
---

`Meter` (Beta): new component that shows a measured value within a known range,
such as storage used or a quota consumed. Use it instead of `ProgressBar` when
the value is not the progress of a task.

- Show one measurement with `value`, or several parts of one total with
  `segments`.
- Set `colorPalette` and `thresholds` to change the fill color as the value
  grows, for example `warning` from 80 and `critical` from 95.
- Compose `Meter.Label`, `Meter.Value`, `Meter.Track` and `Meter.Legend`. Pass
  children to `Meter.Value` for rich content.
