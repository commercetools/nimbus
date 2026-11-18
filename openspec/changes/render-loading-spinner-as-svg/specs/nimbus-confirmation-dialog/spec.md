# Spec Delta

## ADDED Requirements

### Requirement: Confirm Spinner Sizing
The loading spinner in the confirm button SHALL be sized like an icon of that button.

#### Scenario: Confirm spinner takes the button icon size
- **WHEN** `isConfirmLoading` is `true`
- **THEN** the `LoadingSpinner` in the confirm `Button` SHALL have no `size` and no margin set by the dialog
- **AND** its size SHALL be the size that the button gives to its icons
- **AND** the spacing from the label SHALL come from the button gap
