# Utils

This directory contains internal utility functions and components used by
Nimbus. These utilities are **not exported** as part of the public API.

## Purpose

These utilities provide low-level helpers for internal use:

- **Prop extraction** - Utilities like `extractStyleProps` and
  `extractAriaAttributes` that separate props for proper forwarding
- **Helper functions** - Small, focused utilities used across multiple
  components
- **Story helpers** - Components like `DisplayColorPalettes` for Storybook
  stories
- **Internal constants** - Shared configuration values and type definitions
- **Component utilities** - Functions that support component implementation but
  are not meant for consumer use

## Internal Use Only

**Important:** These utilities are for **internal Nimbus component
implementation only** and are not part of the public API.

### Barrel Export for Internal Use

This directory **has an `index.ts` barrel export file** for internal
convenience, but:

1. Utilities are **NOT** exported from the main `@commercetools/nimbus` package
2. Consumers cannot import these utilities - they are internal implementation
   details
3. The barrel export is only for use within the Nimbus package codebase
4. These utilities support component implementation but are not part of the
   public API

### Import Pattern

**Within Nimbus components**, import utilities using the `@/utils` path alias:

```typescript
// ✅ Correct - Internal import within Nimbus components
import { extractStyleProps, extractAriaAttributes } from "@/utils";

// ❌ Wrong - Not exported from main package (consumers cannot do this)
import { extractStyleProps } from "@commercetools/nimbus";
```

## Adding New Utilities

When adding new utilities to this directory:

1. Create a new file with a descriptive name (e.g., `my-utility.ts`)
2. Export named exports (not default exports)
3. Add comprehensive JSDoc documentation
4. **Export from the barrel file** (`index.ts`)
5. Import using the `@/utils` alias within component implementations
6. Write unit tests for the utility (`.spec.ts` file)
7. Update this README with the new utility

## Guidelines

- Keep utilities pure and focused on a single responsibility
- Add full TypeScript types for all parameters and return values
- Document usage patterns with JSDoc and examples
- Write unit tests for pure utility functions
- Only add utilities used across multiple components or stories
- **Never** export utilities in the main package barrel export
- These utilities support internal development, not the public API
- Story helper components (like `DisplayColorPalettes`) belong here

---

Last updated: November 4, 2025
