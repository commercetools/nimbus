# FEC-884: migrate_from_uikit type validation

## Branch: FEC-884-migrate-from-uikit-type-validation

## Summary

The `migrate_from_uikit` MCP tool returns mapping data that disagrees with
current Nimbus TypeScript types. Fix the hand-curated data and add a CI snapshot
test that catches future drift.

## Confirmed Issues

1. **Stamp → Badge**: Migration data says Badge has a `tone` prop with values
   `danger`, `success`, `info`. Badge actually uses `colorPalette` with values
   like `critical`, `positive`, `info`, `warning`, `primary`, `neutral`. Also
   says `isCondensed → size='sm'` but Badge's valid sizes are
   `"md" | "2xs" | "xs"` (no `sm`).
2. **Card**: Migration data says `Card.Content` but the actual export is
   `Card.Body`.
3. **Select.Options placeholder**: Docs show `placeholder="..."` on
   `Select.Options` but `placeholder` is actually on `Select.Root` (SelectRoot).
   The migration data itself doesn't mention this directly but the tool's hints
   lead users to the wrong docs.

## Tasks

### Task 1: Create validation test (RED)

Write `migrate-from-uikit-validation.spec.ts` with:

- A test that loads all migration entries and for each entry with a
  `nimbusEquivalent` that maps to a known Nimbus component, validates that the
  component exists in the type data.
- A snapshot test that captures the mapping between each migration entry's
  `nimbusEquivalent` and the target component's actual prop names + types. If a
  prop is renamed/removed or a value union changes, the snapshot fails.

### Task 2: Fix migration data (GREEN)

Fix the specific issues in `uikit-migration.ts`:

- Badge entry: Fix `tone` → `colorPalette`, fix value names, fix `size='sm'` →
  valid size
- Card entry: Fix `Card.Content` → `Card.Body`
- Any other issues discovered during snapshot generation

### Task 3: Update snapshot and verify

- Generate the snapshot with corrected data
- Run full test suite to ensure nothing else broke
