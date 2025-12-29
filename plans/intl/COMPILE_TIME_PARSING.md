# Compile-Time Message Parsing Architecture - Original plans, but adjustments being made along the way.

eg LocalizedStringDictionary wasn't exported from @internationalized/message, so
we switched to MessageDictionary. -- same constructor pattern & works with
getStringForLocale() for accessing messages.

**Status:** Draft **Created:** 2025-01-XX **Author:** Engineering Team

## Executive Summary

This document outlines the migration from runtime message parsing (`react-intl`)
to compile-time message compilation using Adobe's `@internationalized/message`
package. This change will:

- **Eliminate runtime overhead** by pre-compiling all translatable strings at
  build time
- **Bundle messages with components** for true code-splitting and tree-shaking
- **Leverage React Aria's i18n infrastructure** (`I18nProvider`, `useLocale`)
- **Maintain existing translation workflow** (FormatJS extraction → Transifex →
  compilation)
- **Reduce bundle size** by removing `react-intl` and `intl-messageformat`
  dependencies
- **Improve performance** by replacing runtime message parsing with pre-compiled
  functions

## Current State Analysis

### Current Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EXTRACTION PHASE                              │
│                         (Development)                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Component (.i18n.ts)                                               │
│    └─> defineMessages({ dismiss: "Dismiss" })                       │
│                           │                                          │
│                           │ @formatjs/cli extract                    │
│                           ↓                                          │
│  packages/i18n/data/core.json (Transifex format)                    │
│    └─> { "Nimbus.Alert.dismiss": { "string": "Dismiss" } }         │
│                           │                                          │
│                           │ Send to Transifex                        │
│                           ↓                                          │
│  Translated files: de.json, es.json, fr-FR.json, pt-BR.json        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        COMPILATION PHASE                             │
│                         (Build Time)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  data/*.json                                                         │
│         │                                                            │
│         │ @formatjs/cli compile-folder --ast                        │
│         ↓                                                            │
│  compiled-data/*.json (FormatJS AST format)                         │
│    └─> { "Nimbus.Alert.dismiss": [{ "type": 0, "value": "..." }] } │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         RUNTIME PHASE                                │
│                    (Consumer Application)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  User Setup:                                                         │
│    const messages = await getMessagesForLocale('de')                │
│    <IntlProvider locale="de" messages={messages}>                   │
│      <NimbusProvider>                                                │
│        <App />                                                       │
│                                                                       │
│  Component:                                                          │
│    import { messages } from './alert.i18n'                          │
│    const intl = useIntl()                                           │
│    intl.formatMessage(messages.dismiss) ← RUNTIME PARSING!          │
│                                                                       │
│  Dependencies bundled: react-intl + intl-messageformat              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Current Issues

1. **Runtime overhead**: `intl-messageformat` parses ICU messages at runtime
2. **Large bundle**: Central message loading loads all component messages
3. **Provider complexity**: Requires `IntlProvider` + message loading utilities
4. **Duplicate definitions**: Messages defined in both `.i18n.ts` and
   `compiled-data/`
5. **No code splitting**: All messages loaded even if components unused
6. **Type safety gaps**: Message keys are strings, no compile-time validation

### Current Message Count

- **137 messages** across all components
- **2 messages** use ICU variables (`{fullName}`, `{totalPages}`)
- **135 messages** are simple strings
- **5 locales**: en, de, es, fr-FR, pt-BR

## Proposed Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EXTRACTION PHASE                              │
│                    (Unchanged - Keep FormatJS)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Component (.i18n.ts)                                               │
│    └─> defineMessages({ dismiss: "Dismiss" })                       │
│                           │                                          │
│                           │ @formatjs/cli extract (KEEP)             │
│                           ↓                                          │
│  packages/i18n/data/core.json                                       │
│                           │                                          │
│                           │ Transifex workflow (KEEP)                │
│                           ↓                                          │
│  Translated: de.json, es.json, etc.                                 │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        COMPILATION PHASE (NEW)                       │
│                         (Build Time)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Step 1: Transform Transifex → ICU MessageFormat                    │
│  ─────────────────────────────────────────────                      │
│    data/core.json → transform → icu/en.json                         │
│      { "Nimbus.Alert.dismiss": { "string": "Dismiss" } }            │
│                            →                                         │
│      { "Nimbus.Alert.dismiss": "Dismiss" }                          │
│                                                                       │
│  Step 2: Split by component                                         │
│  ─────────────────────────                                          │
│    icu/en.json → group by component → component ICU files           │
│      Alert: { dismiss: "Dismiss" }                                  │
│      Avatar: { avatarLabel: "Avatar image for {fullName}" }         │
│                                                                       │
│  Step 3: Compile to JavaScript                                      │
│  ────────────────────────────────                                   │
│    @internationalized/string-compiler                                │
│      alert/intl/en.ts:                                              │
│        export default {                                             │
│          dismiss: () => "Dismiss"                                   │
│        }                                                             │
│                                                                       │
│      avatar/intl/en.ts:                                             │
│        export default {                                             │
│          avatarLabel: (v) => `Avatar image for ${v.fullName}`      │
│        }                                                             │
│                                                                       │
│  Step 4: Generate LocalizedStringDictionary                         │
│  ───────────────────────────────────────────                        │
│    alert/alert.messages.ts:                                         │
│      import { LocalizedStringDictionary } from '@inter.../message'  │
│      import en from './intl/en'                                     │
│      import de from './intl/de'                                     │
│                                                                       │
│      export const alertMessages =                                   │
│        new LocalizedStringDictionary({ 'en-US': en, 'de-DE': de }) │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      RUNTIME PHASE (SIMPLIFIED)                      │
│                    (Consumer Application)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  User Setup (Simplified):                                           │
│    <NimbusProvider locale="de-DE">                                  │
│      <App />   ← No message loading needed!                         │
│    </NimbusProvider>                                                 │
│                                                                       │
│  Internally:                                                         │
│    <I18nProvider locale="de-DE"> ← React Aria                       │
│      <ChakraProvider>                                                │
│        {children}                                                    │
│                                                                       │
│  Component (New Pattern):                                           │
│    import { useLocalizedStringFormatter } from 'react-aria/i18n'    │
│    import { alertMessages } from './alert.messages'                 │
│                                                                       │
│    const strings = useLocalizedStringFormatter(alertMessages)       │
│    return <button aria-label={strings.format('dismiss')} />         │
│                                                                       │
│  Benefits:                                                           │
│    ✓ Messages bundled with component (code-splitting)               │
│    ✓ Pre-compiled (no runtime parsing)                              │
│    ✓ Tree-shakeable (unused components = no messages)               │
│    ✓ No IntlProvider needed                                         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Component-Level Architecture

```
packages/nimbus/src/components/alert/
├── alert.tsx
├── alert.types.ts
├── alert.slots.tsx
├── alert.recipe.ts
├── alert.i18n.ts              ← KEEP (for extraction only)
├── alert.messages.ts          ← NEW (generated)
├── intl/                      ← NEW (generated)
│   ├── en.ts                  Pre-compiled JS functions
│   ├── de.ts
│   ├── es.ts
│   ├── fr-FR.ts
│   └── pt-BR.ts
└── components/
    └── alert-dismiss-button.tsx
```

### Detailed File Structure

#### Generated `alert.messages.ts`

```typescript
/**
 * Pre-compiled localized messages for Alert component
 *
 * Generated by scripts/compile-component-messages.ts
 * DO NOT EDIT MANUALLY
 *
 * @see https://react-spectrum.adobe.com/react-aria/internationalization.html
 */

import { LocalizedStringDictionary } from "@internationalized/message";

// Pre-compiled message functions
import alertMessages_en from "./intl/en";
import alertMessages_de from "./intl/de";
import alertMessages_es from "./intl/es";
import alertMessages_fr from "./intl/fr-FR";
import alertMessages_pt from "./intl/pt-BR";

/**
 * Localized string dictionary for Alert component
 * Contains pre-compiled messages for all supported locales
 */
export const alertMessages = new LocalizedStringDictionary({
  "en-US": alertMessages_en,
  "de-DE": alertMessages_de,
  "es-ES": alertMessages_es,
  "fr-FR": alertMessages_fr,
  "pt-BR": alertMessages_pt,
});

/**
 * Available message keys for Alert component
 */
export type AlertMessageKey = "dismiss";
```

#### Generated `alert/intl/en.ts`

```typescript
/**
 * Pre-compiled English messages for Alert
 * Generated by @internationalized/string-compiler
 * DO NOT EDIT MANUALLY
 */

export default {
  dismiss: () => "Dismiss",
};
```

#### Updated Component Usage

```typescript
// alert-dismiss-button.tsx
import { useLocalizedStringFormatter } from 'react-aria/i18n';
import { alertMessages } from '../alert.messages';
import type { AlertDismissButtonProps } from '../alert.types';

export const AlertDismissButton = (props: AlertDismissButtonProps) => {
  const strings = useLocalizedStringFormatter(alertMessages);

  return (
    <IconButton
      aria-label={strings.format('dismiss')}
      {...props}
    >
      <Clear />
    </IconButton>
  );
};
```

## Build Pipeline

### New Build Scripts

```
scripts/
├── transform-to-icu.ts           Transform Transifex → ICU format
├── split-by-component.ts         Group messages by component
├── compile-component-messages.ts Compile using @inter.../string-compiler
└── generate-dictionaries.ts      Create LocalizedStringDictionary files
```

### Build Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  pnpm extract-intl                                           │
│    └─> @formatjs/cli extract → data/core.json               │
├──────────────────────────────────────────────────────────────┤
│  [Translation workflow - external to build]                  │
│    └─> Transifex → de.json, es.json, etc.                   │
├──────────────────────────────────────────────────────────────┤
│  pnpm build (NEW STEPS)                                      │
│    │                                                          │
│    ├─> scripts/transform-to-icu.ts                           │
│    │     Input:  data/*.json (Transifex format)              │
│    │     Output: .temp/icu/*.json (ICU MessageFormat)        │
│    │     Logic:  Extract "string" field from Transifex       │
│    │                                                          │
│    ├─> scripts/split-by-component.ts                         │
│    │     Input:  .temp/icu/*.json                            │
│    │     Output: .temp/by-component/{Component}/{locale}.json│
│    │     Logic:  Parse "Nimbus.{Component}.{key}" IDs        │
│    │                                                          │
│    ├─> scripts/compile-component-messages.ts                 │
│    │     Input:  .temp/by-component/*/*.json                 │
│    │     Output: components/{comp}/intl/{locale}.ts          │
│    │     Tool:   @internationalized/string-compiler          │
│    │     Logic:  compileStrings() → pre-compiled functions   │
│    │                                                          │
│    └─> scripts/generate-dictionaries.ts                      │
│          Input:  components/{comp}/intl/*.ts                 │
│          Output: components/{comp}/{comp}.messages.ts        │
│          Logic:  Create LocalizedStringDictionary wrapper    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Package.json Updates

```json
{
  "scripts": {
    "extract-intl": "pnpm dlx @formatjs/cli extract ... && pnpm --filter @commercetools/nimbus-i18n build",
    "build": "pnpm build:packages",
    "build:packages": "pnpm -r --filter './packages/*' build"
  }
}
```

```json
// packages/i18n/package.json
{
  "scripts": {
    "build": "pnpm build:compile",
    "build:compile": "pnpm build:transform && pnpm build:split && pnpm build:compile-strings && pnpm build:dictionaries",
    "build:transform": "tsx scripts/transform-to-icu.ts",
    "build:split": "tsx scripts/split-by-component.ts",
    "build:compile-strings": "tsx scripts/compile-component-messages.ts",
    "build:dictionaries": "tsx scripts/generate-dictionaries.ts"
  },
  "devDependencies": {
    "@internationalized/string-compiler": "^3.2.4"
  }
}
```

## Implementation Plan

### Phase 1: Infrastructure Setup (Week 1)

**Goals:**

- Set up build scripts
- Validate compilation pipeline
- Generate messages for 1 component (Alert)

**Tasks:**

1. **Add dependencies**

   ```bash
   cd packages/i18n
   pnpm add -D @internationalized/string-compiler
   ```

2. **Create build scripts**
   - [ ] `scripts/transform-to-icu.ts` - Transifex → ICU format
   - [ ] `scripts/split-by-component.ts` - Group by component
   - [ ] `scripts/compile-component-messages.ts` - Run string-compiler
   - [ ] `scripts/generate-dictionaries.ts` - Create LocalizedStringDictionary

3. **Test compilation pipeline**
   - [ ] Run on Alert component messages only
   - [ ] Verify generated `alert/intl/*.ts` files
   - [ ] Verify generated `alert/alert.messages.ts`
   - [ ] Validate TypeScript types
   - [ ] **Create i18n test suite** - Test message dictionary functionality,
         locale fallbacks, and key validation

4. **Update build configuration**
   - [ ] Add new scripts to `packages/i18n/package.json`
   - [ ] Update `.gitignore` for `.temp/` directory
   - [ ] Document generated file patterns

**Success Criteria:**

- ✅ Alert component has generated message files
- ✅ Build runs without errors
- ✅ Generated files type-check correctly

### Phase 2: Component Migration (Weeks 2-3)

**Goals:**

- Migrate 5-10 representative components
- Establish migration patterns
- Document component update process

**Components to migrate (in order):**

1. **Alert** (simple, 1 message) - Already done in Phase 1
2. **Avatar** (simple with variable, 1 message)
3. **DatePicker** (moderate complexity, 6 messages)
4. **NumberInput** (moderate, 2 messages)
5. **Pagination** (variable usage, 3 messages)
6. **Calendar** (complex, 6 messages)
7. **ComboBox** (complex, 7 messages)

**Migration Pattern:**

For each component:

1. [ ] Run message compilation (automatic in build)
2. [ ] Update component imports:

   ```typescript
   // Before
   import { useIntl } from "react-intl";
   import { messages } from "./component.i18n";

   // After
   import { useLocalizedStringFormatter } from "react-aria/i18n";
   import { componentMessages } from "./component.messages";
   ```

3. [ ] Update message access:

   ```typescript
   // Before
   const intl = useIntl();
   const label = intl.formatMessage(messages.key);

   // After
   const strings = useLocalizedStringFormatter(componentMessages);
   const label = strings.format("key");
   ```

4. [ ] Update variable interpolation:

   ```typescript
   // Before
   intl.formatMessage(messages.label, { name: "John" });

   // After
   strings.format("label", { name: "John" });
   ```

5. [ ] Keep `.i18n.ts` file (needed for extraction)
6. [ ] Update tests if needed
7. [ ] Verify in Storybook
8. [ ] **Add i18n tests** - Test message retrieval, locale handling, and
       variable interpolation for each migrated component

**Success Criteria:**

- ✅ 7 components migrated and working
- ✅ All tests passing
- ✅ Storybook stories working
- ✅ Bundle size analysis shows reduction
- ⚠️ **i18n test suite created** - Tests for message dictionaries, locale
  fallbacks, and key validation

### Phase 3: Provider Updates (Week 4)

**Goals:**

- Update NimbusProvider to use React Aria's I18nProvider only
- Remove IntlProvider dependency
- Simplify locale configuration

**Tasks:**

1. **Update NimbusProvider**

   ```typescript
   // Remove IntlProvider, keep only I18nProvider
   <I18nProvider locale={locale}>
     <ChakraProvider>
       <NimbusColorModeProvider>
         {children}
       </NimbusColorModeProvider>
     </ChakraProvider>
   </I18nProvider>
   ```

2. **Remove message loading utilities**
   - [ ] Remove `getMessagesForLocale()` from `utils/i18n.ts`
   - [ ] Remove `useNimbusMessages()` hook
   - [ ] Update NimbusProvider props (remove `messages` prop)

3. **Update documentation**
   - [ ] Update component MDX files with new usage
   - [ ] Update NimbusProvider documentation
   - [ ] Add migration guide

**Success Criteria:**

- ✅ NimbusProvider simplified (no message loading)
- ✅ Documentation updated
- ✅ Migration guide complete

### Phase 4: Bulk Migration (Weeks 5-6)

**Goals:**

- Migrate all remaining components (130 messages across ~20 components)
- Automated testing and validation

**Approach:**

- Create migration script to automate repetitive changes
- Batch migrate components by complexity
- Run comprehensive test suite after each batch

**Batches:**

1. Simple components (no variables): Badge, Button, Icon, etc.
2. Components with variables: Avatar, Pagination, etc.
3. Complex components: DataTable, RichTextInput, etc.

**Success Criteria:**

- ✅ All 137 messages migrated
- ✅ All tests passing
- ✅ All Storybook stories working
- ⚠️ **i18n test suite complete** - All components have i18n tests covering
  message retrieval, locale fallbacks, and error handling

### Phase 5: Cleanup & Optimization (Week 7)

**Goals:**

- Remove old dependencies
- Optimize bundle size
- Performance testing

**Tasks:**

1. **Remove dependencies**
   - [ ] Remove `react-intl` from dependencies
   - [ ] Remove `intl-messageformat` (transitive)
   - [ ] Clean up unused i18n utilities

2. **Bundle analysis**
   - [ ] Measure bundle size before/after
   - [ ] Verify tree-shaking works correctly
   - [ ] Analyze lazy-loaded chunks

3. **Performance testing**
   - [ ] Measure component mount time
   - [ ] Test with all locales
   - [ ] Verify memory usage
   - [ ] **i18n performance tests** - Measure message retrieval performance
         across all locales and components

4. **Update build process**
   - [ ] Clean up old compilation scripts
   - [ ] Remove `compiled-data/` directory
   - [ ] Update `.gitignore`

**Success Criteria:**

- ✅ `react-intl` removed from package.json
- ✅ Bundle size reduced by >30%
- ✅ Performance metrics improved

### Phase 6: Documentation & Release (Week 8)

**Goals:**

- Complete documentation
- Create migration guide for consumers
- Release as breaking change

**Tasks:**

1. **Documentation**
   - [ ] Update CLAUDE.md with new i18n patterns
   - [ ] Update component guidelines
   - [ ] Add examples to docs site

2. **Migration guide**
   - [ ] Write consumer migration guide
   - [ ] Document breaking changes
   - [ ] Provide codemods if needed

3. **Release preparation**
   - [ ] Create changeset (major version)
   - [ ] Update CHANGELOG
   - [ ] Prepare release notes

**Success Criteria:**

- ✅ Complete documentation
- ✅ Migration guide published
- ✅ Ready for major version release

## Migration Impact

### Breaking Changes

1. **NimbusProvider API Change**

   ```typescript
   // Before
   const messages = await getMessagesForLocale('de');
   <NimbusProvider locale="de" messages={messages}>

   // After (simplified)
   <NimbusProvider locale="de-DE">
   ```

2. **Locale format change**

   ```typescript
   // Before: Accepts simplified locale
   <NimbusProvider locale="de">

   // After: Requires BCP 47 format
   <NimbusProvider locale="de-DE">
   ```

3. **No more message loading utilities**
   - `getMessagesForLocale()` removed
   - `useNimbusMessages()` removed
   - Messages automatically bundled with components

### Consumer Migration Path

#### Minimal Changes Required

Most consumers won't need changes if they use default English:

```typescript
// Works in both versions
<NimbusProvider>
  <App />
</NimbusProvider>
```

#### Locale Changes Required

```typescript
// Before (v2.x)
import { NimbusProvider, getMessagesForLocale } from '@commercetools/nimbus';

const messages = await getMessagesForLocale('de');

<NimbusProvider locale="de" messages={messages}>
  <App />
</NimbusProvider>

// After (v3.x)
import { NimbusProvider } from '@commercetools/nimbus';

<NimbusProvider locale="de-DE">
  <App />
</NimbusProvider>
```

### Backward Compatibility

- **Not possible** - This is a breaking change
- Requires major version bump (v2.x → v3.x)
- Provide detailed migration guide
- Consider providing codemods for automated migration

## Technical Considerations

### Locale Mapping

React Aria uses BCP 47 locale strings (`en-US`, `de-DE`), but Nimbus uses
simplified keys. We need mapping logic:

```typescript
// utils/locale-mapping.ts
export const NIMBUS_LOCALE_MAP = {
  "en-US": "en",
  "en-GB": "en",
  "de-DE": "de",
  "de-AT": "de",
  "de-CH": "de",
  "es-ES": "es",
  "es-MX": "es",
  "fr-FR": "fr-FR",
  "pt-BR": "pt-BR",
  "pt-PT": "pt-BR", // Fallback to Brazilian Portuguese
} as const;

export function getNimbusLocale(raLocale: string): string {
  return NIMBUS_LOCALE_MAP[raLocale as keyof typeof NIMBUS_LOCALE_MAP] || "en";
}
```

**TODO: Investigate Locale Format Documentation Consistency**

There's a discrepancy between documentation and implementation:

- **Documentation says**: `NimbusProvider` expects BCP47 format (`en-US`,
  `de-DE`)
- **Reality**:
  - Type is `locale?: string` (accepts any string)
  - React Aria's `I18nProvider` doesn't enforce BCP47
  - Our message dictionaries use simple codes (`en`, `de`, `es`)
  - `useLocale()` returns whatever you pass (no normalization)

**Questions to investigate:**

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
which locale provider controls message localization.

**Before Migration:**

- Components used `react-intl`'s `useIntl()` hook
- `react-intl` gets locale from `IntlProvider` (from `react-intl`)
- `NimbusI18nProvider` only affected React Aria components (number/date
  formatting), not `react-intl` messages
- Components showed messages based on Storybook's `IntlProvider` or default
  locale (typically English)
- Tests searching for English text were correct

**After Migration:**

- Components use `useLocale()` from `react-aria-components`
- This gets locale from `I18nProvider` (which `NimbusI18nProvider` wraps)
- Components now use the locale from `NimbusI18nProvider` for messages
- If a story sets `NimbusI18nProvider locale="de-DE"`, components show German
  messages
- Tests must be updated to match the locale set in the story

**Example - MoneyInput Story:**

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

Only 2 messages use variables:

- `Avatar.avatarLabel`: "Avatar image for {fullName}"
- `Pagination.pageNumberOf`: "of {totalPages}"

The compiler handles these automatically:

```typescript
// Compiled output
{
  avatarLabel: (values) => `Avatar image for ${values.fullName}`;
}

// Component usage
strings.format("avatarLabel", { fullName: "John Doe" });
```

### ICU Message Features

Current usage:

- ✅ Simple strings (135 messages)
- ✅ Variables (2 messages)
- ❌ Plurals (none)
- ❌ Select (none)
- ❌ Date formatting (none)
- ❌ Number formatting (none)

All current messages are supported by `@internationalized/string-compiler`.

### Bundle Size Analysis

**Before (Estimated):**

```
react-intl:         ~45 KB (gzipped)
intl-messageformat: ~15 KB (gzipped)
Message AST:        ~5 KB (gzipped)
Total:              ~65 KB (gzipped)
```

**After (Estimated):**

```
@internationalized/message:  ~8 KB (gzipped)
Pre-compiled messages:       ~3 KB per component (gzipped)
Only loaded if component used (tree-shakeable)
Estimated savings:           ~50 KB (gzipped)
```

**Per-Component Impact:**

```
Button (5 locales × 2 messages):  ~400 bytes (gzipped)
Alert (5 locales × 1 message):    ~200 bytes (gzipped)
DatePicker (5 locales × 6 msgs):  ~1.2 KB (gzipped)
```

### Performance Metrics

**Runtime Performance:**

- **Before**: Message parsing on every render
- **After**: Pre-compiled function call (direct string return)
- **Expected improvement**: ~90% faster message access

**Build Time:**

- **Additional**: ~2-5 seconds for message compilation
- **Acceptable**: Build time increase negligible compared to runtime gains

### TypeScript Support

Generated types provide full IDE support:

```typescript
// Auto-generated from compilation
export type AlertMessageKey = "dismiss";

// Full inference in components
const strings = useLocalizedStringFormatter(alertMessages);
strings.format("dismiss"); // ✅ Type-safe
strings.format("invalid"); // ❌ TypeScript error
```

## Testing Strategy

### Unit Tests

- [ ] Test locale mapping utility
- [ ] Test message compilation script
- [ ] Test dictionary generation
- [ ] Test component message access

### Integration Tests

- [ ] Test NimbusProvider with different locales
- [ ] Test component rendering in all locales
- [ ] Test lazy-loaded components
- [ ] Test tree-shaking

### Visual Regression Tests

- [ ] Screenshot tests for all locales
- [ ] Verify message display in Storybook
- [ ] Test right-to-left languages (if supported)

### Performance Tests

- [ ] Benchmark message access speed
- [ ] Measure bundle size impact
- [ ] Test memory usage
- [ ] Test initial load time

## Risk Assessment

### High Risk

1. **Breaking change for all consumers**
   - **Mitigation**: Detailed migration guide, major version bump
   - **Timeline**: Plan for 3-month migration period

2. **Build complexity increase**
   - **Mitigation**: Comprehensive error handling in scripts
   - **Timeline**: Thorough testing in Phase 1

### Medium Risk

1. **Locale mapping edge cases**
   - **Mitigation**: Comprehensive locale mapping tests
   - **Fallback**: Always default to English

2. **Missing ICU features discovered later**
   - **Mitigation**: Audit all messages before migration
   - **Fallback**: Can extend compiler or add runtime handling

### Low Risk

1. **Performance regressions**
   - **Mitigation**: Benchmarking before/after
   - **Unlikely**: Pre-compilation is faster by design

2. **TypeScript issues**
   - **Mitigation**: Generate proper type definitions
   - **Unlikely**: Adobe's types are mature

## Success Metrics

### Quantitative

- ✅ Bundle size reduction: >30% (target: ~50 KB saved)
- ✅ Runtime performance: >90% faster message access
- ✅ Build time increase: <10 seconds
- ✅ 100% message migration (137 messages)
- ✅ 0 runtime errors in production

### Qualitative

- ✅ Simpler developer experience (no message loading)
- ✅ Better TypeScript support
- ✅ Clearer component isolation (messages bundled)
- ✅ Easier debugging (pre-compiled strings visible)

## Rollback Plan

If critical issues are discovered:

1. **Before release**: Revert commit, fix issues, retry
2. **After release**:
   - Publish patch with bug fixes
   - If unfixable: Publish v2.x with reverted changes
   - Document issues and learnings

## Future Enhancements

### Phase 7+ (Post-Release)

1. **Dynamic locale loading**
   - Support lazy-loading locale files
   - Reduce initial bundle further

2. **Locale negotiation**
   - Automatic locale detection
   - Browser language preference

3. **Developer tools**
   - CLI for message management
   - VSCode extension for message keys

4. **Advanced ICU features**
   - Add pluralization if needed
   - Add date/number formatting if needed

## References

- [React Aria Internationalization](https://react-spectrum.adobe.com/react-aria/internationalization.html)
- [Adobe React Spectrum PR #3294](https://github.com/adobe/react-spectrum/pull/3294)
- [@internationalized/message package](https://github.com/adobe/react-spectrum/tree/main/packages/@internationalized/message)
- [FormatJS CLI Documentation](https://formatjs.io/docs/tooling/cli)

## Appendix A: Build Script Pseudocode

### transform-to-icu.ts

```typescript
// Read Transifex format files
for each file in packages/i18n/data/*.json:
  read Transifex format: { "id": { "string": "value" } }
  transform to ICU format: { "id": "value" }
  write to .temp/icu/{locale}.json
```

### split-by-component.ts

```typescript
// Group messages by component
for each locale file in .temp/icu/*.json:
  for each message id in file:
    parse "Nimbus.{Component}.{key}"
    group by Component
  write to .temp/by-component/{Component}/{locale}.json
```

### compile-component-messages.ts

```typescript
// Compile using @internationalized/string-compiler
import { compileStrings } from '@internationalized/string-compiler';

for each component in .temp/by-component/:
  for each locale file in component/:
    read ICU messages
    compiled = compileStrings(messages)
    write to packages/nimbus/src/components/{component}/intl/{locale}.ts
```

### generate-dictionaries.ts

```typescript
// Create LocalizedStringDictionary wrapper files
for each component with intl/ directory:
  generate {component}.messages.ts:
    - Import all locale files from intl/
    - Create LocalizedStringDictionary instance
    - Export typed message keys
```

## Appendix B: Example Outputs

### Input: data/core.json (Transifex format)

```json
{
  "Nimbus.Alert.dismiss": {
    "developer_comment": "aria-label for dismiss button",
    "string": "Dismiss"
  }
}
```

### Step 1: .temp/icu/en.json (ICU format)

```json
{
  "Nimbus.Alert.dismiss": "Dismiss"
}
```

### Step 2: .temp/by-component/Alert/en.json

```json
{
  "dismiss": "Dismiss"
}
```

### Step 3: alert/intl/en.ts (Compiled)

```typescript
export default {
  dismiss: () => "Dismiss",
};
```

### Step 4: alert/alert.messages.ts (Dictionary)

```typescript
import { LocalizedStringDictionary } from "@internationalized/message";
import en from "./intl/en";
import de from "./intl/de";

export const alertMessages = new LocalizedStringDictionary({
  "en-US": en,
  "de-DE": de,
});
```

---

**Document Status:** Ready for team review and approval **Next Steps:** Present
to team, gather feedback, finalize timeline **Target Start Date:** TBD
**Estimated Completion:** 8 weeks from start

-remove compiled-data check vite.config update ALL documentation -remove i18n
package from publishing & changesets

- update claude and/or copilot instructions re: i18n deprecate i18n package w/
  notice.

  -bundle size analysis

- docs unit tests
- update all readmes
- add visuals
- do we want to add Ra to react-aria-components hooks as well?
- \_reset locales in Storybook
- - handle fallback & splits (de-DE, usw) --link readmes
