# Tasks: Add the Item and ItemGroup components

> **API note:** This change delivers **two peer components**:
>
> - **`Item`** (compound) — `Item.Root` (publishes the `nimbusItem` context) +
>   `.Header`, `.Media`, `.Content` (wrapping `.Title` / `.Description`),
>   `.Actions`, `.Footer`. Interactivity is **link-upgrade only**: `Item.Root`
>   is a `<div>` that becomes an `<a>` (via the `react-aria` `useLink` hook)
>   when `href` is present. No button mode, no selection; row actions are nested
>   `Button`s in `.Actions`, and a capture-phase guard on the link root stops an
>   action click from navigating the row.
> - **`ItemGroup`** (compound, standalone peer) — `ItemGroup.Root` (vertical
>   stack of rows) + `ItemGroup.Separator`. It wraps `Item.Root` rows (it is a
>   parent, not a child), so it is its own component/folder, not `Item.Group`.

## 1. Scaffold the `item/` component — DONE

- [x] 1.1 Create `packages/nimbus/src/components/item/` mirroring `card/`.
- [x] 1.2 `item.tsx` compound namespace `Item` (Root/Header/Media/Content/Title/
      Description/Actions/Footer) + JSDoc + underscore raw exports.
- [x] 1.3 Per-part files under `components/` + `components/index.ts`.
- [x] 1.4 Barrel `index.ts`; exported from `components/index.ts` → package barrel.

## 2. Failing Storybook tests first (TDD) — DONE

- [x] 2.1–2.4 Authored `item.stories.tsx` play functions (static row; header/
      footer; variant×size; media variants; link-mode `<a>` + keyboard; actions
      independently operable without navigation).
- [x] 2.5 Confirmed red against the shells before implementing.

## 3–6. Implement `item/` — DONE

- [x] 3. Types (`item.types.ts`) — slot + public props; Root link surface;
      Media `variant`.
- [x] 4. Recipe (`item.recipe.ts`) — `defineSlotRecipe` `nimbusItem`, 8 slots,
      `variant` (`plain`/`outline`/`subtle`) + `size` (`xs`/`sm`/`md`) on root,
      media `variant` via `data-variant`; registered in
      `theme/slot-recipes/index.ts`; theme typings regenerated.
- [x] 5. Slots (`item.slots.tsx`) — `withProvider` root, `withContext` rest.
- [x] 6. Parts + link-upgrade (`item.root.tsx`) — `useLink` on `href`; static
      `<div>` otherwise; capture-phase guard stops action-click navigation.

## 7. Scaffold + implement the `item-group/` component — DONE

- [x] 7.1 Create `packages/nimbus/src/components/item-group/` (own folder).
- [x] 7.2 `item-group.tsx` compound namespace `ItemGroup` (Root/Separator) +
      raw exports; `item-group.types.ts`; `item-group.slots.tsx`
      (`withProvider` root, `withContext` separator).
- [x] 7.3 Recipe `item-group.recipe.ts` — `defineSlotRecipe` `nimbusItemGroup`
      (slots `root`, `separator`); `ItemGroup.Root` is a plain stack (no
      `role="list"`); `ItemGroup.Separator` renders `role="separator"`.
      Registered as `nimbusItemGroup`; theme typings regenerated.
- [x] 7.4 `item-group.stories.tsx` play functions (grouped rows + separators;
      grouped link rows); barrel + package-barrel export.

## 8. Documentation — DONE

- [x] 8.1 `item/` docs: `item.mdx`, `item.dev.mdx`, `item.a11y.mdx`,
      `item.guidelines.mdx`, `item.docs.spec.tsx`.
- [x] 8.2 `item-group/` docs: `item-group.mdx`, `item-group.dev.mdx`,
      `item-group.a11y.mdx`, `item-group.guidelines.mdx`,
      `item-group.docs.spec.tsx`.

## 9. Figma Code Connect — DEFERRED

- [ ] 9.1 `*.figma.tsx` deferred until a Figma design source exists (these
      components were designed from the shadcn React Aria reference, not Figma).

## 10. Verification

- [x] 10.1 `typecheck:dev` — 0 errors.
- [x] 10.2 `item` story tests pass (7/7) against source; `item-group` (2/2);
      automatic axe checks pass; browser-stable across repeated runs.
- [x] 10.3 `pnpm lint` (eslint) on both folders incl. docs — no errors.
- [x] 10.4 Built-surface check: `pnpm --filter @commercetools/nimbus build`
      succeeded; `pnpm test:storybook` passed against `dist` (item 7/7,
      item-group 2/2); `item.docs.spec`/`item-group.docs.spec` pass (9 total).
- [x] 10.5 Changeset added (`.changeset/add-item-component.md`, lifecycle
      **Experimental**) describing `Item` and `ItemGroup` for consumers.
