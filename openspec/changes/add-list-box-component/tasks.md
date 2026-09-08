## 1. Scaffolding & types

- [x] 1.1 Create `packages/nimbus/src/components/list-box/` mirroring the `select/` layout (recipe, slots, types, main, `components/`, i18n, stories, docs)
- [x] 1.2 Write `list-box.types.ts` following the four-layer type architecture: recipe variant props → slot props → helper types → public props. Public props: `ListBoxRootProps<T>` (extends React Aria `ListBoxProps<T>` + recipe variants `size`, `variant`, `density`), `ListBoxItemProps<T>`, `ListBoxSectionProps<T>`. JSDoc on every public prop.

## 2. Recipe, slots & theme registration

- [x] 2.1 Write `list-box.recipe.tsx` as `defineSlotRecipe` with slots: `root`, `item`, `itemIndicator`, `itemLeading`, `itemContent`, `itemTrailing`, `section`, `sectionHeader`, `emptyState`, `loader`
- [x] 2.2 Base styles: `root` card surface copied from `select.recipe.tsx`; item highlight `&[data-selected]`, `&[data-focused]`, focus-visible ring, `&[data-disabled] { layerStyle: disabled }`
- [x] 2.3 Variant `variant`: `card` (surface) vs `plain` (no surface/shadow/maxHeight)
- [x] 2.4 Variant `size`: aligned to the shared Nimbus size scale (`sm`, `md`)
- [x] 2.5 Variant `density`: `comfortable` (default) vs `compact`
- [x] 2.6 Selection affordance: multi-select renders `itemIndicator` checkbox (spread from the Checkbox recipe) and suppresses row highlight via `&[data-selection-mode="multiple"]`; single uses highlight. Targets real slot keys (avoids the `combobox.recipe.ts` no-op gotcha)
- [x] 2.7 Write `list-box.slots.tsx` via `createSlotRecipeContext({ key: "nimbusListBox" })`, one slot component per recipe slot
- [x] 2.8 Register `nimbusListBox: listBoxSlotRecipe` in `theme/slot-recipes/index.ts` and run `build-theme-typings`

## 3. Component implementation

- [x] 3.1 `components/list-box.root.tsx` → `RaListBox`: split recipe variants, forward style + functional props, provide slot context, default localized `renderEmptyState`
- [x] 3.2 `components/list-box.item.tsx` → `RaListBoxItem`: leading/indicator/content/trailing slots; multi-select checkbox from `isSelected` render prop
- [x] 3.3 `components/list-box.section.tsx` → `RaListBoxSection` + `RaHeader`
- [x] 3.4 `components/list-box.load-more.tsx` (styled loader slot via `RaListBoxLoadMoreItem`)
- [x] 3.5 `components/index.ts` and `list-box.tsx` assembling the `ListBox` namespace with `displayName`s

## 4. i18n

- [x] 4.1 `list-box.i18n.ts` + `list-box.messages.ts` with `Nimbus.ListBox.emptyState` ("No options available"); wired to the default empty state; ran `pnpm extract-intl`

## 5. Stories — mechanics (play functions) & visual permutations

- [x] 5.1 Mechanics play functions: single-select replaces; multiple toggles; keyboard Home/ArrowDown/End; type-ahead; Enter selects; disabled not selectable; empty state renders; sections not focusable; controlled sync
- [x] 5.2 Drag-and-drop play (draggable affordance via `dragAndDropHooks`)
- [x] 5.3 Visual-permutation stories: Sizes, Variants (`card`/`plain`), Density, SelectedState, MultipleSelectionVisual, RichContent, WithSections, DisabledItems, EmptyState, Focused, and a SmokeTest grid (size × density × single/multi)
- [x] 5.4 `pnpm test:storybook:dev packages/nimbus/src/components/list-box/list-box.stories.tsx` — 17/17 green

## 6. Documentation

- [x] 6.1 `list-box.mdx` (primary) + `list-box.dev.mdx` (developer docs with live examples)
- [x] 6.2 `list-box.docs.spec.tsx` — copy-ready consumer tests (6/6 green)
- [x] 6.3 `list-box.a11y.mdx` (keyboard map, ARIA) and `list-box.guidelines.mdx` (when to use card vs plain, density, vs Select/ComboBox)

## 7. Registration & release

- [x] 7.1 Export `ListBox` and its public types from `packages/nimbus/src/index.ts` (via `components/index.ts`)
- [x] 7.2 Add a minor changeset per `docs/changeset-conventions.md`

## 8. Verification

- [x] 8.1 `pnpm --filter @commercetools/nimbus typecheck:dev` — clean
- [x] 8.2 `pnpm test:storybook:dev …list-box.stories.tsx` — 17/17 pass
- [x] 8.3 `pnpm lint` (list-box) — clean
- [x] 8.4 `pnpm openspec validate add-list-box-component --strict` — valid
