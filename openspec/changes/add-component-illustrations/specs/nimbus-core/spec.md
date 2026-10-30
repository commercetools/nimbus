# Spec Delta

## MODIFIED Requirements

### Requirement: Consistent File Structure

All components SHALL follow standardized file organization.

#### Scenario: Component directory structure

- **WHEN** component is created
- **THEN** SHALL have directory: src/components/{component-name}/
- **AND** SHALL include: index.ts (exports), {component}.tsx (implementation),
  {component}.types.ts (types), {component}.stories.tsx (tests),
  {component}.illustration.ts (illustration source) and
  {component}.illustration.svg (generated illustration)
- **AND** MAY include: {component}.recipe.ts, {component}.slots.tsx,
  {component}.i18n.ts, {component}.mdx
- **AND** Compound components SHALL have components/ subdirectory
