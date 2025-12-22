# @commercetools/nimbus-i18n

This package manages the translation message compilation pipeline for the Nimbus
design system. It transforms translation data from Transifex format into
pre-compiled, component-level message dictionaries that are bundled directly
with Nimbus components.

> 📖 **For i18n development information (adding messages, extraction workflow,
> etc.), see the
> [Nimbus README](../nimbus/README.md#internationalization-i18n-development)**

## Package Purpose

This is an **internal build tool package** that:

- **Stores translation source data** (`data/`) for the extraction and
  translation workflow
- **Compiles messages at build time** using `@internationalized/string-compiler`
- **Generates component-level message files** in
  `packages/nimbus/src/components/*/intl/` and `*.messages.ts`
- **Eliminates runtime parsing overhead** by pre-compiling all messages to
  JavaScript functions

## Architecture

### Build Pipeline

The package runs a 4-step compilation process:

1. **Transform** (`build:transform`) - Converts Transifex format → ICU
   MessageFormat
2. **Split** (`build:split`) - Groups messages by component (parses
   `Nimbus.{Component}.{key}` IDs)
3. **Compile** (`build:compile-strings`) - Compiles ICU messages to JavaScript
   functions using `@internationalized/string-compiler`
4. **Generate Dictionaries** (`build:dictionaries`) - Creates
   `MessageDictionary` wrapper files for each component

### Output

The build process generates files in `packages/nimbus/src/components/`:

````packages/nimbus/src/components/alert/
├── alert.messages.ts ← Generated dictionary
└── intl/ ← Generated compiled messages
├── en.ts
├── de.ts
├── es.ts
├── fr-FR.ts
└── pt-BR.ts```



These files are consumed directly by Nimbus components using `MessageDictionary` from `@internationalized/message`.

## Supported Locales

- **English (en)** - Default locale
- **German (de)**
- **Spanish (es)**
- **French (fr-FR)**
- **Portuguese (pt-BR)**

## Build Commands

# Full build (runs all 4 steps)
pnpm build

# Individual steps
pnpm build:transform        # Transform Transifex → ICU
pnpm build:split            # Split by component
pnpm build:compile-strings # Compile to JavaScript
pnpm build:dictionaries     # Generate dictionaries## Message Keys Structure

All translation keys follow the pattern: `Nimbus.{ComponentName}.{messageKey}`

Examples:
- `Nimbus.Alert.dismiss` - Dismiss button label
- `Nimbus.Avatar.avatarLabel` - Avatar accessibility label (with variable: `{fullName}`)
- `Nimbus.Pagination.ofTotalPages` - Pagination label (with variable: `{totalPages}`)

## Internal Package

**Note:** This package is for internal Nimbus development only. The compiled message files are generated in the `@commercetools/nimbus` package and consumed directly by components.

## Translation Workflow

1. **Extraction**: Messages are extracted from `.i18n.ts` files using `@formatjs/cli extract` → `data/core.json`
2. **Translation**: Files in `data/` are sent to Transifex for translation
3. **Compilation**: Translated files are compiled using the build pipeline
4. **Usage**: Components import and use compiled `*.messages.ts` files at runtime


## Message Keys Structure
All translation keys follow the pattern: Nimbus.{ComponentName}.{messageKey}
Examples:
- Nimbus.Alert.dismiss - Dismiss button label
- Nimbus.Avatar.avatarLabel - Avatar accessibility label (with variable: {fullName})
- Nimbus.Pagination.ofTotalPages - Pagination label (with variable: {totalPages})

## Internal Package
**Note:** This package is for internal Nimbus development only. The compiled message files are generated in the `@commercetools/nimbus` package and consumed directly by components.
**External consumers do not need to install or use this package directly.

## Translation Workflow

1. **Extraction**: Messages are extracted from `.i18n.ts` files using `@formatjs/cli extract` → `data/core.json`
2. **Translation**: Files in `data/` are sent to Transifex for translation
3. **Compilation**: Translated files are compiled using the build pipeline
4. **Usage**: Components import and use compiled `*.messages.ts` files at runtime
````
