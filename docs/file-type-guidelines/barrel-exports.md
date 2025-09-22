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

### Named Export Pattern

```typescript
// index.ts
export { ComponentName } from "./component-name";
export type * from "./component-name.types";
```

### Selective Export Pattern (Hiding Internals)

```typescript
// index.ts
// Export only public API
export { Button } from "./button";
export type { ButtonProps, ButtonVariant } from "./button.types";
```

## Examples from Nimbus

### Simple Component (Button)

```typescript
// packages/nimbus/src/components/button/index.ts
export * from "./button.tsx";
export * from "./button.types.ts";
```

### Complex Component (RichTextInput)

```typescript
// packages/nimbus/src/components/rich-text-input/index.ts
export { RichTextInput } from "./rich-text-input";
export type * from "./rich-text-input.types";
// Note: Internal hooks, utils, and components are NOT exported
```

### Compound Component (Menu)

```typescript
// packages/nimbus/src/components/menu/index.tsx
export * from "./menu";
export * from "./menu.types";
```

## File Extension Considerations

### `.ts` vs `.tsx`

- **Use `.ts`** when the file contains only exports (most common)
- **Use `.tsx`** only if the index file contains JSX code (rare)

### Import Extensions

Current Nimbus patterns show inconsistency:

- Some use extensions: `export * from "./button.tsx"`
- Others don't: `export * from "./menu"`

**Recommendation**: Be consistent within your component. Either always include
extensions or never include them.

## Best Practices

1. **Export both implementation and types**

   ```typescript
   export * from "./component-name";
   export * from "./component-name.types";
   ```

2. **Use `type` modifier for type-only exports**

   ```typescript
   export type * from "./component-name.types";
   ```

3. **Keep barrel exports minimal**
   - Only export what consumers need
   - Hide internal implementation details

4. **Maintain consistent patterns**
   - Use the same export style across your component
   - Follow existing patterns in the codebase

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

### ESLint Rule Enforcement

Consider enforcing module boundaries with ESLint:

```javascript
// .eslintrc.js
{
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        // Prevent direct imports, force through index
        '@/components/*/!(index)*'
      ]
    }]
  }
}
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
- [ ] File extension appropriate (.ts for exports only)
- [ ] No circular dependencies
- [ ] Follows team conventions for extensions in imports

---

[← Back to Index](../component-guidelines.md) |
[Next: Main Component →](./main-component.md)
