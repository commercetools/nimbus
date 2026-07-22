# FEC-889: Document DataTable migration mechanics

## Branch: FEC-889-datatable-migration-mechanics

## Summary

Add structured migration guidance fields (`propShapeTransforms`,
`callbackAdapters`, `typeNotes`) to the `UiKitMigrationEntry` type and populate
them for DataTable. These document three migration pitfalls:

1. Column definitions require generic typing (`DataTableColumnItem<T>`) and have
   renamed/new fields
2. `onSortChange` callback signature changed shape
3. `Selection` type includes `'all' | Set<Key>`, not just `Set`

## Tasks

### Task 1: Add types to `types.ts`

- Add `PropShapeTransform` interface (prop, rename, addRequired, addOptional,
  drop, genericRequired)
- Add `CallbackAdapter` interface (prop, from, to)
- Add optional fields to `UiKitMigrationEntry`: `propShapeTransforms`,
  `callbackAdapters`, `typeNotes`
- Add same optional fields to `MigrateComponentResult`

### Task 2: Update `buildComponentResult` in `migrate-from-uikit.ts`

- Pass through `propShapeTransforms`, `callbackAdapters`, `typeNotes` from entry
  to result

### Task 3: Populate DataTable migration data

- Add `propShapeTransforms` with column transform details
- Add `callbackAdapters` with sort adapter
- Add `typeNotes` for Selection type handling
- Add `onSortChange` propMapping entry
- Enhance `breakingChanges` and `notes`

### Task 4: Tests

- Test that DataTable migration result includes `propShapeTransforms`
- Test that DataTable migration result includes `callbackAdapters`
- Test that DataTable migration result includes `typeNotes`
- Test that entries without these fields omit them

### Task 5: Changeset + validation

- Run validation script
- Run full test suite
- Add changeset
