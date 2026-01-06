# Specification: NimbusProvider Component

## Overview

The NimbusProvider component is the foundational root provider that establishes the design system context for all Nimbus components. It wraps the entire application to provide theme configuration, color mode management, internationalization support, and optional client-side routing integration.

**Component:** `NimbusProvider`
**Package:** `@commercetools/nimbus`
**Type:** System provider component

## Purpose

The NimbusProvider component establishes the foundational environment for all Nimbus components by providing theme configuration, color mode management, internationalization support, and optional client-side routing integration. It is a required wrapper that must be placed at the root of any application using Nimbus components.

## Requirements

### Requirement: Root Provider Wrapper
The component SHALL serve as the root provider wrapping all Nimbus components.

#### Scenario: Application wrapping
- **WHEN** an application uses Nimbus components
- **THEN** SHALL wrap the entire application tree with NimbusProvider
- **AND** all Nimbus components SHALL be rendered as descendants of NimbusProvider
- **AND** SHALL provide required context for all child components

#### Scenario: Single instance requirement
- **WHEN** NimbusProvider is used
- **THEN** SHALL typically have only one instance at application root
- **AND** MAY support multiple instances with different locales for specific use cases
- **AND** nested providers SHALL override parent provider context

### Requirement: Children Rendering
The component SHALL render children within the provider context.

#### Scenario: Basic children rendering
- **WHEN** children are provided
- **THEN** SHALL render children within all provider contexts
- **AND** SHALL pass through all context values to descendants
- **AND** children SHALL have access to theme, i18n, and router context

### Requirement: Chakra Provider Integration
The component SHALL integrate Chakra UI ChakraProvider for styling system.

#### Scenario: Chakra system configuration
- **WHEN** NimbusProvider renders
- **THEN** SHALL wrap children with ChakraProvider
- **AND** SHALL provide Nimbus theme system from `@/theme`
- **AND** SHALL configure Chakra with createSystem output
- **AND** theme SHALL include all registered recipes and slot recipes

#### Scenario: Default Nimbus theme
- **WHEN** no custom theme is provided
- **THEN** SHALL use default Nimbus theme system
- **AND** theme SHALL include design tokens from @commercetools/nimbus-tokens
- **AND** SHALL include all recipe registrations from theme/recipes/
- **AND** SHALL include all slot recipe registrations from theme/slot-recipes/

### Requirement: CSS Variables Configuration
The component SHALL configure Chakra CSS variable system.

#### Scenario: CSS variable prefix
- **WHEN** theme system initializes
- **THEN** SHALL use "nimbus" as CSS variable prefix
- **AND** all CSS variables SHALL be prefixed with --nimbus-
- **AND** SHALL prevent naming conflicts with other libraries

#### Scenario: CSS variables root
- **WHEN** CSS variables are applied
- **THEN** SHALL target :where(:root, :host) as CSS variables root
- **AND** SHALL make variables available globally
- **AND** SHALL support both regular and shadow DOM contexts

### Requirement: CSS Reset Application
The component SHALL apply CSS reset for consistent cross-browser rendering.

#### Scenario: Preflight styles
- **WHEN** theme system initializes
- **THEN** SHALL apply preflight CSS reset by default
- **AND** SHALL normalize browser default styles
- **AND** SHALL provide consistent base styles across browsers
- **AND** SHALL be configurable via preflight option in theme config

### Requirement: Color Mode Provider Integration
The component SHALL integrate next-themes for color mode management.

#### Scenario: ThemeProvider wrapping
- **WHEN** NimbusProvider renders
- **THEN** SHALL wrap with NimbusColorModeProvider using next-themes ThemeProvider
- **AND** SHALL set attribute="class" for CSS class-based theme switching
- **AND** SHALL set disableTransitionOnChange to prevent flash of unstyled content
- **AND** SHALL forward all next-themes ThemeProviderProps

#### Scenario: Default color mode
- **WHEN** no color mode configuration is provided
- **THEN** SHALL enable light mode by default
- **AND** SHALL NOT enable system preference detection by default (enableSystem={false})
- **AND** users SHALL explicitly set theme preference

### Requirement: Color Mode Configuration
The component SHALL support color mode configuration via props.

#### Scenario: System preference support
- **WHEN** enableSystem prop is set to true
- **THEN** SHALL detect and respect user's system color mode preference
- **AND** SHALL automatically switch when system preference changes
- **AND** SHALL provide "system" as a theme option

#### Scenario: Initial theme setting
- **WHEN** theme prop is provided
- **THEN** SHALL initialize with specified theme ('light', 'dark', 'system')
- **AND** SHALL override any stored theme preference
- **AND** SHALL persist theme choice to storage

#### Scenario: Theme persistence
- **WHEN** user changes color mode
- **THEN** SHALL persist choice to localStorage
- **AND** SHALL restore theme on subsequent page loads
- **AND** SHALL handle storage availability gracefully

### Requirement: Color Mode Access
The component SHALL provide color mode context to descendants.

#### Scenario: useColorMode hook integration
- **WHEN** descendant components use useColorMode hook
- **THEN** SHALL provide current resolved theme via useTheme from next-themes
- **AND** SHALL provide setColorMode function via setTheme
- **AND** SHALL provide toggleColorMode function for light/dark toggle

#### Scenario: Color mode value hook integration
- **WHEN** descendant components use useColorModeValue hook
- **THEN** SHALL provide light and dark value resolution
- **AND** SHALL return appropriate value based on current color mode
- **AND** SHALL support responsive styling based on theme

### Requirement: react-intl Provider Integration
The component SHALL integrate react-intl for internationalization.

#### Scenario: IntlProvider configuration
- **WHEN** NimbusProvider renders
- **THEN** SHALL wrap children with IntlProvider from react-intl
- **AND** SHALL configure locale from locale prop or navigator.language fallback
- **AND** SHALL set defaultLocale to "en"
- **AND** SHALL provide message formatting context to descendants

#### Scenario: Browser locale fallback
- **WHEN** no locale prop is provided
- **THEN** SHALL use navigator.language as fallback locale
- **AND** SHALL detect user's browser language preference
- **AND** SHALL provide automatic locale detection

### Requirement: React Aria I18n Integration
The component SHALL integrate React Aria I18nProvider for accessible component localization.

#### Scenario: NimbusI18nProvider integration
- **WHEN** NimbusProvider renders
- **THEN** SHALL wrap children with NimbusI18nProvider
- **AND** SHALL forward locale prop to NimbusI18nProvider
- **AND** NimbusI18nProvider SHALL wrap React Aria's I18nProvider
- **AND** SHALL provide locale context for React Aria components (DatePicker, Calendar, etc.)

### Requirement: Locale Configuration
The component SHALL support locale configuration via props.

#### Scenario: BCP47 locale format
- **WHEN** locale prop is provided
- **THEN** SHALL accept BCP47 language tag format (e.g., 'en-US', 'de-DE', 'fr-FR')
- **AND** SHALL validate locale format
- **AND** SHALL pass locale to both react-intl and React Aria providers

#### Scenario: Locale propagation
- **WHEN** locale is set
- **THEN** SHALL propagate to all Nimbus components requiring localization
- **AND** date/time components SHALL format according to locale
- **AND** number components SHALL format according to locale
- **AND** text direction SHALL be determined by locale

### Requirement: Multiple Locale Support
The component SHALL support nested locale overrides.

#### Scenario: Nested IntlProvider
- **WHEN** IntlProvider is nested within NimbusProvider with different locale
- **THEN** nested provider SHALL override parent locale for its subtree
- **AND** SHALL allow multiple locales on a single page
- **AND** each subtree SHALL use its respective locale configuration

### Requirement: React Aria RouterProvider Integration
The component SHALL support optional React Aria RouterProvider integration.

#### Scenario: Router configuration
- **WHEN** router prop is provided
- **THEN** SHALL wrap content with React Aria RouterProvider
- **AND** SHALL forward router configuration to RouterProvider
- **AND** RouterProvider SHALL enable client-side navigation for components with href props

#### Scenario: No router configuration
- **WHEN** router prop is not provided
- **THEN** SHALL NOT wrap with RouterProvider
- **AND** components with href SHALL use standard anchor navigation
- **AND** navigation SHALL cause full page reloads

### Requirement: Router Navigate Function
The component SHALL support router navigate function configuration.

#### Scenario: Navigate function
- **WHEN** router.navigate is provided
- **THEN** SHALL accept function signature: (href: string, routerOptions?: any) => void
- **AND** SHALL be called when user navigates via Link, Button with href, etc.
- **AND** SHALL support framework-specific navigation (React Router, Next.js, etc.)

#### Scenario: React Router integration
- **WHEN** using with React Router
- **THEN** SHALL accept useNavigate() return value as router.navigate
- **AND** SHALL accept useHref as router.useHref
- **AND** SHALL enable client-side navigation without page reload

#### Scenario: Next.js integration
- **WHEN** using with Next.js App Router
- **THEN** SHALL accept router.push from useRouter() as router.navigate
- **AND** SHALL support Next.js navigation patterns
- **AND** SHALL work in client components marked with 'use client'

### Requirement: Router useHref Function
The component SHALL support optional useHref function for URL transformation.

#### Scenario: useHref configuration
- **WHEN** router.useHref is provided
- **THEN** SHALL accept function signature: (href: string) => string
- **AND** SHALL transform hrefs before navigation and rendering
- **AND** SHALL support base path prepending, URL transformation, etc.

#### Scenario: Base path support
- **WHEN** application has base path
- **THEN** useHref SHALL prepend base path to all hrefs
- **AND** SHALL ensure consistent URL handling across components
- **AND** SHALL work with both navigate function and href rendering

### Requirement: TypeScript Props Interface
The component SHALL provide comprehensive TypeScript types.

#### Scenario: NimbusProviderProps export
- **WHEN** component types are defined
- **THEN** SHALL export NimbusProviderProps interface
- **AND** SHALL extend ColorModeProviderProps from next-themes
- **AND** SHALL include locale, router, and children props with JSDoc
- **AND** SHALL be exported from package index

#### Scenario: Router configuration types
- **WHEN** router prop is typed
- **THEN** SHALL export NimbusRouterConfig type
- **AND** SHALL include navigate and optional useHref properties
- **AND** SHALL support TypedNimbusRouterConfig for enhanced typing
- **AND** SHALL support module augmentation for framework-specific types

### Requirement: Router Options Module Augmentation
The component SHALL support module augmentation for router options typing.

#### Scenario: Framework-specific router options
- **WHEN** consumer needs typed router options
- **THEN** SHALL provide NimbusRouterOptionsBase interface for augmentation
- **AND** consumers SHALL extend via module augmentation
- **AND** SHALL support React Router NavigateOptions typing
- **AND** SHALL support Next.js router.push options typing

### Requirement: Display Name
The component SHALL set displayName for debugging.

#### Scenario: Debug identification
- **WHEN** component renders in React DevTools
- **THEN** SHALL display as "NimbusProvider"
- **AND** SHALL aid in component tree debugging
- **AND** SHALL follow nimbus-core displayName standards

### Requirement: Multi-Provider Layering
The component SHALL compose multiple providers in correct order.

#### Scenario: Provider stack order
- **WHEN** NimbusProvider renders
- **THEN** SHALL layer providers in order: IntlProvider → ChakraProvider → NimbusColorModeProvider → NimbusI18nProvider
- **AND** RouterProvider SHALL wrap entire stack when configured
- **AND** order SHALL ensure proper context availability for all descendants

#### Scenario: Context isolation
- **WHEN** multiple providers are stacked
- **THEN** each provider SHALL maintain independent context
- **AND** SHALL not interfere with other provider functionality
- **AND** descendants SHALL access all contexts via respective hooks

### Requirement: Server-Side Rendering Compatibility
The component SHALL support server-side rendering environments.

#### Scenario: SSR rendering
- **WHEN** rendered on server
- **THEN** SHALL render without errors in SSR environment
- **AND** SHALL handle navigator.language gracefully (may be undefined on server)
- **AND** SHALL use provided locale or fallback to 'en' when navigator unavailable

#### Scenario: Hydration
- **WHEN** hydrating on client after SSR
- **THEN** SHALL match server-rendered output
- **AND** SHALL initialize color mode without flash of unstyled content
- **AND** SHALL restore stored theme preference after hydration

#### Scenario: Next.js compatibility
- **WHEN** used in Next.js application
- **THEN** SHALL work in both App Router and Pages Router
- **AND** SHALL support 'use client' directive for client components
- **AND** SHALL integrate with Next.js navigation when router configured

### Requirement: Children Prop
The component SHALL accept children prop.

#### Scenario: Children type
- **WHEN** children prop is provided
- **THEN** SHALL accept ReactNode type
- **AND** SHALL be required prop
- **AND** SHALL render all provided children within provider context

### Requirement: Locale Prop
The component SHALL accept optional locale prop.

#### Scenario: Locale configuration
- **WHEN** locale prop is provided
- **THEN** SHALL be optional string type
- **AND** SHALL expect BCP47 language tag format
- **AND** SHALL default to browser locale when not provided
- **AND** SHALL have JSDoc: "Locale for internationalization support"

### Requirement: Router Prop
The component SHALL accept optional router prop.

#### Scenario: Router configuration
- **WHEN** router prop is provided
- **THEN** SHALL be optional NimbusRouterConfig | TypedNimbusRouterConfig type
- **AND** SHALL include navigate function (required) and useHref function (optional)
- **AND** SHALL have JSDoc: "Router configuration for client-side navigation"

### Requirement: Color Mode Props
The component SHALL accept color mode configuration props from next-themes.

#### Scenario: ThemeProvider props inheritance
- **WHEN** component accepts props
- **THEN** SHALL extend ColorModeProviderProps (alias for ThemeProviderProps)
- **AND** SHALL support: theme, defaultTheme, forcedTheme, enableSystem, enableColorScheme
- **AND** SHALL support: disableTransitionOnChange, storageKey, themes, attribute, value
- **AND** SHALL forward all props to NimbusColorModeProvider

### Requirement: Token System Access
The component SHALL provide design token access to descendants.

#### Scenario: Chakra token resolution
- **WHEN** descendants use Chakra style props
- **THEN** SHALL resolve design tokens from @commercetools/nimbus-tokens
- **AND** SHALL support semantic tokens (colors.primary, spacing.400, etc.)
- **AND** SHALL support responsive breakpoints from design tokens

#### Scenario: Theme mode token resolution
- **WHEN** color mode changes
- **THEN** SHALL resolve appropriate semantic token values for current mode
- **AND** light mode SHALL use light token values
- **AND** dark mode SHALL use dark token values

### Requirement: JSDoc Documentation
The component SHALL provide comprehensive JSDoc.

#### Scenario: Component JSDoc
- **WHEN** component is documented
- **THEN** SHALL include description: "Provides an environment for the rest of the components to work in."
- **AND** SHALL include @see link to documentation site
- **AND** SHALL document all props with JSDoc comments

### Requirement: Missing Context Warnings
The component SHALL provide helpful error messages when misused.

#### Scenario: Missing provider
- **WHEN** Nimbus components render without NimbusProvider
- **THEN** components MAY log console warnings about missing context
- **AND** SHALL fail gracefully where possible
- **AND** error messages SHALL suggest wrapping with NimbusProvider

### Requirement: Invalid Locale Handling
The component SHALL handle invalid locale values gracefully.

#### Scenario: Unsupported locale
- **WHEN** invalid or unsupported locale is provided
- **THEN** SHALL fall back to default locale 'en'
- **AND** SHALL not throw errors that break rendering
- **AND** SHALL log warning about locale fallback

### Requirement: Transition Performance
The component SHALL optimize color mode transition performance.

#### Scenario: Transition on change disabled
- **WHEN** color mode changes
- **THEN** SHALL disable CSS transitions during change (disableTransitionOnChange)
- **AND** SHALL prevent flash of unstyled content
- **AND** SHALL ensure instant theme switching without animation artifacts

### Requirement: Provider Re-render Optimization
The component SHALL minimize unnecessary re-renders.

#### Scenario: Stable context values
- **WHEN** provider props don't change
- **THEN** SHALL not trigger unnecessary re-renders of descendants
- **AND** context values SHALL remain stable across renders
- **AND** SHALL leverage React context optimization patterns
