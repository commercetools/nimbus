# @commercetools/nimbus-i18n

This package contains all translation messages from the Nimbus design system
components. It's a **pure data package** that provides centralized
internationalization support for accessibility labels, tooltips, and user-facing
text across all Nimbus components.

> 📖 **For i18n development information (adding messages, extraction workflow,
> etc.), see the
> [Nimbus README](../nimbus/README.md#internationalization-i18n-development)**

## Package Type

This is a **data-only package** - it contains no code, only translation files in
multiple formats. It's designed to be consumed directly by importing JSON files.

## Supported Locales

- **English (en)** - Default locale
- **German (de)**
- **Spanish (es)**
- **French (fr-FR)**
- **Portuguese (pt-BR)**

## Installation

```bash
pnpm add @commercetools-nimbus/i18n
```

## Usage

### Primary Usage: App-Kit Integration

This package is primarily designed to be consumed by the **Merchant Center
App-Kit**, which automatically loads and merges Nimbus translations with other
system translations.

## Message Keys Structure

All translation keys follow the pattern: `Nimbus.{ComponentName}.{messageKey}`

Examples:

- `Nimbus.PasswordInput.show` - Show password button
- `Nimbus.DatePicker.clearInput` - Clear input button
