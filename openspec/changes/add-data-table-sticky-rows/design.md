## Context

Sources for this design: the Jira ticket FEC-1484, PRs #2160 and #2169 (and the
code of this branch, which contains both), and React Aria source in
`node_modules`. Each fact names its source. See `proposal.md` for scope and
`specs/nimbus-data-table/spec.md` for behavior.

**Code today.**

- The root element scrolls. The header is `position: sticky; top: 0` with
  `zIndex: 14`, set only when `maxHeight` is set (`data-table.recipe.ts:267-273`
  and `components/data-table.header.tsx:116`).
- Stacking levels today: frozen body cells 11 and 12, `bodyLayer` (focus ring,
  pinned outline, drop indicator) 13, frozen header cells 13, header 14
  (`data-table.recipe.ts:8-35`).
- The row is `position: relative` and reads one variable for its background,
  `--data-table-row-bg`. Frozen cells mirror it. Rows with a consumer background
  leave the variable unset (`data-table.recipe.ts:406-416`).
- The table uses `borderCollapse: "collapse"` and rows draw `borderBottom`
  (`data-table.recipe.ts:256`, `:416`).
- `DataTable.Row` already receives per-row flags (`isPinned`, `isDragDisabled`)
  that are computed outside the row and passed in
  (`components/data-table.row.tsx:168-180`, `data-table.types.ts:467-477`).
- PR #2169: `getScrollInsets` in `hooks/use-data-table-api.ts:52` is the one
  place that decides what covers rows. It returns the header height as
  `topInset` (only when the header is sticky) and `0` as `bottomInset`. The row
  registry gives it the row elements.
- PR #2160: a row outside `draggableKeys` keeps a visually hidden, disabled drag
  button. Rows are draggable by their handle and by the row (React Aria puts the
  drag props on the row).

**React Aria (react-aria 3.53.1).** `scrollIntoView` reads `scroll-padding-top`
and `scroll-padding-bottom` of the scroll container, and `scroll-margin` of the
item, when it decides how far to scroll
(`dist/private/utils/scrollIntoView.mjs:34-41`, `:54-55`).
`useSelectableCollection.mjs` imports it (line 13). I did not read its call
sites, so a story must confirm that arrow-key focus in a table uses it (Decision
5).

## Goals / Non-Goals

**Goals:**

- One measured source for the stack heights, used by the CSS offsets, the root's
  scroll padding and `scrollToRow`.
- No re-render of the whole table when a stack height changes.

**Non-Goals:**

- Virtualized tables. See `proposal.md`, Out of Scope.
- A separate stuck look, and `scroll-state()` container queries.

## Decisions

**1. The row is the sticky element, with a top and a bottom offset.** A sticky
`tr` gets both `top` and `bottom`. The browser then keeps it at the top edge
when it scrolls above, and at the bottom edge when it lies below, without any
scroll listener. `top` is the header height plus the heights of the sticky rows
before it. `bottom` is the heights of the sticky rows after it. Both come from
CSS variables.

- _Alternative: `position: sticky` on the row's cells (the prototype)._
  Rejected: the ticket records that it behaved differently in Safari, Firefox
  and Windows, and a click on a frozen cell then did not reach the row.
- _Alternative: JavaScript that moves rows on scroll._ Rejected: it lags behind
  native scrolling and needs a scroll listener per table.

**2. Measure the heights in one hook, and write CSS variables on the root.** A
hook in `DataTable.Root` holds a `ResizeObserver` on the header and on the
sticky row elements (found through the row registry from #2169). It computes the
prefix and suffix sums in row order and writes `--data-table-sticky-top-<index>`
style variables, or one variable per row key, on the root element through the
DOM, not through React state. It also writes the two totals, used for
`scroll-padding`. It measures the border-box height as a fractional number
(`borderBoxSize`, or `getBoundingClientRect().height`), never a rounded or
content-box value, so stacked rows leave no gap at fractional heights or page
zoom. The observer only reports size changes, so the hook also runs again after
every change of the row order, the row set or `stickyRows` (an effect on those
inputs). Drop indicator rows are not in the row registry, so they are never
counted.

- _Alternative: React state for the heights._ Rejected: every height change
  would re-render the table.
- _Alternative: one `ResizeObserver` per row._ Rejected: more observers, and the
  sums still need one place.

The exact variable names are an implementation detail and are not part of the
spec.

**3. Row order is the order in the DOM.** The stack order is the order of the
rows as rendered (after sorting, search and pinning). A pinned sticky row is
therefore first in the top stack, because pinned rows are partitioned before the
other rows. A row hidden by `search` is not rendered and so is not in a sum.

**4. z-index.** A sticky row uses 14, so it covers body rows, frozen body cells
and `bodyLayer` (13). The header moves from 14 to 15. A positioned element with
a `z-index` forms its own stacking context, so the levels of the cells inside
the row stay inside the row. I did not find a source for this in the project;
the stories for focus ring and frozen cells (tasks 3.x) must confirm it. The
`zIndex` table in the recipe is the single place for the new values, and its
comment is updated.

**5. Keyboard focus clear of the stacks.** The root gets `scroll-padding-top`
and `scroll-padding-bottom` equal to the two totals. React Aria's
`scrollIntoView` reads them. A story arrows through a table with sticky rows and
checks that the focused row is never behind a stack. If the story shows that the
table's focus path does not use `scrollIntoView`, the design changes to scroll
the focused row from `onFocus` with the same totals. This is the one decision
that needs a check before the rest is built (task 3.4).

This also serves WCAG 2.2 SC 2.4.11 (level AA): "When a user interface component
receives keyboard focus, the component is not entirely hidden due to
author-created content." Its Understanding document lists "sticky footers,
sticky headers, and non-modal dialogs" as typical cases
(w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html). Scroll
padding avoids partly hidden rows too, which is more than the criterion asks.
The project's target is WCAG 2.1 AA, so this is a quality choice, not a
requirement.

**6. Highlight through the existing background variable.** A sticky row sets
`--data-table-row-bg` to the `neutral.2` token and the same value as its
`background`, in the recipe, with a lower specificity than the hover and
selected rules, so those win. Frozen cells already read the variable, so they
match without new rules. A consumer background (`data-custom-bg`) leaves the
variable unset, so it wins, as it does today.

**7. `scrollToRow` inset change.** `getScrollInsets` adds the stack heights to
`topInset` and `bottomInset`. It measures them live when the call runs (the
heights of the sticky row elements in the registry, in DOM order), the same way
it already measures the header. It does not read the CSS variables, because a
`ResizeObserver` writes those after layout, and a call right after `stickyRows`
or the rows changed would read old numbers. For a target that is sticky and
stuck, the hook resolves `true` before it computes a scroll. "Stuck" is decided
from the row's position against the edges: the row's box touches the top or
bottom edge of the visible area, and its own position is outside it. This keeps
`computeTargetScrollTop` unchanged.

- _Alternative: compute the row's natural position and apply `align` to it._
  Rejected in the brainstorm: a sticky row's own offsets show its stuck
  position, so this needs extra measuring, and it can move the table for a row
  the user already sees.

**8. Development warnings.** Both warnings run in an effect in development only
and use the measured totals. They log once per cause, not on every render.

**9. Sticky only with `maxHeight`.** `data-table.body.tsx` sets `isSticky` (and
the row's sticky attribute) only when the row id is in `stickyRows` and the
table has `maxHeight`. This is the same condition as the sticky header
(`components/data-table.header.tsx:116`). A table sized with the `maxH` style
prop scrolls, but its header is not sticky (story `ScrollToRowHeaderNotSticky`
in #2169), and the top offset would have to guess whether to add the header
height. Brainstorm decision: no special case; the development warning covers it.

- _Alternative: any scroll area, with the top offset following the header (as
  `getScrollInsets` does)._ Rejected: more stories, and the warning could not
  tell "no scroll area" from `maxH`.

**10. A stuck row must be opaque.** A normal row has no resting background: only
hover and selected set one, and frozen cells read `--data-table-row-bg`
(`data-table.recipe.ts:406-452`). A disabled row gets `layerStyle: "disabled"`,
which is `opacity: 0.5` on the row (`recipe:467-469`,
`theme/layer-styles.ts:6-10`), so a stuck disabled row would show the rows under
it. For a sticky row that is disabled, the recipe does not apply the row
opacity. It keeps the opaque sticky background and dims the cell content
instead. A consumer background must be opaque; the docs say so (brainstorm
decision).

**11. Render cost.** `isSticky` is computed per row in `data-table.body.tsx`,
from a ref to the current set, the same way `isPinned` and `isDragDisabled` are
(`data-table.body.tsx:89-103`), so a changed set re-renders only rows whose flag
changed. The measuring hook writes only to the DOM and never sets state. A story
counts renders, as the per-row drag story does (#2160, criterion 5).

## Risks / Trade-offs

- [Row borders on a sticky `tr` in a `border-collapse: collapse` table] →
  **Measured (task 2.1).** A throwaway page copied the table structure
  (scrolling root, collapsed borders, sticky `thead`, rows with `border-bottom`,
  sticky rows with `top` and `bottom`) and read pixels from screenshots.
  Chromium 156.0.8078.4 and the Playwright WebKit build 27.2 (revision 2370; not
  a Safari release) agree:
  - Stack geometry is exact: 0.00 px gap and no overlap between the header and
    the top stack and inside both stacks, also with fractional heights (40.90625
    px) and at a device scale of 1.25. (WebKit showed 0.20 px at scale 1.25 at
    the bottom edge.) Measuring the fractional border-box height (Decision 2)
    works.
  - The `border-bottom` of a sticky `tr` is **not painted** at the row's stuck
    position. The collapsed border belongs to the table grid and stays at the
    row's original position. Instead the bottom pixel row of the stuck row shows
    the row that scrolls under it.
  - An inset `box-shadow` (`inset 0 -1px 0`) on the cells of a sticky row, with
    `border-bottom: none` on the row, paints the line at the stuck position in
    both engines. **Decision for the recipe:** sticky rows draw their bottom
    line this way.
  - An outward 1px shadow on the cells to cover the seam was tried and rejected:
    the lower stuck row paints over the line of the row above it.
  - A 1px seam of the scrolling row can still show between two stacked rows when
    the offsets are fractional (the header was 40.5 px high in the test).
    Chromium and WebKit snap each sticky row to device pixels separately. This
    is not solved: tasks 2.3 and 3.3 sample pixels in the real table, and if a
    seam shows, the offsets are rounded to device pixels (or rows overlap by one
    pixel) before merge.
  - The header's own bottom border is not painted at its stuck position either
    (the same one-pixel sliver above the first stuck row). This already happens
    today; it is not changed here.
  - **Firefox was not measured.** Firefox 157.0 (Playwright revision 1555) did
    not start in the session sandbox ("Could not find profile folder", also with
    a profile in a scratch directory). The script is `run2.mjs`, kept outside
    the repository; Firefox stays in the manual check (task 6.2).
- [Firefox and Windows Chrome are not measured] → The manual check in the ticket
  stays: a person checks Firefox, Safari and Windows Chrome against a checklist
  and records the result in the PR. Playwright Chromium and WebKit cover the
  automated part.
- [A tall stack hides most of the table] → Development warning at half of the
  visible height. No limit in production.
- [Header z-index change from 14 to 15] → Only the recipe changes. The Chromatic
  run for the whole DataTable shows any change.
- [`neutral.2` equals the header background step] → A stuck row directly under
  the header looks related to it. Design can change the token later; it is one
  line in the recipe.
- [React Aria `scrollIntoView` and the table focus path] → Decision 5 and task
  3.4.
- [A pinned sticky row that is stuck alone] → The pinned group outline draws
  edges for the first, middle and last row of a group. A stuck row without its
  group may show an edge that makes no sense alone. I have not checked it; tasks
  2.1 and 2.3 look at it and Design decides.
- [React Aria drag auto-scroll near the edges] → No change. React Aria's
  `useAutoScroll.mjs` uses a 20px zone measured on the scroll container's box
  and only runs on WebKit on macOS ("Most browsers auto scroll natively, but
  WebKit on macOS does not"), so the pointer position decides and a stack does
  not block it. The sticky header has the same shape today. Native auto-scroll
  in Chrome and Firefox was not checked: item in the manual checklist (task
  6.2). The docs list this as part of "React Aria's default".
- [Footer at the bottom edge] → The footer is rendered inside the scrolling
  root, after the table (`data-table.tsx:46`, `data-table.recipe.ts:138`). MDN
  says a sticky element stays "stuck until meeting the opposite edge of its
  containing block", so the bottom stack should stop at the table's edge and not
  cover the footer. MDN does not mention `tr` for `sticky` (and calls the effect
  of `relative` on table rows "undefined"), so a story checks it (task 3.7) and
  task 2.1 covers the browsers.
- [Highlight is the only cue, and forced-colors mode drops it] → Brainstorm
  decision: keep one simple highlight, no ARIA state, no extra cue. WCAG 1.4.1
  says "Color is not used as the only visual means of conveying information … or
  distinguishing a visual element"; whether "this row is sticky" is such
  information is a Design question and goes in the PR for Design to confirm. MDN
  lists `background-color` among the properties replaced in forced-colors mode.
  The manual checklist (task 6.2) checks that a stuck row still hides the rows
  under it there.
- [This change depends on #2169 and #2160] → It is based on the #2169 branch and
  cannot merge before it. The `scrollToRow` requirement here is written as ADDED
  because the main spec does not contain the `scrollToRow` requirements until
  #2169 is archived.

## Migration Plan

No migration. The prop is optional. Rollback is a revert of the change.
