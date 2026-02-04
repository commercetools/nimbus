# Specification: @commercetools/nimbus-i18n

## Overview

The @commercetools/nimbus-i18n package is a pure data package providing
centralized internationalization support for Nimbus components. It contains
multiple translation messages across 5 supported locales with Transifex-ready
format and runtime-optimized AST compilation.

**Package:** `@commercetools/nimbus-i18n` **Version:** 2.1.0 **Type:** Data-only
package (no code exports) **Locales:** 5 (en, de, es, fr-FR, pt-BR)
**Messages:** 137 unique IDs across 24 components

## Purpose

This specification defines the cross-cutting concerns for translation data
management, message compilation, and internationalization integration.
Component-specific translation messages are documented within individual
component specifications.

## Requirements

### Requirement: Dual Format Support

The system SHALL provide both source and compiled translation formats.

#### Scenario: Source format

- **WHEN** translations are authored or updated
- **THEN** SHALL store in data/ directory in Transifex format
- **AND** SHALL include developer_comment for translator context
- **AND** SHALL include string field with translatable text

#### Scenario: Compiled format

- **WHEN** translations are consumed at runtime
- **THEN** SHALL generate compiled message functions in
  packages/nimbus/src/components/{component}/intl/{locale}.ts
- **AND** SHALL generate message dictionaries in
  packages/nimbus/src/components/{component}/{component}.messages.ts
- **AND** SHALL optimize for runtime performance with LocalizedStringDictionary
- **AND** SHALL reduce bundle size after minification

### Requirement: Message ID Convention

The system SHALL follow hierarchical naming for message IDs.

#### Scenario: Message naming

- **WHEN** defining translation messages
- **THEN** SHALL use pattern: `Nimbus.{ComponentName}.{messageKey}`
- **AND** SHALL support nested components:
  `Nimbus.{Component}.{SubComponent}.{messageKey}`
- **AND** examples SHALL include: `Nimbus.Alert.dismiss`,
  `Nimbus.DatePicker.Time.enterTimeHour`

### Requirement: Multi-Locale Coverage

The system SHALL provide complete translations for 5 locales.

#### Scenario: Supported locales

- **WHEN** requesting available locales
- **THEN** SHALL provide English (en) as default/fallback
- **AND** SHALL provide German (de)
- **AND** SHALL provide Spanish (es)
- **AND** SHALL provide French (fr-FR)
- **AND** SHALL provide Portuguese Brazil (pt-BR)

#### Scenario: Translation completeness

- **WHEN** checking translation coverage
- **THEN** all 5 locales SHALL have all 137 messages translated
- **AND** SHALL maintain consistency across locales

### Requirement: Component-Specific Messages

The system SHALL organize messages by component ownership.

#### Scenario: Message distribution

- **WHEN** components reference i18n messages
- **THEN** DataTable SHALL have 31 messages (table settings, columns, density)
- **AND** RichTextInput SHALL have 24 messages (formatting, styles, lists)
- **AND** FieldErrors SHALL have 15 messages (validation errors)
- **AND** DateRangePicker SHALL have 13 messages (time inputs, calendar)
- **AND** Pagination SHALL have 8 messages (page navigation)
- **AND** ComboBox SHALL have 6 messages (selection, filtering)
- **AND** other components SHALL have 1-6 messages each

### Requirement: Automated Message Extraction

The system SHALL extract messages from component source files.

#### Scenario: Extraction process

- **WHEN** `pnpm extract-intl` runs
- **THEN** SHALL scan all `*.i18n.ts` files in packages
- **AND** SHALL use custom extraction script to extract messages
- **AND** SHALL output to packages/i18n/data/core.json in Transifex format
- **AND** SHALL trigger compilation to generate component-specific message files

#### Scenario: Custom extraction implementation

- **WHEN** extraction script processes .i18n.ts files
- **THEN** SHALL use dynamic import() to load TypeScript files directly
- **AND** SHALL read exported messages object from module.messages
- **AND** SHALL NOT use CLI parsing or AST manipulation
- **AND** SHALL iterate over message descriptors and convert to Transifex format
- **AND** SHALL validate required fields (id, description, defaultMessage)
- **AND** SHALL sort output alphabetically for consistent git diffs
- **AND** SHALL provide clear error messages for invalid message definitions

#### Scenario: Message definition

- **WHEN** component defines translatable text
- **THEN** SHALL create {component}.i18n.ts file
- **AND** SHALL define messages as plain TypeScript objects
- **AND** SHALL include id, description, and defaultMessage fields

### Requirement: AST Format Compilation

The system SHALL compile messages to optimized AST format.

#### Scenario: Compilation process

- **WHEN** `pnpm build` runs in i18n package
- **THEN** SHALL compile data/ files to component-specific directories using
  @internationalized/string-compiler
- **AND** SHALL generate intl/{locale}.ts files with compiled message functions
- **AND** SHALL generate {component}.messages.ts with LocalizedStringDictionary
- **AND** SHALL support variable interpolation placeholders

#### Scenario: Interpolation support

- **WHEN** message includes variables
- **THEN** SHALL parse interpolation syntax: `{variableName}`
- **AND** compiled AST SHALL represent literals (type: 0) and placeholders
  (type: 1)
- **AND** example: `"Avatar image for {fullName}"` →
  `[{type: 0, value: "Avatar image for "}, {type: 1, value: "fullName"}]`

### Requirement: Professional Translation Management

The system SHALL support Transifex workflow for translations.

#### Scenario: Transifex compatibility

- **WHEN** translations are managed via Transifex
- **THEN** data/ files SHALL use Transifex-compatible format
- **AND** SHALL include developer_comment field for translator context
- **AND** SHALL support bidirectional sync (extract → Transifex → sync back)

### Requirement: Component i18n Usage

The system SHALL integrate with @internationalized/string for message
formatting.

#### Scenario: Component message usage

- **WHEN** component needs localized text
- **THEN** SHALL import useLocalizedStringFormatter hook from @/hooks
- **AND** SHALL import compiled message strings from {component}.messages.ts
- **AND** SHALL call msg.format("key") for formatting
- **AND** SHALL support variable interpolation:
  `msg.format("key", { var: value })`

### Requirement: Provider Configuration

The system SHALL provide IntlProvider configuration.

#### Scenario: Provider setup

- **WHEN** NimbusProvider or IntlProvider is configured
- **THEN** SHALL load compiled messages from @commercetools/nimbus-i18n
- **AND** SHALL set locale prop for current locale
- **AND** SHALL set defaultLocale to "en"
- **AND** SHALL provide messages to all child components

### Requirement: Reusable Error Messages

The system SHALL provide standardized validation error messages.

#### Scenario: Error message categories

- **WHEN** FieldErrors component displays errors
- **THEN** SHALL provide basic validation messages (missing, invalid, empty)
- **AND** SHALL provide length validation (min, max)
- **AND** SHALL provide format validation (format, duplicate)
- **AND** SHALL provide numeric validation (negative, fractional, belowMinimum,
  aboveMaximum, outOfRange)
- **AND** SHALL provide server/async validation (serverError, resourceNotFound,
  blockedValue)

#### Scenario: Error usage

- **WHEN** form validation fails
- **THEN** SHALL render localized error message:
  `<FieldErrors errors={{ missing: true }} />`
- **AND** SHALL support multiple simultaneous errors
- **AND** SHALL display all applicable error messages

### Requirement: NPM Publication

The system SHALL publish translation data to NPM registry.

#### Scenario: Published files

- **WHEN** package is published
- **THEN** SHALL include data/ directory (source translations in i18n package)
- **AND** SHALL include compiled message files in nimbus package
  (components/{component}/intl/\*.ts and {component}.messages.ts)
- **AND** SHALL not include .i18n.ts source files (gitignored)
- **AND** SHALL be consumable via component imports

### Requirement: Consumer Integration

The system SHALL be consumed by Merchant Center App-Kit.

#### Scenario: App-Kit integration

- **WHEN** Merchant Center app uses Nimbus components
- **THEN** App-Kit SHALL load Nimbus translations automatically
- **AND** SHALL merge with system translations
- **AND** SHALL provide seamless i18n experience for end users

### Requirement: Organized Translation Files

The system SHALL maintain clear file organization.

#### Scenario: Directory structure

- **WHEN** accessing translation files
- **THEN** packages/i18n/data/ SHALL contain source Transifex format (6 files:
  core.json + 5 locales)
- **AND** packages/nimbus/src/components/{component}/intl/ SHALL contain
  compiled message functions per locale (5 files: en.ts, de.ts, es.ts, fr-FR.ts,
  pt-BR.ts)
- **AND** packages/nimbus/src/components/{component}/ SHALL contain
  {component}.messages.ts with LocalizedStringDictionary
- **AND** generated files SHALL be excluded from git via .gitignore
