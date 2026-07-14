> **Scope note:** DropZone is an MVP — a thin, styled React Aria `DropZone`
> wrapper that adds the drag-and-drop + accessibility mechanics plus one minimal
> **default state** (upload icon + a localized `<Text slot="label">`, shown only
> when no children are passed; children replace it wholesale). The 3-slot content
> model (per-slot icon/title/description overrides + slot detection/fragment
> flattening), the `size` variant, the `aria-labelledby` DOM workaround +
> accessible-name warning, and disabled-context propagation were deliberately
> cut. The recipe is a standard `defineRecipe` (registered in
> `theme/recipes/index.ts`), not a slot recipe.

## 1. Scaffold component structure

- [x] 1.1 Create `packages/nimbus/src/components/drop-zone/` with the component
      file set: `drop-zone.tsx`, `drop-zone.types.ts`, `drop-zone.recipe.ts`,
      `drop-zone.slots.tsx`, `drop-zone.stories.tsx`, `index.ts`, and a
      `utils/` drop-event test helper.
- [x] 1.2 Add documentation/test files: `drop-zone.mdx`, `drop-zone.dev.mdx`,
      `drop-zone.guidelines.mdx`, `drop-zone.a11y.mdx`, `drop-zone.docs.spec.tsx`,
      `drop-zone.figma.tsx`.
- [x] 1.3 Export DropZone from `packages/nimbus/src/components/index.ts` and
      register the `nimbusDropZone` standard recipe in
      `packages/nimbus/src/theme/recipes/index.ts`.

## 2. Storybook tests (TDD)

- [x] 2.1 Add a drop-event test helper (`makeDataTransfer`/`fireDrop`) that
      dispatches synthetic `DragEvent`s with a mocked `DataTransfer`, since the
      runner cannot fire native OS drag-and-drop.
- [x] 2.2 Write play functions (failing first): idle renders the dashed border
      (data-attr/class assertion); a drop fires `onDrop`; drag-enter sets
      `data-drop-target` and exit clears it; `getDropOperation` `"cancel"` does
      **not** set `data-drop-target`; empty drop handled; keyboard focusable +
      focus ring; `isDisabled` rejects drops; accessible name via `aria-label`;
      a composed `FileTrigger` renders inside and opens the picker.
- [x] 2.3 Run `pnpm test:storybook:dev` and confirm the new tests fail
      behaviorally (TDD baseline).

## 3. Implementation

- [x] 3.1 `drop-zone.types.ts`: derive from RAC `DropZoneProps` (omit
      `className`/`style`), add `children` and `ref: Ref<HTMLDivElement>` and
      Nimbus style props; re-export `DropEvent`, `DropOperation`, `DragTypes`. No
      `size`, no slot props, no file-selection props.
- [x] 3.2 `drop-zone.recipe.ts`: standard `defineRecipe` for `nimbusDropZone` —
      dashed idle border, `&[data-hovered]`, `&[data-focus-visible]` focus ring,
      `&[data-drop-target='true']` dragOver highlight (not color-only),
      `&[data-disabled]` disabled layer + `pointerEvents: none`; ≥3:1 non-text
      contrast, `forced-colors` visible, `prefers-reduced-motion` respected.
- [x] 3.3 `drop-zone.slots.tsx`: single root slot via
      `createRecipeContext({ key: "nimbusDropZone" })`, bound so `RaDropZone` is
      the styled root via `asChild`.
- [x] 3.4 `drop-zone.tsx`: render `RaDropZone` as the styled root; when there are
      no children, render the default state (upload `Icon` + localized
      `<Text slot="label">` from `Nimbus.DropZone.defaultLabel`, which supplies
      the accessible name); otherwise render `children` as-is (all-or-nothing, no
      slot detection). Forward `onDrop`/`getDropOperation`/`onDropEnter/Exit/Move/
      Activate`/`isDisabled` and `aria-label`/`aria-labelledby` (RAC-native
      labelling; explicit label wins over the default); forward `ref`; support
      style props. Recreate `drop-zone.i18n.ts`/`.messages.ts` with the single
      `defaultLabel` message and run `pnpm extract-intl`.
- [x] 3.5 Iterate until all `drop-zone.stories.tsx` play functions pass.
- [x] 3.6 Docs tabs (Overview, Guidelines, Implementation, Accessibility) +
      `drop-zone.docs.spec.tsx` + Figma Code Connect. Implementation tab includes
      the `onDrop` → `await item.getFile()` example, a shared
      `handleFiles(files: File[])` helper for drop + composed FileTrigger's
      `onSelect`, a `getDropOperation` guard, and the FileTrigger composition;
      Accessibility tab explains RAC-native labelling and keyboard support.

## 4. Validation

- [x] 4.1 `pnpm --filter @commercetools/nimbus typecheck` → 0 errors.
- [x] 4.2 `pnpm exec eslint packages/nimbus/src/components/drop-zone` → clean.
- [x] 4.3 `pnpm test:storybook:dev …/drop-zone.stories.tsx` → 8/8 pass.
- [x] 4.4 `pnpm test:unit …/drop-zone.docs.spec.tsx` → 6/6 pass.
- [x] 4.5 DropZone exported from the barrel; `nimbusDropZone` registered in
      `theme/recipes/index.ts` and removed from `slot-recipes/index.ts`; exactly
      one `Nimbus.DropZone.defaultLabel` i18n key; no slot-recipe references.
- [x] 4.7 Visually verified in Storybook (Playwright): the dashed border renders
      in the idle/default state (`borderWidth: "{sizes.50}"`), with the default
      icon + label. Border-width regression (bare `"25"` → invalid CSS) fixed.
- [x] 4.6 Changeset (`.changeset/add-drop-zone.md`) describes the MVP.

## 5. Post-review refinements

- [x] 5.1 `drop-zone.recipe.ts`: remove the misleading `cursor: pointer` from the
      zone base (the zone is not itself a click-to-upload target — that is the
      composed `FileTrigger`'s role) and disable text selection on the drop
      target (`userSelect: "none"`) so dragging content over the zone does not
      select its text.
- [x] 5.2 Add a play-function assertion covering `user-select: none` on the drop
      target.
- [x] 5.3 Correct the docs lifecycle badge: `drop-zone.mdx` `lifecycleState`
      Experimental → Beta.
- [x] 5.4 Rewrite `.changeset/add-drop-zone.md` to be short and consumer-focused
      per `docs/changeset-conventions.md` (drop the RAC-internals play-by-play).
- [x] 5.5 Re-run typecheck, eslint, and the DropZone story tests.
