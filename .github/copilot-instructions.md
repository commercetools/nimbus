# Copilot Instructions

## Project Overview

This is a UI component library project with the following structure:

- **nimbus**: Monorepo root folder
  - **packages/nimbus**: Core UI component library
  - **packages/tokens**: Design tokens
  - **packages/nimbus-icons**: Icon library
  - **packages/color-tokens**: Color definitions
  - **apps/docs**: Documentation site (react spa)

## Component Development Patterns

### Component Structure

Each component in the `nimbus` package follows this file structure:

#### Files

- `component-name.tsx`: Main component implementation OR - when it's a compound
  component - export of all compound components
- `component-name.types.ts`: TypeScript types for the exported components
- `component-name.slots.tsx`: Slot-based components (naming convention:
  ComponentNameSlot)
- `component-name.recipe.ts`: Styling recipes using Chakra UI v3
- `component-name.stories.tsx`: Storybook stories + tests (MANDATORY for all
  components)
- `component-name.mdx`: Documentation in MDX format
- `index.ts`: Exports from the component

#### Folders

- `components` contains the files of the exported compound components of this
  compound component (`component-name.slot-name.tsx`)
- `utils` folder for component specific custom functions (formatters, etc.)

#### Conventions

- The `component-name.recipe.ts` file needs to be imported by
  `packages/nimbus/src/theme/recipes/index.ts` or
  `packages/nimbus/src/theme/slot-recipes/index.ts`, key-name is the capitalized
  version of the component-name

### Naming Conventions

1. Components exported from `*.slots.tsx` files should end with 'Slot' in their
   name (e.g., `ButtonSlot`, `DialogTitleSlot`)
2. Component props should follow the pattern `ComponentNameProps`
3. Slot props should follow the pattern `ComponentNameSlotProps`

### Component Implementation Guidelines

1. Use React Aria Components for accessibility when appropriate
2. Components should be implemented as forwardRef components
3. Use Chakra UI's styling system with slot recipes
4. Components which require state should provide a controlled and uncontrolled
   mode if possible

### React Aria Components Integration

When using React Aria Components:

1. Import the component with a prefix (e.g., `RAButton`) to distinguish it
2. Forward necessary props to the React Aria component

## Code Style and Conventions

### TypeScript

- Use strict typing for all components and functions
- Export types for all component props
- when importing types, annotate them as such (import { **type** FooBar })
- Use interfaces for complex objects with documentation

### Styling

- Use Chakra UI's styling system
- Define styles in recipe files
- Support common variants and sizes
- Use tokens from the theme if possible

### Documentation

- Include JSDoc comments for all components & compound components
- Document props, variants, and features
- Include accessibility information
- Reference any related patterns or standards

## Testing Guidelines

- Write unit tests as part of the storybook stories for component functionality
- Ensure accessibility testing is included
- Test all variants and states

## Pull Request Guidelines

- Include a thorough description of changes
- Reference any related issues
- Include before/after screenshots for visual changes
- Ensure all tests pass
- Check for accessibility compliance

### Glossary

- **Component**: A reusable, abstract, UI building block that encapsulates
  structure, behavior, and styling.
- **React component**: A JavaScript/TypeScript function or class that returns
  JSX and can be composed within a React application.
- **Compound component**: A pattern where multiple react components work
  together to form a cohesive UI element, with a parent component (the root
  component) managing shared state for its children.
- **Root component**: The root component of a compound component
  (`ComponentNameRoot`), providing context for the other components of the
  compound component
- **Slot**: A designated area within a component that can be filled with content
  or other components, enabling flexible composition patterns.
- **Slot component**: A specialized React component (typically defined in
  `*.slots.tsx` files) that represents a specific part of a compound component,
  styled and configured for a particular purpose within the component's
  structure.
- **Recipe**: A styling function in Chakra UI that generates styles based on
  variants, states, and other properties.
- **Slot-Recipe**: A Chakra UI recipe specifically designed to style the
  different parts (slots) of a component.
- **Design Token**: A named variable that stores visual design information (like
  colors, spacing, typography) used across the system to maintain consistency.
- **forwardRef**: A React technique that allows components to take a ref and
  forward it to a child DOM element.
- **Controlled Component**: A component whose state is fully controlled by its
  parent through props and callbacks.
- **Uncontrolled Component**: A component that manages its own state internally,
  typically using React's useState hook.
- **React Aria**: A library of accessibility primitives that provides behavior
  and ARIA semantics for UI components.

## Additional Resources

- [React Aria Components Documentation](https://react-spectrum.adobe.com/react-aria/index.html)
- [Chakra UI Documentation](https://chakra-ui.com/docs/getting-started)
- [Storybook Best Practices](https://storybook.js.org/docs/writing-stories/introduction)
