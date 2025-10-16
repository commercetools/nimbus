# Barrel Exports (index.ts) Guidelines

[← Back to Index](../component-guidelines.md) |
[Next: Main Component →](./main-component.md)

## Purpose

Barrel export files (`index.ts` or `index.tsx`) define the public API of a
component module. They control what consumers can import and establish clear
module boundaries.

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
export * from "./component-name";
export * from "./component-name.types";
```

## Examples from Nimbus

### Simple Component

```typescript
// packages/nimbus/src/components/badge/index.ts
export * from "./badge";
export * from "./badge.types";
```

### Compound Component

```typescript
// packages/nimbus/src/components/menu/index.ts
export * from "./menu";
export * from "./menu.types";
```

## File Extension Considerations

### `.ts` vs `.tsx`

- **Use `.ts`** when the file contains only exports (most common)
- **Use `.tsx`** only if the index file contains JSX code (rare)

### Import Extensions

The TypeScript configuration allows both styles
(`allowImportingTsExtensions: true`), but the codebase shows a clear preference:

- **Dominant pattern (100%)**: Omit extensions - `export * from "./menu"`

**Always Required**: Omit extensions to ensure proper type resolution in the
build.

## Best Practices

1. **Omit file extensions in imports** (preferred)

   ```typescript
   export * from "./component-name";
   export * from "./component-name.types";
   ```

2. **Export both implementation and types**

   ```typescript
   export * from "./component-name";
   export * from "./component-name.types";
   ```

3. **Use `type` modifier for type-only exports**

   ```typescript
   export type * from "./component-name.types";
   ```

4. **Keep barrel exports minimal**
   - Only export what consumers need
   - Hide internal implementation details

5. **Maintain consistent patterns**
   - Use the same export style across your component
   - Follow the dominant codebase pattern (omit extensions)

## Module Boundary Enforcement

### Public vs Private API

```typescript
// index.ts - Public API only
export { Select } from "./select";
export type { SelectProps, SelectOption } from "./select.types";

// These remain private (not exported):
// - ./hooks/use-select-internal.ts
// - ./utils/select-helpers.ts
// - ./components/select-internal-part.tsx
```

## Related Guidelines

- [Main Component](./main-component.md) - What to export from main file
- [Types](./types.md) - Type definition patterns
- [Compound Components](./compound-components.md) - Barrel exports for compound
  components

## Validation Checklist

- [ ] Index file exists at component root
- [ ] Exports component implementation
- [ ] Exports TypeScript types
- [ ] Only exports public API (no internal utilities)
- [ ] Uses consistent export pattern
- [ ] File extension appropriate (.ts for exports only, .tsx if JSX present)
- [ ] **Omits file extensions in imports** (preferred pattern)
- [ ] No circular dependencies
- [ ] Uses `export type *` for type-only exports when appropriate

---

[← Back to Index](../component-guidelines.md) |
[Next: Main Component →](./main-component.md)
