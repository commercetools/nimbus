## ADDED Requirements

### Requirement: Content Style Props
Menu.Content SHALL accept and forward Chakra UI style props to the popover container.

#### Scenario: Width override
- **WHEN** a `width` prop is passed to Menu.Content
- **THEN** the flyout container SHALL render with that width

#### Scenario: Style props forwarding
- **WHEN** any valid Chakra style prop (e.g. `maxHeight`, `minWidth`, `bg`) is passed to Menu.Content
- **THEN** the prop SHALL be forwarded to the popover slot element

#### Scenario: Existing props unchanged
- **WHEN** `placement`, `ref`, or `children` are passed to Menu.Content
- **THEN** they SHALL continue to work as before
