## 1. Scaffold component structure

- [x] 1.1 Create the component directory `packages/nimbus/src/components/file-trigger/`
- [x] 1.2 Create shell `file-trigger.types.ts` exporting an empty/placeholder `FileTriggerProps` type
- [x] 1.3 Create shell `file-trigger.tsx` with a `FileTrigger` component stub and `displayName = "FileTrigger"`, exporting nothing functional yet
- [x] 1.4 Create shell `file-trigger.stories.tsx` with Storybook `Meta` wired to the component
- [x] 1.5 Create shell `file-trigger.docs.spec.tsx` for consumer implementation tests (per FEC-982 file list)
- [x] 1.6 Create `index.ts` barrel that re-exports the component and its types
- [x] 1.7 Confirm NO `file-trigger.recipe.ts` / `file-trigger.slots.tsx` / `file-trigger.i18n.ts` are created — this is a pure behavior wrapper with no styling, theme registration, or messages (matches the `IconButton` precedent)

## 2. Author Storybook tests

- [x] 2.1 Write a play function using a Nimbus `Button` as the child trigger (FEC-982: "Works with Nimbus Button as child trigger") asserting single-file selection invokes `onSelect` with a `FileList` of one file (use `userEvent.upload` / simulated `change` on the hidden input)
- [x] 2.2 Write a play function asserting `allowsMultiple` renders the `multiple` attribute and `onSelect` receives all selected files
- [x] 2.3 Write a play function asserting `acceptedFileTypes={["image/png", ".pdf"]}` renders `accept="image/png,.pdf"` on the hidden input
- [x] 2.4 Write a play function asserting `acceptDirectory` renders directory-selection attributes (e.g. `webkitdirectory`)
- [x] 2.5 Write a play function asserting `defaultCamera="environment"` renders `capture="environment"`
- [x] 2.6 Write a play function asserting a disabled child suppresses activation (`onSelect` not called; child reported disabled)
- [x] 2.7 Write a play function asserting keyboard accessibility: the trigger is Tab-focusable and exposes a child-derived accessible name (NOTE: actual Enter/Space *picker opening* delegates to the child Button and opens a native OS dialog that cannot be observed headlessly — covered by Button's own tests)
- [x] 2.8 Write a play function asserting accessibility (CORRECTED): the trigger's accessible name derives from the child, and the input is `display:none` and activated programmatically. The original task text ("visually hidden, not `display:none`") was based on incorrect research — RAC renders the input with `display:none` and clicks it via the child. Spec and a11y docs were corrected to match the real RAC behavior.
- [~] 2.9 TDD red state — NOT done as a strict red-first step. Because the component is a trivial pass-through wrapper, implementation was written alongside the stories rather than verifying a failing stub first. Tests were exercised against the real implementation (group 5).

## 3. Implement the component

- [x] 3.1 Implement `file-trigger.types.ts`: public `FileTriggerProps` derived from React Aria's `FileTriggerProps` (imported as `RaFileTriggerProps`) with Nimbus JSDoc on each supported prop (`onSelect`, `acceptedFileTypes`, `allowsMultiple`, `acceptDirectory`, `defaultCamera`, `children`, `ref`)
- [x] 3.2 Implement `file-trigger.tsx`: render React Aria `FileTrigger` forwarding all props (incl. `ref` to the hidden input) to the wrapped pressable child; set `displayName = "FileTrigger"`; no inline styles, no recipe usage
- [x] 3.3 Finalize `index.ts` barrel exports (component + types)
- [x] 3.4 Add `export * from "./file-trigger";` to `packages/nimbus/src/components/index.ts` in alphabetical position (between `field-errors` and `flex`)

## 4. Documentation

- [x] 4.1 Create `file-trigger.dev.mdx` developer documentation — usage with `Button`/`IconButton`, all props, the `FileList`/`Array.from()` note, the no-reset `key`-remount workaround, and the no-`name`/form limitation
- [x] 4.2 Create `file-trigger.mdx` designer documentation
- [x] 4.3 Create `file-trigger.a11y.mdx` documenting the hidden input, child-derived accessible name, keyboard operability via the child, and disabled-via-child behavior
- [x] 4.4 Implement `file-trigger.docs.spec.tsx` consumer implementation tests — copy-pasteable examples (single select with Nimbus `Button`, accepted types, multiple, disabled child) that consumers can run in their own apps

## 5. Validation (standards compliance — blocks shipping)

- [x] 5.1 All Storybook play functions PASS — `pnpm test packages/nimbus/src/components/file-trigger/file-trigger.stories.tsx` (8/8, both dev source and built bundle) + docs.spec (6/6)
- [x] 5.2 TypeScript compiles with no errors — `pnpm --filter @commercetools/nimbus typecheck` (clean)
- [x] 5.3 Linting passes — `pnpm exec eslint packages/nimbus/src/components/file-trigger/` (clean, exit 0)
- [x] 5.4 Verify `FileTrigger` is importable from the package barrel (`@commercetools/nimbus`) — confirmed via the built-bundle story test importing it from the package
- [x] 5.5 Built bundle rebuilt and tests run against it — `pnpm --filter @commercetools/nimbus build` succeeded; story tests pass against `dist/`
- [x] 5.6 Added changeset `.changeset/add-file-trigger.md` describing the new component from the consumer's perspective
- [x] 5.7 Verify all FEC-982 acceptance criteria are satisfied (see mapping below)

## 6. FEC-982 acceptance criteria mapping

- [x] 6.1 Wraps React Aria `FileTrigger`, forwards all props → tasks 3.1, 3.2
- [x] 6.2 Supports `acceptedFileTypes`, `allowsMultiple`, `defaultCamera` → tasks 2.2, 2.3, 2.5
- [x] 6.3 `onSelect` callback fires with `FileList` → tasks 2.1, 2.2
- [x] 6.4 Works with Nimbus `Button` as child trigger → task 2.1
- [x] 6.5 Storybook stories demonstrate file selection → tasks 2.1–2.8
- [x] 6.6 Exported from package barrel → task 3.4
