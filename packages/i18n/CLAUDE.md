# Nimbus Internationalization

## Package Overview

The `@commercetools/nimbus-i18n` package is an **internal build tool** that:

- Stores translation source data for the extraction and translation workflow
- Compiles messages at build time using `@internationalized/string-compiler`
- Generates component-level message files directly in the Nimbus package
- Eliminates runtime parsing overhead through pre-compilation

**Important:** This package uses `react-intl` only as a dev dependency for
message extraction from `.i18n.ts` files. At runtime, components use
pre-compiled `LocalizedStringDictionary` from `@internationalized/string`.

## Build Process

### Compilation Commands

```bash
# Full build (runs all 3 steps in the pipeline)
pnpm --filter @commercetools/nimbus-i18n build

# Or from package directory
cd packages/i18n
pnpm build

# Individual build steps (for debugging)
pnpm build:split            # Transform Transifex format & split by component
pnpm build:compile-strings  # Compile messages to TypeScript
pnpm build:dictionaries     # Generate dictionary files
```

**For normal development**, use `pnpm extract-intl` from the project root, which
handles both extraction and compilation in one step.

### What Compilation Does

The build pipeline runs a **3-step compilation process**:

1. **Transform & Split** (`build:split`): Transforms Transifex format to simple
   key-value pairs and groups messages by component
2. **Compile** (`build:compile-strings`): Compiles messages to TypeScript
   functions using `@internationalized/string-compiler`
3. **Generate Dictionaries** (`build:dictionaries`): Creates `*.messages.ts`
   files for use with `useLocalizedStringFormatter` hook

This approach:

- Eliminates runtime parsing overhead (messages are pre-compiled functions)
- Reduces bundle size through tree-shaking of unused messages
- Provides type-safe message access with compile-time validation
- Integrates seamlessly with React Aria's internationalization patterns

## Directory Structure

```
packages/i18n/
├── data/              # Source translation files (Transifex format)
│   ├── core.json      # English source (for extraction only)
│   ├── en.json        # English translations
│   ├── de.json        # German translations
│   ├── es.json        # Spanish translations
│   ├── fr-FR.json     # French translations
│   ├── pt-BR.json     # Portuguese (Brazil) translations
│   └── ...            # Additional locales
├── scripts/           # Build pipeline scripts
│   ├── split-by-component.ts
│   ├── compile-component-messages.ts
│   ├── generate-dictionaries.ts
│   └── locales.ts
├── .temp/             # Temporary build artifacts (gitignored)
│   └── by-component/  # Messages grouped by component
├── package.json
└── README.md
```

**Generated output** (in `packages/nimbus/src/components/`):

```
packages/nimbus/src/components/alert/
├── alert.messages.ts  # Generated dictionary
└── intl/              # Generated compiled messages
    ├── en.ts
    ├── de.ts
    ├── es.ts
    ├── fr-FR.ts
    └── pt-BR.ts
```

## Translation Workflow

### 1. Message Extraction

Extract messages from components (run from repo root):

```bash
pnpm extract-intl
```

This command:

1. Scans all `.i18n.ts` files in packages and components
2. Extracts messages using `@formatjs/cli`
3. Outputs to `packages/i18n/data/core.json`
4. Automatically compiles translations

### 2. Message Definition

Define messages in component `.i18n.ts` files using `react-intl` for extraction:

```typescript
// packages/nimbus/src/components/alert/alert.i18n.ts
import { defineMessages } from "react-intl";

export const messages = defineMessages({
  dismiss: {
    id: "Nimbus.Alert.dismiss",
    defaultMessage: "Dismiss",
    description: "aria-label for the dismiss button in an alert",
  },
});
```

**Important:** `.i18n.ts` files are **only for extraction**. They use
`react-intl`'s `defineMessages` to enable `@formatjs/cli` extraction, but are
**not imported by components at runtime**.

### 3. Transifex Integration

1. Messages are extracted to `data/core.json` and pushed to Transifex
2. Translators provide translations for all supported locales
3. Translations are pulled back to `data/[locale].json` (Transifex format)
4. Build pipeline compiles messages:
   `pnpm --filter @commercetools/nimbus-i18n build`
5. Generated `*.messages.ts` files are committed to the repository

### 4. Usage in Components

Components import the **generated** `*.messages.ts` file and use the
`useLocalizedStringFormatter` hook:

```typescript
// packages/nimbus/src/components/alert/components/alert.dismiss-button.tsx
import { useLocalizedStringFormatter } from "@/hooks";
import { alertMessagesStrings } from "../alert.messages";

export const AlertDismissButton = ({ ...props }) => {
  const msg = useLocalizedStringFormatter(alertMessagesStrings);

  return (
    <button aria-label={msg.format("dismiss")}>
      <CloseIcon />
    </button>
  );
};
```

**Key points:**

- Use `useLocalizedStringFormatter` hook (from `@/hooks`)
- Import `*MessagesStrings` from generated `*.messages.ts` files (never from
  `.i18n.ts`)
- Call `msg.format(key)` with the key from the ID suffix (e.g.,
  `"Nimbus.Alert.dismiss"` → `"dismiss"`)

## Message ID Convention

Use namespaced IDs following this pattern:

```
Nimbus.{Component}.{key}
```

Examples:

- `Nimbus.Alert.dismiss` - Alert dismiss button label
- `Nimbus.Avatar.avatarLabel` - Avatar image label (with variable)
- `Nimbus.Dialog.close` - Dialog close button
- `Nimbus.Pagination.nextPage` - Pagination next button

**Guidelines:**

- Always start with `Nimbus.` (capitalized)
- Use PascalCase component name
- Use camelCase key names
- Keep keys descriptive but concise
- Message key in component = ID suffix (e.g., `Nimbus.Alert.dismiss` → use
  `"dismiss"` in `msg.format("dismiss")`)

## Message Format

### Simple vs Variable Messages

**Simple strings** (no variables):

- Plain text, no special syntax needed
- Example: `"Dismiss"` → compiles to: `dismiss: "Dismiss"`
- Use `msg.format("dismiss")` in components

**Variable strings** (with ICU MessageFormat syntax):

- Use ICU syntax for interpolation: `{variableName}`
- Example: `"Avatar image for {fullName}"` → compiles to function
- Use `msg.format("avatarLabel", { fullName: "John Doe" })` in components

```typescript
// Simple message example
export const messages = defineMessages({
  dismiss: {
    id: "Nimbus.Alert.dismiss",
    defaultMessage: "Dismiss", // Plain text
    description: "Dismiss button label",
  },
});

// Variable message example
export const messages = defineMessages({
  avatarLabel: {
    id: "Nimbus.Avatar.avatarLabel",
    defaultMessage: "Avatar image for {fullName}", // ICU syntax
    description: "Avatar accessibility label with user's full name",
  },
});
```

## Adding New Messages

1. **Define message in component's `.i18n.ts` file**

   ```typescript
   // packages/nimbus/src/components/alert/alert.i18n.ts
   import { defineMessages } from "react-intl";

   export const messages = defineMessages({
     dismiss: {
       id: "Nimbus.Alert.dismiss",
       defaultMessage: "Dismiss",
       description: "Aria label for dismiss button",
     },
   });
   ```

2. **Extract and compile messages from root**

   ```bash
   pnpm extract-intl
   ```

   This command:
   - Extracts messages from `.i18n.ts` files to `data/core.json`
   - Runs the build pipeline to compile messages
   - Generates `alert.messages.ts` and `intl/*.ts` files

3. **Verify generated files**
   - Check `packages/nimbus/src/components/alert/alert.messages.ts` exists
   - Check `packages/nimbus/src/components/alert/intl/en.ts` contains your
     message

4. **Use in component**

   ```typescript
   import { useLocalizedStringFormatter } from "@/hooks";
   import { alertMessagesStrings } from "./alert.messages";

   const msg = useLocalizedStringFormatter(alertMessagesStrings);
   const label = msg.format("dismiss"); // Use key from ID suffix
   ```

**Important:** Do NOT import from `.i18n.ts` files in components. Always import
from the generated `*.messages.ts` files.

## Supported Locales

Available locales (defined in `scripts/locales.ts`):

- `en` - English
- `de` - German
- `es` - Spanish
- `fr-FR` - French
- `pt-BR` - Portuguese (Brazil)

**Locale normalization:** The `useLocalizedStringFormatter` hook automatically
normalizes locale codes (e.g., `en-US` → `en`, `de-DE` → `de`) and falls back to
English for unsupported locales.

To add a new locale:

1. Add locale code to `scripts/locales.ts`
2. Create `data/[locale].json` file with Transifex translations
3. Update Vite config's `optimize-locales-plugin` to include new locale
4. Run build to compile: `pnpm --filter @commercetools/nimbus-i18n build`

## Build Dependencies

This package:

- Uses `@internationalized/string-compiler` for message compilation
- Uses `@formatjs/cli` for message extraction (dev dependency)
- Uses `react-intl` for `.i18n.ts` extraction only (dev dependency, not runtime)
- Does not depend on other Nimbus packages
- Is consumed by `@commercetools/nimbus` package

## Testing Translations

Components automatically receive locale context from React Aria's
`<I18nProvider>`:

```typescript
// In test files
import { I18nProvider } from "react-aria-components";
import { render } from "@testing-library/react";

test("renders with translations", () => {
  render(
    <I18nProvider locale="en">
      <YourComponent />
    </I18nProvider>
  );
});
```

For Storybook stories:

```typescript
// Stories automatically wrapped with I18nProvider by decorator
// Components use useLocalizedStringFormatter hook automatically
export const Primary: Story = {
  render: () => <AlertDismissButton />,
};
```

**Note:** No manual message passing needed - the `useLocalizedStringFormatter`
hook automatically retrieves the correct locale from React Aria's context.

## Common Tasks

### Update Existing Translation

1. **Edit the `.i18n.ts` file** with new message text

   ```typescript
   export const messages = defineMessages({
     dismiss: {
       id: "Nimbus.Alert.dismiss",
       defaultMessage: "Close", // Updated from "Dismiss"
       description: "aria-label for the dismiss button",
     },
   });
   ```

2. **Extract and compile**

   ```bash
   pnpm extract-intl
   ```

3. **Verify generated files updated**
   - Check `alert.messages.ts`
   - Check `intl/en.ts` contains new text

### Find All Messages for a Component

```bash
# Search in generated intl files
ls packages/nimbus/src/components/alert/intl/

# Search in data files
grep "Nimbus.Alert" packages/i18n/data/en.json

# Find all message IDs for a component
grep -o '"Nimbus\.Alert\.[^"]*"' packages/i18n/data/core.json
```

### Debug Missing Translations

If translations aren't working:

1. **Check `.i18n.ts` file exists** with proper `defineMessages` structure
2. **Run extraction**: `pnpm extract-intl` to extract and compile
3. **Verify extraction** in `packages/i18n/data/core.json`
4. **Check generated files exist**:
   - `packages/nimbus/src/components/{component}/{component}.messages.ts`
   - `packages/nimbus/src/components/{component}/intl/{locale}.ts`
5. **Verify component imports**:
   - Imports from `*.messages.ts` (not `.i18n.ts`)
   - Uses `useLocalizedStringFormatter` hook
   - Uses `msg.format(key)` with correct key from ID suffix
6. **Check for typos** in message keys (must match ID suffix exactly)

### Inspect Generated Files

```bash
# View generated dictionary
cat packages/nimbus/src/components/alert/alert.messages.ts

# View compiled messages for specific locale
cat packages/nimbus/src/components/alert/intl/en.ts
cat packages/nimbus/src/components/alert/intl/de.ts

# Check for compilation errors
pnpm --filter @commercetools/nimbus-i18n build
```
