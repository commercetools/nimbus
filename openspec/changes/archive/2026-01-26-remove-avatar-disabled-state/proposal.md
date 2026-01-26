# Proposal: Remove Avatar Disabled State

## Summary

Remove the disabled state from the Avatar component. Avatar is a non-interactive
leaf component that displays user images or initials - it has no interactive
states and therefore should not have a disabled visual state.

## Motivation

The Avatar component currently includes:

1. An `isDisabled` prop in its type definitions
2. Disabled styles (`_disabled: { layerStyle: "disabled" }`) in its recipe
3. Documentation examples showing disabled state usage

However, Avatar is fundamentally a **display-only component**:

- It renders as a `<figure>` element (non-interactive)
- It does not participate in tab order
- It has no click handlers or interactive behavior
- The disabled state serves no accessibility purpose for a non-interactive
  element

Interactive behavior should be provided by wrapper components (e.g., `Button`,
`Link`) which have their own disabled states. The Avatar's disabled styling is
misleading and creates unnecessary API surface.

## Scope

### In Scope

- Remove `_disabled` styles from `avatar.recipe.ts`
- Remove `isDisabled` prop from `avatar.types.ts`
- Remove disabled state examples from `avatar.dev.mdx`
- Update spec to remove disabled state requirement

### Out of Scope

- Adding new functionality
- Changes to other components
- Changes to interactive wrapper patterns (Button, Link, etc.)

## Impact

- **Breaking Change**: Minor - removes `isDisabled` prop
- **Migration**: Consumers using `isDisabled` should apply disabled styling via
  wrapper components or custom styling if needed
- **Risk**: Low - Avatar's disabled state is rarely used since Avatar is not
  interactive

## Success Criteria

1. Avatar recipe has no `_disabled` styles
2. AvatarProps does not include `isDisabled`
3. Documentation has no disabled state examples
4. Spec reflects the removal
5. All existing tests pass (no disabled-related tests should exist)
