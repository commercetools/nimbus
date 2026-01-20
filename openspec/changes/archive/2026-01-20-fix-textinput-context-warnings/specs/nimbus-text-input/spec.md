## ADDED Requirements

### Requirement: React Aria Context Integration

The component SHALL properly consume InputContext from react-aria-components
without producing React DOM property warnings.

#### Scenario: Context prop normalization

- **WHEN** TextInput is wrapped in TextInput.Context.Provider with React Aria
  props (isDisabled, isRequired, isReadOnly)
- **THEN** SHALL consume context props correctly
- **AND** SHALL normalize React Aria props to DOM attributes
- **AND** SHALL NOT produce "React does not recognize prop" warnings
- **AND** SHALL NOT leak React Aria props to native DOM elements

#### Scenario: Context provider isolation

- **WHEN** TextInput renders with context
- **THEN** SHALL prevent inner Input component from consuming outer context
- **AND** SHALL maintain control over prop normalization
- **AND** SHALL use InputContext.Provider with null value internally

#### Scenario: Local props override context

- **WHEN** local props conflict with context props
- **THEN** SHALL prioritize local props over context
- **AND** SHALL apply merged props correctly
- **AND** SHALL maintain component behavior
