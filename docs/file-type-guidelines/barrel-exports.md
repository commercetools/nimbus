# Barrel Exports (index.ts) Guidelines

[← Back to Index](../component-guidelines.md) |
[Next: Main Component →](./main-component.md)

## Purpose

Barrel export files (`index.ts` or `index.tsx`) define the public API of a
component module. They control what consumers can import and establish clear
module boundaries.

This document is the **authoritative source** for Nimbus's import convention —
every other guideline that discusses cross-component or barrel imports links
back to the rule below.

## The Rule (Locked)

**Two lanes, chosen by what the file _is_ — never by prod vs. dev.**

- **Using Nimbus** — a story, test, or doc example that renders a component
  (`*.stories.tsx`, `*.spec.tsx`, `*.docs.spec.tsx`): import Nimbus
  components/hooks from the **package**, `@commercetools/nimbus`.
- **Building Nimbus** — a component/hook/pattern implementation file: import
  from the **`@/` alias**. Barrel (`@/components/button`) or deep
  (`@/components/button/button`) — **it does not matter**, both are safe.

Plus one global hygiene rule that makes "it does not matter" _true_:

- **No value `export *` anywhere.** Every value re-export is explicit
  (`export { Button } from "./button"`). `export type *` is allowed (types are
  erased at build and cannot trigger the defect). This is lint-enforced
  (`no-restricted-syntax` on `ExportAllDeclaration`, with `export type *`
  allowed).

`@/` always resolves to source, in every context and command. The only specifier
that flips src↔dist is `@commercetools/nimbus`, and that flip is a command
concern (dev vs. prod build), never written into an import.

### Why named re-exports — not deep imports — are what keep the bundle safe

Value `export *` chains let vite/rolldown's `lazyBarrel` mis-shake a compound
component whose root lives in a separate module: because the re-export chain is
`export *`, the bundler cannot statically map the re-exported name back to its
declaring module, drops that module as apparently unused, and leaves a free
variable at runtime (`ReferenceError: X is not defined`). Explicit named
re-exports give the bundler a static name→module map, so barrels become provably
safe — which is exactly what makes barrel-vs-deep a non-issue inside
implementation code. **Deep implementation imports are no longer required or
recommended for correctness**; they were a workaround for a defect that no
longer exists once value `export *` is gone.

## Barrels Are Hand-Maintained

Barrels are hand-written — there is no codegen. Converting a barrel from
`export *` to named re-exports is mechanical: one line per export, naming it
explicitly. Adding a new component adds one named line to the relevant barrel
(its own `index.ts` and the mega-barrel `src/components/index.ts`) — the same
cadence as the old `export *` line.

## When to Use

**Always required** - Every component must have an index file that:

- Exports the component implementation
- Exports TypeScript types
- Hides internal implementation details
- Provides a clean import path for consumers

## File Structure

### Standard Pattern (Most Common)

```typescript
// index.ts
export { ComponentName } from "./component-name";
export type * from "./component-name.types";
```

Values are always named (`export { X } from "./x"`); types may use
`export type *` since type-only re-exports are erased at build and cannot
trigger the runtime defect described above.

## Examples from Nimbus

### Simple Component

```typescript
// packages/nimbus/src/components/badge/index.ts
export { Badge } from "./badge";
export type * from "./badge.types";
```

### Compound Component

```typescript
// packages/nimbus/src/components/menu/index.ts
export { Menu } from "./menu";
export type * from "./menu.types";
```

### The Mega-Barrel (`src/components/index.ts`)

The top-level components barrel re-exports every component by name, one
statement per component:

```typescript
export { Button } from "./button";
export { Menu } from "./menu";
export { Badge } from "./badge";
// ... one line per component
```

## File Extension Considerations

### `.ts` vs `.tsx`

- **Use `.ts`** when the file contains only exports (most common)
- **Use `.tsx`** only if the index file contains JSX code (rare)

### Import Extensions

The TypeScript configuration allows both styles
(`allowImportingTsExtensions: true`), but the codebase shows a clear preference:

- **Dominant pattern (100%)**: Omit extensions -
  `export { Button } from "./button"`

**Always Required**: Omit extensions to ensure proper type resolution in the
build.

## Best Practices

1. **Omit file extensions in imports** (preferred)

   ```typescript
   export { ComponentName } from "./component-name";
   export type * from "./component-name.types";
   ```

2. **Export both implementation and types**

   - Values: explicit named re-exports (`export { X } from "./x"`)
   - Types: `export type *` (allowed; erased at build, cannot trigger the
     defect)

3. **Never use value `export *`**

   ```typescript
   // ❌ WRONG — value export * (lint error, unsafe under lazyBarrel)
   export * from "./component-name";

   // ✅ CORRECT — named value re-export
   export { ComponentName } from "./component-name";
   ```

4. **Keep barrel exports minimal**
   - Only export what consumers need
   - Hide internal implementation details

5. **Maintain consistent patterns**
   - Use the same export style across your component
   - Follow the dominant codebase pattern (omit extensions, name every value
     export)

## Module Boundary Enforcement

### Public vs Private API

```typescript
// index.ts - Public API only
export { Select } from "./select";
export type { SelectProps, SelectOption } from "./select.types";

// These remain private (not exported):
// - ./hooks/use-select-internal.ts
// - ./utils/select-filters.ts
// - ./components/select-internal-part.tsx
```

## Related Guidelines

- [Main Component](./main-component.md) - What to export from main file, and the
  two-lane import rule applied to implementation files
- [Types](./types.md) - Type definition patterns
- [Compound Components](./compound-components.md) - Barrel exports for compound
  components

## Validation Checklist

- [ ] Index file exists at component root
- [ ] Exports component implementation
- [ ] Exports TypeScript types
- [ ] Only exports public API (no internal utilities)
- [ ] **No value `export *`** — every value re-export is explicit
      (`export { X } from "./x"`); lint-enforced
- [ ] `export type *` used for type-only re-exports (allowed)
- [ ] File extension appropriate (.ts for exports only, .tsx if JSX present)
- [ ] **Omits file extensions in imports** (preferred pattern)
- [ ] No circular dependencies

---

[← Back to Index](../component-guidelines.md) |
[Next: Main Component →](./main-component.md)
