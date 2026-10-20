---
"@commercetools/nimbus": minor
---

`DataTable`: two rows with the same `id` now throw an error outside production
builds, instead of logging a warning. The error names the duplicated `id`. This
also applies when your tests run, so give every row a unique `id` in test data
too. Production builds are not affected. An empty or missing row `id` still logs
a development warning.

Update React Aria packages: `react-aria` 3.52.1 → 3.53.1,
`react-aria-components` 1.21.1 → 1.22.1 and `react-stately` 3.50.0 → 3.51.0.
