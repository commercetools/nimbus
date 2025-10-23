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

- Create a new `.i18n.ts` file in the component's directory and add the new
  message(s) to it.
  - Example: `/components/alert/alert.i18n.ts`
  - The message should follow the pattern: `Nimbus.{ComponentName}.{messageKey}`
  - Be specific with the message description, these are used to help translators
    with context for each message.
- Use the messages in your component:
  - Example: `/components/alert/components/alert.dismiss-button.tsx`
- Run `pnpm extract-intl` prior to merging to update the `core.json` file so
  Transifex can detect new translation keys.
- Test in Storybook to ensure the locale is working as expected.

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
