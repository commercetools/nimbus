---
"@commercetools/nimbus": minor
---

`Markdown`: new component that renders a Markdown string into Nimbus-styled,
accessible React elements — built for AI chat/assistant output as well as
authored content. GitHub Flavored Markdown (tables, task lists, strikethrough,
autolinks, footnotes) is on by default.

- **Per-element overrides:** pass `components={{ a: MyLink }}` to replace any
  element's renderer; all other defaults stay intact.
- **Custom component tags:** register a non-standard key
  (`components={{ SearchQueryResultCard: Card }}`) and embed that tag in the
  source — `<SearchQueryResultCard id="foo" />` (self-closing) or
  `<SearchQueryResultCard>…</SearchQueryResultCard>` (with markdown children).
  The tag's string attributes arrive as props and any casing is preserved. Safe
  by default: only registered tags render; unregistered tags stay inert.
- **GitHub alerts:** blockquotes starting with `[!NOTE]`, `[!TIP]`,
  `[!IMPORTANT]`, `[!WARNING]`, or `[!CAUTION]` render as accessible, localized
  callouts with a color palette and icon.
- **Safe by default:** raw HTML is never rendered as live markup, rendering is
  restricted to a safe element allowlist, and dangerous URLs are neutralized.
  Embed your own components via custom component tags rather than raw HTML.
- **Streaming:** set `isStreaming` to render live LLM output — half-written
  bold/italic/code/links are completed on the fly (no flash of literal `**` or
  `[`), and the component manages an accessible busy state with a single
  completion announcement.
- **Accessible:** semantic headings with a `headingOffset` to preserve the page
  outline, `th[scope]` tables, read-only task-list checkboxes, and external
  links with `rel="noopener noreferrer"` plus an "opens in new tab" indicator.
- Style props forward to the outer container, so you control width, spacing, and
  clamping with the usual props.
