# Tasks: Add default aria-labels to DataTable components

- [x] Task 1: Add aria-label prop and default to DataTable.Table
- [x] Task 2: Add aria-label prop and default to DataTable.Header
- [x] Task 3: Add aria-label prop and default to DataTable.Body
- [x] Task 4: Add aria-label to DataTable.Manager drawer
- [x] Task 5: Add settingsTabsAriaLabel i18n message
- [x] Task 6: Update locale files with new message
- [x] Task 7: Update tests with aria-label props

---

## Task 1: Add aria-label prop and default to DataTable.Table

**File:**
`packages/nimbus/src/components/data-table/components/data-table.table.tsx`

- Extract `aria-label` from props
- Add `useLocalizedStringFormatter` hook
- Fall back to `msg.format("dataTable")` when not provided
- Pass to underlying `RaTable` component

**Validation:**

- `pnpm typecheck` passes
- Component renders with default aria-label when none provided
- Custom aria-label overrides default

## Task 2: Add aria-label prop and default to DataTable.Header

**File:**
`packages/nimbus/src/components/data-table/components/data-table.header.tsx`

- Extract `aria-label` from props
- Fall back to `msg.format("dataTableHeader")` when not provided
- Pass to underlying `RaTableHeader` component

**Validation:**

- `pnpm typecheck` passes
- Header has correct aria-label in DOM

## Task 3: Add aria-label prop and default to DataTable.Body

**File:**
`packages/nimbus/src/components/data-table/components/data-table.body.tsx`

- Add `useLocalizedStringFormatter` hook import
- Extract `aria-label` from props
- Fall back to `msg.format("dataTableBody")` when not provided
- Pass to underlying `RaTableBody` component

**Validation:**

- `pnpm typecheck` passes
- Body has correct aria-label in DOM

## Task 4: Add aria-label to DataTable.Manager drawer

**File:**
`packages/nimbus/src/components/data-table/components/data-table.manager.tsx`

- Add `aria-label={msg.format("settings")}` to `Drawer.Content`
- Add `tabListAriaLabel={msg.format("settingsTabsAriaLabel")}` to `Tabs.Root`

**Validation:**

- Drawer content has aria-label in DOM
- Tabs have accessible label

## Task 5: Add settingsTabsAriaLabel i18n message

**File:** `packages/nimbus/src/components/data-table/data-table.i18n.ts`

- Add `settingsTabsAriaLabel` message definition
- Add description and default message

**File:** `packages/nimbus/src/components/data-table/data-table.messages.ts`

- Add `settingsTabsAriaLabel` to `DataTableMessageKey` type

**Validation:**

- `pnpm typecheck` passes
- Message is extractable

## Task 6: Update locale files with new message

**Files:**

- `packages/nimbus/src/components/data-table/intl/en.ts`
- `packages/nimbus/src/components/data-table/intl/de.ts`
- `packages/nimbus/src/components/data-table/intl/es.ts`
- `packages/nimbus/src/components/data-table/intl/fr-FR.ts`
- `packages/nimbus/src/components/data-table/intl/pt-BR.ts`

- Add `settingsTabsAriaLabel` to each locale file

**Validation:**

- All locales have the new key
- No TypeScript errors

## Task 7: Update tests with aria-label props

**File:** `packages/nimbus/src/components/data-table/data-table.docs.spec.tsx`

- Add `aria-label="Table settings"` to `DataTable.Manager` in test renders

**File:** `packages/nimbus/src/components/data-table/data-table.stories.tsx`

- Add `aria-label` props to TextInput components in EditProductModal

**Validation:**

- `pnpm test packages/nimbus/src/components/data-table/` passes
- No console warnings about missing labels
