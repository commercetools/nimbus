---
"@commercetools/nimbus-viz": minor
---

`Heatmap`, `CohortTriangle`, `CalendarHeatmap`, and `RfmGrid` accept a new
`domain` prop to pin the color ramp to fixed `[min, max]` bounds.

The ramp's default bounds also changed: it now scales to the actual range of the
values passed in (lightest shade = lowest value, fullest shade = highest)
instead of always anchoring at zero. Charts whose values don't start near zero
will render with more visible shade variation than before; pass
`domain={[0, max]}` to restore the previous zero-anchored look.
