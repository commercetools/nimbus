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

### Requirement: plain TypeScript objects Provider Integration
The component SHALL integrate plain TypeScript objects for internationalization.

#### Scenario: IntlProvider configuration
- **WHEN** NimbusProvider renders
- **THEN** SHALL wrap children with IntlProvider from plain TypeScript objects
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
- **AND** SHALL pass locale to both plain TypeScript objects and React Aria providers

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

### Requirement: Inter Font Loading
The component SHALL load Inter font family by default for consistent typography.

#### Scenario: Default font loading enabled
- **WHEN** NimbusProvider renders without explicit loadFonts prop
- **THEN** SHALL inject Google Fonts preconnect links into document head
- **AND** SHALL inject Inter font stylesheet from Google Fonts CSS API v2
- **AND** SHALL use fonts.googleapis.com and fonts.gstatic.com origins
- **AND** fonts SHALL load in background without blocking render

#### Scenario: Font loading disabled
- **WHEN** loadFonts prop is set to false
- **THEN** SHALL NOT inject any font-related links
- **AND** SHALL rely on host application to provide Inter font
- **AND** SHALL fall back to system fonts if Inter unavailable

### Requirement: Google Fonts Integration
The component SHALL use Google Fonts CSS API v2 for font delivery.

#### Scenario: Preconnect optimization
- **WHEN** font loading is enabled
- **THEN** SHALL inject preconnect link for fonts.googleapis.com
- **AND** SHALL inject preconnect link for fonts.gstatic.com with crossorigin attribute
- **AND** preconnect links SHALL appear before stylesheet link in document head
- **AND** SHALL optimize DNS resolution and TLS handshake

#### Scenario: Stylesheet injection
- **WHEN** font loading is enabled
- **THEN** SHALL inject stylesheet link for Inter font from Google Fonts
- **AND** stylesheet URL SHALL use CSS API v2 format
- **AND** SHALL include explicit font weights: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **AND** SHALL use display=swap parameter to minimize FOUT
- **AND** link element SHALL include data-nimbus-fonts attribute for identification

#### Scenario: Static font weight loading
- **WHEN** fonts load from Google Fonts
- **THEN** SHALL load specific static font weights matching Nimbus design tokens
- **AND** SHALL load all 9 weights (100, 200, 300, 400, 500, 600, 700, 800, 900)
- **AND** SHALL use explicit weight syntax for precise control over loaded fonts
- **AND** browser SHALL receive optimized font format based on capabilities

### Requirement: Font Deduplication
The component SHALL leverage React 19's automatic deduplication for font links.

#### Scenario: Multiple provider instances
- **WHEN** multiple NimbusProvider instances exist on same page with loadFonts enabled
- **THEN** React SHALL automatically deduplicate identical link tags
- **AND** SHALL result in single set of font links in document head
- **AND** deduplication SHALL be handled by React framework
- **AND** all providers SHALL share same font resources

#### Scenario: Automatic deduplication
- **WHEN** provider remounts or re-renders
- **THEN** React SHALL compare link props and deduplicate automatically
- **AND** SHALL not require manual existence checks
- **AND** font loading SHALL remain consistent across render cycles

### Requirement: SSR Compatibility
The component SHALL support server-side rendering without errors.

#### Scenario: Server-side rendering
- **WHEN** component renders on server
- **THEN** React SHALL handle link tag rendering for SSR automatically
- **AND** SHALL serialize links appropriately for server output
- **AND** SHALL not throw errors during server rendering
- **AND** font links SHALL be included in SSR HTML output

#### Scenario: Client-side hydration
- **WHEN** component hydrates on client after SSR
- **THEN** React SHALL hydrate links without mismatch warnings
- **AND** SHALL maintain consistency between server and client
- **AND** fonts SHALL be available immediately after hydration
- **AND** fallback fonts SHALL display during font download

### Requirement: Font Loading Cleanup
The component SHALL rely on React to manage link tag lifecycle.

#### Scenario: Provider unmount
- **WHEN** NimbusProvider unmounts
- **THEN** React SHALL remove associated link tags from document head
- **AND** SHALL handle cleanup automatically without manual intervention
- **AND** SHALL prevent memory leaks from orphaned DOM nodes
- **AND** cleanup SHALL not affect fonts cached by browser

#### Scenario: Hot module replacement
- **WHEN** component reloads during development
- **THEN** React SHALL manage link tag lifecycle across reloads
- **AND** SHALL remove old links and add new ones as needed
- **AND** SHALL maintain clean DOM state across reloads

### Requirement: Font Loading Component
The component SHALL use React 19 link hoisting for font loading.

#### Scenario: InterFontLoader component rendering
- **WHEN** NimbusProvider renders with loadFonts enabled
- **THEN** SHALL render InterFontLoader component
- **AND** component SHALL render link tags declaratively
- **AND** React SHALL automatically hoist links to document head
- **AND** component SHALL be internal implementation detail

#### Scenario: React 19 automatic hoisting
- **WHEN** InterFontLoader renders link tags
- **THEN** React SHALL automatically move links to document head
- **AND** SHALL handle SSR vs client rendering automatically
- **AND** SHALL deduplicate identical links automatically
- **AND** SHALL remove links when component unmounts

### Requirement: loadFonts Prop
The component SHALL accept loadFonts prop for font loading control.

#### Scenario: Prop type definition
- **WHEN** component props are typed
- **THEN** loadFonts SHALL be optional boolean type
- **AND** SHALL default to true when not provided
- **AND** SHALL have JSDoc: "Load Inter font from Google Fonts. Set to false if fonts are loaded by host application."
- **AND** SHALL be exported in NimbusProviderProps interface

#### Scenario: Prop forwarding
- **WHEN** loadFonts prop is provided
- **THEN** SHALL forward to useFontLoader hook
- **AND** hook SHALL respect prop value for font injection
- **AND** prop changes SHALL trigger font loading/cleanup cycle

### Requirement: Font Fallback Support
The component SHALL ensure graceful fallback when fonts fail to load.

#### Scenario: Google Fonts unavailable
- **WHEN** Google Fonts service is unavailable
- **THEN** SHALL fall back to design token font stack
- **AND** SHALL use system fonts: -apple-system, BlinkMacSystemFont, sans-serif
- **AND** application SHALL remain functional without Inter
- **AND** no JavaScript errors SHALL be thrown

#### Scenario: Network failure
- **WHEN** font stylesheet fails to download
- **THEN** browser SHALL use fallback fonts immediately (display=swap)
- **AND** application SHALL render with system fonts
- **AND** layout SHALL remain stable with fallback fonts
- **AND** no blocking or hanging states SHALL occur

### Requirement: Font Loading Performance
The component SHALL optimize font loading for performance.

#### Scenario: Non-blocking font load
- **WHEN** fonts are loading
- **THEN** SHALL not block initial page render
- **AND** content SHALL appear with fallback fonts immediately
- **AND** display=swap parameter SHALL enable instant text rendering
- **AND** fonts SHALL swap in when loaded without layout shift

#### Scenario: Preconnect performance
- **WHEN** preconnect links are injected
- **THEN** SHALL establish early connection to font origins
- **AND** SHALL reduce DNS lookup and TLS handshake latency
- **AND** font download SHALL start faster than without preconnect
- **AND** perceived loading time SHALL improve

### Requirement: Font Loading Documentation
The component SHALL document font loading behavior in JSDoc and guides.

#### Scenario: JSDoc documentation
- **WHEN** loadFonts prop is documented
- **THEN** SHALL include description of default behavior
- **AND** SHALL explain when to set to false (e.g., Merchant Center)
- **AND** SHALL mention Google Fonts dependency
- **AND** SHALL note fallback behavior

#### Scenario: Migration documentation
- **WHEN** existing applications upgrade
- **THEN** documentation SHALL explain opt-out for apps with existing font loading
- **AND** SHALL provide Merchant Center migration example
- **AND** SHALL clarify no changes needed for standalone usage
- **AND** SHALL document testing recommendations

