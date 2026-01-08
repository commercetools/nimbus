# Specification: useColorScheme Hook

## Overview

The useColorScheme hook provides read-only access to the current color-scheme CSS property applied to the document's HTML element. Unlike useColorMode which manages theme state and provides control functions, this hook observes the actual CSS color-scheme value that browsers use for rendering built-in UI elements and default styles.

**Hook:** `useColorScheme`
**Package:** `@commercetools/nimbus`
**Type:** React hook
**Status:** Experimental
**Related Hooks:** useColorMode (manages theme state), useColorModeValue (returns theme-specific values)

## Purpose

The useColorScheme hook enables components to observe the color-scheme CSS property that controls browser rendering of native UI elements. It provides reactive updates when the color-scheme changes through style modifications or localStorage updates, allowing components to synchronize with the browser's color rendering mode. This hook serves as a low-level primitive for observing the actual applied color-scheme, distinct from the higher-level useColorMode hook which manages theme state.

## Requirements

### Requirement: Hook Return Value
The hook SHALL return the current color-scheme CSS property value as a string.

#### Scenario: Return type
- **WHEN** useColorScheme is called
- **THEN** SHALL return a string value
- **AND** value SHALL represent the current color scheme
- **AND** SHALL be either 'light', 'dark', or custom value from CSS

#### Scenario: TypeScript type definition
- **WHEN** hook is used in TypeScript
- **THEN** SHALL provide return type as string
- **AND** SHALL NOT restrict to literal union type
- **AND** SHALL allow any valid CSS color-scheme value

### Requirement: Color Scheme CSS Property Detection
The hook SHALL read the color-scheme CSS property from the document's HTML element.

#### Scenario: CSS property access
- **WHEN** hook initializes or updates
- **THEN** SHALL access document.documentElement.style
- **AND** SHALL read color-scheme property value using getPropertyValue
- **AND** SHALL retrieve inline style property from HTML element

#### Scenario: Empty CSS property
- **WHEN** color-scheme property is not set on HTML element
- **THEN** SHALL receive empty string from getPropertyValue
- **AND** SHALL proceed to fallback chain
- **AND** SHALL NOT throw error

### Requirement: Fallback Chain
The hook SHALL implement a fallback chain when color-scheme CSS property is not set.

#### Scenario: localStorage fallback
- **WHEN** color-scheme CSS property is empty
- **THEN** SHALL read 'theme' key from localStorage
- **AND** SHALL use localStorage value if present
- **AND** SHALL proceed to default if localStorage is also empty

#### Scenario: Default light mode
- **WHEN** both CSS property and localStorage are empty
- **THEN** SHALL return 'light' as default value
- **AND** SHALL NOT return undefined or null
- **AND** SHALL provide predictable fallback

#### Scenario: Fallback priority order
- **WHEN** determining color scheme value
- **THEN** SHALL check color-scheme CSS property first
- **AND** SHALL check localStorage second
- **AND** SHALL use 'light' default third
- **AND** SHALL apply first non-empty value in chain

### Requirement: Initial State
The hook SHALL establish initial color scheme state on mount.

#### Scenario: Initial value on mount
- **WHEN** component using hook mounts
- **THEN** SHALL call getCurrentColorScheme helper immediately
- **AND** SHALL set initial state using useState
- **AND** SHALL reflect current color scheme before useEffect runs

#### Scenario: Synchronous initialization
- **WHEN** hook is first called
- **THEN** SHALL synchronously read color scheme value
- **AND** SHALL NOT return undefined during initial render
- **AND** SHALL provide immediate value for rendering

### Requirement: MutationObserver Setup
The hook SHALL observe changes to the HTML element's style attribute using MutationObserver.

#### Scenario: Observer creation
- **WHEN** component mounts and useEffect runs
- **THEN** SHALL create new MutationObserver instance
- **AND** SHALL configure observer with callback function
- **AND** SHALL prepare observer for style attribute monitoring

#### Scenario: Observer configuration
- **WHEN** observer is attached to HTML element
- **THEN** SHALL observe document.documentElement
- **AND** SHALL set attributes: true in observer options
- **AND** SHALL set attributeFilter: ['style'] to watch only style attribute

#### Scenario: Observation scope
- **WHEN** observer monitors element
- **THEN** SHALL only trigger on style attribute changes
- **AND** SHALL NOT observe child elements
- **AND** SHALL NOT observe other attributes (class, data-*, etc.)

### Requirement: Reactive Color Scheme Updates
The hook SHALL update state when color scheme changes.

#### Scenario: Style attribute mutation detection
- **WHEN** HTML element's style attribute changes
- **THEN** MutationObserver callback SHALL execute
- **AND** SHALL call getCurrentColorScheme to read new value
- **AND** SHALL trigger state update with new color scheme

#### Scenario: Component re-render on update
- **WHEN** color scheme state updates
- **THEN** SHALL trigger component re-render
- **AND** SHALL return new color scheme value
- **AND** SHALL propagate change to consuming components

#### Scenario: Multiple changes handling
- **WHEN** style attribute changes multiple times rapidly
- **THEN** SHALL invoke observer callback for each mutation
- **AND** SHALL update state for each detected change
- **AND** SHALL batch React state updates per React's batching rules

### Requirement: Observer Cleanup
The hook SHALL properly clean up MutationObserver on unmount.

#### Scenario: Cleanup function
- **WHEN** useEffect returns cleanup function
- **THEN** cleanup SHALL call observer.disconnect()
- **AND** SHALL remove all observation targets
- **AND** SHALL prevent memory leaks

#### Scenario: Unmount cleanup
- **WHEN** component using hook unmounts
- **THEN** SHALL execute cleanup function
- **AND** SHALL disconnect observer before unmount completes
- **AND** SHALL NOT leave observer active

#### Scenario: Re-render stability
- **WHEN** component re-renders without unmounting
- **THEN** useEffect SHALL NOT re-run due to empty dependency array
- **AND** observer SHALL remain connected
- **AND** cleanup SHALL only run on unmount

### Requirement: localStorage Integration
The hook SHALL read from localStorage as fallback for color scheme value.

#### Scenario: Reading theme key
- **WHEN** color-scheme CSS property is empty
- **THEN** SHALL call localStorage.getItem('theme')
- **AND** SHALL use returned value if truthy
- **AND** SHALL handle null return value gracefully

#### Scenario: localStorage updates
- **WHEN** localStorage 'theme' value changes
- **THEN** SHALL detect change only if style attribute mutation also occurs
- **AND** SHALL NOT directly observe localStorage changes
- **AND** SHALL rely on style attribute as primary change signal

#### Scenario: localStorage unavailable
- **WHEN** localStorage is blocked or unavailable (strict privacy mode)
- **THEN** SHALL handle getItem error gracefully
- **AND** SHALL fall back to default 'light' value
- **AND** SHALL NOT throw error or crash

### Requirement: Browser Environment Requirement
The hook SHALL only function in browser environment with DOM access.

#### Scenario: Browser API usage
- **WHEN** hook executes
- **THEN** SHALL access document.documentElement
- **AND** SHALL call localStorage.getItem
- **AND** SHALL create MutationObserver instance

#### Scenario: SSR incompatibility
- **WHEN** hook runs during server-side rendering
- **THEN** SHALL throw error due to missing document object
- **AND** SHALL require client-side only usage
- **AND** SHALL NOT provide SSR-safe fallback behavior

### Requirement: React Hook Rules Compliance
The hook SHALL follow React Rules of Hooks per nimbus-core standards.

#### Scenario: Hook naming convention
- **WHEN** hook is defined
- **THEN** SHALL be named with 'use' prefix
- **AND** SHALL follow camelCase naming (useColorScheme)
- **AND** name SHALL clearly indicate color scheme functionality

#### Scenario: Top-level usage requirement
- **WHEN** hook is called
- **THEN** SHALL only be called at top level of component or custom hook
- **AND** SHALL NOT be called conditionally
- **AND** SHALL NOT be called in loops or nested functions

#### Scenario: Component context requirement
- **WHEN** hook is used
- **THEN** SHALL only be called from React function components
- **AND** SHALL only be called from custom hooks
- **AND** SHALL NOT be called from regular JavaScript functions

### Requirement: useState Hook Integration
The hook SHALL use useState for reactive color scheme state management.

#### Scenario: State initialization
- **WHEN** hook is called
- **THEN** SHALL call useState with getCurrentColorScheme() result
- **AND** SHALL initialize state with current color scheme value
- **AND** SHALL establish reactive state container

#### Scenario: State update function
- **WHEN** MutationObserver detects change
- **THEN** SHALL call setColorScheme with new value
- **AND** SHALL update state asynchronously per React scheduling
- **AND** SHALL trigger component re-render

### Requirement: useEffect Hook Integration
The hook SHALL use useEffect for MutationObserver lifecycle management.

#### Scenario: Effect timing
- **WHEN** component mounts
- **THEN** useEffect SHALL run after initial render
- **AND** SHALL set up MutationObserver after DOM is available
- **AND** SHALL execute synchronously in browser environment

#### Scenario: Empty dependency array
- **WHEN** useEffect is configured
- **THEN** SHALL provide empty dependency array []
- **AND** SHALL run effect only once on mount
- **AND** SHALL run cleanup only on unmount

#### Scenario: Effect cleanup
- **WHEN** useEffect returns cleanup function
- **THEN** cleanup SHALL be invoked on component unmount
- **AND** SHALL disconnect MutationObserver
- **AND** SHALL prevent observer from remaining active

### Requirement: Helper Function Encapsulation
The hook SHALL define getCurrentColorScheme as internal helper function.

#### Scenario: Function scope
- **WHEN** getCurrentColorScheme is defined
- **THEN** SHALL be defined within useColorScheme function scope
- **AND** SHALL NOT be exported or accessible outside hook
- **AND** SHALL access closure variables if needed

#### Scenario: Function reuse
- **WHEN** helper function is called
- **THEN** SHALL be invoked during initial state setup
- **AND** SHALL be invoked in MutationObserver callback
- **AND** SHALL encapsulate fallback chain logic consistently

#### Scenario: Return value
- **WHEN** getCurrentColorScheme executes
- **THEN** SHALL return string value
- **AND** SHALL apply fallback chain (CSS property → localStorage → 'light')
- **AND** SHALL always return non-empty string

### Requirement: Style Attribute Monitoring
The hook SHALL specifically monitor the style attribute, not other document changes.

#### Scenario: Style-only observation
- **WHEN** MutationObserver is configured
- **THEN** SHALL use attributeFilter: ['style']
- **AND** SHALL NOT observe class attribute changes
- **AND** SHALL NOT observe data attributes or other properties

#### Scenario: Non-style changes ignored
- **WHEN** HTML element's class or other attributes change
- **THEN** observer callback SHALL NOT execute
- **AND** color scheme state SHALL NOT update
- **AND** component SHALL NOT re-render from non-style changes

### Requirement: Experimental Status Annotation
The hook SHALL be marked as experimental in its public API.

#### Scenario: JSDoc experimental tag
- **WHEN** hook implementation has JSDoc comment
- **THEN** SHALL include @experimental tag
- **AND** SHALL document that API may change in future versions
- **AND** SHALL warn developers of potential breaking changes

#### Scenario: Public export
- **WHEN** hook is exported from package
- **THEN** SHALL be exported from hooks/use-color-scheme/index.ts
- **AND** SHALL be re-exported from @commercetools/nimbus package
- **AND** experimental status SHALL be visible in documentation

### Requirement: No Provider Dependency
The hook SHALL function independently without requiring NimbusProvider context.

#### Scenario: Standalone operation
- **WHEN** useColorScheme is called in any component
- **THEN** SHALL NOT require NimbusProvider wrapper
- **AND** SHALL NOT consume React context
- **AND** SHALL access DOM directly without context dependency

#### Scenario: Provider-independent usage
- **WHEN** component uses hook outside NimbusProvider
- **THEN** SHALL function correctly
- **AND** SHALL read color-scheme CSS property
- **AND** SHALL NOT throw context error

### Requirement: Distinction from useColorMode Hook
The hook SHALL be distinct from useColorMode in purpose and behavior per nimbus-core standards.

#### Scenario: Different responsibilities
- **WHEN** useColorScheme is compared to useColorMode
- **THEN** useColorScheme SHALL observe color-scheme CSS property
- **AND** useColorMode SHALL manage theme state and provide control functions
- **AND** useColorScheme SHALL be read-only without setters

#### Scenario: Implementation independence
- **WHEN** useColorScheme executes
- **THEN** SHALL NOT call useColorMode internally
- **AND** SHALL NOT depend on next-themes ThemeProvider
- **AND** SHALL use MutationObserver, not theme context

#### Scenario: Complementary usage
- **WHEN** both hooks are available in codebase
- **THEN** useColorMode SHALL be primary hook for theme management
- **AND** useColorScheme SHALL be used for observing applied CSS property
- **AND** both MAY be used together if component needs both perspectives

### Requirement: Multiple Hook Instances
The hook SHALL support multiple instances across component tree.

#### Scenario: Multiple components using hook
- **WHEN** multiple components call useColorScheme
- **THEN** each instance SHALL maintain independent state
- **AND** each SHALL set up separate MutationObserver
- **AND** all observers SHALL monitor same document.documentElement

#### Scenario: Synchronized updates
- **WHEN** style attribute changes on HTML element
- **THEN** all MutationObserver instances SHALL detect change
- **AND** all components SHALL update their independent state
- **AND** all SHALL render with same color scheme value

### Requirement: Performance Characteristics
The hook SHALL provide efficient color scheme observation.

#### Scenario: Observer efficiency
- **WHEN** MutationObserver monitors style attribute
- **THEN** SHALL only observe single element (HTML root)
- **AND** SHALL filter to only style attribute changes
- **AND** SHALL minimize observation overhead

#### Scenario: State update frequency
- **WHEN** style attribute changes frequently
- **THEN** SHALL invoke observer callback for each change
- **AND** React SHALL batch state updates when possible
- **AND** SHALL NOT implement additional debouncing or throttling

#### Scenario: Memory usage
- **WHEN** observer is active
- **THEN** SHALL maintain one MutationObserver per hook instance
- **AND** cleanup SHALL prevent memory leaks on unmount
- **AND** SHALL NOT accumulate observers over time

### Requirement: Documentation Requirements
The hook SHALL be fully documented per nimbus-core standards.

#### Scenario: JSDoc comment
- **WHEN** hook source code is viewed
- **THEN** SHALL have comprehensive JSDoc block
- **AND** SHALL document @experimental status
- **AND** SHALL describe color-scheme CSS property monitoring
- **AND** SHALL document return value type

#### Scenario: Implementation comments
- **WHEN** hook implementation is reviewed
- **THEN** SHALL include inline comments explaining MutationObserver usage
- **AND** SHALL document fallback chain logic
- **AND** SHALL clarify style attribute observation scope

#### Scenario: Public documentation
- **WHEN** hook is published
- **THEN** SHALL be documented in package README or docs site
- **AND** SHALL include usage examples
- **AND** SHALL document browser-only requirement and SSR considerations

### Requirement: Error Handling
The hook SHALL handle edge cases gracefully.

#### Scenario: localStorage access errors
- **WHEN** localStorage.getItem throws error
- **THEN** getCurrentColorScheme SHALL handle exception
- **AND** SHALL fall back to 'light' default
- **AND** SHALL NOT propagate error to component

#### Scenario: Missing document object
- **WHEN** hook runs in environment without document
- **THEN** SHALL throw error when accessing document.documentElement
- **AND** error SHALL indicate browser-only requirement
- **AND** SHALL NOT provide silent fallback

#### Scenario: Observer creation failure
- **WHEN** MutationObserver constructor fails
- **THEN** useEffect SHALL throw error during setup
- **AND** component SHALL fail to mount
- **AND** error SHALL surface to error boundary
