# Tasks: Rework Card Component

## - [x] Task 1: Update recipe — add footer slot, restructure to variant/size, fix display

**File:** `packages/nimbus/src/components/card/card.recipe.ts`

- Add `"body"` and `"footer"` to slots array, rename `"content"` to `"body"`
- Change root `display` from `inline-flex` to `flex`
- Add `flexDirection: "column"` to root base
- Remove old variants (`cardPadding`, `borderStyle`, `elevation`,
  `backgroundStyle`)
- Add `size` variant (sm, md, lg) controlling:
  - Gap on root: sm=100, md=200, lg=400
  - Shared slot styles for header, body, footer:
    - Horizontal padding (`px`) from size variant
    - `_first`: top padding matching size
    - `_last`: bottom padding matching size
- Add `variant` option (outlined, elevated, filled, plain):
  - `outlined`: border solid-25 + colorPalette.6, bg, no shadow
  - `elevated`: no border, shadow 1, bg
  - `filled`: no border, no shadow, colorPalette.2 bg
  - `plain`: no border, no shadow, bg
- Set defaults: `size: "md"`, `variant: "outlined"`
- Update theme registration in `src/theme/slot-recipes/index.ts` if slot names
  changed

**Verify:** Recipe compiles, theme typings generate without errors
(`pnpm --filter @commercetools/nimbus build-theme-typings`)

## - [x] Task 2: Update types — rename Content to Body, add Footer, use variant/size

**File:** `packages/nimbus/src/components/card/card.types.ts`

- Replace `CardRecipeProps` internals:
  - Remove `cardPadding`, `borderStyle`, `elevation`, `backgroundStyle`
  - Add `size?: "sm" | "md" | "lg"`
  - Add `variant?: "outlined" | "elevated" | "filled" | "plain"`
- Rename `CardContentSlotProps` to `CardBodySlotProps`
- Rename `CardContentProps` to `CardBodyProps`
- Add `CardFooterSlotProps` extending `HTMLChakraProps<"div">`
- Add `CardFooterProps` with children, ref, OmitInternalProps
- Update all JSDoc comments

**Verify:** `pnpm --filter @commercetools/nimbus typecheck`

## - [x] Task 3: Update slots — rename content to body, add footer

**File:** `packages/nimbus/src/components/card/card.slots.tsx`

- Rename `CardContent` slot to `CardBody` (withContext "body")
- Add `CardFooter` slot (withContext "footer")
- Update type imports

**Verify:** Types align with recipe slot names

## - [x] Task 4: Rewrite card.root.tsx — remove context, direct rendering

**File:** `packages/nimbus/src/components/card/components/card.root.tsx`

- Remove `createContext`, `useState`, `useMemo` imports
- Remove `CardContext` and `CardContextValue`
- Remove `headerNode`, `contentNode` state
- Remove `contextValue` memo
- Remove `CardContext.Provider` wrapper
- Remove intermediate `Stack` component
- Render `CardRootSlot` with `children` directly (no reordering)
- Keep recipe splitting and style prop extraction

**Verify:** Component renders children in DOM order

## - [x] Task 5: Rewrite card.header.tsx — simple passthrough

**File:** `packages/nimbus/src/components/card/components/card.header.tsx`

- Remove `useContext`, `useEffect` imports
- Remove context registration pattern
- Render `CardHeaderSlot` directly with children, forwarding ref and props
- Follow Dialog.Body/Dialog.Footer pattern (simple passthrough)

**Verify:** Header renders content directly, no null return

## - [x] Task 6: Rename card.content.tsx to card.body.tsx

**File:** `packages/nimbus/src/components/card/components/card.content.tsx` →
`card.body.tsx`

- Rename file
- Rename component from `CardContent` to `CardBody`
- Remove `useContext`, `useEffect` imports
- Remove context registration pattern
- Render `CardBodySlot` directly with children, forwarding ref and props
- Update displayName to `"Card.Body"`

**Verify:** Body renders content directly

## - [x] Task 7: Create card.footer.tsx

**File:** `packages/nimbus/src/components/card/components/card.footer.tsx` (new)

- Create footer component following same simple pattern as Header/Body
- Import `CardFooterSlot` from slots
- Import `CardFooterProps` from types
- Render slot directly with children, forwarding ref and props
- Set displayName to `"Card.Footer"`

**Verify:** Footer renders correctly

## - [x] Task 8: Update barrel exports

**Files:**

- `components/index.ts` — export CardBody (not CardContent), add CardFooter
- `card.tsx` — update namespace: rename Content to Body, add Footer with JSDoc
- `card/index.ts` — verify re-exports

**Verify:** `import { Card } from "@commercetools/nimbus"` provides Root,
Header, Body, Footer

## - [x] Task 9: Update stories

**File:** `packages/nimbus/src/components/card/card.stories.tsx`

- Replace all `Card.Content` with `Card.Body`
- Replace `cardPadding`, `borderStyle`, `elevation`, `backgroundStyle` with
  `variant` and `size`
- Add stories demonstrating Card.Footer
- Add story for Header + Body + Footer combination
- Add story for Body-only (verify padding)
- Add story for Header + Body without Footer
- Showcase all variant values (outlined, elevated, filled, plain)
- Showcase all size values (sm, md, lg)
- Add play functions verifying rendering and padding behavior

**Verify:** `pnpm test:dev packages/nimbus/src/components/card/card.stories.tsx`

## - [x] Task 10: Update docs spec

**File:** `packages/nimbus/src/components/card/card.docs.spec.tsx`

- Replace all `Card.Content` with `Card.Body`
- Replace old variant props with `variant` and `size`
- Add test case for Card with Footer
- Add test case for Body-only card
- Verify all combinations render expected content

**Verify:**
`pnpm test:dev packages/nimbus/src/components/card/card.docs.spec.tsx`

## - [x] Task 11: Update MDX documentation

**Files:** `card.mdx`, `card.dev.mdx`, `card.guidelines.mdx`, `card.a11y.mdx`

- Replace all `Card.Content` references with `Card.Body`
- Replace old variant prop references with `variant` and `size`
- Document Card.Footer in API reference
- Update examples to show Header + Body + Footer pattern
- Document padding behavior (CSS-driven, adapts to present parts)
- Document variant options with visual examples

## - [x] Task 12: Build and full test

- `pnpm --filter @commercetools/nimbus build`
- `pnpm test:dev` (storybook + unit tests against source)
- `pnpm --filter @commercetools/nimbus typecheck`

## - [x] Task 13: Add @react-aria/utils dependency

**Files:**

- `pnpm-workspace.yaml` — add `"@react-aria/utils": 3.33.1` to `react:` catalog
- `packages/nimbus/package.json` — add `"@react-aria/utils": "catalog:react"` to
  dependencies

Run `pnpm install`. Verify no version conflicts.

**Verify:** `pnpm --filter @commercetools/nimbus typecheck`

## - [x] Task 14: Implement slot-based ARIA wiring in Card.Root

**File:** `packages/nimbus/src/components/card/components/card.root.tsx`

- Import `useSlotId` from `@react-aria/utils`
- Import `Provider`, `HeadingContext`, `TextContext` from
  `react-aria-components`
- Call `useSlotId()` twice: once for titleId, once for descriptionId
- Derive conditional ARIA props (`role="article"`, `aria-labelledby`,
  `aria-describedby`) when at least one slot is detected
- Wrap children in
  `<Provider values={[[HeadingContext, ...], [TextContext, ...]]}>`
- Pass ARIA props to CardRootSlot

**Verify:** `pnpm --filter @commercetools/nimbus typecheck`

## - [x] Task 15: Add slot-based accessibility stories

**File:** `packages/nimbus/src/components/card/card.stories.tsx`

- Add `Heading` to imports from `@commercetools/nimbus`
- Add story: SlotBasedAccessibility (both title + description slots)
- Add story: WithoutSlots (regression test: no role on plain cards)
- Add story: TitleSlotOnly (partial slot usage)
- All stories must have play functions with ARIA attribute assertions

**Verify:**
`pnpm test:dev packages/nimbus/src/components/card/card.stories.tsx`

## - [x] Task 16: Update docs spec with slot examples

**File:** `packages/nimbus/src/components/card/card.docs.spec.tsx`

- Add `Heading`, `Text` to imports
- Add "Slot-based accessibility" describe block
- Test automatic `aria-labelledby` wiring with `Heading slot="title"`
- Test `aria-describedby` wiring with `Text slot="description"`
- Test no-role behavior without slots

**Verify:**
`pnpm test:dev packages/nimbus/src/components/card/card.docs.spec.tsx`

## - [x] Task 17: Update MDX documentation

**Files:**

- `card.a11y.mdx` — rewrite with slot-based ARIA guidance, behavior table, code
  examples
- `card.dev.mdx` — add "Accessible cards" section with live example, update
  accessibility notes

## - [x] Task 18: Build and full test

- `pnpm --filter @commercetools/nimbus build`
- `pnpm test:dev` (storybook + unit tests against source)
- `pnpm --filter @commercetools/nimbus typecheck`
- Verify no regressions in Heading, Text, or Combobox
- Verify no regressions in other components
