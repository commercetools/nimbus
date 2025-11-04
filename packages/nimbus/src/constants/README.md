# Constants

This directory contains internal constant values used throughout Nimbus. These
constants are **not exported** as part of the public API.

## Purpose

Constants provide shared, immutable configuration values for internal use:

- **Color palette definitions** - Arrays defining semantic, brand, and system
  color palettes
- **Design system values** - Shared constants used across components and
  utilities
- **Configuration** - Static values that configure component behavior
- **Type derivation** - Constant arrays used to derive TypeScript union types

## Internal Use Only

**Important:** These constants are for **internal Nimbus development only** and
are not part of the public API.

### Barrel Export for Internal Use

This directory **has an `index.ts` barrel export file** for internal
convenience, but:

1. Constants are **NOT** exported from the main `@commercetools/nimbus` package
2. Consumers cannot import these constants - they are internal implementation
   details
3. The barrel export is only for use within the Nimbus package codebase
4. These constants support internal implementation but are not part of the
   public API

### Import Pattern

**Within Nimbus**, import constants using the `@/constants` path alias:

```typescript
// ✅ Correct - Internal import within Nimbus
import { SEMANTIC_COLOR_PALETTES, ALL_COLOR_PALETTES } from "@/constants";

// ❌ Wrong - Not exported from main package (consumers cannot do this)
import { SEMANTIC_COLOR_PALETTES } from "@commercetools/nimbus";
```

## Adding New Constants

When adding new constants to this directory:

1. Create a new file with a descriptive name (e.g., `spacing-values.ts`)
2. Export named constants (not default exports)
3. Use SCREAMING_SNAKE_CASE for constant names
4. Add comprehensive JSDoc documentation
5. Mark values as `as const` for literal type inference
6. **Export from the barrel file** (`index.ts`)
7. Import using the `@/constants` alias

## Guidelines

- Use `as const` assertions for literal type inference
- Name constants using SCREAMING_SNAKE_CASE convention
- Group related constants in the same file
- Document the purpose and usage of each constant with JSDoc
- Only add constants that are truly shared across multiple components
- **Never** export constants in the main package barrel export
- These constants support internal implementation, not the public API
- Consider if values should be part of the design tokens instead

## Design Tokens vs Constants

**Use design tokens when:**

- Values are part of the visual design system (colors, spacing, typography)
- Values need to be theme-aware or customizable
- Values are consumed by Chakra UI recipes

**Use constants when:**

- Values are configuration, not visual design
- Values are used for logic, validation, or type derivation
- Values are internal implementation details

---

Last updated: November 4, 2025
