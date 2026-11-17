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

**2. One pure module decides what is stuck; one hook applies it.**
`utils/sticky-stacks.utils.ts` has pure functions for three things. (a) The
natural layout of the sticky rows: each one's natural top and fractional
border-box height, from the heights of all body rows in DOM order (nested panel
rows and drop indicator rows included, because they take space), starting at the
table's top and the header height. (b) The static offsets: `top` is the header
height plus the heights of the sticky rows before it, `bottom` is the heights of
the sticky rows after it. (c) The stuck stacks for a scroll position. A sticky
row is stuck at the top when its natural top is above the bottom edge of the
stack above it (which starts with the header), and at the bottom when its
natural bottom is below the top edge of the stack below it. Only the stuck rows
cover other rows; a sticky row in its own place covers nothing.

A hook in `DataTable.Root` measures the layout from the DOM and writes, always
through the DOM and never through React state: the offsets as custom properties
on the sticky row elements (`--data-table-sticky-top` and
`--data-table-sticky-bottom`), and the stuck stack heights as
`scroll-padding-top` and `scroll-padding-bottom` on the root. The layout is
measured again after a size change (a `ResizeObserver` on the header, the table
and the root) and after a change of the row order, the row set or `stickyRows`
(the observer only reports sizes). On scroll, a passive listener throttled to
one animation frame recomputes only the padding from the cached layout:
arithmetic over the sticky rows, no layout read. Measuring uses the fractional
border-box height (`getBoundingClientRect().height`), never a rounded or
content-box value, so stacked rows leave no gap at fractional heights or page
zoom.

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

**5. Keyboard focus clear of the stacks.** Two parts.

_Scroll padding._ The root gets `scroll-padding-top` and `scroll-padding-bottom`
equal to the header and the stuck stack heights at the current scroll position
(Decision 2). React Aria reads them when it scrolls a focused row into view
(`scrollIntoView.mjs`).

_Measured (task 3.4): padding alone is not enough._ A story arrowed down a
40-row table (360 px high, Chromium 156) and sampled `scrollTop` every frame:

- With no sticky rows at all, focus on Row 7 scrolled to 338 px in one step. The
  row ended at the very top, 3.5 px above the viewport, under the 42.5 px sticky
  header. Moving focus down aligns the new row to the top edge; it does not
  scroll the minimum distance. This already happens on `main` for any table with
  `maxHeight`. It is outside this change.
- With the padding, a row is aligned just below the header, as intended.
- A top stack that does not exist yet cannot be in the padding. Focus on Row 5
  scrolled to 195 px, then rows 2 and 3 became stuck on top of it. The padding
  describes the stacks at the position before the scroll, and the stacks at the
  destination can be taller.

So the padding makes most cases right, but it cannot give the guarantee in the
spec.

_Correction after focus._ When a row (or a cell of it) gets focus, the hook
waits until React Aria and the browser have scrolled, then checks whether the
focused row is covered by the header or a stuck row. If it is, the hook scrolls
to the position `scrollToRow` would use for `align: "nearest"`: the same
destination-aware calculation (Decision 7), so it is one function, not two. A
sticky row that is stuck is part of a stack and is never moved. The correction
runs only after a focus change, so scrolling with the mouse wheel is never
pulled back.

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

**7. `scrollToRow` inset change.** `getScrollInsets` adds the stuck stack
heights to `topInset` and `bottomInset`. It measures the layout live when the
call runs, the same way it already measures the header, and does not read the
cache or the DOM properties: a call right after `stickyRows` or the rows changed
would read old numbers. The stacks must be those of the destination, not of the
current position (a sticky row near the top is in place now, and stuck once the
table has scrolled down). Because the destination depends on the insets, the
hook computes a first target with the stacks at the current scroll position,
computes the stacks at that target, and computes the target again, until two
passes agree (at most three passes).

_Measured (tasks 4.3, 3.4): the passes can go round in a circle._ A row between
two sticky rows does: with the stack of one pass it goes to a position where the
stack is taller, and with the taller stack to a position where it is shorter.
The stack changes by whole rows and there are few, so when the passes do not
agree, the function tries every combination of stuck rows at the top and the
bottom and returns the first one that agrees with the position it gives.

_A row that touches the edge of a stack counts as stuck_ (0.5 px tolerance). In
place and stuck look the same there, and counting it makes the answer stable. A
row aligned right below a sticky row flipped between the two answers on every
pass before this.

For a target that is sticky and currently stuck (it is in a stuck stack at the
current scroll position), the hook resolves `true` before it computes a scroll.
`computeTargetScrollTop` stays unchanged.

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

- [Dividers of sticky rows in a `border-collapse: collapse` table] →
  **Measured (task 2.1, then again after task 6.2 feedback).** Throwaway scripts
  read pixels from screenshots of the stories, with every scrolling row painted
  red so that a row showing through is unmistakable. They compare Chromium
  156.0.8078.4 and the Playwright WebKit build 27.2 (revision 2370; not a Safari
  release), and measure the thickness of each divider against the divider
  between two normal rows.
  - Stack geometry is exact: hit testing finds no gap between the header and the
    stuck rows or between stuck rows, also at fractional heights. Measuring the
    fractional border-box height (Decision 2) works.
  - **In a collapsed-border table a sticky row cannot carry its divider.** The
    one-pixel grid line between two rows belongs to the table, and no cell paints
    it. A row border is not painted at the stuck position, and the rows that
    scroll under the stack show through that line: a one-pixel seam between the
    header and the first stuck row and between two stuck rows, at almost every
    scroll position, at every device scale. It is one CSS pixel at scales 1, 2
    and 3, so it is **not** a rounding problem (an earlier version of this note
    proposed rounding the offsets; that would not have helped), and it
    disappears with `border-collapse: separate`.
  - Tried and rejected, each measured: an inset shadow on the cells (draws the
    line, leaves the seam); an outward shadow on the cells (no effect, or the
    lower stuck row paints over it); an own cell background (no effect); a
    one-pixel outline in the row color (fills the seam but hides the divider); a
    cell outline in the divider color (vertical lines between the cells); an
    outline on the row in the divider color (no seam, but a divider of 2px
    between two stuck rows, because the outline sits outside both rows); a
    one-sided outline (1px, but the seam comes back at scale 2).
  - **Decision for the recipe:** a table that has sticky rows (`stickyRows` is not
    empty and `maxHeight` is set, `data-has-sticky-rows` on the root) uses
    `border-collapse: separate`, and its dividers are cell borders, on the body
    cells and on the header cells. A sticky row carries its cell borders along,
    so the divider between two stuck rows is one pixel, like any other. Other
    DataTables keep the collapsed borders and are not changed.
  - The last sticky row is at the bottom edge when any row is stuck there. Its
    divider would sit next to the border of the scroll area, two lines in all.
    `useStickyStacks` sets `data-sticky-bottom-edge` on that row while rows are
    stuck at the bottom, and the border turns transparent. It must stay a
    border and not be removed: a row that changes height by one pixel makes the
    measured stacks stale (a story failed by 1.25px when it was removed).
  - The first row of the bottom stack has no divider on top. That line is the
    bottom border of the row above, which is far away while the row is stuck
    (row 38 in the stuck-at-bottom story had `border-top: 0` and nothing painted
    its top edge). `useStickyStacks` sets `data-sticky-bottom-start` on that row
    while it is pushed up from its own place by more than 0.5px, and the cells
    draw the line as a 1px background gradient. A border on top would make the
    row taller and make the stacks stale, as above. A box-shadow would replace
    the shadows of the frozen cells. In its own place the row is not marked,
    because the row above paints the line, and two lines would show.
  - Result on the real stories (sampled at 21 to 47 scroll positions per stack):
    no seam and a one-pixel divider at every boundary, in both stacks, in
    Chromium at scales 1, 2 and 3 and in WebKit at scales 1 and 2. That includes
    the seam between the header and the first stuck row, which WebKit showed
    before. The line at the bottom edge of the scroll area is one line.
  - **Not solved: fractional device scales in the top stack.** At 1.25 a seam
    shows between two stuck rows at about a quarter of the scroll positions, at
    1.5 at about half (the bottom stack is clean at both). Each sticky row is its
    own stacking context, and Chromium snaps its origin to whole device pixels
    separately, while the row heights are fractional, so the two edges can round
    apart by one device pixel. Setting an own background or an inset line on the
    cells, or `will-change: transform` on the rows, did not help. Making the
    height of every sticky row a whole number of device pixels (set by the hook)
    removed the seam at 1.25 in a prototype, but not at 1.5, and it would need a
    new measure after every zoom change. Not built.
  - The border of a column header cell of a table with sticky rows is a cell
    border too, so the header's divider moves with the sticky header.
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
