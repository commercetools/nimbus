---
"@commercetools/nimbus": minor
---

`CodeBlock`: new component for displaying read-only, syntax-highlighted source
code. Supports optional line numbers — including a `startLineNumber` offset so
you can show a contiguous excerpt of a file at its real source line numbers
(e.g. 42–46) — a language label, and a one-click copy-to-clipboard button. Token
colors automatically switch between light and dark mode via CSS custom
properties. Accessible as a named `region` landmark; the copy button announces
success via a live region. Size variants `sm` and `md` are available.
