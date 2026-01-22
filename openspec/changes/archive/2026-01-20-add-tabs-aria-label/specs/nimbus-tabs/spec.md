# Spec Delta: nimbus-tabs

## ADDED Requirements

### Requirement: Tab List Accessibility Label

The component SHALL support providing an accessible label for the tab list when
using the simplified API.

#### Scenario: tabListAriaLabel with tabs prop

- **WHEN** `tabs` prop is provided to Tabs.Root
- **AND** `tabListAriaLabel` prop is provided
- **THEN** SHALL apply aria-label to the rendered TabList
- **AND** SHALL improve accessibility for screen readers

#### Scenario: tabListAriaLabel without tabs prop

- **WHEN** children-based composition is used (no `tabs` prop)
- **THEN** `tabListAriaLabel` SHALL be ignored
- **AND** consumer SHALL apply aria-label directly to Tabs.List

#### Scenario: Missing tabListAriaLabel

- **WHEN** `tabs` prop is provided without `tabListAriaLabel`
- **THEN** TabList SHALL render without aria-label
- **AND** component SHALL still function correctly
- **AND** accessibility tools MAY warn about missing label
