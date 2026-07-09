---
"@commercetools/nimbus": minor
---

**Tabs & TabNav**: unified variants and a sliding active indicator.

- Both components now expose the **same three variants**: `line` (default),
  `rounded` (soft rounded-rect highlight), and `pill` (capsule highlight). The
  `rounded`/`pill` highlights are themeable via `colorPalette`.
- The active marker now **slides** between items/tabs as the selection changes
  (a bar for `line`, a filled highlight for `rounded`/`pill`), instead of
  snapping. The motion automatically respects `prefers-reduced-motion: reduce`,
  and the indicator is decorative (`aria-hidden`) — selection, focus, and
  keyboard behavior are unchanged. The animation is always on; there is no
  per-instance toggle.
- The `pill` variant now looks the same on `Tabs` and `TabNav`: a themeable
  capsule highlight that follows `colorPalette`. If you use `Tabs`
  `variant="pills"` today, expect a refreshed look (and it now themes with the
  surrounding palette instead of a fixed color).

**Deprecations (non-breaking — old names still work):**

- `Tabs`: `variant="pills"` → `variant="pill"`.
- `TabNav`: `variant="tabs"` → `variant="line"`.

Update at your convenience; the deprecated names are accepted as aliases.
