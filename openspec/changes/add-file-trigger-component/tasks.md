## 1. Scaffold component structure

- [ ] 1.1 Create the component directory `packages/nimbus/src/components/file-trigger/`
- [ ] 1.2 Create shell `file-trigger.types.ts` exporting an empty/placeholder `FileTriggerProps` type
- [ ] 1.3 Create shell `file-trigger.tsx` with a `FileTrigger` component stub and `displayName = "FileTrigger"`, exporting nothing functional yet
- [ ] 1.4 Create shell `file-trigger.stories.tsx` with Storybook `Meta` wired to the component
- [ ] 1.5 Create shell `file-trigger.docs.spec.tsx` for consumer implementation tests (per FEC-982 file list)
- [ ] 1.6 Create `index.ts` barrel that re-exports the component and its types
- [ ] 1.7 Confirm NO `file-trigger.recipe.ts` / `file-trigger.slots.tsx` / `file-trigger.i18n.ts` are created — this is a pure behavior wrapper with no styling, theme registration, or messages (matches the `IconButton` precedent)

## 2. Author failing Storybook tests (TDD)

- [ ] 2.1 Write a play function using a Nimbus `Button` as the child trigger (FEC-982: "Works with Nimbus Button as child trigger") asserting single-file selection invokes `onSelect` with a `FileList` of one file (use `userEvent.upload` / simulated `change` on the hidden input)
- [ ] 2.2 Write a play function asserting `allowsMultiple` renders the `multiple` attribute and `onSelect` receives all selected files
- [ ] 2.3 Write a play function asserting `acceptedFileTypes={["image/png", ".pdf"]}` renders `accept="image/png,.pdf"` on the hidden input
- [ ] 2.4 Write a play function asserting `acceptDirectory` renders directory-selection attributes (e.g. `webkitdirectory`)
- [ ] 2.5 Write a play function asserting `defaultCamera="environment"` renders `capture="environment"`
- [ ] 2.6 Write a play function asserting a disabled child suppresses activation (picker not opened, `onSelect` not called)
- [ ] 2.7 Write a play function asserting keyboard activation (Enter/Space on the focused child) triggers the hidden input
- [ ] 2.8 Write a play function asserting accessibility: the trigger's accessible name derives from the child, and the input is visually hidden (not `display:none`)
- [ ] 2.9 Run the stories and verify all play functions FAIL initially (TDD red state) against the unimplemented stub

## 3. Implement the component

- [ ] 3.1 Implement `file-trigger.types.ts`: re-export React Aria `FileTriggerProps` (imported with an `Ra` prefix) as the public `FileTriggerProps`, adding JSDoc on each supported prop (`onSelect`, `acceptedFileTypes`, `allowsMultiple`, `acceptDirectory`, `defaultCamera`, `children`)
- [ ] 3.2 Implement `file-trigger.tsx`: render React Aria `FileTrigger` forwarding all props to the wrapped pressable child; set `displayName = "FileTrigger"`; no inline styles, no recipe usage
- [ ] 3.3 Finalize `index.ts` barrel exports (component + types)
- [ ] 3.4 Add `export * from "./file-trigger";` to `packages/nimbus/src/components/index.ts` in alphabetical position (between `flex` and `form-field`)

## 4. Documentation

- [ ] 4.1 Create `file-trigger.dev.mdx` developer documentation using the `/writing-developer-documentation` skill — cover usage with `Button`/`IconButton`, all props, the `FileList`/`Array.from()` note, the no-reset `key`-remount workaround, and the no-`name`/form limitation
- [ ] 4.2 Create `file-trigger.mdx` designer documentation using the `/writing-designer-documentation` skill
- [ ] 4.3 Create `file-trigger.a11y.mdx` documenting the VisuallyHidden input, child-derived accessible name, keyboard activation, and disabled-via-child behavior
- [ ] 4.4 Implement `file-trigger.docs.spec.tsx` consumer implementation tests — copy-pasteable examples (single select with Nimbus `Button`, accepted types, multiple) that consumers can run in their own apps

## 5. Validation (standards compliance — blocks shipping)

- [ ] 5.1 Make all Storybook play functions from group 2 PASS (TDD green) — `pnpm test packages/nimbus/src/components/file-trigger/file-trigger.stories.tsx`
- [ ] 5.2 TypeScript compiles with no errors — `pnpm --filter @commercetools/nimbus typecheck`
- [ ] 5.3 Linting passes — `pnpm lint`
- [ ] 5.4 Verify `FileTrigger` is importable from the package barrel (`@commercetools/nimbus`)
- [ ] 5.5 Run the full component test suite to confirm no regressions — `pnpm test`
- [ ] 5.6 Confirm docs render and examples are accurate; add a changeset describing the new `FileTrigger` component from the consumer's perspective
- [ ] 5.7 Verify all FEC-982 acceptance criteria are satisfied (see mapping below)

## 6. FEC-982 acceptance criteria mapping

- [ ] 6.1 Wraps React Aria `FileTrigger`, forwards all props → tasks 3.1, 3.2
- [ ] 6.2 Supports `acceptedFileTypes`, `allowsMultiple`, `defaultCamera` → tasks 2.2, 2.3, 2.5
- [ ] 6.3 `onSelect` callback fires with `FileList` → tasks 2.1, 2.2
- [ ] 6.4 Works with Nimbus `Button` as child trigger → task 2.1
- [ ] 6.5 Storybook stories demonstrate file selection → tasks 2.1–2.8
- [ ] 6.6 Exported from package barrel → task 3.4
