---
"@commercetools/nimbus": minor
---

`Meter`: new component that shows a measured value within a known range, such as
storage used or a quota consumed. Use it instead of `ProgressBar` when the value
is not the progress of a task. Pass `value` for one measurement, or `segments`
to show several parts of one total in one bar with an automatic legend. Supports
`formatOptions`, `valueLabel`, `size`, `layout`, and `colorPalette` (for example
`positive`, `warning`, or `critical` to show a state).
