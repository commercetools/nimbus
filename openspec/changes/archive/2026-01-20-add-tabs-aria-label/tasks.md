# Tasks: Add tabListAriaLabel prop to Tabs component

- [x] Task 1: Add tabListAriaLabel prop to types
- [x] Task 2: Forward prop to Tabs.List in Root component
- [x] Task 3: Add story demonstrating usage
- [x] Task 4: Update documentation

---

## Task 1: Add tabListAriaLabel prop to types

**File:** `packages/nimbus/src/components/tabs/tabs.types.ts`

- Add `tabListAriaLabel?: string` to `TabsProps`
- Add JSDoc documentation explaining usage

**Validation:**

- `pnpm typecheck` passes
- Prop appears in TypeScript autocomplete

## Task 2: Forward prop to Tabs.List in Root component

**File:** `packages/nimbus/src/components/tabs/components/tabs.root.tsx`

- Destructure `tabListAriaLabel` from props
- Pass as `aria-label` to `Tabs.List` when using `tabs` prop API

**Validation:**

- Render `<Tabs.Root tabs={tabs} tabListAriaLabel="Test" />`
- Inspect DOM: TabList should have `aria-label="Test"`

## Task 3: Add story demonstrating usage

**File:** `packages/nimbus/src/components/tabs/tabs.stories.tsx`

- Add or update story showing `tabListAriaLabel` usage
- Include play function that verifies aria-label is applied

**Validation:**

- `pnpm test packages/nimbus/src/components/tabs/tabs.stories.tsx` passes
- No console warnings about missing labels

## Task 4: Update documentation

**File:** `packages/nimbus/src/components/tabs/tabs.dev.mdx`

- Document `tabListAriaLabel` prop in examples using simplified API
- Add accessibility section note about when to use it

**Validation:**

- Documentation builds without errors
- Prop is visible in PropsTable
