# Internal Utils

This directory contains internal-use utilities for Nimbus development. These utilities are **not exported** as part of the public API.

## Purpose

Internal utilities provide reusable helpers for:

- **Story composition** - Components like `DisplayColorPalettes` that help showcase component variations in Storybook
- **Development helpers** - Shared utilities used during component development
- **Testing support** - Shared configuration and setup code for stories and tests
- **Internal tooling** - Utilities that support the development workflow but are not part of the public API

## Internal Use Only

**Important:** These utilities are for **internal Nimbus development only** and are not part of the public API.

### No Barrel Export

This directory intentionally **does not have an `index.ts` barrel file**. This ensures:

1. Internal utilities are not exported from the main `@commercetools/nimbus` package
2. Consumers cannot import internal development utilities
3. The public API surface remains clean and focused on components only
4. Internal implementation details stay private

### Import Pattern

Import internal utilities directly using the `@/internal-utils` path alias:

```typescript
// ✅ Correct - Direct import with path alias
import { DisplayColorPalettes } from "@/internal-utils/display-color-palettes";

// ❌ Wrong - No barrel export exists
import { DisplayColorPalettes } from "@/internal-utils";

// ❌ Wrong - Not exported from main package
import { DisplayColorPalettes } from "@commercetools/nimbus";
```

## Available Utilities

### DisplayColorPalettes

Utility component for showcasing components across all color palettes (semantic, brand, and system).

**Usage:**

```typescript
import { DisplayColorPalettes } from "@/internal-utils/display-color-palettes";

export const ColorPalettes: Story = {
  render: (args) => (
    <DisplayColorPalettes>
      {(palette) => (
        <Badge {...args} colorPalette={palette}>
          {palette}
        </Badge>
      )}
    </DisplayColorPalettes>
  ),
};
```

This renders the component with every available color palette, organized by palette type.

## Adding New Utilities

When adding new internal utilities:

1. Create a new file with a descriptive name (e.g., `my-utility.tsx`)
2. Export named exports (not default exports)
3. Add comprehensive JSDoc documentation
4. **Do not create a barrel export file** (`index.ts`)
5. Import directly using the `@/internal-utils/my-utility` pattern
6. Update this README with the new utility

## Guidelines

- Keep utilities focused and single-purpose
- Add TypeScript types for all exports
- Document usage patterns with examples
- Only add utilities used internally across multiple components or stories
- **Never** export utilities from the main package - they are internal only
- Consider whether the utility should be a public API export (if so, move to the components directory)

---

Last updated: January 2025
