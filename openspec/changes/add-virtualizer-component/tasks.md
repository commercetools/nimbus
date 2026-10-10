## 1. Scaffolding and types

- [x] 1.1 Create `packages/nimbus/src/components/virtualizer/` with
      `virtualizer.tsx`, `virtualizer.types.ts`, `index.ts`, `internal/`,
      `utils/`, `virtualizer.stories.tsx`, `virtualizer.mdx`,
      `virtualizer.dev.mdx`, `virtualizer.a11y.mdx`,
      `virtualizer.guidelines.mdx`, `virtualizer.docs.spec.tsx`. No recipe or
      slots (the component renders no DOM element, design Decision 1), so no
      recipe registration in `theme/slot-recipes/index.ts`
- [x] 1.2 Record the current bundle size with `pnpm check:bundle-size` as the
      baseline for task 8.4
- [x] 1.3 Write `virtualizer.types.ts` with the public types only:
      `VirtualizerListLayoutOptions` and `VirtualizerProps` (`layout?: "list"`,
      Decision 3). JSDoc on every prop and option, with defaults
- [x] 1.4 Write `internal/types.ts` with the internal grid and table option
      types, the internal props union, and the spacing value type; not exported
      from the package

## 2. Option merging and mapping (TDD, unit tests)

- [x] 2.1 Write failing unit tests in `utils/merge-virtualizer-options.spec.ts`:
      consumer options override collection defaults; keys neither sets stay
      unset (Decision 5)
- [x] 2.2 Write failing unit tests in `utils/map-layout-options.spec.ts`: list
      name mapping (`rowHeight` → `rowSize`, etc.), pass-through for table and
      grid, never emits `columnWidths` or `direction` (Decisions 4 and 5)
- [x] 2.3 Write failing unit tests in `utils/resolve-spacing.spec.ts`: spacing
      token keys (`"100"` → 4), numbers, and the development warning for an
      unknown token (Decision 6)
- [x] 2.4 Implement `utils/resolve-spacing.ts` using `themeTokens` from
      `@commercetools/nimbus-tokens`
- [x] 2.5 Implement `utils/merge-virtualizer-options.ts` and
      `utils/map-layout-options.ts` as pure functions; all tests from 2.1 to 2.3
      pass

## 3. Virtualizer component

- [x] 3.1 Implement `Virtualizer`: choose the React Aria Components layout class
      (`ListLayout` by default; internal `GridLayout`, `TableLayout`), map
      `layoutOptions`, render React Aria's `Virtualizer` with
      `shouldObserveItemSize` (Decisions 4 and 8); set `displayName`
- [x] 3.2 Implement internal
      `useVirtualizationWarnings({ isVirtualized, hasOptions })` for
      collections: warn when wrapped in a `Virtualizer` without `isVirtualized`
      (reads `isVirtualized` from React Aria's `CollectionRendererContext`), and
      when `virtualizerOptions` is set without `isVirtualized` (Decision 7)
- [x] 3.3 ~~Implement the development warning for a missing bounded height~~ —
      **dropped (Decision 11)**: React Aria intersects the collection with the
      browser window, so an unbounded collection still virtualizes; it scrolls
      with its parent or the page. Covered by story 4.7 and the docs instead
- [x] 3.4 Export only `Virtualizer`, `VirtualizerProps` and
      `VirtualizerListLayoutOptions` from `virtualizer/index.ts`,
      `components/index.ts` and `packages/nimbus/src/index.ts` (Decision 10);
      add a type test that internal types and helpers are not importable from
      the package

## 4. Virtualizer stories and play tests

Follow the test rules in design Decision 14 (fixed story sizes,
`waitFor`/`findBy*`, `scrollTop`/`scrollHeight`, one-call typeahead, ±1px, no
Chromatic snapshot for 10,000-item stories).

- [x] 4.1 Story: `Virtualizer` with unstyled React Aria `ListBox` (the
      custom-collection use case), 10,000 items — play asserts fewer than 100
      options in the DOM, `scrollHeight` accounts for all items,
      `aria-posinset`/`aria-setsize` (10000) on rendered options
- [x] 4.2 Story: keyboard — End and Home, PageDown and PageUp, typeahead to an
      unrendered item; each asserts the focused item is rendered and in view
- [x] 4.3 Story: focus survives scrolling — focus item 5, scroll to item 5000
      with `scrollTop`, assert `document.activeElement` is still item 5, then
      ArrowDown focuses item 6
- [x] 4.4 Story: selection survives scrolling — select, scroll out and back,
      assert still selected
- [x] 4.5 Story: custom layout options — fixed `rowHeight`, `gap` and `padding`
      as token and as pixels; play asserts rendered positions and sizes
- [x] 4.6 Story: no height options with multi-line items, then narrow the
      container — play asserts rows are measured, no overlap after scrolling and
      after the width change
- [x] 4.7 Story: no bounded height — 10,000 items with no height limit; play
      asserts the list is as tall as all items and only about one window of
      items is in the DOM (Decision 11)
- [x] 4.8 Internal story: grid layout with unstyled React Aria `GridList` — only
      visible cells render, arrow keys move between rows and columns, `aria-rowcount` on the grid and `aria-rowindex` on rendered rows (React Aria sets `aria-posinset` only for tree grids, `useGridListItem.mjs:296`); second variant in a right-to-left locale
      (Decision 9)
- [x] 4.9 Internal story: table layout with unstyled React Aria `Table`, 10,000
      rows — only visible rows render, `aria-rowcount` 10001, `aria-rowindex` on
      rendered rows; second variant inside `ResizableTableContainer` asserts
      cells follow a resized column width (Decision 9)
- [x] 4.10 Type test: `layout="grid"` and `layoutOptions={{ maxColumns: 3 }}`
      fail with `@ts-expect-error`

## 5. ListBox support

- [x] 5.1 Add `isVirtualized` and `virtualizerOptions`
      (`VirtualizerListLayoutOptions`) to `ListBoxRootProps` with JSDoc that
      links to the Virtualizer docs
- [x] 5.2 Derive the estimated row, section header and loader heights per `size`
      from the ListBox recipe tokens (for example `sm` row 30px, `md` row 38px)
      and store them in `list-box/constants/` (Decision 8)
- [x] 5.3 Write failing story play test: per size, the measured height of a
      single-line, single-select item is within 1px of its estimate; same for
      the section header and loader
- [x] 5.4 `ListBox.Root`: when `isVirtualized`, merge `virtualizerOptions` over
      the defaults (estimated heights for `size`; `gap: "100"`; `padding: "200"`
      for `card`, `0` for `plain`), render `<Virtualizer>` around the root slot,
      set `data-virtualized`; do not forward the two props to React Aria; call
      `useVirtualizationWarnings` (Decisions 4 and 7)
- [x] 5.5 `list-box.recipe.ts`: under `&[data-virtualized]`, set root
      `display: block`, root `gap: 0`, section `gap: 0` and section margin 0,
      because the layout owns spacing
- [x] 5.6 Story: `ListBox.Root isVirtualized` with 500 and 10,000 options, per
      `size` — play asserts DOM count, keyboard navigation, typeahead to an
      off-screen option, single and multiple selection of off-screen options,
      `aria-posinset`/`aria-setsize`
- [x] 5.7 Story: `virtualizerOptions` overrides a default — play asserts the
      consumer value is used
- [x] 5.8 Story: virtualized ListBox with sections — record whether
      `aria-setsize` counts per section or for the whole list (design open
      question); compare spacing with the non-virtualized story and fix visible
      differences (design risk)
- [x] 5.9 Story: long wrapping labels and items with descriptions — play asserts
      no two option rects overlap and no option content overflows its row
- [x] 5.10 Story: text spacing override (WCAG 1.4.12) — inject a style with line
      height 1.5, letter spacing 0.12em, word spacing 0.16em after first render;
      play asserts rows are re-measured and do not overlap
- [x] 5.11 Story: browser zoom — apply CSS `zoom: 2` to the story root; play
      asserts no overlap and no clipping
- [x] 5.12 Story: `variant="plain"` inside `ScrollArea` — play asserts the
      parent scrolls and only visible options render
- [x] 5.13 Story: focus ring — play focuses the first and the last item and
      asserts the item rect plus ring width is inside the scroll container rect;
      one small Chromatic snapshot per size of the focused state
- [x] 5.14 Story: misuse — `ListBox.Root` wrapped in `<Virtualizer>`, and
      `virtualizerOptions` without `isVirtualized`; play asserts each
      development warning
- [x] 5.15 Run the existing ListBox stories unchanged to confirm non-virtualized
      rendering did not change

## 6. Measurement and spike

- [x] 6.1 Timing story: mount time and time to first paint for ListBox with 500
      and 10,000 options, with and without `isVirtualized`; also the scroll size
      correction with estimated heights; numbers shown on screen, no CI
      threshold (Decision 12)
- [x] 6.2 Run the timing story locally and write the results into `design.md`
- [x] 6.3 Spike story (excluded from published Storybook and Chromatic): current
      ComboBox list virtualized with 500 options inside the popover; record
      which element scrolls, who bounds the height, and where `ComboBox.Root`
      should render the `Virtualizer` (Decision 13)

## 7. Documentation

- [x] 7.1 `virtualizer.mdx` with `lifecycleState: Experimental`: overview;
      Nimbus collections are virtualized with their `isVirtualized` prop; the
      `Virtualizer` itself is for custom collections built on React Aria; when
      pagination or a search field is better; the component renders no DOM
      element and has no recipe
- [x] 7.2 `virtualizer.dev.mdx`: first example `ListBox.Root isVirtualized` with
      a bounded height; custom layout configuration (every list option, token vs
      pixel values, estimated vs fixed heights and when fixed heights break,
      precedence rules); custom collections with `<Virtualizer>`;
      `data-virtualized` contract; limits (collection building cost, browser
      find, deep content changes not re-measured)
- [x] 7.3 `virtualizer.a11y.mdx`: what stays accessible (position and size,
      keyboard, focus), browser find limitation, recommendation of a search or
      filter field, text spacing and zoom support
- [x] 7.4 `virtualizer.guidelines.mdx`: when to virtualize, when not to,
      interaction with pagination
- [x] 7.5 `virtualizer.docs.spec.tsx`: consumer test examples (virtualized
      ListBox renders few options; selecting an option by keyboard)
- [x] 7.6 `list-box.dev.mdx`: virtualization section (`isVirtualized`,
      `virtualizerOptions`, bounded height) linking to the Virtualizer page
- [x] 7.7 Add a changeset for `@commercetools/nimbus` (minor): new experimental
      `Virtualizer`, ListBox `isVirtualized` and `virtualizerOptions`

## 8. Verification

- [x] 8.1 `pnpm --filter @commercetools/nimbus typecheck:dev` passes
- [x] 8.2 `pnpm test:dev packages/nimbus/src/components/virtualizer` and
      `pnpm test:dev packages/nimbus/src/components/list-box` pass
- [x] 8.3 `pnpm --filter @commercetools/nimbus build`, then
      `pnpm test:storybook` for both components against the built bundle
- [x] 8.4 `pnpm check:bundle-size` and `pnpm check:package-shape` pass; record
      the size difference against the baseline from 1.2 in `design.md`
- [x] 8.5 `pnpm lint` passes

## 9. Keep the Virtualizer internal (design Decision 10)

Follows task 8.3: a public `Virtualizer` cannot reach a consumer's own React
Aria components, and consumers only use Nimbus components. Replaces the export
parts of tasks 1.3, 3.2, 3.4, 4.10, 5.14 and 7.1–7.7.

- [x] 9.1 Merge the public wrapper into one internal `Virtualizer`
      (`virtualizer.tsx`, list, grid and table) and move its types into
      `virtualizer.types.ts`; remove the `internal/` folder
- [x] 9.2 Export only the type `VirtualizerListLayoutOptions` from
      `virtualizer/index.ts`; update the exports spec to assert that the package
      exports no `Virtualizer`, and that `virtualizerOptions` on `ListBox.Root`
      rejects grid options at type level
- [x] 9.3 Remove the wrapper warning and `CollectionRendererReset`; keep the
      `virtualizerOptions` without `isVirtualized` warning
      (`hooks/use-virtualizer-options-warning.ts`) and update the misuse story
- [x] 9.4 Virtualizer stories and the ComboBox spike import the component from
      source; title "Components/Virtualizer (internal)"
- [x] 9.5 Move the documentation into ListBox: implementation (options table,
      fixed or measured heights, styling, limitations, testing note),
      accessibility, guidelines, consumer test examples; delete the
      `virtualizer.*.mdx` files and `virtualizer.docs.spec.tsx`
- [x] 9.6 Changeset describes only the ListBox props
- [x] 9.7 Run typecheck, unit tests, lint, and the story tests against source
      files and against the built bundle (closes 8.3)
