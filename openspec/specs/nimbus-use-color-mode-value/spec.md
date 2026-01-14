# Specification: useColorModeValue Hook

## Overview

The useColorModeValue hook returns different values based on the current color mode (light or dark). It provides a simple API for conditional rendering and styling that adapts to the active theme, enabling components to provide theme-specific colors, styles, content, or any other values.

**Hook:** `useColorModeValue`
**Package:** `@commercetools/nimbus`
**Type:** React hook
**Generic Type Support:** Yes
**Related Hook:** useColorMode

## Purpose

The useColorModeValue hook enables components to conditionally select values based on the current color mode without manually checking the theme state. It provides a declarative, type-safe way to specify light and dark mode alternatives for any value type, ensuring components adapt seamlessly to theme changes while maintaining full TypeScript type inference.

## Requirements

### Requirement: Hook Signature
The hook SHALL accept two parameters and return one value based on color mode.

#### Scenario: Function signature with generic type
- **WHEN** useColorModeValue is defined
- **THEN** SHALL accept generic type parameter T
- **AND** SHALL accept first parameter 'light' of type T
- **AND** SHALL accept second parameter 'dark' of type T
- **AND** SHALL return value of type T

#### Scenario: Parameter order convention
- **WHEN** hook is called
- **THEN** first parameter SHALL represent light mode value
- **AND** second parameter SHALL represent dark mode value
- **AND** parameter order SHALL match conventional light-then-dark pattern

### Requirement: Generic Type Support
The hook SHALL support any value type with full type inference.

#### Scenario: Primitive types
- **WHEN** hook is called with string values
- **THEN** SHALL infer return type as string
- **WHEN** hook is called with number values
- **THEN** SHALL infer return type as number
- **WHEN** hook is called with boolean values
- **THEN** SHALL infer return type as boolean

#### Scenario: Complex types
- **WHEN** hook is called with object values
- **THEN** SHALL infer return type as object type
- **AND** SHALL preserve object shape in type inference
- **WHEN** hook is called with array values
- **THEN** SHALL infer return type as array type
- **AND** SHALL preserve array element type

#### Scenario: React element types
- **WHEN** hook is called with React elements
- **THEN** SHALL accept JSX elements as values
- **AND** SHALL return appropriate element based on color mode
- **AND** SHALL support component references and icons

### Requirement: Light Mode Value Return
The hook SHALL return the light value when color mode is light.

#### Scenario: Light mode active
- **WHEN** current colorMode is 'light'
- **THEN** SHALL return first parameter value (light value)
- **AND** SHALL NOT return second parameter value
- **AND** SHALL match value provided to first parameter exactly

#### Scenario: Light value reactivity
- **WHEN** light parameter value changes while in light mode
- **THEN** SHALL return updated light value
- **AND** SHALL trigger component re-render
- **AND** SHALL reflect new value immediately

### Requirement: Dark Mode Value Return
The hook SHALL return the dark value when color mode is dark.

#### Scenario: Dark mode active
- **WHEN** current colorMode is 'dark'
- **THEN** SHALL return second parameter value (dark value)
- **AND** SHALL NOT return first parameter value
- **AND** SHALL match value provided to second parameter exactly

#### Scenario: Dark value reactivity
- **WHEN** dark parameter value changes while in dark mode
- **THEN** SHALL return updated dark value
- **AND** SHALL trigger component re-render
- **AND** SHALL reflect new value immediately

### Requirement: Color Mode Detection
The hook SHALL detect current color mode via useColorMode hook.

#### Scenario: useColorMode integration
- **WHEN** useColorModeValue is called
- **THEN** SHALL internally call useColorMode hook
- **AND** SHALL access colorMode property from useColorMode
- **AND** SHALL share same theme context as useColorMode

#### Scenario: Resolved theme usage
- **WHEN** determining which value to return
- **THEN** SHALL use resolvedTheme from next-themes
- **AND** SHALL NOT use system preference directly
- **AND** SHALL match the actual applied theme ('light' or 'dark')

#### Scenario: System preference resolution
- **WHEN** theme is set to 'system' and enableSystem is true
- **THEN** SHALL return value based on resolved system preference
- **AND** 'light' SHALL return first parameter value
- **AND** 'dark' SHALL return second parameter value

### Requirement: Reactive Updates on Color Mode Change
The hook SHALL update return value when color mode changes.

#### Scenario: Toggle from light to dark
- **WHEN** color mode changes from 'light' to 'dark'
- **THEN** SHALL update return value to dark parameter value
- **AND** SHALL trigger component re-render
- **AND** SHALL update synchronously with colorMode change

#### Scenario: Toggle from dark to light
- **WHEN** color mode changes from 'dark' to 'light'
- **THEN** SHALL update return value to light parameter value
- **AND** SHALL trigger component re-render
- **AND** SHALL update synchronously with colorMode change

#### Scenario: Multiple hook instances synchronization
- **WHEN** multiple components use useColorModeValue
- **THEN** all instances SHALL update simultaneously on theme change
- **AND** all SHALL receive updated values in same render cycle
- **AND** SHALL maintain consistency across component tree

### Requirement: Type Inference from Arguments
The hook SHALL infer return type from provided arguments.

#### Scenario: Automatic type inference
- **WHEN** hook is called with typed values
- **THEN** TypeScript SHALL infer generic type T automatically
- **AND** SHALL NOT require explicit type annotation
- **AND** return type SHALL match parameter types

#### Scenario: Mixed type handling
- **WHEN** light and dark parameters have compatible types
- **THEN** SHALL infer common type
- **WHEN** light and dark parameters have incompatible types
- **THEN** TypeScript SHALL show type error
- **AND** SHALL require explicit union type or type adjustment

#### Scenario: Const values type narrowing
- **WHEN** hook is called with literal values
- **THEN** SHALL preserve literal types in inference
- **AND** SHALL enable discriminated unions when applicable
- **AND** SHALL provide narrowest possible return type

### Requirement: Conditional Styling Use Case
The hook SHALL support conditional styling based on theme.

#### Scenario: Color value switching
- **WHEN** hook is used for color values
- **THEN** SHALL accept color tokens or CSS color values
- **AND** SHALL return appropriate color for current mode
- **AND** SHALL integrate with Chakra style props

#### Scenario: Background and foreground colors
- **WHEN** hook is used for background colors
- **THEN** SHALL support switching between light and dark backgrounds
- **WHEN** hook is used for text colors
- **THEN** SHALL support switching between light and dark text colors
- **AND** SHALL maintain WCAG contrast requirements per nimbus-core standards

#### Scenario: Border and shadow values
- **WHEN** hook is used for borders or shadows
- **THEN** SHALL support theme-specific border colors
- **AND** SHALL support theme-specific shadow definitions
- **AND** SHALL work with design token references

### Requirement: Theme-Specific Content Use Case
The hook SHALL support conditional content rendering.

#### Scenario: Text content switching
- **WHEN** hook is used for text content
- **THEN** SHALL return theme-specific strings
- **AND** SHALL enable different labels for light/dark modes
- **AND** SHALL work with internationalized messages

#### Scenario: Icon switching
- **WHEN** hook is used for icon components
- **THEN** SHALL return different icons for light/dark modes
- **AND** SHALL support nimbus-icons package icons
- **AND** SHALL enable theme-appropriate iconography

#### Scenario: Image source switching
- **WHEN** hook is used for image sources
- **THEN** SHALL return theme-specific image URLs
- **AND** SHALL enable light/dark optimized images
- **AND** SHALL support conditional asset loading

### Requirement: Dynamic Value Use Case
The hook SHALL support any dynamic value type.

#### Scenario: Configuration objects
- **WHEN** hook is used with configuration objects
- **THEN** SHALL return complete object for current mode
- **AND** SHALL support nested object structures
- **AND** SHALL enable theme-specific settings

#### Scenario: Style objects
- **WHEN** hook is used with style objects
- **THEN** SHALL return complete style object for current mode
- **AND** SHALL work with Chakra style prop objects
- **AND** SHALL support responsive style values

#### Scenario: Component references
- **WHEN** hook is used with component references
- **THEN** SHALL return different component types per mode
- **AND** SHALL enable theme-specific component rendering
- **AND** SHALL maintain type safety for component props

### Requirement: NimbusProvider Context Requirement
The hook SHALL only function within NimbusProvider context per nimbus-core standards.

#### Scenario: Valid provider context
- **WHEN** useColorModeValue is called within NimbusProvider
- **THEN** SHALL access theme context successfully
- **AND** SHALL return appropriate value based on current color mode
- **AND** SHALL function correctly with all color mode operations

#### Scenario: Missing provider context
- **WHEN** useColorModeValue is called outside NimbusProvider
- **THEN** useColorMode SHALL throw error from next-themes
- **AND** error SHALL indicate missing ThemeProvider context
- **AND** developer SHALL wrap application with NimbusProvider

### Requirement: SSR Compatibility
The hook SHALL work correctly in server-side rendering environments.

#### Scenario: Server-side rendering
- **WHEN** hook is called during SSR
- **THEN** SHALL handle undefined colorMode gracefully
- **AND** SHALL return light value as default during SSR
- **AND** SHALL prevent hydration mismatches

#### Scenario: Client-side hydration
- **WHEN** component hydrates on client
- **THEN** SHALL update to correct value for actual color mode
- **AND** SHALL match server-rendered content initially
- **AND** SHALL sync with next-themes after hydration

#### Scenario: next-themes initialization
- **WHEN** next-themes initializes color mode
- **THEN** hook SHALL return undefined initially (matching useColorMode)
- **AND** SHALL update to resolved theme value after initialization
- **AND** SHALL prevent flash of wrong content

### Requirement: React Hook Rules Compliance
The hook SHALL follow React hook rules per nimbus-core standards.

#### Scenario: Hook naming convention
- **WHEN** hook is defined
- **THEN** SHALL be named with 'use' prefix
- **AND** SHALL follow camelCase naming convention
- **AND** name SHALL clearly indicate color mode value functionality

#### Scenario: Top-level usage only
- **WHEN** hook is called
- **THEN** SHALL only be called at top level of component or custom hook
- **AND** SHALL NOT be called conditionally
- **AND** SHALL NOT be called in loops or nested functions
- **AND** SHALL NOT be called in event handlers

#### Scenario: Component and hook context
- **WHEN** hook is used
- **THEN** SHALL only be called from React function components
- **OR** SHALL only be called from custom hooks
- **AND** SHALL NOT be called from regular JavaScript functions
- **AND** SHALL follow all Rules of Hooks

### Requirement: Performance Characteristics
The hook SHALL provide efficient value selection and updates.

#### Scenario: Minimal re-renders
- **WHEN** color mode changes
- **THEN** SHALL only re-render components using useColorModeValue or useColorMode
- **AND** SHALL NOT cause unnecessary re-renders of unrelated components
- **AND** next-themes context SHALL optimize render propagation

#### Scenario: Value computation efficiency
- **WHEN** hook executes
- **THEN** SHALL perform simple ternary evaluation
- **AND** SHALL NOT perform expensive computations
- **AND** SHALL execute synchronously without delays

#### Scenario: Multiple hook instances performance
- **WHEN** multiple instances of hook exist in render tree
- **THEN** all SHALL share same useColorMode context
- **AND** SHALL NOT duplicate theme state subscriptions
- **AND** SHALL update efficiently in parallel

### Requirement: useColorMode Integration
The hook SHALL work seamlessly with useColorMode hook.

#### Scenario: Shared context consumption
- **WHEN** both hooks are used in same component
- **THEN** both SHALL consume same next-themes context
- **AND** colorMode value SHALL be consistent between hooks
- **AND** theme changes SHALL update both hooks synchronously

#### Scenario: Complementary functionality
- **WHEN** component needs theme control and conditional values
- **THEN** useColorMode SHALL provide state and control functions
- **AND** useColorModeValue SHALL provide conditional value selection
- **AND** both SHALL be safe to use together without conflicts

### Requirement: Memoization Considerations
The hook SHALL handle value memoization appropriately.

#### Scenario: No automatic memoization
- **WHEN** hook parameters are objects or arrays
- **THEN** SHALL NOT automatically memoize parameter values
- **AND** new object/array references SHALL cause re-evaluation
- **AND** developer SHALL use useMemo for expensive values if needed

#### Scenario: Stable primitive values
- **WHEN** hook parameters are primitive values
- **THEN** SHALL return same primitive value on each render
- **AND** SHALL not require additional memoization
- **AND** SHALL be safe for dependency arrays

### Requirement: Experimental Status
The hook SHALL be marked as experimental in its API.

#### Scenario: Experimental annotation
- **WHEN** hook JSDoc is read
- **THEN** SHALL include @experimental tag
- **AND** SHALL document that API may change in future versions
- **AND** SHALL guide developers to expect potential breaking changes

#### Scenario: Public export
- **WHEN** hook is imported from @commercetools/nimbus
- **THEN** SHALL be exported from package index
- **AND** SHALL be available as named export
- **AND** SHALL be documented in package API

### Requirement: Common Usage Patterns
The hook SHALL support established usage patterns.

#### Scenario: Inline value switching
- **WHEN** hook is used directly in JSX
- **THEN** SHALL work inline with component props
- **AND** SHALL provide clean declarative API
- **AND** example: `<Box bg={useColorModeValue('white', 'black')} />`

#### Scenario: Variable assignment pattern
- **WHEN** hook result is assigned to variable
- **THEN** SHALL work with destructured or named variables
- **AND** SHALL support multiple value selections per component
- **AND** example: `const bg = useColorModeValue('white', 'black')`

#### Scenario: Style prop object pattern
- **WHEN** hook is used within style object
- **THEN** SHALL work as object property values
- **AND** SHALL compose with other style properties
- **AND** SHALL integrate with responsive style patterns

### Requirement: Error Handling
The hook SHALL handle edge cases gracefully.

#### Scenario: Undefined color mode handling
- **WHEN** colorMode is undefined during initialization
- **THEN** SHALL default to returning light value (first parameter)
- **AND** SHALL not throw error
- **AND** SHALL update to correct value once colorMode is resolved

#### Scenario: Null or undefined parameters
- **WHEN** hook is called with null or undefined values
- **THEN** SHALL accept and return null/undefined as valid values
- **AND** SHALL maintain type safety with union types
- **AND** SHALL not throw runtime errors

### Requirement: Documentation Requirements
The hook SHALL be fully documented per nimbus-core standards.

#### Scenario: JSDoc comments
- **WHEN** hook source code is viewed
- **THEN** SHALL have comprehensive JSDoc block
- **AND** SHALL document @experimental status
- **AND** SHALL document generic type parameter
- **AND** SHALL document @param tags for light and dark values
- **AND** SHALL document @returns tag with explanation
- **AND** SHALL include usage @example

#### Scenario: API documentation
- **WHEN** hook is published
- **THEN** SHALL be documented in Nimbus documentation site
- **AND** SHALL include usage examples for common patterns
- **AND** SHALL document relationship with useColorMode
- **AND** SHALL document relationship with NimbusProvider

### Requirement: TypeScript Type Exports
The hook SHALL export appropriate TypeScript types.

#### Scenario: No separate props interface needed
- **WHEN** hook types are considered
- **THEN** SHALL NOT require separate props interface
- **AND** function signature SHALL provide complete type information
- **AND** generic type T SHALL be inferred from usage

#### Scenario: Re-export from package
- **WHEN** hook is imported
- **THEN** SHALL be re-exported from package index
- **AND** TypeScript declaration SHALL be available in dist/
- **AND** SHALL provide full IntelliSense support
