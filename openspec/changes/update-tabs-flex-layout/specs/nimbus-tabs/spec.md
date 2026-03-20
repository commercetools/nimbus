## MODIFIED Requirements

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** tabs render
- **THEN** SHALL apply tabs slot recipe from theme/slot-recipes/tabs.ts
- **AND** SHALL style: root, tabList, tab, indicator, panel slots
- **AND** SHALL support size and variant options
- **AND** SHALL support orientation styles

#### Scenario: Root flex participation
- **WHEN** Tabs.Root is placed inside a flex-direction column parent
- **THEN** root SHALL grow to fill available space along the flex axis via `flex: 1`
- **AND** root SHALL set `minHeight: 0` to allow content overflow in nested flex containers
- **AND** these properties SHALL have no visible effect when Tabs is not inside a flex parent
