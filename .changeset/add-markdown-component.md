---
"@commercetools/nimbus": minor
---

`Markdown`: new component that renders a Markdown string into Nimbus-styled,
accessible React elements — built for AI chat/assistant output as well as
authored content. GitHub Flavored Markdown (tables, task lists, strikethrough,
autolinks) is on by default.

- **Per-element overrides:** pass `components={{ a: MyLink }}` to replace any
  element's renderer; all other defaults stay intact.
- **Custom renderers:** supply `remarkPlugins` / `rehypePlugins` that emit
  non-standard nodes and map them through the same `components` prop.
- **Safe by default:** `trust="untrusted"` (the default) skips raw HTML,
  restricts rendering to a safe element allowlist, and neutralizes dangerous
  URLs. Opt into sanitized raw HTML for authored content with `trust="trusted"`
  - `allowRawHtml`.
- **Streaming:** set `isStreaming` to render live LLM output — half-written
  bold/italic/code/links are completed on the fly (no flash of literal `**` or
  `[`), and the component manages an accessible busy state with a single
  completion announcement.
- **Accessible:** semantic headings with a `headingOffset` to preserve the page
  outline, `th[scope]` tables, read-only task-list checkboxes, and external
  links with `rel="noopener noreferrer"` plus an "opens in new tab" indicator.
- Style props forward to the outer container, so you control width, spacing, and
  clamping with the usual props.
