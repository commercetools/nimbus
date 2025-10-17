# Type Utilities

This directory contains TypeScript utility types that are used across Nimbus
components and must be part of the main export chain.

## Why This Folder Exists

This folder exists to solve **type bundling and resolution issues** with
`vite-plugin-dts` when building the library.

### The Problem

When building a library with Vite and `vite-plugin-dts`, type definitions need
to be:

1. **Reachable from entry points**: Types must be exported through the main
   `src/index.ts` to be included in the build output
2. **Resolvable by consumers**: Type imports must resolve correctly in consuming
   applications

Previously, utility types were located in nested folders like
`src/components/utils/`, which caused issues:

- Types weren't part of the main export chain (`src/index.ts` →
  `src/components/`)
- Relative imports (`../utils/slot-types`) couldn't be resolved in the bundled
  `.d.ts` files
- `vite-plugin-dts` couldn't find type definitions during the build process

### The Solution

By placing utility types in `src/type-utils/` and explicitly exporting them
through `src/index.ts`, we ensure:

- ✅ Types are part of the main export chain
- ✅ Imports use the path alias `@/type-utils` which resolves correctly
- ✅ `vite-plugin-dts` can find and include all type definitions
- ✅ Consuming applications can import components without type errors

## What's Inside

### `slot-types.ts`

Contains the `SlotComponent` type annotation used for all Chakra UI slot recipe
components created with `withProvider` and `withContext`.

**Purpose**: Provides explicit type annotations to prevent TypeScript TS2742
errors about inferred types not being portable.

**Usage**:

```typescript
import type { SlotComponent } from "@/type-utils";

export const AccordionRootSlot: SlotComponent<
  HTMLDivElement,
  AccordionRootSlotProps
> = withProvider<HTMLDivElement, AccordionRootSlotProps>("div", "root");
```

### `omit-props.ts`

Contains utility types for omitting specific props from component interfaces.

## Important Guidelines

### ✅ DO

- Place shared type utilities used across multiple components here
- Use the path alias `@/type-utils` for imports
- Export new types through `index.ts`
- Document the purpose of new utility types

### ❌ DON'T

- Place component-specific types here (those belong in component `.types.tsx`
  files)
- Create nested subdirectories (keep the structure flat for simpler imports)
- Use relative imports like `../type-utils` (always use the path alias)
- Forget to export new types in `index.ts`

## Adding New Type Utilities

When adding a new type utility:

1. **Create the file** in `src/type-utils/`
2. **Export it** in `src/type-utils/index.ts`
3. **Document it** in this README
4. **Use the path alias** `@/type-utils` when importing it

Example:

```typescript
// src/type-utils/my-utility.ts
export type MyUtility<T> = { ... };

// src/type-utils/index.ts
export type { MyUtility } from "./my-utility";

// Component file
import type { MyUtility } from "@/type-utils";
```

## Related Documentation

- See `vite.config.ts` for the `vite-plugin-dts` configuration
- See `src/components/` for examples of `SlotComponent` usage
- See `CLAUDE.md` for overall project architecture
