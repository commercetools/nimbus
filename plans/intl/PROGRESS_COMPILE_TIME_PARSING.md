# i18n Migration Progress Report - Compile-Time Message Parsing

**Status:** Phase 1-3 Complete + All Components Migrated + Provider Updates
Complete + Fallback Implementation Complete  
**Date:** January 2025  
**Last Updated:** January 2025  
**Related PR:** #841 (CRAFT-2029)

## Executive Summary

This document tracks the progress of migrating Nimbus from runtime message
parsing (`react-intl`) to compile-time message compilation using
`@internationalized/message`.

## Recent Updates (January 2025)

### ✅ Locale Normalization & Publishing Updates - COMPLETE

**Completed:**

- ✅ Added `normalizeLocale()` function to generated dictionary files
  - Handles BCP47 codes (`"en-US"` → `"en"`, `"de-DE"` → `"de"`)
  - Maps language codes to dictionary keys (`"fr"` → `"fr-FR"`, `"pt"` →
    `"pt-BR"`)
  - Falls back to `"en"` for unsupported languages
- ✅ Simplified fallback logic in `getStringLocale` and `getVariableLocale`
  methods
- ✅ Updated tests to verify BCP47 normalization (en-US, de-DE, es-ES)
- ✅ Removed `@commercetools/nimbus-i18n` from changesets ignore list
  - Package already marked as `"private": true` in package.json
  - No longer creates changesets or version bumps for i18n package

### ✅ Phase 3: Provider Updates - COMPLETE

**Completed:**

- ✅ Removed `IntlProvider` from `NimbusProvider` (no longer wraps with
  `react-intl`'s `IntlProvider`)
- ✅ Updated Storybook decorators (removed `WithIntlDecorator`, `ThemeDecorator`
  now provides i18n)
- ✅ Updated `NimbusProvider.stories.tsx` to use `NimbusI18nProvider` instead of
  `IntlProvider`
- ✅ Removed `react-intl` from `peerDependencies` (consumers no longer need it)
- ✅ Removed `react-intl` from `vite.config.ts` external array (no longer
  bundled)
- ✅ Added locale flow documentation to `NimbusProvider.mdx` and
  `docs/file-type-guidelines/i18n.md`
- ✅ Updated `packages/nimbus/README.md` and `packages/i18n/README.md` with
  dependency status information
- ✅ Updated `docs/file-type-guidelines/i18n.md` and
  `docs/component-templates/i18n.template.md` to reflect new system
- ✅ Updated all remaining documentation files with outdated patterns:
  - `CLAUDE.md`, `docs/readme.md`, `nimbus-i18n-provider.mdx`
  - `main-component.md`, `context-files.md`
  - `single-component.md`, `compound-component.root.md`
- ✅ Cleanup: Removed `compiled-data/` directory, made
  `@commercetools/nimbus-i18n` package private, updated README

**Key Changes:**

- Components now get locale from `NimbusProvider` → `NimbusI18nProvider` → React
  Aria's `I18nProvider`
- Storybook automatically provides locale through `ThemeDecorator` →
  `NimbusProvider`
- No `react-intl` runtime dependencies - only dev dependency for `.i18n.ts`
  extraction
- Build configuration updated to reflect dependency changes

### ✅ Final Implementation: Inline Fallback with Type-Safe API - COMPLETE

**Final Architecture Decision: Inline Fallback Logic (Not Class-Based)**

After exploring multiple approaches, we settled on **inline fallback logic**
directly in generated dictionary files. This approach:

- ✅ **No class/constructor** - Just plain objects with methods (simpler,
  cleaner)
- ✅ **Type-safe** - `getStringLocale` always returns `string` (fixes TypeScript
  errors)
- ✅ **Self-contained** - Generated files have no external runtime dependencies
- ✅ **Clear API** - Separate methods for simple strings vs variable messages

**Key Methods:**

1. **`getStringLocale(key, locale): string`** - Always returns `string` (never
   `undefined`)
   - For simple string messages (aria-labels, text content)
   - Filters out functions (variable messages)
   - Falls back to English, then empty string as last resort
   - **This was the key fix** - returning `string` instead of
     `string | undefined` resolved all TypeScript errors

2. **`getVariableLocale(key, locale): function | undefined`** - Returns function
   or undefined
   - For variable messages that require arguments (e.g., `"Hello {name}"`)
   - Filters out simple strings
   - Falls back to English, then `undefined`
   - Only 2 components use this (Avatar, Pagination)

### ✅ Fallback Implementation & Testing - COMPLETE

**Completed:**

- ✅ Implemented inline fallback logic directly in generated dictionary files
- ✅ Updated dictionary generation script to generate inline fallback methods
- ✅ Added try-catch error handling for unsupported locales (MessageDictionary
  throws errors, not returns undefined)
- ✅ Created two separate methods: `getStringLocale` (simple strings) and
  `getVariableLocale` (variable messages)
- ✅ Made `getStringLocale` always return `string` (never `undefined`) to fix
  TypeScript errors with `aria-label` props
- ✅ Created comprehensive Storybook tests for locale fallback behavior:
  - `AllSupportedLocales` - Tests all 5 supported locales (en, de, es, fr-FR,
    pt-BR)
  - `UnsupportedLocaleFallback` - Tests unsupported locales (ja-JP, sqi, it-IT)
    fallback to English
- ✅ All components automatically get fallback behavior without code changes
  (handled at dictionary level)

**Key Implementation Details:**

**Why Fallback at Dictionary Level (Not Provider Level):**

The locale from `NimbusI18nProvider` serves two separate purposes:

1. **React Aria Formatting** (dates, numbers, currency) - Needs the actual
   locale
   - If user requests `"ja-JP"`, React Aria should format dates/numbers in
     Japanese style
   - Changing locale to `"en"` at provider level would break formatting

2. **Nimbus Message Dictionaries** - Needs fallback to English when locale not
   supported
   - If user requests `"ja-JP"` but dictionary only has `"en"`, `"de"`, etc.,
     fallback to `"en"`
   - This fallback happens inside the generated dictionary methods, not at
     provider level

**How It Works:**

```typescript
// Component code (no changes needed)
const { locale } = useLocale(); // Returns "de-DE" or "ja-JP" (from provider)
const dismissLabel = alertMessages.getStringLocale("dismiss", locale);

// Inside generated alertMessages.getStringLocale():
//   1. Normalizes locale: "de-DE" → "de", "en-US" → "en", "ja-JP" → "en" (unsupported)
//   2. Tries normalized locale → succeeds for supported locales
//   3. For unsupported locales, normalization already returns "en"
//   4. Returns localized message (or English fallback) - always returns string
//   5. Locale context remains original (e.g., "de-DE") for React Aria formatting
```

**Result:**

- ✅ React Aria components format dates/numbers using `"ja-JP"` (correct)
- ✅ Nimbus messages fallback to English `"Dismiss"` (graceful degradation)
- ✅ No component code changes needed (fallback handled at dictionary level)
- ✅ Type-safe: `getStringLocale` always returns `string` (fixes TypeScript
  errors)

**Why Try-Catch Was Necessary:**

`MessageDictionary` from `@internationalized/message` throws an error when
accessing an unsupported locale, rather than returning `undefined`. The error
was: `"can't access property 'dismiss', strings is undefined"`.

The try-catch converts this error into a fallback:

- Catches the error when locale doesn't exist
- Continues to fallback logic
- Falls back to English: `dictionary.getStringForLocale(key, "en")`
- Returns empty string as last resort (ensures always returns `string`)

**Test Coverage:**

- ✅ All supported locales verified (en, de, es, fr-FR, pt-BR)
- ✅ BCP47 normalization verified (en-US → en, de-DE → de, es-ES → es)
- ✅ Unsupported locale fallback verified (ja-JP, sqi, it-IT → English)
- ✅ Locale context preserved for React Aria formatting
- ✅ Message retrieval works correctly with normalization and fallback

**Common Question: Why Show "ja-JP" as Returned Locale When Using English
Messages?**

When testing with unsupported locales, the display shows:

- **"Returned locale: ja-JP"** - This is correct! It's what `useLocale()`
  returns from React Aria context
- **"aria-label: Dismiss"** - This is also correct! It's the English fallback
  message

**Why this is the correct behavior:**

- The locale context (`"ja-JP"`) is used by React Aria for formatting (dates,
  numbers)
- The message fallback happens internally in the generated dictionary methods
- We want formatting to use `"ja-JP"` (Japanese date/number format) even if
  messages are in English
- This separation allows graceful degradation: formatting works correctly,
  messages fallback to English

**We should NOT change the returned locale to "en"** because that would break
React Aria formatting. The current behavior is intentional and correct.

## What's Been Completed

### ✅ Phase 1: Infrastructure Setup

1. **Build Scripts Created** (`packages/i18n/scripts/`)
   - ✅ `transform-to-icu.ts` - Transforms Transifex format → ICU MessageFormat
   - ✅ `split-by-component.ts` - Groups messages by component
   - ✅ `compile-component-messages.ts` - Compiles ICU to JavaScript functions
   - ✅ `generate-dictionaries.ts` - Creates MessageDictionary wrapper files

2. **Dependencies Added**
   - ✅ `@internationalized/string-compiler` (devDependency)
   - ✅ `@internationalized/message` (runtime dependency in
     `@commercetools/nimbus`)
   - ✅ `tsx` (for running TypeScript scripts)

3. **Build Pipeline Integrated**
   - ✅ `packages/i18n/package.json` updated with build scripts
   - ✅ Build orchestration: `build:transform` → `build:split` →
     `build:compile-strings` → `build:dictionaries`
   - ✅ `.temp/` directory for intermediate build artifacts (already in
     `.gitignore`)

4. **Components Migrated** (24 total - **ALL COMPLETE**)

   All components have:
   - ✅ Generated `intl/*.ts` files for all 5 locales
   - ✅ Generated `*.messages.ts` dictionary files
   - ✅ Updated component code to use new system
   - ✅ TypeScript types generated and working

5. **Package Configuration**
   - ✅ `pnpm-workspace.yaml` updated with `@internationalized/message` in
     catalog
   - ✅ `packages/i18n/README.md` updated with new architecture
   - ⏳ `@commercetools/nimbus-i18n` package set to private (pending - will
     tackle later)

### ✅ Phase 3: Provider Updates (COMPLETE)

1. **NimbusProvider Updates**
   - ✅ Removed `IntlProvider` from `react-intl` (no longer wraps children)
   - ✅ Components now get locale from `NimbusI18nProvider` → React Aria's
     `I18nProvider`
   - ✅ Simplified provider chain: `NimbusProvider` → `NimbusI18nProvider` →
     `I18nProvider`
   - ✅ Updated JSDoc to reflect new locale flow

2. **Storybook Decorators**
   - ✅ Removed `WithIntlDecorator` (obsolete - used `react-intl`'s
     `IntlProvider`)
   - ✅ Updated `ThemeDecorator` to provide both theme and i18n context via
     `NimbusProvider`
   - ✅ Updated `NimbusProvider.stories.tsx` to use `NimbusI18nProvider` instead
     of `IntlProvider`
   - ✅ Removed all `react-intl` references from Storybook

3. **Dependency Management**
   - ⏳ Remove `react-intl` from `peerDependencies` (pending - will tackle
     later)
   - ⏳ Full dependency cleanup pending (will tackle later - may need to keep
     `react-intl` in `devDependencies` for `.i18n.ts` extraction via
     `@formatjs/cli`, or find alternative extraction method)
   - ✅ `.i18n.ts` files remain unchanged (source files for extraction, not
     runtime)

4. **Documentation Updates**
   - ✅ Added locale flow diagram to `NimbusProvider.mdx` (user-facing)
   - ✅ Added locale resolution section to `docs/file-type-guidelines/i18n.md`
     (developer-facing)
   - ✅ Cross-referenced documentation between user and developer docs
   - ✅ Updated `ThemeDecorator` JSDoc to clarify i18n context provision

## Key Divergences from Original Plan

### 1. **API Change: `LocalizedStringDictionary` → `MessageDictionary`**

**Original Plan:**

```typescript
import { LocalizedStringDictionary } from "@internationalized/message";
export const alertMessages = new LocalizedStringDictionary({ ... });
```

**Actual Implementation:**

```typescript
import { MessageDictionary } from "@internationalized/message";
export const alertMessages = new MessageDictionary({ ... });
```

**Reason:** `LocalizedStringDictionary` is not exported from
`@internationalized/message` v3.1.8. `MessageDictionary` provides the same
functionality, and we wrap it with inline fallback logic in generated
dictionaries.

**Impact:** Minimal - same constructor pattern and API.

---

### 2. **Component Usage Pattern: Direct Access vs Hook**

**Original Plan:**

```typescript
import { useLocalizedStringFormatter } from "react-aria/i18n";
import { alertMessages } from "./alert.messages";

const strings = useLocalizedStringFormatter(alertMessages);
const label = strings.format("dismiss");

// Variable interpolation (original plan)
strings.format("avatarLabel", { fullName: "John Doe" });
```

**Actual Implementation:**

```typescript
import { useLocale } from "react-aria-components";
import { alertMessages } from "./alert.messages";

const { locale } = useLocale();
const label = alertMessages.getStringLocale("dismiss", locale);

// Variable interpolation (actual implementation)
const message = componentMessages.getVariableLocale("avatarLabel", locale);
const label = message ? message({ fullName: "John Doe" }) : undefined;
```

**Reason:** `useLocalizedStringFormatter` hook does not exist in
`react-aria/i18n`. The direct `getStringLocale()` and `getVariableLocale()`
approach is simpler and more explicit. Messages with variables use
`getVariableLocale()` which returns a function.

**Impact:**

- ✅ Simpler API (no intermediate hook)
- ✅ More explicit locale handling
- ✅ Better alignment with React Aria's patterns
- ⚠️ Variable messages require type checking (documented pattern)

---

### 3. **TypeScript Type Workarounds for Variable Messages**

**Challenge:** `MessageDictionary` TypeScript types only accept `string` values,
but messages with ICU variables compile to functions:
`(args: Record<string, any>) => string`.

**Solution:** Conditional `@ts-expect-error` directive for components with
variable messages:

```typescript
// Only added when component has messages with variables
// @ts-expect-error - MessageDictionary accepts both strings and functions at runtime,
// but TypeScript types only allow strings. Messages with variables compile to functions.
export const alertMessages = new MessageDictionary({ ... });
```

**Impact:**

- ✅ Runtime works correctly
- ⚠️ TypeScript type checking bypassed for these specific cases
- ✅ Type safety maintained for message keys via generated types

---

### 4. **CommonJS → ES Module Transformation**

**Challenge:** `@internationalized/string-compiler` outputs CommonJS by default.

**Solution:** Post-processing in `compile-component-messages.ts`:

- Transform `module.exports =` → `export default`
- Inject type annotations: `(args) =>` → `(args: Record<string, any>) =>`

**Impact:**

- ✅ Generated code matches project's ES module standards
- ✅ TypeScript errors resolved

---

### 5. **Test Setup Requirements**

**Challenge:** Tests need explicit locale in `NimbusProvider` for `useLocale()`
to work correctly.

**Solution:** Updated test utilities to default to `"en-US"`:

```typescript
const renderWithProvider = (
  ui: ReactNode,
  options?: RenderOptions & { locale?: string }
): RenderResult => {
  return rtlRender(
    <NimbusProvider locale={options?.locale ?? "en-US"}>{ui}</NimbusProvider>,
    options
  );
};
```

**Impact:**

- ⚠️ Some tests still need manual locale prop (if using `render` from
  `@testing-library/react` directly)
- ✅ Test utilities provide sensible defaults

---

### 6. **Locale Format: Simple Codes Instead of BCP47**

**Original Plan:**

- Dictionaries would use BCP47 format (`"en-US"`, `"de-DE"`)
- Assumed React Aria would normalize locales to BCP47
- Planned locale mapping utility (`utils/locale-mapping.ts`) to map BCP47 codes
  to simplified Nimbus locale keys:
  ```typescript
  export const NIMBUS_LOCALE_MAP = {
    "en-US": "en",
    "de-DE": "de",
    "es-ES": "es",
    // ... etc
  };
  export function getNimbusLocale(raLocale: string): string;
  ```

**Actual Implementation:**

- Dictionaries use simple locale codes (`"en"`, `"de"`, `"es"`)
- `useLocale()` returns whatever is passed to `I18nProvider` (no normalization)
- Storybook and tests use simple codes, so dictionaries match
- **Locale mapping utility NOT implemented** - not needed since we use simple
  codes throughout

**Reason:** React Aria doesn't force BCP47 normalization - it passes through
whatever locale string you provide. Using simple codes matches what Storybook
and tests actually use, eliminating the need for locale mapping.

**Impact:**

- ✅ Simpler - no locale mapping utility needed
- ✅ Consistent across Storybook, tests, and production
- ✅ Matches existing data format (`en.json`, `de.json`)
- ✅ No additional utility code to maintain

---

### 7. **API Parameter Order Correction**

**Initial Implementation:**

```typescript
alertMessages.getStringLocale(locale, "dismiss"); // ❌ Wrong order
```

**Corrected Implementation:**

```typescript
alertMessages.getStringLocale("dismiss", locale); // ✅ Correct: key first
```

**Reason:** The generated dictionary API signature is
`getStringLocale(key: string, locale: string)`, not
`getStringLocale(locale: string, key: string)`.

**Impact:**

- ✅ All 11 migrated components updated with correct parameter order
- ✅ Documentation updated to reflect correct usage

---

### 8. **Code Simplification: Inlined Message Calls**

**Pattern:** For simple string messages, we inlined the `getStringLocale` call
directly in JSX instead of using intermediate variables:

```typescript
// Before (unnecessary variable)
const label = alertMessages.getStringLocale("dismiss", locale);
return <button aria-label={label}>...</button>;

// After (inlined)
return <button aria-label={alertMessages.getStringLocale("dismiss", locale)}>...</button>;
```

**Impact:**

- ✅ Cleaner code for simple messages
- ✅ Variables only used when needed (default values, function handling)

---

### 9. **Message Key Extraction Clarification**

**Issue:** Message keys in components come from the `id` field in `.i18n.ts`
files, not the object key.

**Example:**

```typescript
// .i18n.ts file
export const messages = defineMessages({
  defaultLoadingMessage: {
    // ← Object key (not used)
    id: "Nimbus.LoadingSpinner.default", // ← ID extracts to "default"
    defaultMessage: "Loading data",
  },
});

// Component must use: "default" (from ID), not "defaultLoadingMessage" (object key)
loadingSpinnerMessages.getStringLocale("default", locale);
```

**Impact:**

- ✅ Fixed LoadingSpinner to use correct key (`"default"` instead of
  `"defaultLoadingMessage"`)
- ✅ Documentation updated with examples

---

### 10. **Dual Locale Hooks for MoneyInput**

**Challenge:** `MoneyInput` component requires both number formatting (from
`react-aria`) and message retrieval (from `react-aria-components`), but both
packages export a `useLocale` hook with different return types.

**Solution:** Import both hooks with aliasing:

```typescript
import { useLocale as useAriaLocale } from "react-aria"; // For number formatting
import { useLocale } from "react-aria-components"; // For messages

export const MoneyInput = (props: MoneyInputProps) => {
  // Get locale for number formatting (react-aria)
  const { locale: ariaLocale } = useAriaLocale();

  // Get locale for message retrieval (react-aria-components)
  const { locale } = useLocale();

  // Use ariaLocale for formatting
  const isCurrentlyHighPrecision = isHighPrecision(value, ariaLocale || "en");
  const formatOptions: Intl.NumberFormatOptions = useMemo(() => {
    // ... uses ariaLocale for Intl.NumberFormat
  }, [value.currencyCode, ariaLocale]);

  // Use locale for messages
  const currencyLabel = moneyInputMessages.getStringLocale(
    "currencySelectLabel",
    locale
  );
  // ...
};
```

**Why both are needed:**

- `react-aria`'s `useLocale()` provides locale context for `Intl.NumberFormat`
  and high precision detection
- `react-aria-components`' `useLocale()` provides the locale string from
  `I18nProvider` for message dictionaries
- MoneyInput needs both: formatting context AND message retrieval

**Impact:**

- ✅ MoneyInput correctly formats numbers and retrieves messages
- ✅ Pattern documented for future components that may need both hooks
- ⚠️ Currently the only component requiring both hooks

---

### 11. **Static Method Locale Parameter Requirement (FieldErrors)**

**Challenge:** `FieldErrors.getBuiltInMessage()` is exported as a static method
for backwards compatibility and testing, but it needs locale to retrieve
messages.

**Solution:** Pass locale as a parameter to the function instead of using
`useLocale()` hook inside it.

```typescript
// ❌ Can't use useLocale() here - violates Rules of Hooks
const getBuiltInMessage = (key: string): string | null => {
  const { locale } = useLocale(); // ❌ Fails when called outside React context
  return fieldErrorsMessages.getStringLocale("missingRequiredField", locale);
};

// ✅ Correct: Accept locale as parameter
const getBuiltInMessage = (key: string, locale: string): string | null => {
  return fieldErrorsMessages.getStringLocale("missingRequiredField", locale);
};

// Component usage
export const FieldErrors = (props: FieldErrorsProps) => {
  const { locale } = useLocale(); // ✅ Hook called at component level
  // ...
  const builtInMessage = getBuiltInMessage(key, locale); // ✅ Pass locale
};

// Static export for external use
FieldErrors.getBuiltInMessage = getBuiltInMessage;
```

**Why locale parameter is required:**

- **Static method export**: `FieldErrors.getBuiltInMessage()` is exported for
  backwards compatibility and can be called from outside React context
- **Rules of Hooks**: Hooks like `useLocale()` can only be called at the top
  level of React components, not in utility functions
- **External usage**: The function must work when called from tests, utilities,
  or other non-React contexts
- **Pure function**: The function remains pure and testable without React
  dependencies

**Impact:**

- ✅ Function works both inside component (with locale from `useLocale()`) and
  externally (with provided locale)
- ✅ Maintains backwards compatibility with UI-Kit API
- ✅ Function remains testable and pure
- ⚠️ External callers must provide locale string (documented in function
  signature)

---

### 13. **Storybook Decorator Simplification**

**Original Plan:**

- Storybook would use `IntlProvider` from `react-intl` for i18n context
- Separate decorator for i18n (`WithIntlDecorator`)

**Actual Implementation:**

- Removed `WithIntlDecorator` entirely (obsolete)
- `ThemeDecorator` now provides both theme and i18n context via `NimbusProvider`
- Components get locale from `NimbusProvider` → `NimbusI18nProvider` → React
  Aria's `I18nProvider`
- Storybook toolbar locale switching works automatically through
  `ThemeDecorator`

**Why this works:**

- `ThemeDecorator` already wraps stories with `NimbusProvider` and passes
  `locale` from Storybook globals
- `NimbusProvider` provides `NimbusI18nProvider` which wraps React Aria's
  `I18nProvider`
- Components use `useLocale()` from `react-aria-components` which reads from
  React Aria's `I18nProvider`
- No separate i18n decorator needed

**Impact:**

- ✅ Simpler Storybook setup (one decorator instead of two)
- ✅ Consistent with production usage (same provider chain)
- ✅ No `react-intl` dependencies in Storybook

---

### 14. **react-intl Dependency Status**

**Original Plan:**

- Remove `react-intl` entirely from dependencies

**Actual Implementation:**

- ✅ Removed from `peerDependencies` (consumers don't need it)
- ✅ Kept in `devDependencies` (needed for `.i18n.ts` extraction via
  `@formatjs/cli extract`)
- ✅ `.i18n.ts` files remain unchanged (source files for extraction, not
  imported at runtime)

**Why `react-intl` is still needed:**

- `.i18n.ts` files use `defineMessages` from `react-intl` as the source format
- `@formatjs/cli extract` expects `defineMessages` format to extract messages to
  `data/core.json`
- These files are never imported at runtime - they're only used during
  extraction
- Components use compiled `*.messages.ts` files instead

**Impact:**

- ✅ No runtime dependency on `react-intl` for consumers
- ✅ Extraction workflow unchanged (still uses FormatJS CLI)
- ✅ `.i18n.ts` files remain as source files (not runtime code)

---

### 15. **Provider Updates Implementation (Phase 3)**

**Original Plan:**

- Remove `IntlProvider` from `NimbusProvider`
- Remove message loading utilities
- Update NimbusProvider to use React Aria's `I18nProvider` directly:
  ```typescript
  <I18nProvider locale={locale}>
    <ChakraProvider>
      <NimbusColorModeProvider>
        {children}
      </NimbusColorModeProvider>
    </ChakraProvider>
  </I18nProvider>
  ```

**Actual Implementation:**

- ✅ Removed `IntlProvider` from `NimbusProvider` (no longer imports or uses
  `react-intl`)
- ✅ Created `NimbusI18nProvider` wrapper component (proxy for React Aria's
  `I18nProvider`) instead of using `I18nProvider` directly
- ✅ `NimbusProvider` now wraps children with `NimbusI18nProvider` instead of
  `IntlProvider`
- ✅ No message loading utilities needed (messages are bundled with components)
- ✅ Storybook decorators simplified (removed separate i18n decorator)

**Why `NimbusI18nProvider` wrapper:**

- Provides a Nimbus-specific API surface
- Allows future customization if needed
- Keeps React Aria implementation details abstracted
- Matches pattern of other Nimbus provider components

**Impact:**

- ✅ Cleaner provider chain
- ✅ No `react-intl` runtime dependencies
- ✅ Components get locale from React Aria's `I18nProvider` via `useLocale()`

---

### 16. **Breaking Changes: Locale Format NOT Changed to BCP47**

**Original Plan (Breaking Change #2):**

The plan documented a breaking change requiring BCP47 locale format:

```typescript
// Before: Accepts simplified locale
<NimbusProvider locale="de">

// After: Requires BCP 47 format
<NimbusProvider locale="de-DE">
```

**Actual Implementation:**

- ✅ **No breaking change** - `NimbusProvider` still accepts simple locale codes
  (`"de"`, `"en"`, `"es"`)
- ✅ Simple codes used throughout (dictionaries, tests, Storybook)
- ✅ No BCP47 requirement for consumers

**Reason:** Using simple codes is simpler and matches existing patterns. React
Aria doesn't require BCP47 format - it accepts any locale string.

**Impact:**

- ✅ **No breaking change** for locale format (consumers can continue using
  `"de"`)
- ✅ Simpler migration path for consumers
- ✅ Consistent with existing codebase patterns
- ⚠️ Original plan's breaking change documentation was incorrect - this change
  was not implemented

---

### 17. **Number Formatting for Variable Messages (Pagination)**

**Challenge:** When messages contain variables that were previously formatted
with `intl.formatNumber()`, we need to format numbers manually before passing
them to the compiled message function.

**Original Code:**

```typescript
// react-intl automatically formatted numbers
{
  intl.formatMessage(messages.ofTotalPages, {
    totalPages: intl.formatNumber(pagination.totalPages), // "2,500"
  });
}
```

**Issue:** The compiled message function just does string interpolation:

```typescript
// Compiled function
ofTotalPages: (args) => `of ${args.totalPages}`;
// If we pass raw number: "of 2500" ❌
// We need: "of 2,500" ✅
```

**Solution:** Use native JavaScript `Intl.NumberFormat` to format numbers before
passing to message functions:

```typescript
// Format the number with locale-specific formatting
const formattedTotalPages = new Intl.NumberFormat(locale).format(
  pagination.totalPages
);

// Get variable message function and call it with arguments
const ofTotalPagesMessage = paginationMessages.getVariableLocale(
  "ofTotalPages",
  locale
) as string | ((args: Record<string, string | number>) => string);

return typeof ofTotalPagesMessage === "function"
  ? ofTotalPagesMessage({ totalPages: formattedTotalPages }) // "2,500"
  : ofTotalPagesMessage;
```

**Why this is needed:**

- **Native JavaScript API**: `Intl.NumberFormat` is the standard Web API (not
  React-specific)
- **Same behavior**: This is what `react-intl`'s `formatNumber()` uses
  internally
- **Locale-aware**: Automatically formats according to locale (e.g., `"en"` →
  `"2,500"`, `"de"` → `"2.500"`)
- **No dependencies**: Uses built-in browser/Node.js APIs

**Impact:**

- ✅ Numbers are properly formatted with locale-specific separators
- ✅ Matches original `intl.formatNumber()` behavior
- ✅ Works for any numeric variable in messages (e.g., `{totalPages}`,
  `{count}`)
- ⚠️ Must manually format numbers before passing to message functions

**Pattern for future components:** When migrating components with numeric
variables, format numbers using `Intl.NumberFormat` before passing to message
functions.

---

## Current Architecture (As Implemented)

### Build Pipeline Flow

```
1. Extract (Unchanged)
   └─> @formatjs/cli extract → packages/i18n/data/core.json

2. Transform
   └─> transform-to-icu.ts → .temp/icu/*.json

3. Split
   └─> split-by-component.ts → .temp/by-component/{Component}/{locale}.json

4. Compile
   └─> compile-component-messages.ts → packages/nimbus/src/components/{component}/intl/{locale}.ts

5. Generate
   └─> generate-dictionaries.ts → packages/nimbus/src/components/{component}/{component}.messages.ts
       └─> Generates inline fallback logic with getStringLocale and getVariableLocale methods
           └─> All generated dictionaries automatically have fallback behavior
```

### Package Architecture & Inline Fallback Implementation

**Key Architecture Decision: Inline Fallback Logic in Generated Files**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Package Responsibilities                      │
└─────────────────────────────────────────────────────────────────┘

packages/i18n/ (Build-time tool, private)
├── Build scripts (generate-dictionaries.ts)
│   └─> Generates inline fallback logic directly in .messages.ts files
│   └─> Does NOT import or use any runtime utilities (only generates code)
└── Translation data (data/*.json)
    └─> Source files for compilation

packages/nimbus/ (Runtime package, published)
└── src/components/{component}/{component}.messages.ts
    └─> Generated dictionaries (runtime code)
    └─> Contains inline fallback logic (no external dependencies)
    └─> Exports getStringLocale() and getVariableLocale() methods
    └─> Used by components at runtime
```

**Why Inline Fallback:**

1. **No Runtime Dependencies**: Generated `.messages.ts` files are
   self-contained with inline fallback logic. No need to import utilities from
   other packages.

2. **Simpler Architecture**: No class/constructor needed - just plain objects
   with methods. Easier to understand and maintain.

3. **Type Safety**: `getStringLocale` always returns `string` (never
   `undefined`), which fixes TypeScript errors with `aria-label` props that
   require `string`.

4. **Clear Separation**: `getStringLocale` for simple strings,
   `getVariableLocale` for variable messages - explicit API that matches use
   cases.

**Result:**

- ✅ Clean separation: Build-time tools (i18n) vs runtime code (nimbus)
- ✅ No runtime dependencies between packages
- ✅ Self-contained generated files with inline fallback logic
- ✅ Type-safe: `getStringLocale` always returns `string`
- ✅ All dictionaries automatically have fallback behavior without component
  changes

### Locale Resolution Hierarchy

**How Components Retrieve Locale:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Locale Resolution Flow                        │
└─────────────────────────────────────────────────────────────────┘

Component calls useLocale() from react-aria-components
  │
  └─→ Reads from React Aria I18nProvider context
      │
      ├─→ Nearest NimbusI18nProvider (if nested)
      │   │
      │   └─→ Passes locale prop → React Aria's I18nProvider(locale={locale})
      │       │
      │       └─→ I18nProvider provides locale via React Context
      │
      ├─→ Parent NimbusProvider (if no nested provider)
      │   │
      │   └─→ NimbusI18nProvider (receives locale prop from NimbusProvider)
      │       │
      │       └─→ Passes locale prop → React Aria's I18nProvider(locale={locale})
      │           │
      │           └─→ I18nProvider provides locale via React Context
      │
      └─→ Browser default (navigator.language) if no provider found

┌─────────────────────────────────────────────────────────────────┐
│                      Precedence Order                            │
└─────────────────────────────────────────────────────────────────┘

Highest Priority (most specific)
  ↓
1. Nested NimbusI18nProvider locale prop
2. Nested NimbusProvider locale prop
3. Parent NimbusProvider locale prop
4. Browser locale (navigator.language)
  ↓
Lowest Priority (fallback)
```

**Key Points:**

- `useLocale()` from `react-aria-components` reads from React Aria's
  `I18nProvider` context
- React Aria's `I18nProvider` gets its locale from the `locale` prop passed to
  `NimbusI18nProvider`
- `NimbusI18nProvider` is a wrapper that passes the `locale` prop directly to
  React Aria's `I18nProvider`
- `NimbusProvider` passes its `locale` prop to `NimbusI18nProvider`, which then
  passes it to React Aria's `I18nProvider`
- Nested providers override parent providers (standard React Context behavior)
- Storybook's `ThemeDecorator` wraps stories with `NimbusProvider` using
  `context.globals.locale`
- Nested `NimbusI18nProvider` components in stories override Storybook's global
  locale
- If no provider is found, React Aria falls back to browser locale
  (`navigator.language`)

### Two Uses of Locale: Formatting vs. Messages

**Important Distinction:** The same locale from `NimbusI18nProvider` serves two
different purposes:

```
┌─────────────────────────────────────────────────────────────────┐
│              Two Uses of Locale from useLocale()                  │
└─────────────────────────────────────────────────────────────────┘

Component gets locale:
const { locale } = useLocale(); // Returns "ja-JP" (from React Aria I18nProvider context, set by app via NimbusProvider)
  │
  ├─→ React Aria Formatting (dates, numbers, currency)
  │   │
  │   └─→ Uses locale directly: "ja-JP"
  │       │
  │       ├─→ DatePicker formats dates in Japanese style (YYYY/MM/DD)
  │       ├─→ NumberInput formats numbers with Japanese separators
  │       └─→ MoneyInput formats currency with Japanese conventions
  │
  └─→ Nimbus Message Dictionaries (UI text, aria-labels)
      │
      └─→ Uses locale with fallback: "ja-JP" → "en" (if not supported)
          │
          ├─→ alertMessages.getStringLocale("dismiss", locale)
          │   └─> Tries "ja-JP" → not found → falls back to "en"
          │   └─> Returns "Dismiss" (English message)
          │
          └─> But locale context still "ja-JP" for formatting above
```

**Key Differences:**

| Aspect            | React Aria Formatting                                 | Nimbus Message Dictionaries                              |
| ----------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| **What it does**  | Formats dates, numbers, currency                      | Retrieves UI text, aria-labels                           |
| **Locale usage**  | Uses locale directly (no fallback)                    | Uses locale with fallback to "en"                        |
| **Example**       | `DatePicker` formats as "2024/01/15" (Japanese style) | `Alert.DismissButton` aria-label: "Dismiss" (English)    |
| **Why different** | Formatting should match user's locale preference      | Messages gracefully degrade when translation unavailable |
| **Where handled** | React Aria's `I18nProvider` (automatic)               | Inline fallback in generated dictionaries (automatic)    |

**Why This Separation Matters:**

- ✅ **User gets correct formatting**: Japanese users see dates/numbers in
  Japanese format
- ✅ **Graceful degradation**: UI text falls back to English when translation
  unavailable
- ✅ **No breaking changes**: Components don't need to handle fallback manually
- ✅ **Consistent behavior**: All components automatically get both behaviors

**Example Scenario:**

```typescript
// User requests Japanese locale
<NimbusI18nProvider locale="ja-JP">
  <DatePicker /> {/* Formats dates as "2024/01/15" (Japanese style) */}
  <Alert.DismissButton /> {/* aria-label: "Dismiss" (English fallback) */}
</NimbusI18nProvider>
```

**Result:**

- DatePicker uses Japanese date format (correct for user's locale)
- Alert button has English aria-label (graceful fallback when Japanese
  translation unavailable)
- Both work correctly without component code changes

### Runtime Message Retrieval Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              Component Message Retrieval Flow                    │
└─────────────────────────────────────────────────────────────────┘

Component Code:
  const { locale } = useLocale(); // "ja-JP" (from NimbusI18nProvider)
  const label = alertMessages.getStringLocale("dismiss", locale);

  │
  └─→ alert.messages.ts (Generated dictionary)
      │
      └─→ alertMessages.getStringLocale("dismiss", "ja-JP")
          │
          ├─→ Try "ja-JP" → MessageDictionary throws error (not found)
          │   └─> Catch error, treat as undefined
          │
          └─→ Fallback to "en" → Success
              └─> Returns "Dismiss" (English message)

Result:
  ✅ Component receives: "Dismiss" (English fallback)
  ✅ React Aria formatting still uses: "ja-JP" (from useLocale())
  ✅ No component code changes needed (fallback handled automatically)
```

### Component Usage Pattern

**Simple Messages (inlined):**

```typescript
import { useLocale } from "react-aria-components";
import { alertMessages } from "../alert.messages";

export const AlertDismissButton = () => {
  const { locale } = useLocale();

  return (
    <IconButton
      aria-label={alertMessages.getStringLocale("dismiss", locale)}
    >
      ...
    </IconButton>
  );
};
```

**Messages with Variables (need type checking):**

```typescript
import { useLocale } from "react-aria-components";
import { avatarMessages } from "../avatar.messages";

export const Avatar = ({ fullName, ...props }) => {
  const { locale } = useLocale();
  // Get variable message function and call it with arguments
  const avatarLabelMessage = avatarMessages.getVariableLocale(
    "avatarLabel",
    locale
  ) as string | ((args: Record<string, string | number>) => string);

  const ariaLabel =
    typeof avatarLabelMessage === "function"
      ? avatarLabelMessage({ fullName })
      : avatarLabelMessage;

  return <div aria-label={ariaLabel}>...</div>;
};
```

### Generated File Structure

```
packages/nimbus/src/components/alert/
├── alert.messages.ts          ← Generated dictionary (inline fallback logic)
│   └─> Exports getStringLocale() and getVariableLocale() methods
│   └─> Contains inline fallback logic (no external dependencies)
├── intl/                      ← Generated compiled messages
│   ├── en.ts
│   ├── de.ts
│   ├── es.ts
│   ├── fr-FR.ts
│   └── pt-BR.ts
└── components/
    └── alert.dismiss-button.tsx  ← Updated to use new system
```

**Dictionary Format:**

```typescript
// Generated file: packages/nimbus/src/components/alert/alert.messages.ts
import { MessageDictionary } from "@internationalized/message";
import alertMessages_en from "./intl/en";
import alertMessages_de from "./intl/de";
// ... other locale imports

/**
 * Normalizes BCP47 locale codes to match dictionary keys.
 * Extracts language code and maps to supported locales: "en", "de", "es", "fr-FR", "pt-BR"
 */
function normalizeLocale(locale: string): string {
  // Exact match - return as-is
  if (
    locale === "en" ||
    locale === "de" ||
    locale === "es" ||
    locale === "fr-FR" ||
    locale === "pt-BR"
  ) {
    return locale;
  }

  // Extract language code (first part before any separator)
  const lang = locale.split(/[-_]/)[0].toLowerCase();

  // Map language codes to dictionary keys
  if (lang === "en") return "en";
  if (lang === "de") return "de";
  if (lang === "es") return "es";
  if (lang === "fr") return "fr-FR";
  if (lang === "pt") return "pt-BR";

  // Fallback to English for unsupported languages
  return "en";
}

// Internal dictionary instance
const dictionary = new MessageDictionary({
  en: alertMessages_en, // Simple locale codes
  de: alertMessages_de,
  es: alertMessages_es,
  "fr-FR": alertMessages_fr,
  "pt-BR": alertMessages_pt,
});

export const alertMessages = {
  /**
   * Retrieves a simple string message (no variables).
   * Always returns a string (empty string if message not found or is a function).
   */
  getStringLocale(key: string, locale: string): string {
    const normalizedLocale = normalizeLocale(locale);

    try {
      const message = dictionary.getStringForLocale(key, normalizedLocale);
      if (typeof message === "string") return message;
    } catch {
      // Return empty string if message not found
    }

    return "";
  },

  /**
   * Retrieves a variable message (function that takes arguments).
   * Returns undefined if the message is a simple string or not found.
   */
  getVariableLocale(
    key: string,
    locale: string
  ): ((args: Record<string, string | number>) => string) | undefined {
    const normalizedLocale = normalizeLocale(locale);

    try {
      const message = dictionary.getStringForLocale(key, normalizedLocale);
      return typeof message === "function" ? message : undefined;
    } catch {
      return undefined;
    }
  },
};
```

**Key Points:**

- All generated dictionaries use inline normalization and fallback logic
- `normalizeLocale()` handles BCP47 codes (`"en-US"` → `"en"`) and unsupported
  locales (→ `"en"`)
- `getStringLocale` always returns `string` (never `undefined`) - fixes
  TypeScript errors
- `getVariableLocale` returns `function | undefined` for variable messages
- Simplified fallback logic (normalization handles most cases, try-catch is
  safety net)
- Components don't need to handle fallback manually - it's built into the
  dictionary
- No runtime dependencies between packages - self-contained generated files

## Known Issues & Next Steps

### ✅ Resolved Issues

1. **Storybook Decorator Updates** ✅
   - ✅ Removed obsolete `WithIntlDecorator` that used `react-intl`
   - ✅ `ThemeDecorator` now provides i18n context via `NimbusProvider`
   - ✅ All Storybook references to `react-intl` removed

2. **NimbusProvider Cleanup** ✅
   - ✅ Removed `IntlProvider` from `react-intl`
   - ✅ Components now use `NimbusI18nProvider` → React Aria's `I18nProvider`
   - ✅ Simplified provider chain

3. **Dependency Management** ✅ COMPLETE
   - ✅ Removed `react-intl` from `peerDependencies` (consumers no longer need
     it)
   - ✅ Removed `react-intl` from `vite.config.ts` external array (no longer
     bundled as external dependency)
   - ✅ Kept `react-intl` in `devDependencies` (needed for `.i18n.ts` extraction
     via `@formatjs/cli extract`)
   - ✅ Updated README files to document dependency status

4. **Message Dictionary Fallback** ✅ COMPLETE
   - ✅ Implemented inline fallback logic directly in generated dictionary files
   - ✅ Updated dictionary generation script to generate inline fallback methods
   - ✅ Created two separate methods: `getStringLocale` (simple strings) and
     `getVariableLocale` (variable messages)
   - ✅ Made `getStringLocale` always return `string` (never `undefined`) to fix
     TypeScript errors with `aria-label` props
   - ✅ Added try-catch error handling (MessageDictionary throws errors for
     unsupported locales)
   - ✅ All components automatically get fallback behavior without code changes
   - ✅ Comprehensive Storybook tests verify fallback works correctly
   - ✅ Locale context preserved for React Aria formatting while messages
     fallback gracefully

### 🟡 Remaining Issues

1. **TypeScript Type Workarounds**
   - `@ts-expect-error` needed for components with variable messages
   - Type assertion needed when calling function messages:
     `as string | ((args: ...) => string)`
   - Acceptable trade-off, but documented for future reference

2. **Locale Normalization** ✅ IMPLEMENTED
   - **Issue:** `useLocale()` from `react-aria-components` may return BCP47
     codes (`"de-DE"`) when `NimbusI18nProvider` is set to `locale="de-DE"`, but
     `MessageDictionary` only has keys for simple locale codes (`"de"`, `"en"`).
     This was causing dictionary lookup to fail and unnecessary fallback to
     `"en"`.
   - **Solution:** Added `normalizeLocale()` function in generated dictionary
     files
     - Extracts language code from BCP47 format (e.g., `"de-DE"` → `"de"`)
     - Maps language codes to dictionary keys (`"fr"` → `"fr-FR"`, `"pt"` →
       `"pt-BR"`)
     - Falls back to `"en"` for unsupported languages
   - **Implementation:**
     - ✅ `normalizeLocale()` function added to all generated `.messages.ts`
       files
     - ✅ Normalization happens before `getStringForLocale()` call
     - ✅ Simplified fallback logic (no longer needs nested try-catch for BCP47
       variants)
     - ✅ Tests updated to verify BCP47 normalization (en-US, de-DE, es-ES)
   - **Impact:** High - BCP47 codes now work correctly without unnecessary
     fallback

3. **i18n Test Suite** ✅ COMPLETE
   - ✅ **Storybook tests created** - Comprehensive tests for message
     dictionaries and locale fallbacks
   - ✅ **Test Coverage:**
     - `MessageTranslationForSupportedLocales` - Validates all supported locales
       work correctly
       - Tests simple codes: en, de, es, fr-FR, pt-BR
       - Tests BCP47 variants: en-US, de-DE, es-ES (verifies normalization)
     - `MessageTranslationForUnsupportedLocales` - Verifies unsupported locales
       gracefully fallback to English
     - Tests verify both locale context (for formatting) and message retrieval
       (with normalization and fallback)
   - ✅ **Implementation:** Tests in `nimbus-i18n-provider.stories.tsx` using
     `MessageTranslationTestComponent`
   - ✅ **Verified:** All tests passing, fallback behavior working correctly

### 🟡 Pending Tasks

1. **Component Migration**

2. **Provider Updates** ✅ COMPLETE
   - ✅ Removed `IntlProvider` from `NimbusProvider`
   - ✅ Removed `react-intl` from `peerDependencies` (consumers no longer need
     it)
   - ✅ Updated Storybook decorators (removed `WithIntlDecorator`, updated
     `ThemeDecorator`)
   - ✅ Updated `NimbusProvider.stories.tsx` to use new system

3. **Documentation** ✅ COMPLETE
   - ✅ `packages/i18n/README.md` - Updated with component usage examples and
     dependency status
   - ✅ `packages/nimbus/README.md` - Updated workflow and dependency
     information
   - ✅ Script JSDoc comments - Reviewed and updated
   - ✅ `NimbusProvider.mdx` - Added locale flow diagram and precedence order
   - ✅ `docs/file-type-guidelines/i18n.md` - Updated to reflect new system
     (removed old `useIntl()` patterns)
   - ✅ `docs/component-templates/i18n.template.md` - Updated to show new
     component usage patterns
   - ✅ `docs/file-type-guidelines/main-component.md` - Updated to show new
     `useLocale()` pattern
   - ✅ `docs/file-type-guidelines/context-files.md` - Updated to show new
     message dictionary usage
   - ✅ `docs/component-templates/single-component.md` - Removed old `useIntl()`
     import, added new pattern
   - ✅ `docs/component-templates/compound-component.root.md` - Removed old
     `useIntl()` import, added new pattern
   - ✅ `CLAUDE.md` - Updated both mentions from "react-intl integration" to
     "compile-time message compilation"
   - ✅ `docs/readme.md` - Updated from "via react-intl" to "via compile-time
     message compilation"
   - ✅ `nimbus-i18n-provider.mdx` - Updated to reference i18n guidelines
     instead of "use react-intl or similar"
   - ✅ Cross-references added between user and developer documentation
   - ⏳ Create migration guide for consumers

4. **Cleanup** ✅ COMPLETE
   - ✅ Removed `compiled-data/` directory (no longer needed - build pipeline
     generates files directly in `packages/nimbus/src/components/`)
   - ✅ Made `@commercetools/nimbus-i18n` package private (added
     `"private": true` to package.json, removed `publishConfig`)
   - ✅ Updated `packages/i18n/README.md` to reflect package is now private
   - ✅ Removed `compiled-data` from `files` array in package.json
   - ⏳ Remove unused i18n utilities (if any exist)

## Migration Pattern (Validated with Alert)

For each component migration:

1. **Build generates files automatically** (no manual step needed)

   ```bash
   pnpm --filter @commercetools/nimbus-i18n build
   ```

2. **Update component imports:**

   ```typescript
   // Remove
   import { useIntl } from "react-intl";
   import { messages } from "./component.i18n";

   // Add
   import { useLocale } from "react-aria-components";
   import { componentMessages } from "./component.messages";
   ```

3. **Update message access:**

   ```typescript
   // Before
   const intl = useIntl();
   const label = intl.formatMessage(messages.key);

   // After (simple messages - can inline)
   const { locale } = useLocale();
   return <button aria-label={componentMessages.getStringLocale("key", locale)}>...</button>;

   // Or with variable messages (use getVariableLocale)
   const message = componentMessages.getVariableLocale("key", locale);
   const label = message ? message({ variable: value }) : undefined;
   ```

4. **Update variable interpolation:**

   ```typescript
   // Before
   intl.formatMessage(messages.label, { name: "John" });

   // After (use getVariableLocale for variable messages)
   const message = componentMessages.getVariableLocale("label", locale);
   const formatted = message ? message({ name: "John" }) : undefined;
   ```

5. **Keep `.i18n.ts` file** (still needed for extraction)

6. **Verify message key** - Use the key from the message ID, not the object key:
   - `"Nimbus.LoadingSpinner.default"` → use `"default"` (not
     `"defaultLoadingMessage"`)

7. **Rebuild package** - Storybook tests run against built bundle:

   ```bash
   pnpm --filter @commercetools/nimbus build
   ```

8. **Update tests** (ensure locale is provided if needed)

## Success Metrics (Current Status)

- ✅ Build scripts working end-to-end
- ✅ **24 components migrated and functional**
- ✅ TypeScript types generated correctly
- ✅ Generated files follow ES module standards
- ✅ Locale format standardized (simple codes)
- ✅ API parameter order corrected
- ✅ Code simplified (inlined where possible)
- ✅ Phase 3 complete: Provider updates, Storybook decorators, dependency
  cleanup
- ✅ Documentation updated with locale flow diagrams
- ⚠️ Storybook tests need rebuild to pass (components are correct, bundle is
  stale)

## Next Steps

**Immediate:**

1. Rebuild nimbus package to fix Storybook test failures
2. Verify all 24 migrated components pass tests after rebuild
3. **All component migrations complete!** ✅

**Next Steps:**

1. ✅ Remove `react-intl` from `peerDependencies` (complete - consumers no
   longer need it)
2. ✅ Remove `react-intl` from `vite.config.ts` external array (complete)
3. ✅ Update Storybook decorators (done - removed `WithIntlDecorator`)
4. ✅ Update core documentation (`i18n.md`, `i18n.template.md`, READMEs)
5. ✅ Update remaining component templates and guidelines (completed:
   `main-component.md`, `context-files.md`, `single-component.md`,
   `compound-component.root.md`)
6. ✅ Update CLAUDE.md and `docs/readme.md` (completed - now reflect new system)
7. ✅ Update `nimbus-i18n-provider.mdx` (completed)
8. ✅ Cleanup i18n package (completed - removed `compiled-data/`, made package
   private, updated README)
9. ⏳ Remove unused i18n utilities (if any exist)
10. ⏳ Create migration guide for consumers
11. ⚠️ **i18n test suite created** - Tests for message dictionaries, locale
    fallbacks, and key validation (implementation pending)
12. ✅ **Locale normalization implemented** - Added `normalizeLocale()` function
    to generated dictionary files. Handles BCP47 codes (`"de-DE"` → `"de"`) and
    unsupported locales (→ `"en"`). Tests verify normalization works correctly.

---

## Additional Notes & Future Tasks

**Build Configuration:**

- ✅ Removed `react-intl` from `vite.config.ts` external array
- ⏳ Consider if `optimizeLocales.vite` BCP47 locales need to match simple codes
  (currently uses BCP47 for React Aria formatting, separate from message
  dictionaries)

**Documentation Cleanup** ✅ COMPLETE:

- ✅ Updated all outdated `useIntl()` patterns in:
  - `docs/file-type-guidelines/main-component.md`
  - `docs/file-type-guidelines/context-files.md`
  - `docs/component-templates/single-component.md`
  - `docs/component-templates/compound-component.root.md`
- ✅ Updated CLAUDE.md to reflect new i18n system (now mentions "compile-time
  message compilation")
- ✅ Updated `docs/readme.md` (now mentions "compile-time message compilation")
- ✅ Updated `nimbus-i18n-provider.mdx` (now references i18n guidelines)

**Remaining Cleanup:**

- ✅ Removed `compiled-data/` directory (completed)
- ✅ Made `@commercetools/nimbus-i18n` package private (completed - added
  `"private": true`, removed `publishConfig`)
- ✅ Updated `packages/i18n/README.md` to reflect package is now private
  (completed)
- ⏳ Remove unused i18n utilities (if any exist)
- ⏳ Bundle size analysis
- ⏳ Create migration guide for consumers

https://github.com/commercetools/nimbus/pull/841/commits/d3dfd91b84edaf339017bd5c79cfd1cfed9f875e#diff-606a73f6458049283ac735590173191140a5f9a553b3fc8aa17b70dcad88b6d1
\*\*\*\*There's a discrepancy between documentation and implementation:

- **Documentation says**: `NimbusProvider` expects BCP47 format (`en-US`,
  `de-DE`)
- **Reality**:
  - Type is `locale?: string` (accepts any string)
  - React Aria's `I18nProvider` doesn't enforce BCP47
  - Our message dictionaries use simple codes (`en`, `de`, `es`)
  - `useLocale()` returns whatever you pass (no normalization) **Questions to
    investigate:**

1. Should we standardize on simple codes everywhere?
2. Should we update `NimbusProvider` docs to reflect that any locale string
   works?
3. Do we need locale mapping/fallback logic for BCP47 → simple code conversion?
4. What happens if consumer passes `"en-US"` but dictionary has `"en"`?
   **Current status**: Simple codes work everywhere. Documentation may be
   misleading.

### Locale Source Change Impact on Tests

**Issue:** After migration, components use `useLocale()` from
`react-aria-components` instead of `react-intl`'s `useIntl()`, which changes
which locale provider controls message localization. **Before Migration:**

- Components used `react-intl`'s `useIntl()` hook
- `react-intl` gets locale from `IntlProvider` (from `react-intl`)
- `NimbusI18nProvider` only affected React Aria components (number/date
  formatting), not `react-intl` messages
- Components showed messages based on Storybook's `IntlProvider` or default
  locale (typically English)
- Tests searching for English text were correct **After Migration:**
- Components use `useLocale()` from `react-aria-components`
- This gets locale from `I18nProvider` (which `NimbusI18nProvider` wraps)
- Components now use the locale from `NimbusI18nProvider` for messages
- If a story sets `NimbusI18nProvider locale="de-DE"`, components show German
  messages
- Tests must be updated to match the locale set in the story **Example -
  MoneyInput Story:**

```typescript
// Story sets German locale
export const EULocaleFormattingExample: Story = {
  render: (args) => (
    <NimbusI18nProvider locale="de-DE">
      <MoneyInput {...args} />
    </NimbusI18nProvider>
  ),
  play: async ({ canvasElement }) => {
    // ❌ Before: Test searched for English (was correct)
    const badges = canvas.getAllByLabelText(/high precision price/i);
    // ✅ After: Test must search for German (matches story locale)
    const badges = canvas.getAllByLabelText(/hochpräzisionspreis/i);
  },
};
```

**Impact:**

- ✅ Components now consistently use the same locale source for both formatting
  and messages
- ⚠️ Tests in stories with explicit `NimbusI18nProvider` locale must be updated
  to match that locale
- ⚠️ Tests that relied on Storybook's default English locale may need updates
  **Pattern for Test Updates:** When a story sets
  `NimbusI18nProvider locale="xx-XX"`, update tests to expect messages in that
  locale, not the default English.

### Variable Interpolation

Only 2 messages use variables: @@ -1102,18 +1008,3 @@ export const alertMessages
= new LocalizedStringDictionary({ **Document Status:** Ready for team review and
approval **Next Steps:** Present to team, gather feedback, finalize timeline
**Target Start Date:** TBD **Estimated Completion:** 8 weeks from start -remove
compiled-data check vite.config update ALL documentation -remove i18n package
from publishing & changesets

- update claude and/or copilot instructions re: i18n deprecate i18n package w/
  notice. -bundle size analysis
- docs unit tests
- update all readmes
- add visuals
- do we want to add Ra to react-aria-components hooks as well?
- \_reset locales in Storybook
- - handle fallback & splits (de-DE, usw) --link readmes\*\*\*\*
- fallback
- use RA for formatting w/ X locale, but something diff for messaging??
- normalize and double check fallback situation
- remove from changelog
- investigate default more
- changeset

## References

- Original Plan: `plans/intl/COMPILE_TIME_PARSING.md`
- Implementation: `packages/i18n/scripts/`
- [Example Migration: `packages/nimbus/src/components/alert/`](https://react-aria.adobe.com/useLocale)
- Related PR: #841 (CRAFT-2029)
