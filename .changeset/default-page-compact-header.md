---
"@commercetools/nimbus": minor
---

`DefaultPage`: `stickyHeader` now also accepts `"compact-on-scroll"` with
`layout="flexible"`. The pinned header shrinks once the page has scrolled past
it, with a smaller title, the back link icon kept beside the title, and the
subtitle collapsed, and returns to full size when the page is back at the top.
It works with any scrolling container, and `prefers-reduced-motion` turns the
transition off.

`stickyHeader={true}` and pages that do not set `stickyHeader` look and behave
as before.
