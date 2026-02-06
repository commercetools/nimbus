# Proposal: Add Steps Component

## Summary

Add a display-only Steps component for showing progress through multi-step
processes like forms, wizards, and onboarding flows. The component uses a
compound architecture (Steps.Root, Steps.List, Steps.Item, etc.) following
established Nimbus patterns.

## Motivation

Currently, Nimbus does not provide a component for displaying multi-step
progress. Users building forms, wizards, or onboarding flows must create custom
solutions, leading to inconsistent implementations and accessibility issues. A
standardized Steps component will:

- Provide accessible progress indication for multi-step processes
- Ensure consistent visual design across applications
- Reduce development effort for common use cases
- Maintain WCAG 2.1 AA compliance standards

## Scope

### In Scope

- Display-only progress indicator (no navigation)
- Compound component architecture for flexibility
- Three size variants: xs (24px), sm (32px), md (40px) indicators
- Two orientations: horizontal and vertical
- Two indicator types: numeric (with checkmark on complete) and icon (with state
  styling)
- Automatic state derivation from step/index comparison
- Full accessibility support (ARIA attributes, semantic HTML)
- Comprehensive Storybook stories and tests
- Developer and designer documentation

### Out of Scope

- Interactive navigation between steps (use Tabs component instead)
- Content panels associated with steps (consumers manage content externally)
- Form validation or submission logic
- Convenience wrapper with array API (future non-breaking enhancement)
- Animation between step transitions (left to consumers)

## Design Decisions

### 1. Display-Only vs Interactive

**Decision**: Display-only progress indicator without built-in navigation.

**Rationale**:

- Clear separation of concerns (progress vs navigation)
- Simpler implementation and API surface
- Interactive navigation requires step validation, content management, and
  complex state
- Consumers can add navigation controls externally as needed

### 2. Compound Components vs Simple API

**Decision**: Compound component architecture (Steps.Root, Steps.List,
Steps.Item, etc.)

**Rationale**:

- Aligns with Nimbus patterns for complex components (Accordion, ComboBox, Menu)
- Provides maximum flexibility for customization
- Enables per-step customization (icons, badges, custom content)
- Easier to extend without breaking changes
- React Aria doesn't provide Steps primitives, so building from scratch

**Future Enhancement**: Can add convenience wrapper with array API as
non-breaking addition later.

### 3. State Management Pattern

**Decision**: Context-based state derivation (step prop flows from Root to
Items)

**Rationale**:

- Single source of truth (step prop on Root)
- Items derive state by comparing their index to current step
- No prop drilling required
- Pattern used by other compound components in Nimbus

### 4. Indicator Types

**Decision**: Support both numeric and icon indicators

**Rationale**:

- Numeric: Default, clear ordinal position, checkmark on complete
- Icon: Semantic meaning (e.g., user icon for profile step)
- Matches Figma design specifications
- Provides flexibility for different use cases

## Implementation Plan

See `tasks.md` for detailed implementation steps.

## Risks and Mitigations

### Risk: Scope Creep

Users may request interactive navigation, form integration, validation, etc.

**Mitigation**: Clear documentation that component is display-only. Provide
examples of external navigation controls.

### Risk: Complexity of Compound API

First-time users may find compound components verbose.

**Mitigation**:

- Comprehensive examples in documentation
- Clear JSDoc comments on all components
- Future convenience wrapper for simple use cases

### Risk: Figma Design Changes

Design specifications may evolve during implementation.

**Mitigation**: Detailed design captured in spec with clear measurements,
colors, and tokens. Any changes require spec update first.

## Success Criteria

- [ ] All components implemented with TypeScript types
- [ ] Chakra UI v3 recipe with all size/orientation variants
- [ ] Storybook stories cover all variants and states
- [ ] Play functions test state derivation and accessibility
- [ ] WCAG 2.1 AA compliance verified
- [ ] Developer documentation (`.dev.mdx`) complete
- [ ] Designer guidelines (`.guidelines.mdx`) complete
- [ ] Recipe registered in theme config
- [ ] Component exported from main package
- [ ] All validation passes
      (`pnpm openspec validate add-steps-component --strict`)
