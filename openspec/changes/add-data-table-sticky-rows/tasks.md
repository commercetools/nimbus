## 1. Types and Row Flag

- [ ] 1.1 Add `stickyRows?: Set<string>` to the `DataTable` and `DataTable.Root`
      props and `isSticky: boolean` to `DataTableRowRenderProps`, with JSDoc on
      both, in `data-table.types.ts`; verify with
      `pnpm --filter @commercetools/nimbus typecheck:dev`
- [ ] 1.2 Compute `isSticky` for each row in `data-table.body.tsx` from
      `getRowKey(row)` and a ref to the current set (the same way `isPinned` and
      `isDragDisabled` are computed), `true` only when the id is in the set and
      the table has `maxHeight`; pass it to `DataTable.Row`; set
      `data-sticky-row` on the row element only when it is `true`; verify
      typecheck and that the existing DataTable stories still pass with
      `pnpm test:dev packages/nimbus/src/components/data-table`
- [ ] 1.3 Write a story (`data-table.sticky-rows.stories.tsx`) with a play
      function: a custom row render function receives `isSticky` `true` only for
      rows in `stickyRows` and `false` without the prop; an empty set makes no
      row sticky; an unknown id and a nested child id are ignored without an
      error; without `maxHeight` (size set with `maxH`) every row has `isSticky`
      `false`; verify it passes with `pnpm test:dev` on that file
- [ ] 1.4 Add a render-count story as in the per-row drag stories: adding one
      row to `stickyRows` re-renders only that row; verify it passes

## 2. Styles

- [ ] 2.1 Check, in Chromium, WebKit and Firefox (Playwright and by hand), how
      the `borderBottom` of a sticky `tr` paints in a collapsed-border table
      (`borderCollapse: "collapse"`), with a stuck row at the top and at the
      bottom; record the result in `design.md` under Risks, and if the border
      does not move with the row, use an inset `box-shadow` for sticky rows; in
      the same check, look at fractional row heights and page zoom (no gap or
      overlap between stacked rows) and at a pinned sticky row that is stuck
      alone (the group outline), and record both results; verify the recorded
      results name the browsers and versions
- [ ] 2.2 In `data-table.recipe.ts`: give `[data-sticky-row]` `position: sticky`
      with `top` and `bottom` read from the row's CSS variables; add the sticky
      row level 14 to the `zIndex` table and move the header to 15 (update the
      comment); set the highlight (`neutral.2`) through `--data-table-row-bg`
      and `background`, below the hover and selected rules, leaving
      `data-custom-bg` rows alone; for a sticky row that is disabled, do not
      apply the row-level opacity of `layerStyle: "disabled"`, keep the opaque
      background and dim the cell content; verify typecheck and the existing
      frozen column and pinning stories pass
- [ ] 2.3 Add stories for the look and the stacking order with play functions: a
      sticky row differs in background from a normal row and its frozen cells
      match; hover and selected win; a stuck row hides rows that scroll under it
      (frozen cells included) and the header is above a stuck row; a stuck row
      that is disabled, selected or hovered shows nothing of the rows under it
      (sample the pixel or check the computed opacity and background); verify
      they pass with `pnpm test:dev`

## 3. Stacks and Keyboard Focus

- [ ] 3.1 Write `utils/sticky-stacks.utils.spec.ts` first: from the row heights
      in row order and the sticky flags, the top offsets (header plus the rows
      before) and bottom offsets (the rows after), the two totals, no sticky
      rows, one sticky row, fractional heights, a changed row order with the
      same heights, a changed header height; verify it fails
- [ ] 3.2 Implement the pure function in `utils/sticky-stacks.utils.ts`, and
      `hooks/use-sticky-stacks.ts` with one `ResizeObserver` on the header and
      on the sticky row elements from the row registry, measuring the fractional
      border-box height; run it again after a change of the row order, the rows
      or `stickyRows`; write the offsets and the two totals as CSS variables on
      the root through the DOM (never through state), and set
      `scroll-padding-top` and `scroll-padding-bottom` from the totals; call the
      hook in `data-table.root.tsx`; verify the unit spec passes and typecheck
      passes
- [ ] 3.3 Add stories with play functions: sticky rows stack at the top below
      the header and at the bottom in row order, with no overlap; a height
      change of a sticky row updates the other offsets; adding and removing a
      row from `stickyRows` updates the stacks; a pinned sticky row is first in
      the top stack; a sticky row hidden by `search` does not render and takes
      no space and the totals return to 0; the nested panel of an expanded
      sticky row scrolls; sorting, a drag and drop reorder and a pin toggle
      change the stack order without a height change; a header that wraps moves
      the top stack; changing a sticky row height does not re-render the table;
      verify they pass with `pnpm test:dev`
- [ ] 3.4 Add a story that moves focus with ArrowUp and ArrowDown through a
      table with a top and a bottom stack, and checks that the focused row is
      never behind a stack; if it fails because the table's focus path does not
      use React Aria's `scrollIntoView`, scroll the focused row from its focus
      handler with the same totals and update `design.md` Decision 5; verify the
      story passes
- [ ] 3.5 Add stories: a focused stuck row shows its whole focus ring; after
      scrolling sideways a click on a stuck row's frozen cell calls
      `onRowAction` for that row; a pointer drag and a keyboard drag start from
      a stuck row (mocked native drag events for the pointer, as in the per-row
      drag stories); verify they pass with `pnpm test:dev`
- [ ] 3.6 Add the development warnings (`stickyRows` without `maxHeight`, a
      stack taller than half of the visible height), each logged once per cause
      and not in production; add a story that spies on `console.warn` for both
      and for the quiet case; verify it passes

## 4. Scroll To Row

- [ ] 4.1 Extend `hooks/use-data-table-api.spec.ts` first: with sticky row
      elements in the registry, `topInset` and `bottomInset` include their
      heights, measured when the call runs; a call right after the set or the
      row order changed uses the new heights; a target that is sticky and stuck
      resolves `true` without calling `scrollTo`, for every `align`; a sticky
      target that is not stuck scrolls as any other row; verify the new cases
      fail
- [ ] 4.2 Add the live stack heights to `getScrollInsets` in
      `hooks/use-data-table-api.ts` (not read from the CSS variables) and
      resolve `true` early for a stuck sticky target; leave
      `computeTargetScrollTop` unchanged; verify the hook spec passes
- [ ] 4.3 Add to `data-table.scroll-to-row.stories.tsx` or the sticky stories:
      `align` `"start"` and `"end"` for a normal row end below the top stack and
      above the bottom stack; a call from an effect right after `stickyRows`
      changed uses the new stacks; a stuck sticky row resolves `true` and the
      table does not move; verify with `pnpm test:dev`

## 5. Documentation and Release

- [ ] 5.1 Mark two stories for Chromatic (sticky row stuck at the top, stuck at
      the bottom) following `docs/chromatic-visual-testing.md`; verify the story
      parameters match the other snapshotted DataTable stories
- [ ] 5.2 Write the sticky rows section in `data-table.dev.mdx`: the prop,
      `maxHeight` requirement and the development warnings, the highlight,
      `isSticky`, `scrollToRow` behavior for stuck rows, that pointer drops over
      the stack follow React Aria's default (including drag auto-scroll near the
      edges, which is not adjusted), that a new `Set` is needed to change the
      set, that a consumer row background must be opaque, that a disabled sticky
      row keeps an opaque background, and that virtualized tables are not
      covered; add a copy-ready example to `data-table.docs.spec.tsx`; update
      `data-table.a11y.mdx` and `data-table.mdx` where they describe rows or
      scrolling; verify the docs spec passes and the MDX compiles
- [ ] 5.3 Add a minor changeset in `.changeset/` written from the consumer's
      view (`stickyRows`, `isSticky`, the highlight, the header z-index, the
      `scrollToRow` change), following `docs/changeset-conventions.md`; verify
      `pnpm changeset:status` lists it

## 6. Integration Checks

- [ ] 6.1 Run `pnpm lint`, `pnpm --filter @commercetools/nimbus typecheck:dev`,
      `pnpm test:dev packages/nimbus/src/components/data-table` and
      `pnpm exec openspec validate add-data-table-sticky-rows --strict`; verify
      all pass
- [ ] 6.2 Before merge, a person checks Firefox, Safari and Chrome on Windows
      with the checklist (both edges, stacks, focus ring, frozen-cell click,
      drag, keyboard focus, highlight) and records the browsers, versions and
      result in the PR description

## Workflow follow-up

- Open the PR on top of the #2169 branch, and rebase when #2160 and #2169 merge.
- Archive this change after the project's review requirements are satisfied.
