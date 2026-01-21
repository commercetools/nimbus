# Spec Delta: ComboBox Clear Button Behavior

## MODIFIED Requirements

### Requirement: Clear Button

The component SHALL provide input clearing capability.

#### Scenario: Clear button visibility

- **WHEN** input has value or selection exists
- **THEN** SHALL show clear button
- **AND** SHALL hide clear button when no value or selection

#### Scenario: Clear button in multi-select mode

- **WHEN** user clicks clear button in multi-select mode
- **THEN** SHALL clear all selected items
- **AND** SHALL clear input text
- **AND** SHALL keep dropdown/menu OPEN
- **AND** SHALL maintain focus on input field
- **AND** SHALL reset filter (show all available options)
- **AND** SHALL allow user to continue selecting without reopening menu

#### Scenario: Clear button in single-select mode

- **WHEN** user clicks clear button in single-select mode
- **THEN** SHALL clear selected item
- **AND** SHALL clear input text
- **AND** SHALL keep dropdown/menu OPEN if input is focused
- **AND** SHALL maintain focus on input field
- **AND** SHALL show all available options

#### Scenario: Clear button callback behavior

- **WHEN** clear button is clicked
- **THEN** SHALL call onInputChange with empty string
- **AND** SHALL call onSelectionChange with appropriate empty value:
  - Multi-select: empty array `[]`
  - Single-select: `null`

#### Scenario: Clear button accessibility

- **WHEN** component renders with value/selection
- **THEN** clear button SHALL use i18n aria-label "Clear selection"
- **AND** SHALL be keyboard accessible
- **AND** SHALL not trigger blur event on input when clicked
- **AND** SHALL not cause menu to close

#### Scenario: Clear button focus management

- **WHEN** clear button is clicked
- **THEN** SHALL maintain input focus (not transfer focus to button)
- **AND** SHALL ensure blur handler does not interpret click as focus loss
- **AND** SHALL keep menu open by preventing blur-triggered closure

#### Scenario: Keyboard-based clearing

- **WHEN** input is empty and user presses Backspace
- **THEN** SHALL clear last selected item (multi-select) or selection
  (single-select)
- **AND** SHALL keep menu open if menu was already open
- **AND** SHALL maintain input focus

## Rationale

This change fixes a UX bug where the clear button incorrectly closes the
dropdown menu, interrupting the user's selection workflow. The new behavior
aligns with:

1. **Design System Patterns**: Carbon Design System, Material UI, and Chakra UI
   all keep menus open after clearing in multi-select contexts to reduce
   interaction cost

2. **User Workflow**: Clearing selections typically indicates "reset and try
   again," not "I'm done selecting," so the menu should remain available

3. **Reduced Interaction Cost**: Users can immediately continue selecting items
   without needing to manually reopen the menu

4. **Focus Continuity**: Keeping focus on the input and menu open creates a
   seamless experience for rapid selection/filtering/clearing cycles

## Breaking Changes

**None.** This is a bug fix that restores correct behavior. Users can still
close the menu via:

- Pressing Escape key
- Pressing Tab key
- Clicking outside the component
- Explicitly setting `isOpen={false}` (controlled mode)

The change only affects the clear button's behavior, which was previously
incorrect.
