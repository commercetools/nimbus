## 1. Types and Row Flag

- [x] 1.1 Add `stickyRows?: Set<string>` to the `DataTable` and `DataTable.Root`
      props and `isSticky: boolean` to `DataTableRowRenderProps`, with JSDoc on
      both, in `data-table.types.ts`; verify with
      `pnpm --filter @commercetools/nimbus typecheck:dev`
- [x] 1.2 Compute `isSticky` for each row in `data-table.body.tsx` from
      `getRowKey(row)` and a ref to the current set (the same way `isPinned` and
      `isDragDisabled` are computed), `true` only when the id is in the set and
      the table has `maxHeight`; pass it to `DataTable.Row`; set
      `data-sticky-row` on the row element only when it is `true`; verify
      typecheck and that the existing DataTable stories still pass with
      `pnpm test:dev packages/nimbus/src/components/data-table`
- [x] 1.3 Write a story (`data-table.sticky-rows.stories.tsx`) with a play
      function: a custom row render function receives `isSticky` `true` only for
      rows in `stickyRows` and `false` without the prop; an empty set makes no
      row sticky; an id that is not a row is ignored without an error (nested
      child ids are never rendered as rows, so the lookup never sees them);
      without `maxHeight` (size set with `maxH`) every row has `isSticky`
      `false`; verify it passes with `pnpm test:dev` on that file
- [x] 1.4 Add a render-count story as in the per-row drag stories: adding one
      row to `stickyRows` re-renders only that row; verify it passes

## 2. Styles

- [x] 2.1 Check, in Chromium and WebKit with a throwaway page and pixel reads,
      how the `borderBottom` of a sticky `tr` paints in a collapsed-border table
      (`borderCollapse: "collapse"`), with stuck rows at the top and at the
      bottom, at fractional row heights and at a device scale of 1.25; record
      the result in `design.md` under Risks (done: the border is not painted, an
      inset `box-shadow` on the cells is, geometry is exact, a 1px seam between
      stacked rows is still possible). Firefox did not start in the session
      sandbox and stays in task 6.2; the pinned sticky row that is stuck alone
      (the group outline) needs the real table and moves to task 2.3
- [x] 2.2 In `data-table.recipe.ts`: give `[data-sticky-row]` `position: sticky`
      with `top` and `bottom` read from the row's CSS variables; add the sticky
      row level 14 to the `zIndex` table and move the header to 15 (update the
      comment); set the highlight (`neutral.2`) through `--data-table-row-bg`
      and `background`, below the hover and selected rules, leaving
      `data-custom-bg` rows alone; for a sticky row, set `border-bottom: none`
      on the row and draw the divider as a 1px `outline` on the row, in the color
      of the row border (task 2.1: a collapsed row border is not painted at the
      stuck position, and no cell paints the grid line, so the rows under a
      stuck row showed through it); for a sticky row that is disabled, do
      not apply the row-level opacity of `layerStyle: "disabled"`, keep the
      opaque background and dim the cell content; verify typecheck and the
      existing frozen column and pinning stories pass
- [x] 2.3 Add a story for the look and the stacking order with a play function:
      a sticky row differs in background from a normal row and its frozen cells
      match; selected wins (hover is not testable: `userEvent.hover` sends
      synthetic events that never turn on CSS `:hover`, so it is covered by the
      specificity of its rule in the recipe); a stuck row, also a disabled or
      selected one, has an opaque computed background and opacity 1 (a disabled
      row dims its content), and hides what is under it; the divider is
      drawn as an outline on the row; the header is above the stuck rows (done in
      `StickyRowsLook`, which found the selector specificity bug fixed in the
      recipe). Not done here, and listed in task 6.2 for the manual check: a
      pixel sample for a one-pixel seam between stacked rows (the stories check
      that stacked rows touch within one pixel, and design Risks names the
      rounding fix if a seam shows), and the pinned sticky row that is stuck
      alone (the group outline), which goes to Design

## 3. Stacks and Keyboard Focus

- [x] 3.1 Write `utils/sticky-stacks.utils.spec.ts` first, for the three pure
      functions of design Decision 2: the natural layout of the sticky rows from
      all body rows in order (nested and drop indicator rows take space); the
      static offsets (`top` = header plus the sticky rows before, `bottom` = the
      sticky rows after); the stuck stacks for a scroll position (a sticky row
      in its own place is not counted, rows scrolled above stack at the top,
      rows below stack at the bottom, mixed top and bottom, header height
      changed, no sticky rows, one sticky row, fractional heights, a changed row
      order with the same heights); verify it fails
- [x] 3.2 Implement the three functions in `utils/sticky-stacks.utils.ts`, a
      live DOM measuring function (`measureStickyLayout`, fractional border-box
      heights from the body rows) and `hooks/use-sticky-stacks.ts`: measure
      after a size change (`ResizeObserver` on the header, the table and the
      root) and after a change of the row order, the rows or `stickyRows`; write
      `--data-table-sticky-top` and `--data-table-sticky-bottom` on the sticky
      row elements (and remove them from rows that are no longer sticky) and
      `scroll-padding-top` and `scroll-padding-bottom` on the root, through the
      DOM and never through state; recompute only the padding on scroll (passive
      listener, one animation frame); clean up on unmount; call the hook in
      `data-table.root.tsx`; verify the unit spec passes and typecheck passes
- [x] 3.3 Add stories with play functions (done: `StickyRowsStacks`,
      `StickyRowsChanges`, `StickyRowsHeightChanges`,
      `StickyRowsPinnedAndNested`): sticky rows stack at the top below the
      header and at the bottom in row order, with no overlap; adding and
      removing a row from `stickyRows` updates the stacks; a pinned sticky row
      is first in the top stack; a sticky row hidden by `search` does not render
      and the padding is removed; the nested panel of an expanded sticky row is
      not sticky; a new row order (the rows reversed, which stands for sorting,
      a drag and drop reorder and a pin toggle: the rows keep their heights and
      move) gives a new stack order; a narrower table makes rows and header
      wrap, the stack follows, and nothing re-renders because of it; verify they
      pass with `pnpm test:dev`
- [x] 3.4 Add a story that moves focus with ArrowUp and ArrowDown through a
      table with a top and a bottom stack, and checks that the focused row is
      never behind a stack (done: the story failed with padding alone, see
      design Decision 5); add the correction after focus to
      `hooks/use-sticky-stacks.ts`, which scrolls a covered focused row to where
      `scrollToRow` with `align: "nearest"` would put it, using the shared
      destination-aware function from task 4.2; scrolling with the wheel is not
      pulled back; verify the story passes
- [x] 3.5 Add stories (done: `StickyRowsFocusAndClick`, `StickyRowsDrag`): a
      focused stuck row shows its whole focus ring; after scrolling sideways a
      click on a stuck row's frozen cell calls `onRowAction` for that row; a
      pointer drag and a keyboard drag start from a stuck row (mocked native
      drag events for the pointer, as in the per-row drag stories); verify they
      pass with `pnpm test:dev`
- [x] 3.6 Add the development warnings (`stickyRows` without `maxHeight`, a
      stack taller than half of the visible height), each logged once per cause
      and not in production; add a story that spies on `console.warn` for both
      and for the quiet case; verify it passes
- [x] 3.7 Add a story (`StickyRowsFooter`) with `DataTable.Footer` and a bottom
      stack: at the end of the scroll range the footer is fully visible and no
      stuck row covers it (compare bounding boxes); verify it passes, and if a
      browser covers the footer, record it in `design.md` under Risks and fix it
      before merge

## 4. Scroll To Row

- [x] 4.1 Write the tests first, in `utils/sticky-stacks.utils.spec.ts` (the
      logic is pure, so it is tested there; the fake container of
      `use-data-table-api.spec.ts` has no `<table>`, so it cannot hold sticky
      rows): the destination stacks (a sticky row in its own place now but stuck
      at the destination is included; one that will not be stuck is not); a row
      right below a sticky row settles; a row between two sticky rows settles on
      the one stable answer; no sticky rows give `computeTargetScrollTop`;
      `isRowStuck`; verify the new cases fail
- [x] 4.2 Add `computeScrollTopWithStacks` and `isRowStuck` to
      `utils/sticky-stacks.utils.ts` and use them in `measureTarget` of
      `hooks/use-data-table-api.ts` (live measuring, not the cache or the DOM
      properties; a sticky target that is stuck needs no scroll); leave
      `computeTargetScrollTop` unchanged; verify the util spec and the existing
      hook spec pass
- [x] 4.3 Add stories in `data-table.sticky-rows.stories.tsx` (real layout, so
      they test the DOM wiring): `align` `"start"` and `"end"` for a normal row
      end below the top stack and above the bottom stack; rows that are in place
      now but stuck at the destination are counted; a sticky row between the
      target and the top is not counted when it is not stuck there; a row
      between two sticky rows settles; a call from an effect right after
      `stickyRows` changed uses the new stacks; a stuck sticky row resolves
      `true` and the table does not move; verify with `pnpm test:dev`

## 5. Documentation and Release

- [x] 5.1 Mark two stories for Chromatic (sticky row stuck at the top, stuck at
      the bottom) following `docs/chromatic-visual-testing.md`; verify the story
      parameters match the other snapshotted DataTable stories
- [x] 5.2 Write the sticky rows section in `data-table.dev.mdx`: the prop,
      `maxHeight` requirement and the development warnings, the highlight,
      `isSticky`, `scrollToRow` behavior for stuck rows, that pointer drops over
      the stack follow React Aria's default (including drag auto-scroll near the
      edges, which is not adjusted), that a new `Set` is needed to change the
      set, that a consumer row background must be opaque, that a disabled sticky
      row keeps an opaque background, that the highlight is a visual hint only
      (no ARIA state, replaced in forced-colors mode), and that virtualized
      tables are not covered; add a copy-ready example to
      `data-table.docs.spec.tsx`; update `data-table.a11y.mdx` and
      `data-table.mdx` where they describe rows or scrolling; verify the docs
      spec passes and the MDX compiles
- [x] 5.3 Add a minor changeset in `.changeset/` written from the consumer's
      view (`stickyRows`, `isSticky`, the highlight, the header z-index, the
      `scrollToRow` change), following `docs/changeset-conventions.md`; verify
      `pnpm changeset:status` lists it

## 6. Integration Checks

- [x] 6.1 Run `pnpm lint`, `pnpm --filter @commercetools/nimbus typecheck:dev`,
      `pnpm test:dev packages/nimbus/src/components/data-table` and
      `pnpm exec openspec validate add-data-table-sticky-rows --strict`; verify
      all pass
- [ ] 6.2 Before merge, a person checks Firefox, Safari and Chrome on Windows
      with the checklist (both edges, stacks, focus ring, frozen-cell click,
      drag, keyboard focus, highlight, a drag toward the top and bottom edges
      with stacks present, the footer at the end of the scroll range, and
      forced-colors mode: a stuck row still hides the rows under it, no
      one-pixel seam of the scrolling rows between two stacked rows, also at
      fractional sizes and page zoom, and a pinned sticky row that is stuck
      alone: the group outline is for Design to judge) and records the browsers,
      versions and result in the PR description
- [ ] 6.3 Ask Design in the PR to confirm the `neutral.2` highlight, and that
      the highlight is the only cue for a sticky row (no extra non-color cue, no
      ARIA state); verify the answer is recorded in the PR

## Workflow follow-up

- Open the PR on top of the #2169 branch, and rebase when #2160 and #2169 merge.
- Archive this change after the project's review requirements are satisfied.
