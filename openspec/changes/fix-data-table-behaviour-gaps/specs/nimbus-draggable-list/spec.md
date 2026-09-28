## MODIFIED Requirements

### Requirement: Item Removal

The component SHALL support optional item removal functionality.

#### Scenario: Removable items enabled

- **WHEN** removableItems prop is true
- **THEN** SHALL render remove button (IconButton with Close icon) in each item
- **AND** remove button SHALL have the localized aria-label "remove item" unless
  the item sets `removeButtonLabel`
- **AND** SHALL be positioned after item content
- **AND** SHALL pass onRemoveItem callback to items

#### Scenario: Custom remove button label

- **WHEN** a `DraggableList.Item` receives `removeButtonLabel`
- **THEN** its remove button SHALL use that string as its aria-label

#### Scenario: Remove button interaction

- **WHEN** user clicks remove button
- **THEN** SHALL call onRemoveItem with item key
- **AND** SHALL remove item from list
- **AND** SHALL call onUpdateItems with updated items array

#### Scenario: Keyboard removal

- **WHEN** user navigates to remove button and presses Enter
- **THEN** SHALL remove item from list
- **AND** SHALL maintain focus management after removal
