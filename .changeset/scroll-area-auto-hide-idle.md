---
"@commercetools/nimbus": minor
---

`ScrollArea`: the scrollbar now auto-hides when the user is idle. With the
default `hover` variant it appears when the pointer enters the area or when the
content scrolls, then fades out after a short idle delay; while the pointer
stays inside, only scrolling brings it back — so a resting reader is not
distracted by the bar. Wheel, touch, and keyboard scrolling keep working while
it is hidden. Use `variant="always"` to keep the scrollbar permanently visible.
