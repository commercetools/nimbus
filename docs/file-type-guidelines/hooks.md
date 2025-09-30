# Hooks Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Compound Components](./compound-components.md) |
[Next: Utils & Constants →](./utils-and-constants.md)

## Purpose

The `hooks/` directory contains component-specific React hooks that encapsulate
complex logic, state management, and side effects. Organizing hooks in a dedicated
folder keeps component implementations clean and logic well-organized.

## When to Use

Create a hook when you need to:

- Encapsulate complex state management logic
- Coordinate multiple React hooks (useState, useEffect, useMemo)
- Process or transform data with memoization
- Reuse logic across multiple component files

**Don't create a hook if:**

- Logic is simple and used once - keep it inline
- Logic has no React dependencies - use a utility function instead

## Critical Rule: Hooks Location

**ALL hooks MUST go in the `hooks/` subfolder** - Never place hooks in the
component root directory.

```
✅ CORRECT Structure:
component-name/
├── component-name.tsx
├── hooks/
│   ├── use-component-logic.ts
│   ├── use-keyboard-navigation.ts
│   └── index.ts
└── index.ts

❌ WRONG Structure:
component-name/
├── component-name.tsx
├── use-component-logic.ts  # Wrong location!
└── index.ts
```

## File Structure

### Basic Hook Structure

```typescript
// hooks/use-component-name.ts
import { useState, useCallback, useMemo } from "react";

/**
 * Hook description
 *
 * @param options - Configuration options
 * @returns State and methods
 *
 * @example
 * ```tsx
 * const { value, setValue } = useComponentName({ defaultValue: 'initial' });
 * ```
 */
export function useComponentName(options) {
  // Hook implementation
  const [state, setState] = useState(options.defaultValue);

  const handleChange = useCallback((newValue) => {
    setState(newValue);
    options.onChange?.(newValue);
  }, [options.onChange]);

  return { value: state, setValue: handleChange };
}
```

### Hooks Index File

```typescript
// hooks/index.ts
export { useComponentName } from "./use-component-name";
```

## Naming Conventions

### Hook Names

Always prefix with `use` and use camelCase:

| Pattern                   | Example           |
| ------------------------- | ----------------- |
| `use{Functionality}`      | `usePagination`   |
| `use{Component}{Feature}` | `useMenuKeyboard` |
| `use{Component}State`     | `useSelectState`  |

### File Names

Use kebab-case with `use-` prefix:

| Hook Name           | File Name                |
| ------------------- | ------------------------ |
| `usePagination`     | `use-pagination.ts`      |
| `useMenuKeyboard`   | `use-menu-keyboard.ts`   |
| `useFormValidation` | `use-form-validation.ts` |

## Type Definitions

Define types based on visibility:

**Public hooks** (exported for consumers): Define types in `component-name.types.ts`

```typescript
// component-name.types.ts
export interface UseComponentNameOptions {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export interface UseComponentNameReturn {
  value: string;
  setValue: (value: string) => void;
}
```

**Internal hooks** (not exported): Define types inline in the hook file

```typescript
// hooks/use-internal-helper.ts
interface InternalState {
  // Internal types here
}

export function useInternalHelper() {
  // Implementation
}
```

## Common Patterns

### Complex State Management

Used for coordinating multiple states with controlled/uncontrolled modes:

```typescript
// hooks/use-pagination.ts
export function usePagination({ totalItems, currentPage, onPageChange }) {
  const [internalPage, setInternalPage] = useState(1);
  const isControlled = currentPage !== undefined;
  const page = isControlled ? currentPage : internalPage;

  const goToPage = useCallback((newPage: number) => {
    if (!isControlled) {
      setInternalPage(newPage);
    }
    onPageChange?.(newPage);
  }, [isControlled, onPageChange]);

  return { page, goToPage };
}
```


## JSDoc Requirements

Document hooks with:

- Brief description of what the hook does
- `@param` for parameters
- `@returns` for return value
- `@example` showing usage

```typescript
/**
 * Manages pagination state and navigation
 *
 * @param options - Pagination configuration
 * @returns Pagination state and navigation functions
 *
 * @example
 * ```tsx
 * const { page, goToPage } = usePagination({ totalItems: 100 });
 * ```
 */
```

## Testing Hooks

Test hooks using Storybook's play functions by using them in a component:

```typescript
// component-name.stories.tsx
export const InteractiveTest: Story = {
  render: () => {
    const { value, setValue } = useComponentName({ defaultValue: 'test' });
    return <div onClick={() => setValue('clicked')}>{value}</div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('test'));
    await expect(canvas.getByText('clicked')).toBeInTheDocument();
  },
};
```

## Related Guidelines

- [Types](./types.md) - Hook type definitions
- [Main Component](./main-component.md) - Using hooks in components
- [Utils & Constants](./utils-and-constants.md) - Pure utility functions

## Validation Checklist

- [ ] Hook in `hooks/` subfolder (never in root)
- [ ] File name: `use-*` with kebab-case
- [ ] Function name: `use*` with camelCase
- [ ] Public types in component types file, internal types colocated
- [ ] JSDoc with description, @param, @returns, @example
- [ ] Exported from `hooks/index.ts`
- [ ] Dependencies array correct for useCallback/useMemo/useEffect
- [ ] Cleanup functions for side effects (if applicable)

---

[← Back to Index](../component-guidelines.md) |
[Previous: Compound Components](./compound-components.md) |
[Next: Utils & Constants →](./utils-and-constants.md)
