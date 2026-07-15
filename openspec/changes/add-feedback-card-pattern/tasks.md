## 1. Scaffold structure

- [x] 1.1 Create `packages/nimbus/src/patterns/feedback/feedback-card/` and the
      `components/` subdirectory
- [x] 1.2 Create shell files with exports only (no implementation):
      `feedback-card.tsx`, `feedback-card.types.ts`, `feedback-card.recipe.ts`,
      `feedback-card.slots.tsx`, `feedback-card.stories.tsx`, `index.ts`, and
      `components/{feedback-card.root,feedback-card.content,feedback-card.action}.tsx` +
      `components/index.ts`
- [x] 1.3 Create the category barrel `patterns/feedback/index.ts`
      (`export * from "./feedback-card";`) and add `export * from "./feedback";`
      to `patterns/index.ts`
- [x] 1.4 Verify the package still typechecks with the empty shells
      (`pnpm --filter @commercetools/nimbus typecheck:dev`)

## 2. Failing Storybook tests (TDD — write first, confirm red)

- [x] 2.1 Write `feedback-card.stories.tsx` with
      `title: "patterns/feedback/FeedbackCard"` and a base composition (Content
      = title + subtitle via Nimbus `Heading`/`Text`; Action =
      `<Button onPress={fn()}>Undo</Button>`)
- [x] 2.2 Add **ApproveContext** and **RejectedContext** stories with distinct
      consumer style props; play functions assert title/subtitle text render,
      the action button is present with an accessible name, and `onPress` fires
      on `userEvent.click`
- [x] 2.3 Add **StylePropForwarding** story; play function passes
      `bg`/`border`/`borderRadius`/`padding` to `FeedbackCard.Root` and asserts
      they land on the rendered root element
- [x] 2.4 Add **LayoutContract** story; play function asserts all three slots
      render and the action element follows the content element in DOM order
- [x] 2.5 Run
      `pnpm test:storybook:dev packages/nimbus/src/patterns/feedback/feedback-card/feedback-card.stories.tsx`
      and confirm the tests FAIL (red baseline)

## 3. Implementation (dependency order)

- [x] 3.1 Implement `feedback-card.recipe.ts`: `defineSlotRecipe` with slots
      `["root","content","action"]`, `className: "nimbus-feedback-card"`, base
      layout only (root: flex row + `flexWrap` + `alignItems: center` +
      `justifyContent: space-between` + token gap; content: column,
      `flex: "1 1 auto"`, `minWidth: 0`, token gap; action: flex +
      `alignItems: center` + `flexShrink: 0`). No `variants`/`defaultVariants`
- [x] 3.2 Register the recipe: add `nimbusFeedbackCard: feedbackCardRecipe` to
      `theme/slot-recipes/index.ts`, then run
      `pnpm --filter @commercetools/nimbus build-theme-typings` and confirm
      slot-recipe typings generate
- [x] 3.3 Implement `feedback-card.types.ts`: slot props as
      `HTMLChakraProps<"div">` (no variant unions); public
      `FeedbackCard{Root,Content,Action}Props` via
      `OmitInternalProps<…> & { children?, ref?, [data-*] }`; JSDoc on every
      public prop
- [x] 3.4 Implement `feedback-card.slots.tsx`:
      `createSlotRecipeContext({ key: "nimbusFeedbackCard" })`;
      `RootSlot = withProvider("div","root")`, Content/Action =
      `withContext("div", slot)`; explicit `SlotComponent<TElement,TProps>`
      return types with correct relative import depth
- [x] 3.5 Implement `components/feedback-card.root.tsx` (`useSlotRecipe` →
      `splitVariantProps` → forward to RootSlot; neutral div, no implicit role,
      forwards `role`/`aria-*`; `displayName = "FeedbackCard.Root"`,
      `@supportsStyleProps`)
- [x] 3.6 Implement `components/feedback-card.content.tsx` and
      `components/feedback-card.action.tsx` (thin wrappers: forward to slot;
      displayNames `"FeedbackCard.Content"`/`"FeedbackCard.Action"`,
      `@supportsStyleProps`); wire `components/index.ts`
- [x] 3.7 Implement `feedback-card.tsx`: compound object
      `{ Root, Content, Action }` (Root first) with per-part JSDoc `@example`
      blocks; underscore-aliased named exports; ensure `index.ts` re-exports
      component + types
- [x] 3.8 Run `pnpm test:storybook:dev` on the story file and confirm all play
      functions now PASS (green)

## 4. Documentation

- [x] 4.1 Create `feedback-card.dev.mdx` (developer docs) using the
      `writing-developer-documentation` skill (+ companion
      `feedback-card.docs.spec.tsx`)
- [x] 4.2 Create `feedback-card.mdx` (designer docs) using the
      `writing-designer-documentation` skill, referencing Figma node 10094-8293

## 5. Validation gates

- [x] 5.1 `pnpm --filter @commercetools/nimbus typecheck:dev` passes with no
      errors
- [x] 5.2
      `pnpm test:storybook:dev packages/nimbus/src/patterns/feedback/feedback-card/feedback-card.stories.tsx`
      — all play functions pass
- [x] 5.3 `pnpm lint` (eslint) passes for the new files
- [x] 5.4 Confirm `import { FeedbackCard } from "@commercetools/nimbus"`
      resolves with `.Root`/`.Content`/`.Action` (verified in dev via
      typecheck:dev, and against the built `dist` via the passing
      `.docs.spec.tsx` unit test)
- [x] 5.5 Run `nimbus-reviewer` to validate compliance against Nimbus standards;
      addressed findings: synced `docs/file-type-guidelines/component-vs-pattern.md`
      to codify the layout-only-slot-recipe pattern exception (#1), rewrote
      `feedback-card.docs.spec.tsx` + the `.dev.mdx` testing section as
      consumer-integration scenarios per `testing-strategy.md` (#2), and added the
      `@see` doc-site link to the main JSDoc (#3). Nits #4–#6 confirmed
      correct-as-implemented / pre-existing repo conventions.
