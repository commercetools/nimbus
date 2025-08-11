# 🌍 Internationalization Guide

Nimbus components are fully internationalized and require proper setup in
consuming applications to display translated text and aria-labels.

## Quick Setup

```tsx
import { IntlProvider } from "react-intl";
import { NimbusProvider, nimbusMessagesEN } from "@commercetools/nimbus";

// Combine Nimbus messages with your app's messages
const messages = {
  ...yourAppMessages,
  ...nimbusMessagesEN, // Required for Nimbus components
};

function App() {
  return (
    <IntlProvider locale="en" messages={messages}>
      <NimbusProvider>{/* Your app content */}</NimbusProvider>
    </IntlProvider>
  );
}
```

## Available Message Exports

Nimbus exports translation messages for multiple languages:

```tsx
import {
  nimbusMessagesEN, // English (default)
  nimbusMessagesDE, // German
  nimbusMessagesFR, // French
  nimbusMessagesCore, // Fallback/core messages
} from "@commercetools/nimbus";
```

## Multi-Language Setup

```tsx
const getMessages = (locale: string) => {
  const baseMessages = {
    ...yourAppMessages[locale],
  };

  switch (locale) {
    case "de":
      return { ...baseMessages, ...nimbusMessagesDE };
    case "fr-FR":
      return { ...baseMessages, ...nimbusMessagesFR };
    default:
      return { ...baseMessages, ...nimbusMessagesEN };
  }
};

<IntlProvider locale={currentLocale} messages={getMessages(currentLocale)}>
  <NimbusProvider>
    <App />
  </NimbusProvider>
</IntlProvider>;
```

## Customizing Nimbus Translations

You can override any Nimbus translation by providing your own values:

```tsx
const messages = {
  ...nimbusMessagesEN,

  // Override Nimbus defaults
  "numberInput.increment": "Add One",
  "passwordInput.show": "Reveal Password",
  "loadingSpinner.default": "Please wait...",
};
```

## ⚠️ Important Notes

### Without Nimbus Messages

If you don't include Nimbus messages, components will display raw translation
keys instead of user-friendly text:

```html
<!-- Without Nimbus messages -->
<button aria-label="numberInput.increment">+</button>

<!-- With Nimbus messages -->
<button aria-label="Increment">+</button>
```

### Console Warnings

Missing translations will generate console warnings:

```bash
Warning: Translation key "numberInput.increment" not found for locale "en"
```

### Accessibility Impact

Proper translations are essential for screen readers and accessibility. Raw
translation keys make your app less accessible to users with disabilities.

## Examples of Available Translation Keys

### Date Picker

- `datePicker.clearInput` - "Clear input value"
- `datePicker.time.enterTimeHourMinuteSecond` - "Enter time (hour, minute, and
  second)"

### Date Range Picker

- `dateRangePicker.time.startTime` - "Start time"
- `dateRangePicker.time.endTime` - "End time"

### Loading Spinner

- `loadingSpinner.default` - "Loading data"

### Number Input

- `numberInput.increment` - "Increment"
- `numberInput.decrement` - "Decrement"

### Password Input

- `passwordInput.show` - "Show password"
- `passwordInput.hide` - "Hide password"

### Select

- `select.clearSelection` - "Clear Selection"

## Architecture

Nimbus follows the industry-standard pattern where:

1. **Components use `useIntl()`** to access translation messages
2. **Consuming applications provide `IntlProvider`** at the root level
3. **Message loading and locale management** is handled by the consuming app
4. **Component libraries don't bundle translations** to avoid conflicts

This approach ensures:

- ✅ Single source of truth for translations
- ✅ No version conflicts with react-intl
- ✅ Consuming apps control message loading
- ✅ Easy customization and overrides
- ✅ Smaller bundle sizes

## Dependencies

Make sure your application has `react-intl` installed:

```bash
npm install react-intl
# or
pnpm add react-intl
```

Nimbus lists `react-intl` as a peer dependency, so you control the version.

## Example: Complete Setup

```tsx
import React, { useState } from "react";
import { IntlProvider } from "react-intl";
import {
  NimbusProvider,
  NumberInput,
  nimbusMessagesEN,
  nimbusMessagesDE,
} from "@commercetools/nimbus";

// Your app's messages
const appMessages = {
  en: {
    "app.welcome": "Welcome!",
    "app.submit": "Submit",
  },
  de: {
    "app.welcome": "Willkommen!",
    "app.submit": "Absenden",
  },
};

function App() {
  const [locale, setLocale] = useState("en");

  // Combine app + Nimbus messages
  const messages = {
    ...appMessages[locale],
    ...(locale === "de" ? nimbusMessagesDE : nimbusMessagesEN),

    // Optional overrides
    "numberInput.increment": locale === "de" ? "Erhöhen" : "Add One",
  };

  return (
    <IntlProvider locale={locale} messages={messages}>
      <NimbusProvider>
        <div>
          <select value={locale} onChange={(e) => setLocale(e.target.value)}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>

          <NumberInput />
        </div>
      </NimbusProvider>
    </IntlProvider>
  );
}

export default App;
```

---

For more information about react-intl setup, see the
[react-intl documentation](https://formatjs.io/docs/react-intl/).
