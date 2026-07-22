# FEC-889: Document DataTable migration mechanics

## Branch: FEC-889-datatable-migration-mechanics

## Summary

Add structured migration guidance fields (`propShapeTransforms`,
`callbackAdapters`, `typeNotes`) to the `UiKitMigrationEntry` type and populate
them for DataTable and backfill across all components with callback/type
changes.

1. Column definitions require generic typing (`DataTableColumnItem<T>`) and have
   renamed/new fields
2. `onSortChange` callback signature changed shape
3. `Selection` type includes `'all' | Set<Key>`, not just `Set`

## Tasks

### Task 1: Add types to `types.ts` ✅

- Add `PropShapeTransform` interface (prop, rename, addRequired, addOptional,
  drop, genericRequired)
- Add `CallbackAdapter` interface (prop, from, to)
- Add optional fields to `UiKitMigrationEntry`: `propShapeTransforms`,
  `callbackAdapters`, `typeNotes`
- Add same optional fields to `MigrateComponentResult`

### Task 2: Update `buildComponentResult` in `migrate-from-uikit.ts` ✅

- Pass through `propShapeTransforms`, `callbackAdapters`, `typeNotes` from entry
  to result

### Task 3: Populate DataTable migration data ✅

- Add `propShapeTransforms` with column transform details
- Add `callbackAdapters` with sort adapter
- Add `typeNotes` for Selection type handling
- Add `onSortChange` propMapping entry
- Enhance `breakingChanges` and `notes`

### Task 4: Backfill callbackAdapters and typeNotes across all components ✅

- SelectInput, NumberInput, MoneyInput, DateInput, DateTimeInput,
  DateRangeInput, TimeInput, CheckboxInput, ToggleInput, LocalizedTextInput,
  LocalizedMultilineTextInput, LocalizedMoneyInput, LocalizedRichTextInput, Tag,
  CollapsiblePanel, DropdownMenu

### Task 5: Tests ✅

- Test that DataTable migration result includes `propShapeTransforms`
- Test that DataTable migration result includes `callbackAdapters`
- Test that DataTable migration result includes `typeNotes`
- Test that entries without these fields omit them
- Test backfilled entries across all components

### Task 6: Accuracy fixes from review

- Fix TimeInput `from` signature: was `TCustomEvent`, actually
  `ChangeEventHandler<HTMLInputElement>` (DOM ChangeEvent)
- Fix LocalizedTextInput/LocalizedMultilineTextInput/LocalizedRichTextInput
  `from` signature: was "per-locale onChange handlers", actually single
  `ChangeEventHandler<HTMLLocalizedInputElement>` with `target.language`
- Fix DropdownMenu `from` signature: was `onSelect: (option: object) => void`,
  actually per-item `onClick: () => void` with no arguments
- Fix Tag `from` signature: was `(key: string) => void`, actually
  `(event: MouseEvent | KeyboardEvent) => void`
- Fix SelectInput: remove multi-select claim — Nimbus Select is single-selection
  only; suggest ComboBox for multi-select needs

### Task 7: Changeset + validation

- Add changeset covering the backfill work
- Run validation script
- Run full test suite
