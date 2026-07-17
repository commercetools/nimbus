## Why

Combobox, Select, and SearchInput lack a `trailingElement` slot, preventing consumers from adding custom trailing content (e.g., action buttons, status indicators, validation icons). The pattern already exists in TextInput, DateInput, and TimeInput, creating an inconsistency across input-style components. Adding `trailingElement` to these three components aligns their APIs and unlocks common use cases without requiring workarounds.

## What Changes

- **Combobox**: Add `trailingElement` ReactNode prop, recipe slot, and slot component. The trailing element renders _after_ the existing clear and toggle buttons at the far trailing edge of the trigger.
- **Select**: Add `trailingElement` ReactNode prop, recipe slot, and slot component. The trailing element renders _after_ the existing clear button and dropdown indicator at the far trailing edge of the trigger.
- **SearchInput**: Add `trailingElement` ReactNode prop, recipe slot, and slot component. The trailing element renders _after_ the existing clear button at the far trailing edge of the input.
- All three follow the established TextInput/DateInput/TimeInput pattern for slot naming, conditional rendering, and styling.

## Capabilities

### New Capabilities

- `trailing-element-combobox`: Add `trailingElement` slot to Combobox component
- `trailing-element-select`: Add `trailingElement` slot to Select component
- `trailing-element-search-input`: Add `trailingElement` slot to SearchInput component

### Modified Capabilities

- `nimbus-combobox`: Adding `trailingElement` prop to the public API
- `nimbus-select`: Adding `trailingElement` prop to the public API
- `nimbus-search-input`: Adding `trailingElement` prop to the public API

## Impact

- **Types**: New `trailingElement?: ReactNode` prop added to `ComboBoxRootProps`, `SelectProps`, and `SearchInputProps`
- **Recipes**: New `trailingElement` slot added to each component's slot recipe
- **Slots**: New slot component exported for each component
- **Rendering**: Trigger/root components updated to conditionally render the trailing element after built-in controls
- **Theme config**: No changes needed — slots are part of existing recipes
- **No breaking changes**: All additions are optional props with no default behavior change
