# FEC-422: Centralize MCP types into dedicated types file

## Status: In Progress

## Context

Most types (37/38) are already centralized in
`packages/nimbus-mcp/src/types.ts`. Two issues remain:

## Tasks

### Task 1: Move `UiKitMigrationEntry` to `types.ts`

- **File**: `packages/nimbus-mcp/src/data/uikit-migration.ts` (lines 12-26)
- **Action**: Move the `UiKitMigrationEntry` interface to `types.ts` in the
  migration section, then import it in `uikit-migration.ts`

### Task 2: Remove duplicate `ComponentSummary` from test file

- **File**: `packages/nimbus-mcp/src/tools/list-components.spec.ts` (lines
  13-20)
- **Action**: Replace the inline type alias with an import from `../types.js`

## Acceptance Criteria

- All shared MCP types live in `src/types.ts`
- All imports reference `src/types.ts` for shared types
- No duplicate type definitions remain
- `pnpm test packages/nimbus-mcp/` passes
- `pnpm --filter @commercetools/nimbus-mcp typecheck` passes
