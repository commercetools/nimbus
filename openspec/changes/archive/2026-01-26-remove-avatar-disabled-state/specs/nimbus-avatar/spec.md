# Spec Delta: nimbus-avatar

## REMOVED Requirements

### Requirement: Disabled State Support

The component no longer supports disabled visual state.

**Rationale:** Avatar is a non-interactive leaf component (renders as `<figure>`
element). Disabled states are only meaningful for interactive elements. When
Avatar is used within an interactive context (e.g., wrapped in a Button), the
wrapper component provides appropriate disabled styling.

#### Scenario: Disabled styling (REMOVED)

- **WHEN** isDisabled prop is set to true
- **THEN** ~~SHALL apply layerStyle "disabled" from theme~~
- **AND** ~~SHALL reduce opacity and visual prominence~~
- **AND** ~~SHALL indicate non-interactive state~~
- **AND** ~~SHALL apply to both image and initials display~~

**Migration:** If disabled appearance is needed, apply custom styling via
wrapper components or style props:

```tsx
// Using wrapper component (recommended)
<Button isDisabled>
  <Avatar firstName="John" lastName="Doe" />
</Button>

// Using style props (if standalone disabled appearance needed)
<Avatar
  firstName="John"
  lastName="Doe"
  opacity={0.4}
  filter="grayscale(1)"
/>
```

## MODIFIED Requirements

### Requirement: Type Safety

The component SHALL provide comprehensive TypeScript types per nimbus-core
standards.

#### Scenario: Required vs optional props (MODIFIED)

- **WHEN** defining component props
- **THEN** firstName SHALL be required string
- **AND** lastName SHALL be required string
- **AND** src SHALL be optional string
- **AND** alt SHALL be optional string
- **AND** size SHALL be optional with type from recipe
- ~~**AND** isDisabled SHALL be optional boolean with default false~~

**Change:** Removed `isDisabled` prop from type definition.
