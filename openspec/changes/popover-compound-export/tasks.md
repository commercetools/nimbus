# Tasks: Popover Compound Component Export

Order follows `design.md` — Migration Plan: recipe first, then parts, then the
public export, then consumers. Stories arrive early (2.4) with a render-only
story so the parts can be driven from a real harness, and grow play functions in
group 5 as behavior lands.

Iterate with `pnpm --filter @commercetools/nimbus typecheck:dev` and
`pnpm test:dev` (both resolve to source, no build needed).

## 1. Recipe and theme registration

- [x] 1.1 Convert `popover/popover.recipe.tsx` from `defineRecipe` to
      `defineSlotRecipe` with slots `root`, `trigger`, `content`, `dialog`
- [x] 1.2 Move the existing flat base styles onto the `content` slot, replacing
      `bg: "white"` with the semantic `bg` token and keeping
      `borderRadius: "200"`, `boxShadow: "5"`, `padding: "400"`, `zIndex: 1`
- [x] 1.3 Add `&[data-entering]` / `&[data-exiting]` fade+scale animations to the
      `content` slot, matching `menu.recipe.tsx`
- [x] 1.4 Remove `nimbusPopover` from `theme/recipes/index.ts` (import + map
      entry)
- [x] 1.5 Register `nimbusPopover` in `theme/slot-recipes/index.ts`, keeping
      alphabetical ordering
- [x] 1.6 Confirm the theme still builds and `nimbusPopover` resolves as a slot
      recipe (`pnpm --filter @commercetools/nimbus build-theme-typings`)

## 2. Types, slots, and scaffolding

- [x] 2.1 Rewrite `popover.slots.tsx` to use `createSlotRecipeContext({ key: "nimbusPopover" })`,
      exporting `PopoverRootSlot` (via `withProvider`, `"div"`, `"root"`),
      `PopoverTriggerSlot`, `PopoverContentSlot`, `PopoverDialogSlot`
- [x] 2.2 Rewrite `popover.types.ts` for the four-layer architecture: recipe
      props, slot props, then `PopoverRootProps` / `PopoverTriggerProps` /
      `PopoverContentProps` with JSDoc on every public prop
- [x] 2.3 Create `popover/components/` with an `index.ts` barrel
- [x] 2.4 Create `popover.stories.tsx` with a single render-only `Base` story to
      drive development from a real harness

## 3. Component parts

- [x] 3.1 Implement `components/popover.root.tsx` as
      `<PopoverRootSlot asChild><RaDialogTrigger>`, splitting recipe variants
      then extracting style props; set `displayName = "Popover.Root"`
- [x] 3.2 Verify Root mounts no DOM element of its own (inspect the rendered
      tree in the Base story — the trigger must be a direct child of its parent)
- [x] 3.3 Implement `components/popover.trigger.tsx` as
      `<PopoverTriggerSlot asChild><RaButton>` with an `asChild` passthrough,
      matching `menu.trigger.tsx`; set `displayName = "Popover.Trigger"`
- [x] 3.4 Implement `components/popover.content.tsx` as
      `<PopoverContentSlot asChild><RaPopover><PopoverDialogSlot asChild><RaDialog>`,
      forwarding `placement`, `offset`, `crossOffset`, `shouldFlip` and
      `isNonModal` to `RaPopover`; set `displayName = "Popover.Content"`
- [x] 3.5 Forward a function child through `Popover.Content` to the dialog's
      render prop so `{({ close }) => …}` works for programmatic close
- [x] 3.6 Export all three parts from `components/index.ts`

## 4. Namespace and public export

- [x] 4.1 Rewrite `popover.tsx` as exports only — `Popover = { Root, Trigger, Content }`
      with `Root` first, one JSDoc block with an `@example` per part, importing
      from the `./components` barrel
- [x] 4.2 Add the `_PopoverRoot` / `_PopoverTrigger` / `_PopoverContent`
      internal exports for react-docgen, following `dialog.tsx`
- [x] 4.3 Update `popover/index.ts` to export the namespace and its types
- [x] 4.4 Add `export * from "./popover"` to `components/index.ts` in
      alphabetical position
- [x] 4.5 Confirm `Popover` and its part prop types are importable from the
      package root

## 5. Behavior tests (play functions)

- [x] 5.1 Add a play function asserting click-to-open: pressing the trigger
      reveals the dialog (queried from `document.body`, since content is
      portaled)
- [x] 5.2 Add a play function asserting Escape closes the popover and focus
      returns to the trigger
- [x] 5.3 Add a play function asserting an outside press dismisses the popover
- [x] 5.4 Add a play function asserting press-to-toggle: a second press on an
      open trigger closes it
- [x] 5.5 Add a story covering controlled mode (`isOpen` + `onOpenChange`) and
      assert `onOpenChange` fires without the popover self-closing
- [x] 5.6 Add a story covering interactive content (a focusable input inside the
      popover) and assert typing does not dismiss it
- [x] 5.7 Add a story with a custom `asChild` trigger and assert no nested
      interactive element is produced
- [x] 5.8 Confirm ARIA wiring in a play function: `role="dialog"` present,
      trigger carries `aria-expanded` and `aria-haspopup="dialog"`
- [x] 5.9 Add a story using a function child with a close button and assert
      calling `close` dismisses the popover and returns focus to the trigger
- [x] 5.10 Add a story with `isNonModal` and assert an element outside the
      popover is reachable, contrasting it with the contained-focus default

## 6. Consumer migration

- [x] 6.1 Add explicit `zIndex: 1` to the `popover` slot in
      `combobox/combobox.recipe.ts` (preserves the one property ComboBox
      inherited from the old flat recipe)
- [x] 6.2 Change `combobox/components/combobox.popover.tsx` to import `Popover`
      from `react-aria-components` directly, matching `select.root.tsx`
- [x] 6.3 Update the JSDoc in `combobox.popover.tsx` — it currently states the
      component "Uses Nimbus Popover component"
- [x] 6.4 Migrate `localized-field/components/localized-field.root.tsx:236` to
      `<Popover.Content padding={0}>`, removing its hand-rolled `RaDialog` and
      preserving `LocalizedFieldInfoDialogSlot` styling on the content children
- [x] 6.5 Run the ComboBox story suite and confirm it passes unchanged
- [x] 6.6 Run the LocalizedField story suite and confirm it passes unchanged
- [x] 6.7 Visually compare both consumers before/after in Storybook (ComboBox
      dropdown surface + stacking; LocalizedField info popover)

## 7. Documentation

- [x] 7.1 Write `popover.mdx` with frontmatter — `id: Components-Popover`,
      `exportName: Popover`, `lifecycleState: Beta`,
      `menu: [Components, Feedback, Popover]` — and overview content
- [x] 7.2 Write `popover.dev.mdx` (engineering guide) via the
      `writing-developer-documentation` skill
- [x] 7.3 Write `popover.docs.spec.tsx` with copy-ready consumer test examples
- [x] 7.4 Write `popover.a11y.mdx` covering keyboard interaction, the
      dialog-in-popover pattern, and accessible-name guidance
- [x] 7.5 Write `popover.guidelines.mdx` covering Popover vs Tooltip vs Dialog
      vs Drawer
- [x] 7.6 Confirm the page renders in the docs site and appears under
      Components > Feedback

## 8. Spec correction and release

- [x] 8.1 Fix the header metadata in `openspec/specs/nimbus-popover/spec.md`
      (drop the "i18n: 1 message (closePopover)" line)
- [x] 8.2 Correct the Overview and Purpose prose in
      `openspec/specs/nimbus-popover/spec.md`, which describes the component as
      non-modal with non-trapped focus — the opposite of React Aria's default
      (delta specs cannot change an existing capability's Purpose, so this is a
      direct edit)
- [x] 8.3 Add a changeset — minor bump for `@commercetools/nimbus`, written for
      consumers per `docs/changeset-conventions.md`

## 9. Verification

- [x] 9.1 `pnpm --filter @commercetools/nimbus typecheck:dev` clean
- [x] 9.2 `pnpm test:dev` clean for the popover, combobox and localized-field
      suites
- [x] 9.3 `pnpm lint` clean
- [x] 9.4 `pnpm --filter @commercetools/nimbus build` then
      `pnpm typecheck:strict` clean (validates the published type surface)
- [x] 9.5 `pnpm test:storybook` clean against the built bundle
- [x] 9.6 `pnpm exec openspec validate --strict` clean for this change
- [ ] 9.7 Commit per `docs/git-conventions.md` with the `FEC-1167` footer, push,
      and open a PR; review Chromatic diffs for the two migrated consumers
