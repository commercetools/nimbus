---
"@commercetools/nimbus": minor
---

`RadioInput`: add a `size` prop with the values `sm` and `md`. The option label
no longer takes its font size from the surrounding element.

- `md` (default): 16px label text and a 20px indicator.
- `sm`: 14px label text and a 16px indicator.

The gap between options is smaller: stacked options are 8px (`sm`) or 12px
(`md`) apart, down from 16px. Options in a row are 16px apart, down from 24px.
