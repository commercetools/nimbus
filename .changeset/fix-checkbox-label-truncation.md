---
"@commercetools/nimbus": patch
---

`Checkbox`: long labels now shrink to fit a narrow container instead of
overflowing it. A label that uses `truncate` (or `text-overflow: ellipsis`) is
now clipped with an ellipsis, and plain text wraps onto more lines. Labels in
wide containers look the same as before.
