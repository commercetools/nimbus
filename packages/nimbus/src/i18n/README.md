# Nimbus Internationalization (i18n)

This directory contains the internationalization setup for the Nimbus design
system.

## Structure

```
src/i18n/
├── data/
│   ├── core.json          # Source of truth (English strings)
│   ├── en-US.json         # American English locale
│   ├── de-DE.json         # German translations
│   ├── es-ES.json         # Spanish translations
│   ├── fr-FR.json         # French translations
│   └── pt-BR.json         # Brazilian Portuguese translations
├── use-nimbus-intl.ts     # Main translation hook
├── index.ts               # Public exports
└── README.md              # This file
```

## Usage

### Basic Translation

```tsx
import { useNimbusIntl } from "@commercetools/nimbus";

const MyComponent = () => {
  const { translate } = useNimbusIntl();

  return <button aria-label={translate("button.save")}>Save</button>;
};
```

### Translation with Values

```tsx
const { translate } = useNimbusIntl();

// With ICU message formatting
const message = translate("validation.minLength", { min: 5 });
// Output: "Must be at least 5 characters"
```

### Available Functions

- `translate(key, values?)` - Translate with optional value interpolation
- `getString(key)` - Get raw string without formatting
- `hasString(key)` - Check if key exists
- `locale` - Current locale (e.g., 'en-US')
- `language` - Current language (e.g., 'en')

## Adding New Strings

1. Add the string to `data/core.json`:

```json
{
  "myComponent.newString": {
    "developer_comment": "Description of what this string is for",
    "string": "English text"
  }
}
```

2. Add translations to other language files (e.g., `data/de-DE.json`):

```json
{
  "myComponent.newString": {
    "developer_comment": "Description of what this string is for",
    "string": "German text"
  }
}
```

## Key Naming Convention

Use the format: `{componentName}.{purpose}`

Examples:

- `loadingSpinner.default`
- `numberInput.increment`
- `select.clearSelection`
- `calendar.nextMonth`
- `datePicker.time.hour`

**Note**: Component names should match the actual component name (e.g.,
`numberInput` not `number`).

## Integration with React Aria

The i18n system integrates with React Aria's built-in i18n hooks for optimal
performance and consistency:

### Custom Hook Approach

This implementation extends React Aria's `useLocale` with our own translation
system:

1. **`useLocale`** from `react-aria` - Gets the current locale from React Aria's
   `I18nProvider`
2. **Custom string dictionary management** - Dynamic loading of language files
   with React state
3. **Custom string formatting** - Simple variable replacement for dynamic
   content

## Translation Workflow

1. **Development**: Use English strings from `core.json`
2. **Translation**: Translate strings using AI services (e.g., DeepL, Claude,
   GPT) or professional translation services
3. **Import**: Add translated strings to language-specific JSON files
4. **Build**: Only English strings are bundled; other languages loaded
   dynamically

### Translation Process

When adding new languages or updating translations:

1. Copy the structure from `core.json` to create a new language file
2. Use AI translation services to translate the `string` values
3. Review and refine translations for context and accuracy
4. Add the completed language file to the `data/` directory
5. Update the `loadLanguageStrings` function in `use-nimbus-intl.ts`

## Supported Languages

Currently supported:

- **English (en-US)** - American English locale
- **German (de-DE)** - German translations
- **Spanish (es-ES)** - Spanish translations
- **French (fr-FR)** - French translations
- **Portuguese (pt-BR)** - Brazilian Portuguese translations

### Language File Naming

We use the `language-region` format (e.g., `en-US.json`, `de-DE.json`) to match:

- React Aria's `optimizeLocales` plugin configuration
- Nimbus's `vite.config.ts` locale settings
- Industry standard locale naming conventions

### Fallback Strategy

- **Primary fallback**: `core.json` (English strings)
- **Locale-specific**: If `en-US.json` fails to load, falls back to `core.json`
- **Graceful degradation**: If any language file fails to load, falls back to
  English

## Dynamic Loading

- **Initial bundle**: Only `core.json` + infrastructure (~4.75KB total)
- **Runtime loading**: Other language files loaded as separate chunks when
  needed
- **On-demand**: Language files only loaded when user switches to that locale

## Validation

## Testing

## Current Component Coverage

Currently translating strings for:

- **Calendar** - Navigation and selection aria-labels
- **Date Picker** - Time input and clear button aria-labels
- **Loading Spinner** - Default loading message
- **Number Input** - Increment/decrement button aria-labels
- **Select** - Empty states and loading messages

## Future Considerations
