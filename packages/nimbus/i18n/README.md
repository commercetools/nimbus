# Nimbus I18n Package

This package contains all translation messages for Nimbus components.

**TEMPORARY SETUP**:

- Add a `DEEPL_API_KEY` environment variable for automatic translations.

## Overview

Nimbus uses react-intl for internationalization, with a centralized approach
where all component translations are collected, managed, and distributed from
this package.

## Translation Workflow

### 1. Component Message Definition

Each component defines its messages in a `messages.ts` file:

```typescript
// packages/nimbus/src/components/date-picker/messages.ts
import { defineMessages } from "react-intl";

export default defineMessages({
  startTime: {
    id: "Nimbus.datePicker.time.startTime",
    description: "Label for start time in date picker",
    defaultMessage: "Start time",
  },
});
```

## Translation Workflow Overview w/ chart- //TODO

### 2. Message Extraction & Multi-Language Translation

Extract all component messages and automatically translate to all supported
languages: en, de, es, pt-BR, fr-FR.

```bash
# From packages/nimbus
pnpm extract-intl
```

This runs a 4-step workflow:

```bash
# 1. Extract messages from components
pnpm dlx @formatjs/cli extract --format=transifex --out-file=i18n/data/core.json 'src/**/messages.ts'
# 2. Copy directly to English so that it's in sync with core.json
cp i18n/data/core.json i18n/data/en.json
# 3. Auto-translate to all supported languages via DeepL API
pnpm translate-all  # What it says
# 4. Compile for runtime optimization
pnpm compile-intl   # Creates compiled-data w/ AST format
```

**Translation Logic:**

The translation script automatically detects which strings need translation:

- Missing language file entries
- Empty string values
- Strings that are the same as English (not yet translated)
- Creates new language files if they don't exist
- --TODO:Test for **removal** from core is handled
- --TODO:Test for **updating** of a string

## Design Decisions

### Why This Structure?

1. **Centralized Management**: All translations in one place.
2. **Component Co-location**: Messages live with components for better
   maintainability.
3. **Build-time Extraction**: Messages are extracted during build, not runtime.
4. **Runtime Optimization**: Compiled format for enhanced performance.
5. **Namespace Isolation**: `Nimbus.` prefix prevents conflicts with consuming
   applications.

### Why DeepL ?

- **Simpler Integration**
- **Cost-effective**
- **Pre-Approved**
- **Developer-friendly**
- **Immediate results** - Translations happen during development, not as
  separate step.

### Why pnpm dlx?

The extract script uses `pnpm dlx` instead of installing `@formatjs/cli` as a
dependency:

- **No dependency management** - Doesn't add to package.json.
- **Always latest version** - Gets newest formatjs CLI features.
- **Cleaner workspace** - One less dependency to maintain.
- **Infrequent usage** - Only run occasionally during development.

### Why Nimbus Prefix?

All translation keys use the `Nimbus.` prefix:

- **Avoids conflicts** with consuming applications (e.g. mc-fe).
- **Clear ownership** - Obvious which translations belong to Nimbus.

## Usage in Components

### Using FormattedMessage (Recommended for JSX)

```typescript
import { FormattedMessage } from 'react-intl';
import messages from './messages';

<Text>
  <FormattedMessage {...messages.startTime} />
</Text>
```

### Using useIntl (For props/attributes)

```typescript
import { useIntl } from 'react-intl';
import messages from './messages';

const intl = useIntl();
<button aria-label={intl.formatMessage(messages.clearInput)}>
  Clear
</button>
```

### React Aria (RA) + react-intl - Add something about RA's IntlProvider

**When using react-intl with RA components, prop spreading order is crucial!**
Notes: RA hooks provide built-in internationalized `aria-label` props that will
override your custom react-intl translations if not handled correctly.

## IN THEORY - Integration with Applications

Applications like mc-fe can merge Nimbus translations with their own:

```typescript
// In mc-fe or other consuming applications
import { messages as nimbusMessages } from "@commercetools/nimbus";

const mergedMessages = {
  ...mcFeMessages, // Application translations
  ...nimbusMessages, // Nimbus translations
};
```

### Adding to Automated Workflow

To include a new language in the automated `extract-intl` workflow:

1. Add the language code to `LANGUAGE_MAPPING` in `scripts/translate.ts`
2. Add the language to the `translate-all` script in `package.json`

## Implementation Details

### Translation Detection

The script automatically detects:

- Missing language file entries
- Empty string values
- Untranslated strings
- Missing language files (creates them)

### Runtime Optimization

- **AST compilation** via FormatJS for faster runtime loading
- **Optimized format** removes developer comments and metadata
- **Smaller bundle size** and improved performance
- **Automatic compilation** of all language files

## Future Needs/Considerations

- **Translation validation** and quality scoring
-
- Integration with CI for automated translation checks
- Shared setup- Set up a more robust workflow for this, ct has a pro account:
  https://commercetools.atlassian.net/wiki/spaces/itops/pages/897482932/DeepL+Pro
- Add to more components
- Test with mc-fe
- while testing with mc-fe, review how uikit handles intlMsg prop and see if we
  can emulate it
- does IntlDecorator work if Storybook set up w/in mc-fe (eg future shared
  components)
- Tests
- Storybook - select 2 components to loop through to test locals
- unit tests will handle this level of testing once in place
- Test components with a screen reader
- add 18n tests themselves
- ***
- - manual overrides!!
- -only updating one string at a time.

  follow up on: DatePicker focus ring Storybook - Select - example under docs
  clear button

  -Not sure if this will work as expected for some languages, how far do we want
  to take translations like this? "aria-label":
  `${fullName} ${intl.formatMessage(messages.avatar)}`,

## Related Documentation

- [React Intl Documentation](https://formatjs.io/docs/react-intl/)
- [FormatJS CLI Documentation](https://formatjs.io/docs/tooling/cli/)
- [DeepL API Documentation](https://www.deepl.com/docs-api)
