# i18n Migration Progress Report - Compile-Time Message Parsing

**Status:** Phase 1 Complete (Infrastructure + Alert Component)  
**Date:** January 2025  
**Related PR:** #841 (CRAFT-2029)

## Executive Summary

This document tracks the progress of migrating Nimbus from runtime message
parsing (`react-intl`) to compile-time message compilation using
`@internationalized/message`. Phase 1 (Infrastructure Setup) is complete, with
the Alert component successfully migrated as a proof of concept.

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

4. **Alert Component Migrated**
   - ✅ Generated `alert/intl/*.ts` files for all 5 locales
   - ✅ Generated `alert/alert.messages.ts` dictionary
   - ✅ Updated `alert.dismiss-button.tsx` to use new system
   - ✅ TypeScript types generated and working

5. **Package Configuration**
   - ✅ `pnpm-workspace.yaml` updated with `@internationalized/message` in
     catalog
   - ✅ `packages/i18n/README.md` updated with new architecture

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
functionality with `getStringForLocale()` method.

**Impact:** Minimal - same constructor pattern and API.

---

### 2. **Component Usage Pattern: Direct Access vs Hook**

**Original Plan:**

```typescript
import { useLocalizedStringFormatter } from "react-aria/i18n";
import { alertMessages } from "./alert.messages";

const strings = useLocalizedStringFormatter(alertMessages);
const label = strings.format("dismiss");
```

**Actual Implementation:**

```typescript
import { useLocale } from "react-aria-components";
import { alertMessages } from "./alert.messages";

const { locale } = useLocale();
const label = alertMessages.getStringForLocale(locale, "dismiss");
```

**Reason:** `useLocalizedStringFormatter` hook does not exist in
`react-aria/i18n`. The direct `getStringForLocale()` approach is simpler and
more explicit.

**Impact:**

- ✅ Simpler API (no intermediate hook)
- ✅ More explicit locale handling
- ✅ Better alignment with React Aria's patterns

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
```

### Component Usage Pattern

```typescript
// Component file
import { useLocale } from "react-aria-components";
import { alertMessages } from "../alert.messages";

export const AlertDismissButton = () => {
  const { locale } = useLocale();
  const dismissLabel = alertMessages.getStringForLocale(locale, "dismiss");

  return <IconButton aria-label={dismissLabel}>...</IconButton>;
};
```

### Generated File Structure

```
packages/nimbus/src/components/alert/
├── alert.messages.ts          ← Generated dictionary
├── intl/                      ← Generated compiled messages
│   ├── en.ts
│   ├── de.ts
│   ├── es.ts
│   ├── fr-FR.ts
│   └── pt-BR.ts
└── components/
    └── alert.dismiss-button.tsx  ← Updated to use new system
```

## Known Issues & Next Steps

### 🔴 Current Issues

1. **Test Failures**
   - Some tests fail with locale errors
   - Need to ensure all tests use test utilities or provide explicit locale
   - **Status:** In progress

2. **TypeScript Type Workarounds**
   - `@ts-expect-error` needed for components with variable messages
   - Acceptable trade-off, but documented for future reference

### 🟡 Pending Tasks

1. **Component Migration**
   - ✅ Alert (1 message) - Complete
   - ⏳ Avatar (1 message with variable)
   - ⏳ Remaining ~20 components (136 messages)

2. **Provider Updates**
   - ⏳ Remove `IntlProvider` from `NimbusProvider`
   - ⏳ Remove `react-intl` dependency
   - ⏳ Update Storybook decorators

3. **Documentation**
   - ⏳ Update component guidelines
   - ⏳ Update CLAUDE.md
   - ⏳ Create migration guide for consumers

4. **Cleanup**
   - ⏳ Remove `compiled-data/` directory
   - ⏳ Make `@commercetools/nimbus-i18n` package private
   - ⏳ Remove unused i18n utilities

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

   // After
   const { locale } = useLocale();
   const label = componentMessages.getStringForLocale(locale, "key");
   ```

4. **Update variable interpolation:**

   ```typescript
   // Before
   intl.formatMessage(messages.label, { name: "John" });

   // After
   const message = componentMessages.getStringForLocale(locale, "label");
   const formatted =
     typeof message === "function" ? message({ name: "John" }) : message;
   ```

5. **Keep `.i18n.ts` file** (still needed for extraction)

6. **Update tests** (ensure locale is provided)

## Success Metrics (Phase 1)

- ✅ Build scripts working end-to-end
- ✅ Alert component migrated and functional
- ✅ TypeScript types generated correctly
- ✅ Generated files follow ES module standards
- ⚠️ Some test failures (locale-related, fixable)

## Next Phase: Component Migration

**Priority Order:**

1. Avatar (validates variable message handling)
2. Simple components (Badge, Button, Icon)
3. Components with variables (Pagination)
4. Complex components (DatePicker, Calendar, ComboBox)

**Estimated Timeline:**

- Phase 2 (Component Migration): 2-3 weeks
- Phase 3 (Provider Updates): 1 week
- Phase 4 (Bulk Migration): 2-3 weeks
- Phase 5 (Cleanup): 1 week
- Phase 6 (Documentation): 1 week

**Total Estimated:** 7-9 weeks remaining

---

## References

- Original Plan: `plans/intl/COMPILE_TIME_PARSING.md`
- Implementation: `packages/i18n/scripts/`
- Example Migration: `packages/nimbus/src/components/alert/`
- Related PR: #841 (CRAFT-2029)
