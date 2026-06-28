---
"@commercetools/nimbus": minor
---

`Markdown`: new component that renders a Markdown string into Nimbus-styled,
accessible React elements — built for AI chat/assistant output as well as
authored content. See the
[docs](https://nimbus-documentation.vercel.app/components/content/markdown).

- GitHub Flavored Markdown (tables, task lists, strikethrough, autolinks,
  footnotes) and GitHub alerts (`[!NOTE]`, `[!TIP]`, …) on by default.
- Override any element's renderer via `components`, or register custom component
  tags to embed your own components in the source.
- `isStreaming` renders live LLM output, completing half-written markdown on the
  fly and managing an accessible busy/complete state.
- Safe by default: raw HTML is never rendered, rendering is restricted to a safe
  element allowlist, and dangerous URLs are neutralized.
- Style props forward to the outer container for width, spacing, and clamping.
