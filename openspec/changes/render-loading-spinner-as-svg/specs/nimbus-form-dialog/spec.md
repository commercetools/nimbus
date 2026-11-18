# Spec Delta

## ADDED Requirements

### Requirement: Save Spinner Sizing
The loading spinner in the save button SHALL be sized like an icon of that button.

#### Scenario: Save spinner takes the button icon size
- **WHEN** `isSaveLoading` is `true`
- **THEN** the `LoadingSpinner` in the save `Button` SHALL have no `size` and no margin set by the dialog
- **AND** its size SHALL be the size that the button gives to its icons
- **AND** the spacing from the label SHALL come from the button gap
