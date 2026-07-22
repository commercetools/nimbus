# FEC-887: Emit `<Icon as={...}>` wrapper form in migrate_from_uikit

## Branch: `FEC-887-icon-wrapper-migration`

## Summary

The `migrate_from_uikit` MCP tool currently returns bare icon component names
(e.g. `<ChevronRight />`) for icon migrations. The canonical Nimbus form wraps
icons in `<Icon as={ChevronRight} size="2xs" color="neutral.11" />`. This change
adds structured `iconWrapper` metadata to the migration response so the LLM
emits the correct wrapped form.

## Tasks

### Task 1: Add `IconWrapper` type and update migration types

- Add `IconWrapper` interface to `src/types.ts`
- Add optional `iconWrapper` field to `UiKitMigrationEntry`
- Add optional `iconWrapper` field to `MigrateComponentResult`

### Task 2: Add failing tests for `iconWrapper` in migration responses

- Test that "Icon Library" response includes `iconWrapper` with component,
  importPath, and defaultProps
- Test that "Icon Library" `iconWrapper` notes mention the wrapped form
- Test that "CustomIcon" response includes `iconWrapper`
- Test that non-icon components do NOT include `iconWrapper`

### Task 3: Update migration data and tool to include `iconWrapper`

- Add `iconWrapper` field to the "Icon Library" entry in `uikit-migration.ts`
- Add `iconWrapper` field to the "CustomIcon" entry in `uikit-migration.ts`
- Update `buildComponentResult` in `migrate-from-uikit.ts` to pass through
  `iconWrapper`
- Update notes to mention the wrapper pattern and size mapping
- Add UI Kit icon size → Nimbus Icon size prop mapping (small→2xs, medium→xs,
  big→md)

### Task 4: Run full test suite and verify

- Run `pnpm test:dev` for the nimbus-mcp package
- Run typecheck:dev
- Verify no regressions
