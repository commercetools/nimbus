# Specification: NimbusI18nProvider Component

## Overview

The NimbusI18nProvider component provides internationalization context specifically for React Aria components (dates, numbers, collation, etc.). It is a thin wrapper around React Aria's I18nProvider that enables locale-aware formatting and behavior for all React Aria-based Nimbus components.

**Component:** `NimbusI18nProvider`
**Package:** `@commercetools/nimbus`
**Type:** System provider component (React Aria I18n wrapper)
**React Aria:** Uses `I18nProvider` from react-aria

## Purpose

The NimbusI18nProvider component establishes the locale context for React Aria components, controlling how dates, numbers, currencies, and other locale-sensitive data are formatted and displayed. This component is specifically for React Aria's internationalization system (not plain TypeScript objects text translation), and it provides the locale context that React Aria components like DatePicker, Calendar, NumberInput, and RangeCalendar rely on for proper formatting.

## Requirements

### Requirement: React Aria I18nProvider Wrapper
The component SHALL serve as a proxy wrapper for React Aria's I18nProvider.

#### Scenario: I18nProvider integration
- **WHEN** NimbusI18nProvider renders
- **THEN** SHALL wrap children with React Aria's I18nProvider component
- **AND** SHALL forward locale prop to I18nProvider
- **AND** SHALL forward children to I18nProvider
- **AND** SHALL use "react-aria" import for I18nProvider

#### Scenario: Thin wrapper architecture
- **WHEN** component is implemented
- **THEN** SHALL act as a simple proxy without additional logic
- **AND** SHALL not modify or transform locale value
- **AND** SHALL not add additional context or state
- **AND** SHALL delegate all functionality to React Aria's I18nProvider

### Requirement: Children Rendering
The component SHALL render children within the I18n provider context.

#### Scenario: Basic children rendering
- **WHEN** children are provided
- **THEN** SHALL render children within I18nProvider context
- **AND** SHALL pass through React Aria I18n context to all descendants
- **AND** children SHALL have access to locale formatting via React Aria hooks

### Requirement: Locale Configuration
The component SHALL support locale configuration via optional locale prop.

#### Scenario: Explicit locale setting
- **WHEN** locale prop is provided
- **THEN** SHALL forward locale to React Aria I18nProvider
- **AND** SHALL accept BCP47 language tag format (e.g., 'en-US', 'de-DE', 'es-ES', 'fr-FR', 'pt-BR', 'ja-JP')
- **AND** SHALL affect date formatting, number formatting, collation, and text direction

#### Scenario: Omitted locale (browser default)
- **WHEN** locale prop is not provided or undefined
- **THEN** SHALL allow React Aria I18nProvider to use browser default locale
- **AND** React Aria SHALL detect locale from navigator.language
- **AND** SHALL provide automatic locale detection for formatting

#### Scenario: Locale propagation
- **WHEN** locale is set
- **THEN** SHALL propagate to all descendant React Aria components
- **AND** DatePicker, Calendar, DateRangePicker SHALL format dates according to locale
- **AND** NumberInput SHALL format numbers according to locale conventions
- **AND** RangeCalendar SHALL use locale-appropriate date formatting

### Requirement: BCP47 Locale Format Support
The component SHALL accept standard BCP47 language tags for locale.

#### Scenario: Language-only codes
- **WHEN** locale like "en", "de", "es", "fr", "ja" is provided
- **THEN** SHALL accept and forward to React Aria I18nProvider
- **AND** SHALL use default region conventions for that language

#### Scenario: Language-region codes
- **WHEN** locale like "en-US", "en-GB", "de-DE", "es-ES", "fr-FR", "pt-BR", "ja-JP" is provided
- **THEN** SHALL accept and forward to React Aria I18nProvider
- **AND** SHALL use region-specific formatting conventions
- **AND** date order, decimal separators, currency symbols SHALL reflect region

#### Scenario: Extended locale tags
- **WHEN** locale with extensions (e.g., "de-DE-u-ca-gregory") is provided
- **THEN** SHALL accept any valid BCP47 tag supported by React Aria
- **AND** SHALL pass through to React Aria without validation

### Requirement: Date Formatting Context
The component SHALL provide locale-aware date formatting context.

#### Scenario: US date formatting
- **WHEN** locale="en-US" is set
- **THEN** DatePicker and Calendar SHALL use MM/DD/YYYY format
- **AND** month SHALL come before day in date displays
- **AND** week SHALL start on Sunday

#### Scenario: European date formatting
- **WHEN** locale="de-DE" or "es-ES" or "fr-FR" is set
- **THEN** DatePicker and Calendar SHALL use DD.MM.YYYY or DD/MM/YYYY format
- **AND** day SHALL come before month in date displays
- **AND** week SHALL start on Monday

#### Scenario: Asian date formatting
- **WHEN** locale="ja-JP" is set
- **THEN** DatePicker and Calendar SHALL use YYYY/MM/DD format
- **AND** year SHALL come first in date displays
- **AND** week SHALL start according to Japanese conventions

### Requirement: Number Formatting Context
The component SHALL provide locale-aware number formatting context.

#### Scenario: US number formatting
- **WHEN** locale="en-US" is set
- **THEN** NumberInput SHALL use period (.) as decimal separator
- **AND** SHALL use comma (,) as thousands separator
- **AND** number 1234.56 SHALL display as "1,234.56"

#### Scenario: European number formatting
- **WHEN** locale="de-DE" or "es-ES" or "fr-FR" is set
- **THEN** NumberInput SHALL use comma (,) as decimal separator
- **AND** SHALL use period (.) or space as thousands separator
- **AND** number 1234.56 SHALL display as "1.234,56" or "1 234,56"

#### Scenario: Japanese number formatting
- **WHEN** locale="ja-JP" is set
- **THEN** NumberInput SHALL use comma (,) as thousands separator
- **AND** decimal separator SHALL follow Japanese conventions
- **AND** currency amounts SHALL format according to Japanese Yen conventions

### Requirement: Currency Formatting Context
The component SHALL provide locale-aware currency formatting context.

#### Scenario: US currency formatting
- **WHEN** locale="en-US" and NumberInput uses currency formatOptions
- **THEN** SHALL format currency as $1,234.56
- **AND** currency symbol SHALL appear before amount
- **AND** SHALL use US decimal and thousands separators

#### Scenario: European currency formatting
- **WHEN** locale="de-DE" and NumberInput uses currency formatOptions with EUR
- **THEN** SHALL format currency as 1.234,56 € (with non-breaking space)
- **AND** currency symbol SHALL appear after amount
- **AND** SHALL use European decimal and thousands separators

#### Scenario: Japanese currency formatting
- **WHEN** locale="ja-JP" and NumberInput uses currency formatOptions with JPY
- **THEN** SHALL format currency as ￥1,234 (no decimal places)
- **AND** Japanese Yen SHALL not include decimal places
- **AND** SHALL use full-width Yen symbol (￥)

### Requirement: Nested Provider Support
The component SHALL support nested providers with locale overrides.

#### Scenario: Nested locale override
- **WHEN** NimbusI18nProvider is nested within another NimbusI18nProvider with different locale
- **THEN** inner provider SHALL override parent locale for its subtree
- **AND** SHALL allow multiple locales on a single page
- **AND** each subtree SHALL use its respective locale configuration

#### Scenario: Parent context fallthrough
- **WHEN** nested NimbusI18nProvider omits locale prop
- **THEN** SHALL inherit locale from parent I18nProvider
- **AND** SHALL not reset to browser default when nested

### Requirement: React Aria Component Integration
The component SHALL provide locale context for all React Aria-based Nimbus components.

#### Scenario: Date component integration
- **WHEN** DatePicker, Calendar, DateRangePicker, RangeCalendar render within provider
- **THEN** SHALL provide locale context via React Aria I18n system
- **AND** components SHALL format dates according to locale
- **AND** components SHALL use locale-appropriate calendars and date parsing

#### Scenario: Number component integration
- **WHEN** NumberInput renders within provider
- **THEN** SHALL provide locale context via React Aria I18n system
- **AND** component SHALL format numbers according to locale
- **AND** component SHALL parse user input according to locale conventions

#### Scenario: Component without provider
- **WHEN** React Aria components render without NimbusI18nProvider ancestor
- **THEN** React Aria SHALL use browser default locale
- **AND** SHALL not throw errors
- **AND** formatting SHALL still work with detected locale

### Requirement: TypeScript Props Interface
The component SHALL provide comprehensive TypeScript types.

#### Scenario: NimbusI18nProviderProps export
- **WHEN** component types are defined
- **THEN** SHALL export NimbusI18nProviderProps interface
- **AND** SHALL include locale prop as optional string (from React Aria I18nProviderProps)
- **AND** SHALL include children prop as required ReactNode (from React Aria I18nProviderProps)
- **AND** SHALL be exported from package index

#### Scenario: Props inheritance from React Aria
- **WHEN** props interface is defined
- **THEN** locale SHALL use type from React Aria I18nProviderProps["locale"]
- **AND** children SHALL use type from React Aria I18nProviderProps["children"]
- **AND** SHALL maintain compatibility with React Aria types

### Requirement: Locale Prop Type
The component SHALL accept optional locale prop with proper typing.

#### Scenario: Optional string locale
- **WHEN** locale prop is defined
- **THEN** SHALL be optional (locale?: string)
- **AND** SHALL accept BCP47 language tag strings
- **AND** SHALL have JSDoc: "BCP47 language code for internationalization (e.g., 'en-US', 'de-DE', 'es-ES')"

#### Scenario: Locale JSDoc documentation
- **WHEN** locale prop is documented
- **THEN** JSDoc SHALL explain it affects date, number, and locale-specific formatting
- **AND** SHALL provide examples: 'en-US', 'de-DE', 'es-ES'
- **AND** SHALL be consistent with types file documentation

### Requirement: Children Prop Type
The component SHALL accept required children prop.

#### Scenario: Required ReactNode children
- **WHEN** children prop is defined
- **THEN** SHALL be required (children: ReactNode)
- **AND** SHALL accept any valid React children
- **AND** SHALL have JSDoc: "Child components to be wrapped with i18n context"

### Requirement: Display Name
The component SHALL set displayName for debugging.

#### Scenario: Debug identification
- **WHEN** component renders in React DevTools
- **THEN** SHALL display as "NimbusI18nProvider"
- **AND** SHALL aid in component tree debugging
- **AND** SHALL follow nimbus-core displayName standards

### Requirement: JSDoc Documentation
The component SHALL provide comprehensive JSDoc.

#### Scenario: Component JSDoc
- **WHEN** component is documented
- **THEN** SHALL include description: "NimbusI18nProvider component that provides internationalization context for React Aria components. This is a proxy component that wraps React Aria's I18nProvider."
- **AND** SHALL include @example with basic usage
- **AND** example SHALL show locale prop and children

#### Scenario: Example code in JSDoc
- **WHEN** JSDoc example is provided
- **THEN** SHALL demonstrate wrapping DatePicker or other React Aria component
- **AND** SHALL show locale prop usage (e.g., locale="de-DE")
- **AND** SHALL use proper TypeScript/JSX syntax

### Requirement: NimbusProvider Integration
The component SHALL integrate with NimbusProvider for full application setup.

#### Scenario: Used within NimbusProvider
- **WHEN** NimbusProvider is used
- **THEN** NimbusProvider SHALL include NimbusI18nProvider in its provider stack
- **AND** SHALL forward locale prop from NimbusProvider to NimbusI18nProvider
- **AND** SHALL ensure React Aria components have locale context automatically

#### Scenario: Standalone usage
- **WHEN** used outside NimbusProvider
- **THEN** SHALL still function independently
- **AND** SHALL provide React Aria I18n context to descendants
- **AND** SHALL be useful for partial Nimbus adoption or testing

### Requirement: Server-Side Rendering Compatibility
The component SHALL support server-side rendering environments.

#### Scenario: SSR rendering
- **WHEN** rendered on server
- **THEN** SHALL render without errors in SSR environment
- **AND** SHALL use provided locale or React Aria defaults
- **AND** SHALL not access browser-only APIs during SSR

#### Scenario: Hydration
- **WHEN** hydrating on client after SSR
- **THEN** SHALL match server-rendered output
- **AND** SHALL apply correct locale formatting on client
- **AND** SHALL not cause hydration mismatches

#### Scenario: Next.js compatibility
- **WHEN** used in Next.js application
- **THEN** SHALL work in both App Router and Pages Router
- **AND** SHALL support 'use client' directive if needed
- **AND** SHALL integrate with Next.js SSR and hydration

### Requirement: Multiple Locale Rendering
The component SHALL support rendering multiple locales on same page.

#### Scenario: Side-by-side locale comparison
- **WHEN** multiple NimbusI18nProvider instances render with different locales
- **THEN** each SHALL maintain independent locale context
- **AND** SHALL not interfere with each other
- **AND** components SHALL format according to their ancestor provider

#### Scenario: Dynamic locale switching
- **WHEN** locale prop changes
- **THEN** SHALL update React Aria I18n context
- **AND** descendant components SHALL reformat according to new locale
- **AND** SHALL not cause unnecessary re-renders of unaffected components

### Requirement: Locale Context Access
The component SHALL enable locale access via React Aria hooks.

#### Scenario: useLocale hook access
- **WHEN** descendant components use React Aria's useLocale hook
- **THEN** SHALL provide current locale value
- **AND** hook SHALL return { locale: string, direction: 'ltr' | 'rtl' }
- **AND** SHALL reflect locale set by nearest NimbusI18nProvider ancestor

#### Scenario: Text direction detection
- **WHEN** locale is set
- **THEN** React Aria SHALL determine text direction (ltr/rtl) from locale
- **AND** RTL locales (ar, he, fa) SHALL set direction="rtl"
- **AND** LTR locales SHALL set direction="ltr"

### Requirement: Calendar System Support
The component SHALL support locale-specific calendar systems.

#### Scenario: Gregorian calendar
- **WHEN** locale uses Gregorian calendar (most Western locales)
- **THEN** Calendar components SHALL use Gregorian calendar system
- **AND** SHALL display months January-December
- **AND** SHALL use standard week numbering

#### Scenario: Alternative calendar systems
- **WHEN** locale specifies alternative calendar via BCP47 extensions
- **THEN** React Aria SHALL support locale-appropriate calendar systems
- **AND** SHALL format dates according to calendar system conventions
- **AND** examples: Buddhist calendar (th-TH-u-ca-buddhist), Japanese calendar (ja-JP-u-ca-japanese)

### Requirement: Week Start Day Configuration
The component SHALL respect locale-specific week start days.

#### Scenario: Sunday start (US, Japan, etc.)
- **WHEN** locale="en-US" or "ja-JP"
- **THEN** Calendar components SHALL start week on Sunday
- **AND** Sunday SHALL appear in leftmost column

#### Scenario: Monday start (Europe, etc.)
- **WHEN** locale="de-DE" or "es-ES" or "fr-FR" or "en-GB"
- **THEN** Calendar components SHALL start week on Monday
- **AND** Monday SHALL appear in leftmost column

### Requirement: Collation and Sorting Context
The component SHALL provide locale-aware collation context.

#### Scenario: String comparison
- **WHEN** components need to sort strings (e.g., Select, ComboBox)
- **THEN** React Aria SHALL use locale-appropriate collation
- **AND** SHALL sort according to locale conventions
- **AND** SHALL handle diacritics and special characters correctly

#### Scenario: Search and filtering
- **WHEN** components filter strings (e.g., ComboBox with search)
- **THEN** React Aria SHALL use locale-aware string comparison
- **AND** SHALL handle case-insensitive matching per locale
- **AND** SHALL respect locale-specific character equivalences

### Requirement: Time Zone Handling
The component SHALL work with React Aria's time zone support.

#### Scenario: Time zone-aware dates
- **WHEN** DatePicker or Calendar components use time zone props
- **THEN** SHALL work correctly with NimbusI18nProvider locale
- **AND** SHALL format dates with locale conventions and time zone offset
- **AND** time zone and locale SHALL be independent concerns

### Requirement: Performance Optimization
The component SHALL minimize unnecessary re-renders.

#### Scenario: Stable locale value
- **WHEN** locale prop doesn't change
- **THEN** SHALL not trigger unnecessary re-renders of descendants
- **AND** React Aria I18n context SHALL remain stable
- **AND** SHALL leverage React context optimization

#### Scenario: Locale change performance
- **WHEN** locale prop changes
- **THEN** SHALL only re-render components that depend on locale
- **AND** SHALL not re-render entire application tree
- **AND** formatting updates SHALL be efficient

### Requirement: Error Handling
The component SHALL handle invalid locale values gracefully.

#### Scenario: Invalid locale format
- **WHEN** invalid locale string is provided
- **THEN** React Aria SHALL fall back to browser default locale
- **AND** SHALL not throw errors that break rendering
- **AND** SHALL log warning in development mode

#### Scenario: Unsupported locale
- **WHEN** valid but unsupported BCP47 locale is provided
- **THEN** React Aria SHALL fall back to closest supported locale
- **AND** SHALL use generic language if region variant unavailable
- **AND** SHALL still provide functional formatting

### Requirement: Storybook Documentation
The component SHALL provide comprehensive Storybook stories.

#### Scenario: Default story
- **WHEN** Default story renders
- **THEN** SHALL demonstrate US English locale (en-US)
- **AND** SHALL include DatePicker and NumberInput examples
- **AND** SHALL include play function verifying US number format ($1,234.56)

#### Scenario: Multiple locale stories
- **WHEN** locale variant stories render
- **THEN** SHALL include stories for: German, Spanish, French, PortugueseBrazil, Japanese
- **AND** each SHALL demonstrate locale-specific formatting
- **AND** SHALL verify number formatting in play functions

#### Scenario: Comparison story
- **WHEN** CompareLocales story renders
- **THEN** SHALL show multiple locales side by side
- **AND** SHALL verify different number formats per locale
- **AND** play function SHALL assert format differences (US: $1,234.56, DE: 1.234,56 €, GB: £1,234.56, JP: ￥1,234)

### Requirement: MDX Documentation
The component SHALL provide comprehensive MDX documentation.

#### Scenario: Overview section
- **WHEN** documentation renders
- **THEN** SHALL explain component purpose for React Aria I18n
- **AND** SHALL clarify it's for React Aria components (not plain TypeScript objects text translation)
- **AND** SHALL list key features: locale-aware formatting, React Aria integration, BCP47 codes

#### Scenario: Usage examples
- **WHEN** examples are provided
- **THEN** SHALL include basic usage wrapping DatePicker
- **AND** SHALL include dynamic locale switching example
- **AND** SHALL include nested providers example

#### Scenario: Guidelines section
- **WHEN** best practices are documented
- **THEN** SHALL recommend wrapping at root level
- **AND** SHALL explain when to use (international apps, date/number formatting)
- **AND** SHALL explain when NOT to use (text translation, non-React Aria components)

#### Scenario: Supported locales list
- **WHEN** locale documentation is provided
- **THEN** SHALL list common BCP47 codes: en-US, en-GB, de-DE, es-ES, fr-FR, ja-JP, zh-CN, pt-BR
- **AND** SHALL explain regional specificity importance
- **AND** SHALL note any valid BCP47 tag is accepted
