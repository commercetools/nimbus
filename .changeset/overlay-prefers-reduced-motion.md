---
"@commercetools/nimbus": patch
---

`Drawer`, `Dialog`, `DatePicker`, `DateRangePicker`: These overlays now respect
the operating system's "reduce motion" setting. Previously they always played
their slide, scale and fade animations on open and close, unlike the rest of the
library. Under `prefers-reduced-motion: reduce` they now appear and dismiss
instantly. Behavior is unchanged for everyone else.
