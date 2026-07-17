## 1. Foundation — ListBox

- [x] 1.1 Create `components/list-box/` directory with types, recipe, slots,
      barrel export. Types: `ListBoxRootProps<T>`, `ListBoxItemProps<T>`,
      `ListBoxSectionProps`. Recipe: `nimbusListBox` slot recipe with size
      variants (sm, md, lg). Register recipe in theme config.
- [x] 1.2 Implement `ListBox.Root` wrapping RAC `ListBox` with Nimbus slot
      styling. Support `items`, `selectionMode`, `selectedKeys`,
      `onSelectionChange`, `disabledKeys`, `dragAndDropHooks`,
      `renderEmptyState`, `layout`, `orientation`.
- [x] 1.3 Implement `ListBox.Item` wrapping RAC `ListBoxItem` with slot styling.
      Support `textValue`, `id`, children.
- [x] 1.4 Implement `ListBox.Section` wrapping RAC `ListBoxSection`/`Header`
      with slot styling. Support `title`, children.
- [x] 1.5 Export ListBox from package public API
      (`packages/nimbus/src/index.ts`).
- [x] 1.6 Add Storybook stories: default, sizes, single/multi-select, sections,
      disabled items, empty state, controlled, dynamic items. Play functions for
      keyboard nav and selection.
- [x] 1.7 Add ListBox D&D stories: reorder, cross-list transfer (two ListBox
      instances).
- [x] 1.8 Add `list-box.docs.spec.tsx` consumer examples.

## 2. Foundation — GridList

- [x] 2.1 Create `components/grid-list/` directory with types, recipe, slots,
      barrel export. Types: `GridListRootProps<T>`, `GridListItemProps<T>`.
      Recipe: `nimbusGridList` slot recipe with size variants. Register recipe
      in theme config.
- [x] 2.2 Implement `GridList.Root` wrapping RAC `GridList` with Nimbus slot
      styling. Support `items`, `selectionMode`, `dragAndDropHooks`, `layout`,
      `renderEmptyState`.
- [x] 2.3 Implement `GridList.Item` wrapping RAC `GridListItem` with slot
      styling.
- [x] 2.4 Export GridList from package public API.
- [x] 2.5 Add Storybook stories: default, list mode, grid mode, selection, empty
      state, dynamic items. Play functions.
- [x] 2.6 Add GridList D&D stories: reorder (DraggableList replacement pattern),
      cross-collection transfer.
- [x] 2.7 Add `grid-list.docs.spec.tsx` consumer examples.

## 3. Foundation — Autocomplete

- [x] 3.1 Create `components/autocomplete/` directory with types, barrel export.
      Autocomplete has no recipe (no visual output). Types:
      `AutocompleteProps`.
- [x] 3.2 Implement `Autocomplete` wrapping RAC `Autocomplete`. Support
      `filter`, `inputValue`, `onInputChange`, `defaultInputValue`,
      `disableVirtualFocus`.
- [x] 3.3 Export Autocomplete from package public API. Re-export `useFilter`
      from React Aria for consumer convenience.
- [x] 3.4 Add Storybook stories: Autocomplete + ListBox, Autocomplete + Menu
      (command palette), Autocomplete + GridList, Autocomplete + TagGroup,
      async loading. Play functions for filtering and virtual focus.
- [x] 3.5 Add `autocomplete.docs.spec.tsx` consumer examples.

## 4. Foundation — Virtualizer

- [x] 4.1 Create `components/virtualizer/` directory with types, barrel export.
      Virtualizer has no recipe. Types: re-export RAC's Virtualizer props.
- [x] 4.2 Implement `Virtualizer` wrapping/re-exporting RAC `Virtualizer`.
      Re-export `ListLayout`, `GridLayout`, `WaterfallLayout`, `TableLayout`.
- [x] 4.3 Export Virtualizer and all layouts from package public API.
- [x] 4.4 Add Storybook stories: Virtualizer + ListBox (vertical, horizontal),
      Virtualizer + GridList (grid layout, waterfall layout),
      Virtualizer + DataTable (table layout), Virtualizer + Tree (list layout).
      Play functions verifying keyboard nav works across virtualized items.
- [x] 4.5 Add `virtualizer.docs.spec.tsx` consumer examples.

## 5. Composition stories — cross-primitive

- [ ] 5.1 Add story: Autocomplete + Virtualizer + ListBox (filtered virtualized
      list).
- [ ] 5.2 Add story: Autocomplete + Virtualizer + GridList (filtered virtualized
      grid).
- [ ] 5.3 Add story: Virtualizer(WaterfallLayout) + GridList + dragAndDropHooks
      (D&D resizable masonry grid).
- [ ] 5.4 Add story: Autocomplete + ListBox + dragAndDropHooks (sortable list
      with search).
- [ ] 5.5 Add story: Transfer List — two ListBox instances with
      dragAndDropHooks.

## 6. ComboBox rewrite

- [ ] 6.1 **DEFERRED (Phase 2):** Integrate Autocomplete into ComboBox.Root.
      The internal rewrite requires careful migration of ~1587 lines including
      async debouncing, custom option creation, selection sync, and collection
      population detection. Deferred to avoid breaking all existing consumers.
- [ ] 6.2 **DEFERRED (Phase 2):** Make `ComboBox.ListBox` and `ComboBox.Option`
      aliases for `ListBox.Root` and `ListBox.Item`.
- [ ] 6.3 **DEFERRED (Phase 2):** Verify all existing ComboBox story tests pass.
- [ ] 6.4 Add ComboBox + Tree story: hierarchical suggestions in popover.
- [ ] 6.5 Add ComboBox + GridList story: grid-based suggestions in popover.
- [ ] 6.6 Add ComboBox + Virtualizer + ListBox story: virtualized dropdown with
      10,000+ items.
- [ ] 6.7 Verify async loading, custom options, multi-select/TagGroup, sections,
      controlled/uncontrolled modes, validation, form integration all work.

## 7. Select rewrite

- [ ] 7.1 **DEFERRED (Phase 2):** Refactor `Select.Options` to compose the
      standalone ListBox internally.
- [ ] 7.2 Verify all existing Select story tests pass. Fix any regressions.
- [ ] 7.3 Add Searchable Select story: Autocomplete + SearchField inside
      Select.Popover wrapping Select.Options.
- [ ] 7.4 Add Virtualized Select story: Virtualizer wrapping Select.Options
      inside Select.Popover.

## 8. DataTable + Tree — Virtualizer support

- [ ] 8.1 Add DataTable + Virtualizer(TableLayout) story with 1000+ rows. Play
      function verifying scroll, selection, sorting work.
- [ ] 8.2 Add DataTable + Autocomplete story for filterable table.
- [ ] 8.3 Add Tree + Virtualizer(ListLayout) story with large tree. Play
      function verifying expand/collapse and keyboard nav.
- [ ] 8.4 Add Tree + Autocomplete story for filterable tree.

## 9. DraggableList deprecation

- [x] 9.1 Add runtime deprecation warning to DraggableList.Root (console.warn
      on first render, pointing to GridList + dragAndDropHooks).
- [x] 9.2 Add `@deprecated` JSDoc to all DraggableList types and components.
- [x] 9.3 Write migration guide documenting the DraggableList → GridList
      transition with before/after code examples.

## 10. Documentation

- [ ] 10.1 Write ListBox `.dev.mdx` and `.mdx` documentation.
- [ ] 10.2 Write GridList `.dev.mdx` and `.mdx` documentation.
- [ ] 10.3 Write Autocomplete `.dev.mdx` and `.mdx` documentation.
- [ ] 10.4 Write Virtualizer `.dev.mdx` and `.mdx` documentation.
- [ ] 10.5 Update ComboBox documentation with Tree and GridList collection
      examples, virtualization example.
- [ ] 10.6 Update Select documentation with searchable select and virtualization
      examples.

## 11. Verification

- [ ] 11.1 `pnpm typecheck:strict` passes with no errors.
- [ ] 11.2 `pnpm lint` passes.
- [ ] 11.3 `pnpm test` — all existing tests pass (no regressions).
- [ ] 11.4 `pnpm test` — all new stories pass.
- [ ] 11.5 `pnpm build` succeeds. All new components exported from published
      entry.
- [ ] 11.6 `pnpm check:package-shape` passes — types resolve correctly for
      all new exports.
- [ ] 11.7 `pnpm check:bundle-size` — verify new components are tree-shakeable
      and don't inflate the base bundle for consumers who don't import them.

## 12. Branch setup — nimbus-4.0

- [x] 12.1 Create `nimbus-4.0` branch from `main`.
- [x] 12.2 Merge SSR branch (`origin/bw/ssr-goal-experiment`) into nimbus-4.0.
- [x] 12.3 Merge theming branch (`origin/bw/themeing-goal-experiment`) into
      nimbus-4.0.
- [x] 12.4 Merge Tree branch (`origin/FEC-985-create-tree-component`) into
      nimbus-4.0.
- [x] 12.5 Resolve any merge conflicts. Verify `pnpm build` succeeds.

## 13. Categories app — scaffold

- [x] 13.1 Create `apps/categories-app/` with Vite + React + TypeScript.
      Add to pnpm workspace. Add nimbus, nimbus-tokens, nimbus-icons as
      workspace deps.
- [x] 13.2 Set up commercetools GraphQL client (Apollo or urql). Configure
      auth (API client credentials via env vars). Add ct GraphQL codegen
      for typed queries.
- [x] 13.3 Create app shell: NimbusProvider, theme toggle (theming branch),
      top bar with search, router (react-router).

## 14. Categories app — category tree sidebar

- [x] 14.1 Query ct Categories API (GraphQL) — fetch full category tree with
      parent/child relationships, names, slugs.
- [x] 14.2 Build category tree data → Tree component items. Render in
      Splitter.Aside with Autocomplete + SearchField for filtering.
- [x] 14.3 Virtualize the tree with Virtualizer(ListLayout) for large catalogs.
- [x] 14.4 Add dragAndDropHooks for category reordering (updates orderHint
      via ct Change OrderHint update action).
- [x] 14.5 Wire tree selection → detail Region in Splitter.Main.

## 15. Categories app — detail pane

- [x] 15.1 Render selected category detail in Region inside Splitter.Main.
      Show name, slug, description, externalId, parent, metaTitle,
      metaDescription.
- [x] 15.2 Inline editing: click field to edit. Name, slug, description are
      text fields. Parent uses Tree ComboBox with hierarchical autosuggest
      (session-weighted ordering, toggle to hide suggestions).
- [x] 15.3 Save edits via ct Update Category mutations (Change Name, Change
      Slug, Set Description, Change Parent).

## 16. Categories app — product assignment

- [ ] 16.1 Query products assigned to selected category (ct
      productProjectionSearch with category filter).
- [ ] 16.2 Render assigned products as Virtualizer(WaterfallLayout) + GridList
      showing product images. D&D to reorder display order.
- [ ] 16.3 Add product assignment Transfer List: two ListBoxes
      (available ↔ assigned) with dragAndDropHooks + Autocomplete search
      on the available side (hits ct Product Search).

## 17. Categories app — command palette + polish

- [ ] 17.1 Global ⌘K command palette: Dialog + Autocomplete + Menu. Searches
      categories by name (ct category query). Actions: jump to category,
      create new, delete.
- [ ] 17.2 Theme toggle in top bar (light/dark via theming branch).
- [ ] 17.3 Keyboard accessibility audit — all interactions reachable via
      keyboard. Focus management on tree selection, detail pane transitions.
- [ ] 17.4 SSR: server-render the app shell (top bar, empty splitter) via
      SSR branch patterns.
