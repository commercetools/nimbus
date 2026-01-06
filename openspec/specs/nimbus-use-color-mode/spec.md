# Specification: useColorMode Hook

## Overview

The useColorMode hook provides access to the current color mode state and functions to change it. It integrates with next-themes to manage theme persistence, system preference detection, and seamless theme switching between light and dark modes.

**Hook:** `useColorMode`
**Package:** `@commercetools/nimbus`
**Type:** React hook
**Library Integration:** next-themes

## Purpose

The useColorMode hook enables components to access and control the application's color mode (light/dark theme). It provides a simple API for reading the current theme, toggling between themes, and setting a specific theme programmatically while handling all the complexity of persistence, system preference detection, and SSR compatibility.

## Requirements

### Requirement: Hook Return Value
The hook SHALL return an object with color mode state and control functions.

#### Scenario: Return value structure
- **WHEN** useColorMode is called
- **THEN** SHALL return an object with three properties: colorMode, setColorMode, toggleColorMode
- **AND** colorMode SHALL be the current resolved theme as a string
- **AND** setColorMode SHALL be a function to change the theme
- **AND** toggleColorMode SHALL be a function to toggle between light and dark

#### Scenario: TypeScript return type
- **WHEN** hook is used in TypeScript
- **THEN** SHALL provide type inference for return value
- **AND** colorMode SHALL be typed as string | undefined
- **AND** setColorMode SHALL accept string parameter
- **AND** toggleColorMode SHALL accept no parameters

### Requirement: Current Color Mode State
The hook SHALL provide access to the current resolved color mode.

#### Scenario: Resolved theme value
- **WHEN** colorMode property is accessed
- **THEN** SHALL return the currently active theme ('light' | 'dark')
- **AND** SHALL reflect the actual theme being displayed to the user
- **AND** SHALL resolve 'system' preference to actual 'light' or 'dark' value

#### Scenario: Initial color mode value
- **WHEN** hook is first called on mount
- **THEN** SHALL return undefined during initial render to prevent hydration mismatch
- **AND** SHALL update to actual theme value after client-side hydration
- **AND** SHALL use persisted theme from localStorage if available

#### Scenario: System preference resolution
- **WHEN** theme is set to 'system' and enableSystem is true
- **THEN** colorMode SHALL return 'light' or 'dark' based on system preference
- **AND** SHALL detect prefers-color-scheme media query
- **AND** SHALL automatically update when system preference changes

### Requirement: Set Color Mode Function
The hook SHALL provide a function to programmatically set the color mode.

#### Scenario: Setting specific theme
- **WHEN** setColorMode function is called with 'light'
- **THEN** SHALL change the theme to light mode
- **AND** SHALL persist choice to localStorage
- **AND** SHALL apply theme class to document element

#### Scenario: Setting dark theme
- **WHEN** setColorMode function is called with 'dark'
- **THEN** SHALL change the theme to dark mode
- **AND** SHALL persist choice to localStorage
- **AND** SHALL apply theme class to document element

#### Scenario: Setting system theme
- **WHEN** setColorMode function is called with 'system' and enableSystem is true
- **THEN** SHALL change the theme to respect system preference
- **AND** SHALL persist 'system' choice to localStorage
- **AND** SHALL apply appropriate theme class based on current system preference

### Requirement: Toggle Color Mode Function
The hook SHALL provide a function to toggle between light and dark modes.

#### Scenario: Toggle from light to dark
- **WHEN** toggleColorMode is called and current colorMode is 'light'
- **THEN** SHALL change theme to 'dark'
- **AND** SHALL persist new choice to localStorage
- **AND** SHALL update colorMode state to 'dark'

#### Scenario: Toggle from dark to light
- **WHEN** toggleColorMode is called and current colorMode is 'dark'
- **THEN** SHALL change theme to 'light'
- **AND** SHALL persist new choice to localStorage
- **AND** SHALL update colorMode state to 'light'

#### Scenario: Toggle with undefined initial state
- **WHEN** toggleColorMode is called before colorMode is initialized
- **THEN** SHALL default to toggling from current resolved theme
- **AND** SHALL handle undefined state gracefully
- **AND** SHALL apply appropriate opposite theme

### Requirement: next-themes Integration
The hook SHALL integrate with next-themes ThemeProvider.

#### Scenario: useTheme hook consumption
- **WHEN** useColorMode is called
- **THEN** SHALL consume useTheme hook from next-themes
- **AND** SHALL access resolvedTheme property for colorMode
- **AND** SHALL access setTheme function for setColorMode

#### Scenario: ThemeProvider dependency
- **WHEN** useColorMode is called outside NimbusProvider
- **THEN** SHALL throw error from next-themes useTheme hook
- **AND** error SHALL indicate missing ThemeProvider context
- **AND** SHALL guide developer to wrap with NimbusProvider

### Requirement: Theme Persistence
The hook SHALL persist theme choices across sessions.

#### Scenario: localStorage persistence
- **WHEN** theme is changed via setColorMode or toggleColorMode
- **THEN** next-themes SHALL persist choice to localStorage
- **AND** SHALL use 'theme' as storage key
- **AND** SHALL store raw theme value ('light', 'dark', 'system')

#### Scenario: Restored theme on load
- **WHEN** application loads with persisted theme
- **THEN** SHALL restore theme from localStorage
- **AND** SHALL apply theme before initial paint to prevent flash
- **AND** SHALL honor persisted choice over default theme

#### Scenario: No stored theme
- **WHEN** no theme is stored in localStorage
- **THEN** SHALL use default theme from NimbusProvider configuration
- **AND** SHALL fall back to 'light' if no default provided
- **AND** SHALL respect enableSystem setting if configured

### Requirement: Theme Application to DOM
The hook SHALL apply theme changes to the document element.

#### Scenario: CSS class application
- **WHEN** theme changes
- **THEN** next-themes SHALL apply theme as CSS class to document element
- **AND** SHALL use class attribute mode (attribute="class")
- **AND** SHALL add 'light' or 'dark' class to document.documentElement

#### Scenario: Class toggling
- **WHEN** theme switches from light to dark
- **THEN** SHALL remove 'light' class from document.documentElement
- **AND** SHALL add 'dark' class to document.documentElement
- **AND** SHALL enable CSS to target .light and .dark selectors

#### Scenario: Transition prevention
- **WHEN** theme is applied on initial load
- **THEN** SHALL prevent CSS transitions during theme initialization
- **AND** NimbusColorModeProvider SHALL set disableTransitionOnChange
- **AND** SHALL prevent flash of unstyled content during hydration

### Requirement: System Preference Detection
The hook SHALL detect and respect system color scheme preference when enabled.

#### Scenario: System preference via media query
- **WHEN** enableSystem is true in NimbusProvider
- **THEN** next-themes SHALL detect prefers-color-scheme: dark media query
- **AND** SHALL apply dark theme when system prefers dark
- **AND** SHALL apply light theme when system prefers light

#### Scenario: System preference changes
- **WHEN** user changes system color scheme while app is running
- **THEN** SHALL automatically detect the change
- **AND** SHALL update colorMode to match new system preference
- **AND** SHALL re-render components using useColorMode

#### Scenario: System preference disabled
- **WHEN** enableSystem is false in NimbusProvider (default)
- **THEN** SHALL NOT provide 'system' as theme option
- **AND** SHALL ignore system preference
- **AND** SHALL require explicit light or dark selection

### Requirement: SSR Compatibility
The hook SHALL work correctly in server-side rendering environments.

#### Scenario: Server-side rendering
- **WHEN** hook is called during SSR
- **THEN** colorMode SHALL return undefined to prevent hydration mismatch
- **AND** SHALL not access browser APIs during server render
- **AND** SHALL avoid reading localStorage on server

#### Scenario: Client-side hydration
- **WHEN** component hydrates on client after SSR
- **THEN** SHALL match server-rendered HTML initially
- **AND** SHALL update to actual theme value after hydration
- **AND** SHALL prevent flash of wrong theme

#### Scenario: next-themes script injection
- **WHEN** NimbusColorModeProvider renders
- **THEN** next-themes SHALL inject blocking script in document head
- **AND** script SHALL apply theme before first paint
- **AND** SHALL read from localStorage and apply class immediately

### Requirement: NimbusProvider Context Requirement
The hook SHALL only function within NimbusProvider context.

#### Scenario: Valid provider context
- **WHEN** useColorMode is called within NimbusProvider
- **THEN** SHALL access theme context from next-themes ThemeProvider
- **AND** SHALL return valid colorMode, setColorMode, toggleColorMode
- **AND** SHALL function correctly with all theme operations

#### Scenario: Missing provider context
- **WHEN** useColorMode is called outside NimbusProvider
- **THEN** next-themes useTheme SHALL throw error
- **AND** error SHALL indicate missing provider
- **AND** developer SHALL wrap application with NimbusProvider

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

### Requirement: React Hook Rules Compliance
The hook SHALL follow React hook rules per nimbus-core standards.

#### Scenario: Hook naming
- **WHEN** hook is defined
- **THEN** SHALL be named with 'use' prefix
- **AND** SHALL follow camelCase naming convention
- **AND** name SHALL clearly indicate color mode functionality

#### Scenario: Conditional usage restriction
- **WHEN** hook is called
- **THEN** SHALL only be called at top level of component
- **AND** SHALL NOT be called conditionally
- **AND** SHALL NOT be called in loops or nested functions

#### Scenario: Component context requirement
- **WHEN** hook is used
- **THEN** SHALL only be called from React function components or custom hooks
- **AND** SHALL NOT be called from regular JavaScript functions
- **AND** SHALL follow all Rules of Hooks

### Requirement: Related Hook Integration
The hook SHALL work seamlessly with useColorModeValue hook.

#### Scenario: useColorModeValue consistency
- **WHEN** useColorMode and useColorModeValue are used together
- **THEN** both SHALL consume the same next-themes context
- **AND** colorMode value SHALL match the theme used by useColorModeValue
- **AND** theme changes SHALL update both hooks synchronously

#### Scenario: Component styling coordination
- **WHEN** component uses both hooks
- **THEN** useColorMode SHALL provide theme state
- **AND** useColorModeValue SHALL provide theme-specific values
- **AND** both SHALL re-render together on theme change

### Requirement: Multiple Hook Instances
The hook SHALL support multiple instances in the same render tree.

#### Scenario: Multiple components using hook
- **WHEN** multiple components call useColorMode
- **THEN** all instances SHALL share the same theme context
- **AND** all instances SHALL receive same colorMode value
- **AND** setColorMode/toggleColorMode from any instance SHALL affect all instances

#### Scenario: Synchronized state updates
- **WHEN** theme is changed via any hook instance
- **THEN** all components using useColorMode SHALL re-render
- **AND** all SHALL receive updated colorMode value
- **AND** state SHALL be synchronized across all instances

### Requirement: Performance Characteristics
The hook SHALL provide efficient theme state access and updates.

#### Scenario: Minimal re-renders
- **WHEN** theme changes
- **THEN** SHALL only re-render components using useColorMode or useColorModeValue
- **AND** SHALL NOT cause unnecessary re-renders of unrelated components
- **AND** next-themes context SHALL optimize render propagation

#### Scenario: Function stability
- **WHEN** component re-renders
- **THEN** setColorMode function reference SHALL remain stable
- **AND** toggleColorMode function SHALL be recreated with latest colorMode
- **AND** functions SHALL be safe to use in useEffect dependencies

### Requirement: Default Theme Configuration
The hook SHALL respect default theme configuration from NimbusProvider.

#### Scenario: Default theme prop
- **WHEN** NimbusProvider has theme="dark" prop
- **THEN** initial colorMode SHALL be 'dark'
- **AND** SHALL override any stored theme
- **AND** SHALL persist as new default

#### Scenario: No default theme
- **WHEN** NimbusProvider has no theme prop
- **THEN** SHALL default to 'light' mode
- **AND** enableSystem=false SHALL be default
- **AND** SHALL not detect system preference

#### Scenario: Forced theme override
- **WHEN** NimbusProvider has forcedTheme prop
- **THEN** colorMode SHALL always return forced theme value
- **AND** setColorMode and toggleColorMode SHALL have no effect
- **AND** theme SHALL be locked to forced value

### Requirement: Storage Configuration
The hook SHALL support storage configuration via NimbusProvider.

#### Scenario: Custom storage key
- **WHEN** NimbusProvider storageKey prop is set
- **THEN** next-themes SHALL use custom key for localStorage
- **AND** SHALL migrate from default 'theme' key if needed
- **AND** multiple providers SHALL use different storage keys

#### Scenario: Disabled storage
- **WHEN** NimbusProvider has enableStorage={false}
- **THEN** theme SHALL not persist to localStorage
- **AND** theme SHALL reset on page reload
- **AND** SHALL only maintain theme in-memory during session

### Requirement: Theme Change Callbacks
The hook SHALL support theme change callbacks via NimbusProvider configuration.

#### Scenario: onChange callback
- **WHEN** theme changes via setColorMode or toggleColorMode
- **THEN** NimbusProvider onChange prop SHALL be called if provided
- **AND** callback SHALL receive new theme value as parameter
- **AND** callback SHALL be called after theme is applied

### Requirement: Error Handling
The hook SHALL handle edge cases and errors gracefully.

#### Scenario: Storage unavailable
- **WHEN** localStorage is unavailable or blocked
- **THEN** next-themes SHALL handle gracefully
- **AND** theme SHALL work without persistence
- **AND** SHALL not throw error or crash application

#### Scenario: Invalid theme value
- **WHEN** setColorMode is called with invalid value
- **THEN** next-themes SHALL handle gracefully
- **AND** SHALL fall back to valid theme
- **AND** SHALL not break theme system

### Requirement: Documentation Requirements
The hook SHALL be fully documented per nimbus-core standards.

#### Scenario: JSDoc comments
- **WHEN** hook source code is viewed
- **THEN** SHALL have comprehensive JSDoc block
- **AND** SHALL document @experimental status
- **AND** SHALL include usage @example
- **AND** SHALL document return value structure

#### Scenario: API documentation
- **WHEN** hook is published
- **THEN** SHALL be documented in Nimbus documentation site
- **AND** SHALL include usage examples and best practices
- **AND** SHALL document relationship with NimbusProvider

### Requirement: useColorScheme Hook Distinction
The hook SHALL be distinct from useColorScheme hook.

#### Scenario: Different responsibilities
- **WHEN** useColorMode is compared to useColorScheme
- **THEN** useColorMode SHALL manage theme state and provide control functions
- **AND** useColorScheme SHALL observe color-scheme CSS property
- **AND** useColorMode SHALL be primary hook for theme management

#### Scenario: Complementary usage
- **WHEN** both hooks are available
- **THEN** useColorMode SHALL be used for user-controlled theme switching
- **AND** useColorScheme SHALL be used for reading applied CSS color-scheme
- **AND** both MAY be used together if needed
