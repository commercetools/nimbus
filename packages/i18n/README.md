# @commercetools-nimbus/i18n

This package contains all translation messages from the Nimbus design system
components. It's a **pure data package** that provides centralized
internationalization support for accessibility labels, tooltips, and user-facing
text across all Nimbus components.

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
# or
npm install @commercetools-nimbus/i18n
# or
yarn add @commercetools-nimbus/i18n
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

## Development

### Adding New Messages

1. Create or update a component's `.i18n.ts` file:

```typescript
// packages/nimbus/src/components/button/button.i18n.ts
import { defineMessages } from "react-intl";

export default defineMessages({
  buttonLabel: {
    id: "Nimbus.Button.buttonLabel",
    description: "Label for the main action button",
    defaultMessage: "Click me",
  },
});
```

2. Use the messages in your component:

```typescript
// packages/nimbus/src/components/button/button.tsx
import { FormattedMessage } from 'react-intl';
import messages from './button.i18n';

export const Button = () => (
  <button>
    <FormattedMessage {...messages.buttonLabel} />
  </button>
);
```

### Extracting Messages

Extract all messages from component files:

```bash
pnpm extract-intl
```

This scans all `.i18n.ts` files, updates `packages/i18n/data/core.json`, and
also runs the `compile-i18n` script.

### Compiling Messages

Compile the raw JSON data into optimized AST format:

```bash
pnpm compile-i18n
```

This converts files in `data/` to optimized versions in `compiled-data/`.

### Building Translation Data

Compile the raw translation data into optimized format:

```bash
pnpm compile-i18n
```

## File Structure

//TODO

## Translation Workflow

//TODO

## Integration with App-Kit

To add Nimbus translations to the Merchant Center App-Kit, update the
`load-i18n.ts` file:

//TODO

## Best Practices

### Accessibility Guidelines

//TODO

### Message Naming

//TODO

```

## Contributing

//TODO
# add diagram
# review Text intlMessage prop
# preconstruct build?
# i18n dist folder
# add to changesets
# automated prs?
# order of operations


MIT
```
