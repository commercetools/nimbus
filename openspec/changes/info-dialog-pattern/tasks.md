## 1. Scaffold

- [x] 1.1 Create directory
      `packages/nimbus/src/patterns/dialogs/info-dialog/`
- [x] 1.2 Create `patterns/dialogs/index.ts` with
      `export * from "./info-dialog"`
- [x] 1.3 Add `export * from "./dialogs"` to
      `packages/nimbus/src/patterns/index.ts`
- [x] 1.4 Create `info-dialog/index.ts` barrel re-exporting the component
      and types

## 2. Implementation

- [x] 2.1 Implement `info-dialog.types.ts` with `InfoDialogProps`:
      `title: ReactNode`, `isOpen?: boolean`,
      `onOpenChange?: (isOpen: boolean) => void`, `children: ReactNode`,
      with JSDoc on every prop
- [x] 2.2 Implement `info-dialog.tsx` composing `Dialog.Root`
      (passing `isOpen`, `onOpenChange`, `isDismissable`),
      `Dialog.Content`, `Dialog.Header` wrapping `Dialog.Title`,
      `Dialog.Body`, `Dialog.CloseTrigger`; set `displayName = "InfoDialog"`
- [x] 2.3 Confirm the close button accessible name from
      `Dialog.CloseTrigger` is translated; only add `.i18n.ts` if a
      pattern-owned user-facing string exists
      (no `.i18n.ts` required — the close button inherits its localized
      "Close dialog" label from `Dialog.CloseTrigger` directly)

## 3. Testing

- [x] 3.1 Write Storybook stories (`info-dialog.stories.tsx`) with play
      functions covering: basic string title, ReactNode title with
      composed content (e.g. badge + heading), long scrollable content,
      close via X button, close via Escape key, close via overlay click,
      focus trap while open and focus restoration on close
- [x] 3.2 Write consumer implementation tests
      (`info-dialog.docs.spec.tsx`) covering basic controlled usage

## 4. Documentation

- [x] 4.1 Create `info-dialog.dev.mdx` with: import statement, basic
      usage, scrollable content example, accessibility section, and
      "Escape hatch" section demonstrating the equivalent manual Dialog
      composition (for consumers needing custom size, custom
      dismissability, or custom aria-label)
- [x] 4.2 Create `info-dialog.mdx` with frontmatter
      `related-components: [Dialog]` and
      `menu: [Patterns, Dialogs, Info dialog]`
- [x] 4.3 Verify the generated PropsTable correctly reflects the flat
      four-prop API

## 5. Validation

- [x] 5.1 `pnpm --filter @commercetools/nimbus typecheck` passes
      (info-dialog files have only the pre-existing
      `Cannot find module '@commercetools/nimbus'` pattern shared by
      other stories and docs-specs — no new type errors)
- [x] 5.2 `pnpm --filter @commercetools/nimbus build` succeeds
- [x] 5.3 Storybook stories render with all play functions passing
      (`pnpm test:storybook` — 5/5 pass)
- [x] 5.4 Consumer implementation tests pass (`pnpm test` — 5/5 pass)
- [x] 5.5 `openspec validate info-dialog-pattern --strict` passes
