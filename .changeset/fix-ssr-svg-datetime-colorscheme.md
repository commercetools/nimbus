---
"@commercetools/nimbus": patch
---

Several components no longer cause React hydration mismatches during server-side
rendering:

- `InlineSvg` is now SSR-safe. The SVG is sanitized and parsed only on the
  client (after hydration), so the server and client render the same markup. As
  a side effect, raw unsanitized SVG is no longer emitted in the server HTML.
- `DateInput`, `TimeInput`, `DatePicker`, and `DateRangePicker` no longer
  mismatch on the literal separator segments (e.g. the space before AM/PM), which
  can differ between the server and browser depending on their Intl/ICU version.
- `useColorScheme` now returns the `"light"` default during both the server
  render and the initial hydration render, then resolves the real color scheme
  after mount.
