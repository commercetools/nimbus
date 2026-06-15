---
"@commercetools/nimbus": patch
---

Fix server-side rendering (SSR) issues across several components so they render
correctly and hydrate without mismatches under React Server Components / Next.js
App Router:

- `RichTextInput` no longer crashes during SSR when given an HTML
  `value`/`defaultValue`. The HTML is parsed after mount, so it renders safely
  on the server and stays consistent during hydration.
- `InlineSvg` is now SSR-safe: the SVG is sanitized and parsed only on the
  client (after hydration), so the server and client render identical markup,
  and raw unsanitized SVG is no longer emitted in the server HTML.
- `DateInput`, `TimeInput`, `DatePicker`, and `DateRangePicker` no longer
  mismatch on literal separator segments (e.g. the space before AM/PM), whose
  whitespace can differ between the server and browser depending on their
  Intl/ICU version.
- `Tabs.Tab` no longer emits a React "An empty string was passed to the href
  attribute" warning when rendered without an `href`; link-related props are
  only forwarded when an `href` is provided.
- `useColorScheme` no longer crashes during SSR and returns the `"light"`
  default during both the server render and the initial hydration render, then
  resolves the real color scheme after mount.

Client-side behavior is unchanged.
