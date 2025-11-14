# Internationalization (i18n) Package

Translation message management for Nimbus components using react-intl and Transifex integration.

## RFC 2119 Compliance

**This file and all i18n documentation MUST be interpreted according to [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).**

Key words: **MUST** / **MUST NOT** / **SHOULD** / **SHOULD NOT** / **MAY** (see root CLAUDE.md for definitions)

## Quick Commands

```bash
# Extract messages from Nimbus components
cd packages/i18n
pnpm extract

# Sync with Transifex
tx push --source        # Push source messages for translation
tx pull --all          # Pull translated messages

# Compile messages for runtime
pnpm build

# All-in-one workflow
pnpm extract && tx push --source
```

## Package Overview

**Purpose:** Centralized translation management for Nimbus components

**Key Technologies:**
- react-intl (message formatting)
- Transifex (translation platform)
- @formatjs/cli (compilation)

**Build Outputs:**
- Compiled messages (`compiled-data/{locale}.json`)

**Supported Locales:**
- `en` - English (source)
- `de` - German
- `es` - Spanish
- `fr-FR` - French
- `ja` - Japanese
- `pt-BR` - Portuguese (Brazil)
- `zh-CN` - Chinese (Simplified)

## i18n Workflow

```
Nimbus *.i18n.ts → Extract → Transifex → Translate → Pull → Compile → Runtime
```

1. **Extract**: Pull messages from Nimbus `*.i18n.ts` files
2. **Push**: Send source (English) messages to Transifex
3. **Translate**: Translators work on Transifex platform
4. **Pull**: Get translated messages from Transifex
5. **Compile**: Build runtime-ready JSON files
6. **Use**: Import in applications

## Message Format

### In Nimbus Components (`*.i18n.ts`)

```typescript
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  label: {
    id: 'Button.label',
    defaultMessage: 'Click me',
  },
  tooltip: {
    id: 'Button.tooltip',
    defaultMessage: 'Click to {action}',
  },
});
```

**YOU MUST:**
- Use `defineMessages` from react-intl
- Provide unique `id` (format: `Component.key`)
- Include `defaultMessage` (source English text)

See [react-intl ICU Syntax](https://formatjs.io/docs/core-concepts/icu-syntax/) for formatting patterns (variables, pluralization, dates, etc.)

## Usage in Applications

### Setup IntlProvider

```typescript
import { IntlProvider } from 'react-intl';
import enMessages from '@commercetools/nimbus-i18n/compiled-data/en.json';

<IntlProvider locale="en" messages={enMessages}>
  <App />
</IntlProvider>
```

### In Nimbus Components

```typescript
import { useIntl } from 'react-intl';
import { messages } from './button.i18n';

const Button = () => {
  const intl = useIntl();
  return <button>{intl.formatMessage(messages.label)}</button>;
};
```

## Adding New Messages

1. Add to component's `*.i18n.ts` file
2. **YOU MUST extract:** `cd packages/i18n && pnpm extract`
3. **YOU SHOULD push to Transifex:** `tx push --source`
4. After translation, pull: `tx pull --all`
5. **YOU MUST compile:** `pnpm build`

## Adding New Locales

1. Request locale on Transifex platform
2. Update `package.json` build scripts with new locale
3. Pull translations: `tx pull -l {locale}`
4. Compile: `pnpm build`
5. Verify: Check `compiled-data/{locale}.json` exists

## Transifex Integration

### Configuration

**File:** `.tx/config` (at repo root)

```ini
[main]
host = https://www.transifex.com

[nimbus.messages]
source_file = packages/i18n/messages/en.json
source_lang = en
type = KEYVALUEJSON
```

### Common Commands

```bash
tx push --source        # Push source messages
tx pull -l de          # Pull specific locale
tx pull --all          # Pull all locales
tx status              # Check translation status
```

## File Structure

```
packages/i18n/
├── messages/                # Extracted messages
│   ├── en.json             # Source (English)
│   ├── de.json             # German translations
│   └── ...                 # Other locales
├── compiled-data/          # Compiled for runtime (YOU MUST use these)
│   ├── en.json
│   ├── de.json
│   └── ...
├── scripts/
│   └── extract.ts          # Message extraction script
└── package.json
```

## Message Extraction

**Source:** `packages/nimbus/src/**/*.i18n.ts`

**Command:** `pnpm extract` (from `packages/i18n/`)

**Output:** `messages/en.json` (source file for Transifex)

## Compilation

**Input:** `messages/{locale}.json` files

**Output:** `compiled-data/{locale}.json` (AST format for react-intl)

**Command:** `pnpm build`

**YOU MUST compile after:**
- Pulling new translations
- Adding new messages
- Modifying existing messages

## Message Formatting Patterns

```typescript
// Variables
defaultMessage: 'Hello {name}'

// Pluralization
defaultMessage: '{count, plural, one {# item} other {# items}}'

// Date/Time
defaultMessage: 'Today is {date, date, ::yyyyMMdd}'

// Select
defaultMessage: '{gender, select, male {he} female {she} other {they}}'
```

See [ICU Message Syntax](https://formatjs.io/docs/core-concepts/icu-syntax/)

## Common Issues

### Messages Not Updating
**YOU MUST:**
1. Extract: `cd packages/i18n && pnpm extract`
2. Build: `pnpm build`
3. Restart dev server

### Missing Translations
**YOU SHOULD:**
1. Verify message in `messages/en.json`
2. Check Transifex translation status
3. Pull: `tx pull -l {locale}`
4. Rebuild: `pnpm build`

### Compilation Fails
**YOU MUST:**
1. Validate JSON syntax in `messages/*.json`
2. Check for duplicate message IDs
3. Review console errors

### Transifex Sync Fails
**YOU SHOULD:**
1. Verify `.tx/config` is correct
2. Check Transifex credentials/auth
3. Review network errors

## Testing Translations

### In Storybook

```typescript
export const WithGerman: Story = {
  parameters: {
    locale: 'de',
  },
};
```

### In Applications

```typescript
<IntlProvider locale={userLocale} messages={messages[userLocale]}>
  <App />
</IntlProvider>
```

## Related Documentation

- **[Root CLAUDE.md](../../CLAUDE.md)** - Monorepo overview
- **[Nimbus i18n Guidelines](../../docs/nimbus/file-type-guidelines/i18n.md)** - Component i18n patterns
- **[react-intl Docs](https://formatjs.io/docs/react-intl/)** - Message formatting
- **[Transifex](https://www.transifex.com/)** - Translation platform

---

For Transifex configuration details and advanced message patterns, see the package README.
