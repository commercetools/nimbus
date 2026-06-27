---
"@commercetools/nimbus": minor
---

**Tabs & TabNav**: unified variants and a sliding active indicator.

- Both components now expose the **same three variants**: `underline` (default),
  `rounded` (soft rounded-rect highlight), and `pill` (capsule highlight). The
  `rounded`/`pill` highlights are themeable via `colorPalette`.
- The active marker now **slides** between items/tabs as the selection changes
  (an underline bar for `underline`, a filled highlight for `rounded`/`pill`),
  instead of snapping. The motion automatically respects
  `prefers-reduced-motion: reduce`, and the indicator is decorative
  (`aria-hidden`) — selection, focus, and keyboard behavior are unchanged. The
  animation is always on; there is no per-instance toggle.
- `Tabs`' `pills` variant has been reimplemented to match `TabNav` (themeable
  `colorPalette` highlight, no outline-box container).

**Deprecations (non-breaking — old names still work):**

- `Tabs`: `variant="line"` → `variant="underline"`; `variant="pills"` →
  `variant="pill"`.
- `TabNav`: `variant="tabs"` → `variant="underline"`.

Update at your convenience; the deprecated names are accepted as aliases.
