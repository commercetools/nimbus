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

Extract all messages from component files and compile them:

```bash
pnpm extract-intl
```

This command performs two operations in sequence:

1. **Extracts** translation messages from all `.i18n.ts` files throughout the
   codebase
2. **Compiles** the extracted messages into optimized AST format for
   distribution

The process:

- Scans all `.i18n.ts` files and updates `packages/i18n/data/core.json`
- Converts files in `data/` to optimized versions in `compiled-data/`

> [!IMPORTANT]  
> Run `extract-intl` before merging your changes so that Transifex knows about
> new translation keys that need to be translated.

### Building Translation Data

The i18n package has its own build process that compiles translation data:

```bash
pnpm --filter @commercetools-nimbus/i18n build
```

This converts files in `data/` to optimized versions in `compiled-data/` for
distribution.

> [!NOTE]  
> The i18n build process is automatically run during the main build process
> (`pnpm build`) via `build:packages`, so compiled translation data is always
> up-to-date in built packages.

## File Structure

//TODO

## Translation Workflow

The i18n workflow involves two main scenarios: development (adding new keys) and
building (compiling for distribution).

### Development Workflow

When developers add new translation keys to components:

```mermaid

    A[Developer adds .i18n.ts files] --> B[Run: pnpm extract-intl]
    B --> C[Extract keys to core.json]
    C --> D[Compile to compiled-data/]
    D --> E[Commit changes]
    E --> F[Transifex gets new keys]
```

### Build Workflow

When building the project for distribution:

```mermaid
    A[Run: pnpm build] --> B[build:packages runs]
    B --> C[i18n package build script]
    C --> D[Compile existing data]
    D --> E[Ready for distribution]
```

### Script Interaction

| Script                 | Purpose            | When to Use                      | What it Does                                                                           |
| ---------------------- | ------------------ | -------------------------------- | -------------------------------------------------------------------------------------- |
| `extract-intl`         | Extract + Compile  | When adding new translation keys | 1. Scans `.i18n.ts` files<br>2. Updates `core.json`<br>3. Compiles to `compiled-data/` |
| `build` (i18n package) | Compile only       | Automatically during build       | Compiles existing translation data                                                     |
| `build:packages`       | Build all packages | During main build                | Runs `build` script in all packages including i18n                                     |

### Key Points

- **Extract workflow**: Use `extract-intl` when adding new translation keys
- **Build workflow**: Compilation happens automatically during `pnpm build`
- **No manual compilation**: The build system handles compilation automatically
- **Transifex integration**: New keys are available for translation after
  running `extract-intl`

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
