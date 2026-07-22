# FEC-888: Flag slot-prop collapse and code-deletion patterns in `migrate_from_uikit`

## Branch: `FEC-888-slot-prop-collapse-code-reduction`

## Summary

Add two new optional fields to `UiKitMigrationEntry`:

1. **`propMigrations`** — describes slot-prop-to-children collapse patterns
   (e.g., Stamp `label`/`icon` → Badge `children`)
2. **`codeReduction`** — describes patterns where migration deletes significant
   code (e.g., DataTable selection columns)

## Tasks

### Task 1: Add types (`src/types.ts`)

- [ ] Add `PropMigration` interface:
      `{ from: string; to: string; position?: "before" | "after" }`
- [ ] Add `CodeReduction` interface:
      `{ type: string; deletableFiles: string[]; rationale: string }`
- [ ] Add `propMigrations?: PropMigration[]` to `UiKitMigrationEntry`
- [ ] Add `codeReduction?: CodeReduction` to `UiKitMigrationEntry`
- [ ] Add both to `MigrateComponentResult` so they flow through to API responses

### Task 2: Update tool result builder (`src/tools/migrate-from-uikit.ts`)

- [ ] In `buildComponentResult()`, pass through `propMigrations` and
      `codeReduction` from entry to result (same pattern as `propMappings`)

### Task 3: Add migration data for Stamp → Badge slot-prop collapse (`src/data/uikit-migration.ts`)

- [ ] Add `propMigrations` to the Stamp entry:
  - `{ from: "label", to: "children" }`
  - `{ from: "icon", to: "children", position: "before" }`

### Task 4: Add migration data for DataTable code reduction (`src/data/uikit-migration.ts`)

- [ ] Add `codeReduction` to the DataTable entry:
  - `type: "selection-model-collapse"`
  - `deletableFiles: ["**/*-selection-column-cell.tsx", "**/*-selection-column-label.tsx"]`
  - `rationale: "Nimbus DataTable provides built-in selection via selectionMode='multiple'."`

### Task 5: Add build-time validation (`scripts/validate-migration-data.ts`)

- [ ] Validate `propMigrations[].from` exists as a UIKit prop (reuse existing
      UIKit prop map)
- [ ] Validate `codeReduction` has non-empty `type`, `deletableFiles`, and
      `rationale`

### Task 6: Add tests

- [ ] **Behavioral test** (`migrate-from-uikit.spec.ts`): Stamp response
      includes `propMigrations`
- [ ] **Behavioral test** (`migrate-from-uikit.spec.ts`): DataTable response
      includes `codeReduction`
- [ ] **Validation test** (`migrate-from-uikit-validation.spec.ts`):
      propMigrations entries have valid UIKit props
- [ ] **Validation test** (`migrate-from-uikit-validation.spec.ts`):
      codeReduction entries have required fields

### Task 7: Changeset

- [ ] Add changeset describing the new fields
