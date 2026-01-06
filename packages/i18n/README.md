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

> **Note:** `react-intl` is used only as a dev dependency in the `nimbus`
> package for `.i18n.ts` source file extraction. It is not a runtime dependency.
> Components use compiled `.messages.ts` dictionaries with
> `LocalizedStringDictionary` from `@internationalized/string` at runtime.

## Architecture

### Build Pipeline

The package runs a 4-step compilation process:

1. **Transform** (`build:transform`) - Flattens Transifex format to simple
   key-value pairs (removes metadata, extracts string values). Simple strings
   remain plain text; variable strings use ICU MessageFormat syntax like
   `{variable}` or pluralization.
2. **Split** (`build:split`) - Groups messages by component (parses
   `Nimbus.{Component}.{key}` IDs)
3. **Compile** (`build:compile-strings`) - Compiles messages to TypeScript files
   with JavaScript functions using `@internationalized/string-compiler`. Simple
   strings compile to plain strings; variable strings (with ICU syntax) compile
   to functions.
4. **Generate Dictionaries** (`build:dictionaries`) - Creates
   `LocalizedStringDictionary` wrapper files that import all locale files and
   export typed message dictionaries for each component

#### Message Normalization

The dictionary generation uses a shared `normalizeMessages` utility function
that adapts compiled messages to match the `LocalizedString` signature expected
by `LocalizedStringDictionary`.

**Why this is needed:**

- `@internationalized/string-compiler` generates functions with signature:
  ```typescript
  (args: Record<string, string | number>) => string;
  ```
- `LocalizedStringDictionary` expects functions with signature:
  ```typescript
  (args: Variables, formatter?: LocalizedStringFormatter) => string;
  ```
  where `Variables` can be `undefined`

**What it does:**

- Wraps compiled functions to accept `undefined` args and optional formatter
  parameter
- Filters out boolean values from args (compiled functions only accept string |
  number)
- Passes strings through unchanged (they're already compatible)
- Runtime-safe: Original functions don't use the formatter, and we provide empty
  object fallback for undefined args

The `normalizeMessages` function is located in
`packages/nimbus/src/utils/normalize-messages.ts` and is imported by all
generated `*.messages.ts` files.

### Output

The build process generates files in `packages/nimbus/src/components/`:

```
packages/nimbus/src/components/alert/
├── alert.messages.ts ← Generated dictionary
└── intl/ ← Generated compiled messages
    ├── en.ts
    ├── de.ts
    ├── es.ts
    ├── fr-FR.ts
    └── pt-BR.ts
```

These files are consumed directly by Nimbus components using
`LocalizedStringDictionary` from `@internationalized/string`.

> 📚 **Reference:**
> [`@internationalized/string`](https://github.com/adobe/react-spectrum/tree/main/packages/%40internationalized/string)
> is part of the [React Spectrum](https://github.com/adobe/react-spectrum)
> project by Adobe.

### Component Usage

Components import and use the generated message dictionaries:

```typescript
import { useLocale } from "react-aria-components";
import { alertMessages } from "./alert.messages";

export const AlertDismissButton = () => {
  const { locale } = useLocale();

  return (
    <button aria-label={alertMessages.getStringLocale("dismiss", locale)}>
      ...
    </button>
  );
};
```

**Important Notes:**

- **Locale Format**: Dictionaries use simple locale codes (`en`, `de`, `es`,
  `fr-FR`, `pt-BR`) that match what `useLocale()` returns from `I18nProvider`.
- **API Signature**:
  - `getStringLocale(key, locale)` - Returns `string` (always) for simple
    messages. Available on all components.
  - `getVariableLocale(key, locale)` - Returns `function | undefined` for
    variable messages. **Only available on components that have messages with
    variables.**
  - **Key first, then locale** for both methods
- **Message Keys**: Use the key extracted from the message ID (e.g.,
  `"Nimbus.Alert.dismiss"` → `"dismiss"`), not the object key from the
  `.i18n.ts` file
- **Variable Messages**: Messages with variables use ICU MessageFormat syntax
  (like `{fullName}`) and require `getVariableLocale`:

  ```typescript
  const message = avatarMessages.getVariableLocale("avatarLabel", locale);
  const label = message ? message({ fullName: "John Doe" }) : undefined;
  ```

  **Note:** Simple strings don't need ICU syntax—they're just plain text. ICU
  MessageFormat syntax is only needed for variable interpolation or
  pluralization.

## Supported Locales

- **English (en)** - Default locale
- **German (de)**
- **Spanish (es)**
- **French (fr-FR)**
- **Portuguese (pt-BR)**

## Build Commands

```bash
# Full build (runs all 4 steps)
pnpm build

# Individual steps
pnpm build:transform        # Flatten Transifex format (extract strings)
pnpm build:split            # Split by component
pnpm build:compile-strings  # Compile messages to TypeScript
pnpm build:dictionaries     # Generate dictionaries
```

## Message Format

### Simple vs Variable Messages

**Simple strings** (no variables):

- Plain text, no special syntax needed
- Example: `"Dismiss"` → compiles to: `dismiss: "Dismiss"`
- Use `getStringLocale()` in components

**Variable strings** (with ICU MessageFormat syntax):

- Use ICU syntax for interpolation: `{variableName}`
- Example: `"Avatar image for {fullName}"` → compiles to:
  `avatarLabel: (args) => "Avatar image for ${args.fullName}"`
- Use `getVariableLocale()` in components (only available when component has
  variable messages)

**Note:** ICU MessageFormat syntax is only needed for variable interpolation or
pluralization. Simple strings are just plain text and don't require any special
syntax.

## Message Keys Structure

All translation keys follow the pattern: `Nimbus.{ComponentName}.{messageKey}`

**Key Extraction:** When messages are split by component, the `{messageKey}`
portion becomes the key used in components. The full ID is used for extraction
and translation, but components use only the extracted key.

Examples:

- `Nimbus.Alert.dismiss` → Component uses: `"dismiss"` (simple string, no ICU
  syntax)
- `Nimbus.Avatar.avatarLabel` → Component uses: `"avatarLabel"` (variable string
  with ICU syntax: `{fullName}`)
- `Nimbus.LoadingSpinner.default` → Component uses: `"default"` (simple string,
  not `"defaultLoadingMessage"` from the object key)
- `Nimbus.Pagination.ofTotalPages` → Component uses: `"ofTotalPages"` (variable
  string with ICU syntax: `{totalPages}`)

**Note:** The message key in components comes from the `id` field in `.i18n.ts`
files, not the object key. For example:

```typescript
// .i18n.ts file
export const messages = defineMessages({
  defaultLoadingMessage: {
    // ← Object key (not used in component)
    id: "Nimbus.LoadingSpinner.default", // ← ID (extracted to "default")
    defaultMessage: "Loading data",
  },
});

// Component usage
loadingSpinnerMessages.getStringLocale("default", locale); // ← Use "default"
```

## Internal Package

**Note:** This package is **private** (marked as `"private": true` in
`package.json`) and is for internal Nimbus development only. It will not be
published to npm. The compiled message files are generated in the
`@commercetools/nimbus` package and consumed directly by components. External
consumers do not need to install or use this package directly.

## Translation Workflow

1. **Extraction**: Messages are extracted from `.i18n.ts` files using
   `@formatjs/cli extract` → `data/core.json`
2. **Translation**: Files in `data/` are sent to Transifex for translation
3. **Compilation**: Translated files are compiled using the build pipeline
4. **Usage**: Components import and use compiled `*.messages.ts` files at
   runtime

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TRANSLATION WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  📝 Source      │
│  Component      │
│  .i18n.ts       │
└────────┬────────┘
         │ @formatjs/cli extract
         ▼
┌─────────────────┐
│  🔍 Extraction   │
│  data/core.json  │
└────────┬────────┘
         │ Upload
         ▼
┌─────────────────┐
│  🌐 Transifex    │
│  (Translation)   │
└────────┬────────┘
         │ Download
         ▼
┌─────────────────────────────────────┐
│  📦 Translated Data                  │
│  data/en.json                        │
│  data/de.json                        │
│  data/es.json                        │
│  data/fr-FR.json                     │
│  data/pt-BR.json                     │
└────────┬────────────────────────────┘
         │
         │ ═══════════════════════════════════════
         │         BUILD PIPELINE
         │ ═══════════════════════════════════════
         │
         ├─ build:transform ──────────────┐
         │                                 ▼
         │                    ┌──────────────────────────┐
         │                    │  .temp/icu/*.json        │
         │                    │  (flattened key-value)    │
         │                    └───────────┬──────────────┘
         │                                │
         │                    ┌────────────▼──────────────┐
         │                    │  build:split             │
         │                    └───────────┬──────────────┘
         │                                │
         │                    ┌────────────▼──────────────────────────┐
         │                    │  .temp/by-component/                  │
         │                    │  {Component}/{locale}.json            │
         │                    └───────────┬──────────────────────────┘
         │                                │
         │                    ┌────────────▼──────────────────────────┐
         │                    │  build:compile-strings                │
         │                    └───────────┬──────────────────────────┘
         │                                │
         │                    ┌────────────▼──────────────────────────┐
         │                    │  packages/nimbus/src/components/       │
         │                    │  {component}/intl/{locale}.ts         │
         │                    └───────────┬──────────────────────────┘
         │                                │
         │                    ┌────────────▼──────────────────────────┐
         │                    │  build:dictionaries                    │
         │                    └───────────┬──────────────────────────┘
         │                                │
         │                    ┌────────────▼──────────────────────────┐
         │                    │  {component}.messages.ts                │
         │                    └───────────┬──────────────────────────┘
         │                                │
         └────────────────────────────────┘
                                          │ Import & use
                                          ▼
                              ┌──────────────────────────┐
                              │  🎯 Nimbus Components     │
                              │  (Runtime Usage)          │
                              └──────────────────────────┘
```
