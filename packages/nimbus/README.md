# Nimbus

To install dependencies:

```bash
pnpm install
```

To build:

```bash
pnpm run build
```

## Internationalization (i18n) Development

### Workflow

1. **Create `.i18n.ts` source file** in the component's directory:
   - Example: `/components/alert/alert.i18n.ts`
   - Use the [i18n template](../../docs/component-templates/i18n.template.md) as
     a starting point
   - Message IDs must follow: `Nimbus.{ComponentName}.{messageKey}`
   - Be specific with descriptions - they help translators understand context
   - **Note:** This file is for extraction only - components don't import it at
     runtime

2. **Use messages in your component**:
   - Import the compiled message dictionary:
     `import { componentMessages } from "./component.messages"`
   - Use `useLocale()` from `react-aria-components` to get locale
   - Call `componentMessages.getStringForLocale("key", locale)` to retrieve
     messages
   - See [i18n guidelines](../../docs/file-type-guidelines/i18n.md) for detailed
     usage patterns

3. **Extract and compile messages**:
   - Run `pnpm extract-intl` to extract messages from `.i18n.ts` files
   - The build pipeline automatically compiles messages to `.messages.ts`
     dictionaries
   - Messages are translated via Transifex workflow

4. **Test in Storybook** to ensure locale is working as expected

### Dependencies

**`react-intl` is a dev dependency only** - it is not required at runtime:

- ✅ **In `devDependencies`**: Needed for `.i18n.ts` source files which use
  `defineMessages` from `react-intl`. The `@formatjs/cli extract` tool expects
  this format to extract messages.
- ❌ **Not in `peerDependencies`**: Consumers do not need to install
  `react-intl`. Components use compiled `.messages.ts` dictionaries at runtime,
  not the `.i18n.ts` source files.
- ✅ **Runtime**: Components use `@internationalized/message` and
  `react-aria-components` for message retrieval, not `react-intl`.

### Extracting Messages

```bash
pnpm extract-intl
```

This command performs two operations:

1. **Extracts** translation messages from all `.i18n.ts` files and saves them to
   `packages/i18n/data/core.json`
2. **Compiles** the extracted messages into optimized AST format in
   `compiled-data/` for distribution

**Note:** The i18n package also builds automatically during `pnpm build`.

> 📦 Translation data is organized in the
> [`@commercetools/nimbus-i18n`](../i18n/README.md) package.

## Translation Workflow

- Notifying Tx, TBD

## Distribution

- Describe how i18n will be packaged for appkit to be consumed by mc-apps.
