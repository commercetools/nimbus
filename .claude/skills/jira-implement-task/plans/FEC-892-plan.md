# FEC-892 Implementation Plan

## Summary

Add a `layoutGuidance` field to layout-related UIKit migration entries so the
LLM consumer migrates nested layout primitives as a group rather than
component-by-component.

## Tasks

### Task 1: Add `layoutGuidance` field to types

- Add optional `layoutGuidance?: string` to `UiKitMigrationEntry` and
  `MigrateComponentResult` in `src/types.ts`
- Add optional `layoutGuidance?: string` to `MigrateCompoundResult` and
  `MigrateFileResult` for envelope-level guidance when layout primitives are
  present

### Task 2: Add guidance text to layout entries in migration data

- Define a shared `LAYOUT_NESTING_GUIDANCE` constant in `uikit-migration.ts`
- Apply it to: `Constraints.Horizontal`, `Spacings.Stack`, `Spacings.Inline`,
  `Spacings.Inset`, `Spacings.InsetSquish`

### Task 3: Pass `layoutGuidance` through in tool response

- Update `buildComponentResult` to include `layoutGuidance` when present
- Add `layoutGuidance` to compound root responses when any mapping has it
- Add `layoutGuidance` to file-level responses when any mapping has it

### Task 4: Write tests

- Test that individual layout component lookups include `layoutGuidance`
- Test that compound root "Spacings" lookup includes `layoutGuidance`
- Test that file-level results with layout imports include `layoutGuidance`
- Test that non-layout components do NOT include `layoutGuidance`

### Task 5: Build validation

- Run `pnpm --filter @commercetools/nimbus-mcp build` to ensure no type errors
- Run full test suite for the mcp package
