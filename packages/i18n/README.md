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
> package for `.i18n.ts` source file extraction. It is not a runtime
> dependency - components use compiled `.messages.ts` dictionaries with
> `@internationalized/message` at runtime.

## Architecture

### Build Pipeline

The package runs a 4-step compilation process:

1. **Transform** (`build:transform`) - Converts Transifex format → ICU
   MessageFormat
2. **Split** (`build:split`) - Groups messages by component (parses
   `Nimbus.{Component}.{key}` IDs)
3. **Compile** (`build:compile-strings`) - Compiles ICU messages to TypeScript
   files with JavaScript functions using `@internationalized/string-compiler`
4. **Generate Dictionaries** (`build:dictionaries`) - Creates
   `MessageDictionary` wrapper files that import all locale files and export
   typed message dictionaries for each component

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

These files are consumed directly by Nimbus components using `MessageDictionary`
from `@internationalized/message`.

> 📚 **Reference:**
> [`@internationalized/message`](https://github.com/adobe/react-spectrum/tree/main/packages/%40internationalized/message)
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
    <button aria-label={alertMessages.getStringForLocale("dismiss", locale)}>
      ...
    </button>
  );
};
```

**Important Notes:**

- **Locale Format**: Dictionaries use simple locale codes (`en`, `de`, `es`,
  `fr-FR`, `pt-BR`) that match what `useLocale()` returns from `I18nProvider`.
- **API Signature**: `getStringForLocale(key, locale)` - **key first, then
  locale**
- **Message Keys**: Use the key extracted from the message ID (e.g.,
  `"Nimbus.Alert.dismiss"` → `"dismiss"`), not the object key from the
  `.i18n.ts` file
- **Variable Messages**: Messages with variables (like `{fullName}`) compile to
  functions. Check the type before calling:
  ```typescript
  const message = avatarMessages.getStringForLocale("avatarLabel", locale);
  const label =
    typeof message === "function" ? message({ fullName: "John Doe" }) : message;
  ```

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
pnpm build:transform        # Transform Transifex → ICU
pnpm build:split            # Split by component
pnpm build:compile-strings  # Compile to TypeScript
pnpm build:dictionaries     # Generate dictionaries
```

## Message Keys Structure

All translation keys follow the pattern: `Nimbus.{ComponentName}.{messageKey}`

**Key Extraction:** When messages are split by component, the `{messageKey}`
portion becomes the key used in components. The full ID is used for extraction
and translation, but components use only the extracted key.

Examples:

- `Nimbus.Alert.dismiss` → Component uses: `"dismiss"`
- `Nimbus.Avatar.avatarLabel` → Component uses: `"avatarLabel"` (with variable:
  `{fullName}`)
- `Nimbus.LoadingSpinner.default` → Component uses: `"default"` (not
  `"defaultLoadingMessage"` from the object key)
- `Nimbus.Pagination.ofTotalPages` → Component uses: `"ofTotalPages"` (with
  variable: `{totalPages}`)

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
loadingSpinnerMessages.getStringForLocale("default", locale); // ← Use "default"
```

## Internal Package

**Note:** This package is for internal Nimbus development only. The compiled
message files are generated in the `@commercetools/nimbus` package and consumed
directly by components. External consumers do not need to install or use this
package directly.

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
