## 1. Spikes (resolve the open questions in design.md)

Results are recorded in `design.md` under "Spike results".

Use a throwaway story in the component folder; delete it when the group is done.
Write each result into `design.md` (Open Questions → Decisions) before moving
on.

- [x] 1.1 `render` pass-through: render React Aria `GridList` through Nimbus
      `SimpleGrid` with the `render` prop. **Done when:** the result is
      recorded: the ref reaches the grid element, React Aria's role, event and
      `data-*` props are on the DOM element, and keyboard focus works. If it
      fails, `design.md` D2 is updated with the fallback (plain element with
      Chakra style props).
- [x] 1.2 `columns` vs `minChildWidth` precedence when both are set. **Done
      when:** the winner is recorded and the types / docs plan for the conflict
      is written in `design.md`.
- [x] 1.3 2D arrow-key behavior: with `layout="grid"`, test ArrowRight, ArrowLeft,
      ArrowUp and ArrowDown at three container widths (`columns` 1, 3, and
      `minChildWidth` auto-fill), including the last row and a partial row.
      **Done when:** observed focus moves are recorded in `design.md`. If any
      result is wrong, the supported layout is narrowed and the spec scenario
      "Arrow keys in a grid" is updated.
- [x] 1.4 Drag handle label: check whether React Aria gives `slot="drag"` a
      default accessible name, in the browser accessibility tree. **Done when:**
      the result is recorded and the i18n key list (task 4.3) is confirmed.

## 2. Scaffold component structure

- [x] 2.1 Create `packages/nimbus/src/components/grid-list/` with shell files:
      `grid-list.tsx` (exported empty `GridList` + `displayName`),
      `grid-list.types.ts`, `grid-list.recipe.ts`, `grid-list.slots.tsx`,
      `grid-list.i18n.ts`, `grid-list.stories.tsx`, `components/index.ts`,
      `components/grid-list.root.tsx`, `components/grid-list.item.tsx`,
      `components/grid-list.context.ts` and `index.ts` (barrel exporting
      component + types). **Done when:** the files exist, `index.ts` re-exports
      `grid-list` and `grid-list.types`, and
      `pnpm --filter @commercetools/nimbus typecheck:dev` passes.
- [x] 2.2 Register `nimbusGridList: gridListSlotRecipe` in
      `packages/nimbus/src/theme/slot-recipes/index.ts` and run
      `pnpm --filter @commercetools/nimbus build-theme-typings`. **Done when:**
      `SlotRecipeProps<"nimbusGridList">` resolves in types.

## 3. Failing tests first (TDD)

- [x] 3.1 Write story play functions in `grid-list.stories.tsx` covering every
      scenario in `specs/nimbus-grid-list/spec.md`: roles (`grid`, `row`) and
      accessible name; free content; single and multiple selection with
      `onSelectionChange`; disabled item; selection versus `onAction`; checkbox
      on Root, Item override and not shown in single mode; handle with
      `dragAndDropHooks`, without hooks, and order (handle, checkbox, children);
      keyboard drag-and-drop reorder with `onReorder` and drop indicator /
      `data-dragging`; ArrowDown in stack; ArrowRight / ArrowDown in a 3-column
      grid at a fixed width, the grid edges (no cell below stays, row end wraps,
      first row ArrowUp stays) and the column count following the width with
      `minChildWidth` (spike 1.3 results); `keyboardNavigationBehavior="tab"` with a text
      field; focus ring; responsive `columns` at two viewport widths; stack
      with `columns`; `gap` override of `size`; virtualized list story (`ListLayout`);
      `size` default, per-size drag handle and a constant checkbox size; selected style visible
      without a container; default and custom empty state; style props and ref;
      German drag handle name ("Mountain ziehen").
      **Done when:**
      `pnpm test:storybook:dev packages/nimbus/src/components/grid-list/grid-list.stories.tsx`
      runs and the tests fail for the expected reason (missing implementation,
      not syntax errors).

## 4. Implementation

- [x] 4.1 Implement `grid-list.types.ts` (skill: `writing-types`): recipe props
      (`size`), slot props, `GridListRootProps<T>` (`RaGridListProps<T>` + `size`,
      `columns`, `minChildWidth`, `gap`, `showSelectionCheckbox`,
      `showDragHandle`) and `GridListItemProps`. `columns` and `minChildWidth`
      are a union (one or the other, design D9). JSDoc on every public prop
      with defaults. No span props. **Done when:** passing a span prop, or both
      `columns` and `minChildWidth`, is a type error (checked with
      `@ts-expect-error` in a story), and `typecheck:dev` passes.
- [x] 4.2 Implement `grid-list.recipe.ts` (skill: `writing-recipes`): slots
      `root`, `item`, `itemContent`, `emptyState` (the built-in handle and
      checkbox and the drop indicator are styled through `[slot=...]` and
      `[data-drop-target]` selectors);
      sizes `sm` / `md` / `lg` (item padding, default gap, drag handle size;
      the built-in checkbox keeps `Checkbox` size `md`); states hover, focus-visible,
      pressed, selected, disabled, dragging, drop target; corner radius; no
      border or background at rest; transitions off under
      `prefers-reduced-motion`; grid rules that do not block a consumer
      `Virtualizer`. **Done when:** only design tokens are used and the
      selected state meets WCAG 2.1 AA contrast in the stories.
- [x] 4.3 Implement `grid-list.i18n.ts` (skill: `writing-i18n`): one key,
      `Nimbus.GridList.emptyMessage` (the drag handle label comes from React Aria,
      spike 1.4), then run `pnpm extract-intl`. **Done when:** the generated
      messages file exists and the default empty-state story passes.
- [x] 4.4 Implement `grid-list.slots.tsx` (skill: `writing-slots`) with
      `createSlotRecipeContext({ key: "nimbusGridList" })`. **Done when:** one
      slot component per recipe slot, typed with the slot props.
- [x] 4.5 Implement `components/grid-list.context.ts`: Root defaults for
      `showSelectionCheckbox` and `showDragHandle`. **Done when:** Item reads the
      Root value and an Item value overrides it.
- [x] 4.6 Implement `components/grid-list.root.tsx` and
      `components/grid-list.item.tsx` and `grid-list.tsx` (skill:
      `writing-main-component`): Root on React Aria `GridList` rendered through
      `SimpleGrid` (per spike 1.1), recipe props split and style props
      extracted, `layout="stack"` → one column, default empty state; Item on
      `GridListItem` with state-dependent checkbox and handle in the fixed
      leading order. Modular Chakra imports only. `displayName` on all parts.
      **Done when:** all play functions from 3.1 pass.
- [x] 4.7 Export from `packages/nimbus/src/components/index.ts`. **Done when:**
      `import { GridList } from "@commercetools/nimbus"` works in the stories.
- [x] 4.8 Developer documentation (skill: `writing-developer-documentation`):
      `grid-list.mdx`, `grid-list.dev.mdx` and `grid-list.docs.spec.tsx`
      (consumer examples: single and multiple selection, built-ins and the
      override rule, drag-and-drop with `useDragAndDrop`, responsive columns,
      Virtualizer, `onAction` versus selection, `keyboardNavigationBehavior`,
      `textValue`). **Done when:** `grid-list.docs.spec.tsx` passes and each
      example above exists.
- [x] 4.9 Designer documentation (skill: `writing-designer-documentation`):
      `grid-list.guidelines.mdx` (decision line: `ListBox` to pick options,
      `DraggableList` for a ready-made reorder list, `GridList` for rich or 2D
      items; uniform cells; when to enable the built-ins) and
      `grid-list.a11y.mdx` (roles, naming, `textValue`, selection versus action,
      tab navigation for inputs, drag handle label, what Nimbus cannot
      guarantee for consumer content). **Done when:** both files exist and match
      the implemented API.
- [x] 4.10 Add a minor changeset per `docs/changeset-conventions.md`, written for
      consumers. **Done when:** `pnpm changeset:status` lists
      `@commercetools/nimbus` minor.
- [x] 4.11 Run lint and type checks. **Done when:** `pnpm lint` and
      `pnpm --filter @commercetools/nimbus typecheck:dev` report no errors.
- [ ] 4.12 Run the full test suite. **Done when:** `pnpm test:dev` passes.
      **Status (not ticked):** after building packages, docs and MCP data, `pnpm test:dev` fails 1 to 2 of 283 test files per run, and none are GridList (all 32 GridList stories and 10 docs-spec tests pass every time). `chat-message-list` > Keyboard Jump Keeps Focus failed in 3 of 4 full runs but passed 2 of 3 reruns of that file alone with my change, and 1 of 1 without my registration edits. `data-table` docs spec failed once in a full run and passes alone (44 of 44). Both look load-sensitive and unrelated to GridList. A fully green run has not been seen. Before the builds, 9 `nimbus-mcp` specs failed for missing generated data.

## 5. Instrument for Chromatic (VRT)

- [x] 5.1 Audit the finished stories per `docs/chromatic-visual-testing.md` and
      opt each real visual state in with `tags: ["vrt"]` plus
      `parameters: { chromatic: { disableSnapshot: false } }`. Derive the list
      from the **recipe** (sizes, states, built-ins, layouts), not from story
      names. **Done when:**
      - Every state the recipe paints differently is visible in some
        snapshotted frame: a `SmokeTest` matrix of size × built-ins
        (none / checkbox / handle / both) with selected and disabled items, and
        a showcase for stack versus grid with the same items.
      - States a matrix cannot hold have their own snapshotted story:
        `Focused` (item focus ring), `Dragging` and `DropTarget`, and the empty
        state.
      - Behavior-only stories (keyboard, selection callbacks, virtualized
        scrolling) stay un-snapshotted, and any visual state deliberately not
        snapshotted names where its visual is covered.
      - Snapshotted stories are deterministic: fixed items and container widths,
        no live data, no stray focus ring, drag states set up and awaited in the
        play function, transitions finished or disabled.

## 6. Validation

- [x] 6.1 `pnpm --filter @commercetools/nimbus typecheck:dev` passes, then after
      `pnpm build:packages`, `pnpm typecheck:strict` passes.
      **Result:** `typecheck:dev` passes, and `typecheck:strict` passes after `pnpm build:packages` (all packages).
- [x] 6.2
      `pnpm test:storybook:dev packages/nimbus/src/components/grid-list/grid-list.stories.tsx`
      passes and `grid-list.docs.spec.tsx` passes.
- [x] 6.3 `pnpm lint` passes.
- [x] 6.4 Documentation complete: `.mdx`, `.dev.mdx`, `.guidelines.mdx`,
      `.a11y.mdx` and `.docs.spec.tsx` exist and match the implemented API.
- [x] 6.5 `GridList` and its types are exported from the `packages/nimbus`
      barrel.
- [x] 6.6 VRT instrumented: at least one story opts in, per task 5.1.
- [x] 6.7 Run nimbus-reviewer on the component folder; resolve all MUST-level
      findings.
      **Result:** no MUST-level findings. SHOULD findings fixed: transition tokens, drop edge in stack and right-to-left (new `DragInProgressRtl` story), drag handle size assertion, checkbox accessible name assertion, unverified link claim and internal note removed from the docs. Left as is (NIT): ref held on `globalThis` in `StylePropsAndRef`; PropsTable output for `columns` / `minChildWidth` not checked (docs build not run).
- [x] 6.8 `pnpm openspec validate add-grid-list-component --strict` passes.
