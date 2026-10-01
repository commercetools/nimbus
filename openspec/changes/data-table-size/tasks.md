## 1. Baseline

- [x] 1.1 Rebase on `main` after PR #1996 is merged
- [ ] 1.2 Record the current Chromatic baseline for all DataTable stories
      (default and `density="condensed"`)
- [x] 1.3 Measure the rendered checkbox, drag handle, expand button and pin
      button; record that each is at least 24×24px today

## 2. Types and constants

- [x] 2.1 Add `size?: "sm" | "md" | "lg" | "xl"` to the DataTable recipe props
      and public props, with JSDoc that lists `sm`/`md`/`lg` and names `xl` as
      the deprecated default
- [x] 2.2 Mark `density` `@deprecated` in the types, pointing to `size="lg"` /
      `size="md"`
- [x] 2.3 Add the size → internal column width map to `constants.ts` (see
      design.md → Decision 4)

## 3. Recipe

- [x] 3.1 Move cell padding out of the base `cell` slot into a `size` variant
      with the values from design.md → Decision 1; set
      `defaultVariants: { size: "xl" }`
- [x] 3.2 Add header padding, text style and height per size, in both header
      blocks (keep them consistent for FEC-1347 §4)
- [x] 3.3 Replace the `condensed` density padding with a compound variant
      `{ size: "xl", density: "condensed" }`
- [x] 3.4 Replace the sticky offsets `"600"`, `"1800"`, `"2400"` with the
      internal column width CSS variables
- [x] 3.5 Add cross-reference comments between `data-table.recipe.ts` and
      `table.recipe.ts` for the shared `sm`/`md`/`lg` values

## 4. Components

- [x] 4.1 Root: destructure `size` without a default, resolve `size ?? "xl"`,
      pass `density` to the recipe only when `size` was not passed
- [x] 4.2 Root: write the internal column widths for the resolved size as CSS
      variables
- [x] 4.3 Root: development warnings for explicit `size="xl"` and for `size` +
      `density` together (once per mount)
- [x] 4.4 Header: read internal column `minWidth`/`maxWidth` from the width map
      instead of hardcoded 24/72
- [x] 4.5 Expose the resolved size through context only if a child needs it
      (header does); keep it in the stable context

## 5. Stories and tests

- [x] 5.1 Story per size (`sm`, `md`, `lg`) with a play function that asserts
      cell padding, header padding and cell text style
- [x] 5.2 Story per size with drag, selection, expand and pin columns and
      horizontal scroll; play function asserts the internal column widths
      (40/48/56/72) and that sticky columns touch without gap or overlap
- [x] 5.3 Play function asserts each control keeps a 24×24px target at `sm`
- [x] 5.4 Story: `density="condensed"` without `size` renders 24/12px padding
      (unchanged)
- [x] 5.5 Story: `size` + `density` → `size` wins; assert one console warning
- [x] 5.6 Story: explicit `size="xl"` warns once; default does not warn
- [x] 5.7 Unit test: the `sm`/`md`/`lg` padding tokens match `table.recipe.ts`
- [x] 5.8 Hide `xl` from the Storybook `size` control

## 6. Documentation

- [x] 6.1 Update `data-table.dev.mdx`: document `size`, the deprecated `xl`
      default, the `density` deprecation, and the advice to remove own cell text
      styles
- [x] 6.2 Update `data-table.mdx` (designer docs) with the size scale
- [x] 6.3 Review the ~89 `density`/`condensed` mentions in stories and docs;
      move examples to `size`
- [x] 6.4 Update the `size` example in `data-table.docs.spec.tsx`
- [x] 6.5 Add a minor changeset per `docs/changeset-conventions.md`

## 7. Verification

- [x] 7.1 `pnpm --filter @commercetools/nimbus typecheck:dev` shows no new
      DataTable errors
- [x] 7.2 `pnpm test:dev packages/nimbus/src/components/data-table` green
- [ ] 7.3 Chromatic: no diff for existing stories; new stories only
- [x] 7.4 Try the `sm`–`lg` header without fixed height in stories; record the
      decision in design.md → Open Questions
- [x] 7.5 `pnpm exec openspec validate data-table-size --type change --strict`
