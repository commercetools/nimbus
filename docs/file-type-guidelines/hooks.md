# Hooks Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Compound Components](./compound-components.md) |
[Next: Utils & Constants →](./utils-and-constants.md)

## Purpose

The `hooks/` directory contains component-specific React hooks that encapsulate
complex logic, state management, and side effects. Hooks promote code reuse and
separation of concerns.

## When to Use

### Create a Hook When:

- **Complex logic** needs to be reused across components
- **State management** becomes complex (multiple states, reducers)
- **Side effects** need coordination (subscriptions, timers, API calls)
- **Keyboard handling** or event management is complex
- **Computed values** require memoization
- **Cross-component communication** is needed

### When Hooks Aren't Needed:

- Logic is simple and used only once
- Standard React hooks suffice (useState, useEffect)
- Logic belongs in a utility function (pure, no React features)

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

````typescript
// hooks/use-component-name.ts
import { useState, useCallback, useMemo } from "react";
import type {
  UseComponentNameOptions,
  UseComponentNameReturn,
} from "../component-name.types";

/**
 * Hook for managing component-name state and behavior
 *
 * @param options - Configuration options
 * @returns Methods and state for component control
 *
 * @example
 * ```tsx
 * const { value, setValue, isValid } = useComponentName({
 *   defaultValue: 'initial',
 *   onChange: (val) => console.log(val)
 * });
 * ```
 */
export function useComponentName(
  options: UseComponentNameOptions = {}
): UseComponentNameReturn {
  const { defaultValue = "", onChange, validator } = options;

  const [value, setValue] = useState(defaultValue);

  const isValid = useMemo(() => {
    if (!validator) return true;
    return validator(value);
  }, [value, validator]);

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  return {
    value,
    setValue: handleChange,
    isValid,
  };
}
````

### Hooks Index File

```typescript
// hooks/index.ts
export { useComponentName } from "./use-component-name";
export { useKeyboardNavigation } from "./use-keyboard-navigation";
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

### Options and Return Types

Define **public** hook types in the component's types file, **internal** hook
types colocated with the hook:

```typescript
// component-name.types.ts (PUBLIC HOOK TYPES - exported for consumers)
export interface UseComponentNameOptions {
  /**
   * Initial value
   * @default ''
   */
  defaultValue?: string;
  onChange?: (value: string) => void;
  validator?: (value: string) => boolean;
}

export interface UseComponentNameReturn {
  value: string;
  setValue: (value: string) => void;
  isValid: boolean;
}

// hooks/use-internal-processing.ts (INTERNAL HOOK TYPES - colocated)
interface InternalProcessingState {
  processing: boolean;
  cache: Map<string, CacheEntry>;
  retryCount: number;
}
```

## Common Hook Patterns

### State Management Hook

```typescript
// hooks/use-menu-state.ts
export function useMenuState(options: UseMenuStateOptions = {}) {
  const { defaultOpen = false, onOpenChange } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  }, [onOpenChange]);

  return { isOpen, open, close, toggle };
}
```

### Keyboard Navigation Hook

```typescript
// hooks/use-keyboard-navigation.ts
export function useKeyboardNavigation({
  items,
  onSelect,
  orientation = "vertical",
}: UseKeyboardNavigationOptions) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          if (orientation === "vertical") {
            event.preventDefault();
            setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
          }
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          onSelect?.(items[focusedIndex]);
          break;
      }
    },
    [items, focusedIndex, onSelect, orientation]
  );

  return { focusedIndex, handleKeyDown, setFocusedIndex };
}
```

### Async Data Hook

```typescript
// hooks/use-async-data.ts
export function useAsyncData<T>({
  fetchFn,
  dependencies = [],
}: UseAsyncDataOptions<T>) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetch();
  }, dependencies);

  return { data, loading, error, refetch: fetch };
}
```

## Examples from Nimbus

### Pagination Hook

```typescript
// pagination/hooks/use-pagination.ts
export function usePagination({
  totalPages,
  currentPage = 1,
  onChange,
}: UsePaginationOptions) {
  const [page, setPage] = useState(currentPage);

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setPage(validPage);
      onChange?.(validPage);
    },
    [totalPages, onChange]
  );

  const next = useCallback(() => goToPage(page + 1), [page, goToPage]);
  const previous = useCallback(() => goToPage(page - 1), [page, goToPage]);

  return {
    page,
    goToPage,
    next,
    previous,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}
```

## JSDoc Requirements

Every hook must have comprehensive JSDoc:

````typescript
/**
 * Hook for managing component state and behavior
 *
 * @param options - Configuration options for the hook
 * @returns Object containing state and methods
 *
 * @example
 * ```tsx
 * const { value, setValue } = useComponentName({
 *   defaultValue: 'initial',
 *   onChange: (val) => console.log(val)
 * });
 * ```
 */
````

## Testing Hooks

Use `@testing-library/react-hooks`:

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import { useCounter } from "./use-counter";

describe("useCounter", () => {
  it("should increment counter", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

## Related Guidelines

- [Types](./types.md) - Hook type definitions
- [Main Component](./main-component.md) - Using hooks in components
- [Utils & Constants](./utils-and-constants.md) - Pure utility functions

## Validation Checklist

- [ ] Hook in `hooks/` subfolder
- [ ] File name uses `use-` prefix with kebab-case
- [ ] Function name uses `use` prefix with camelCase
- [ ] Types defined in component types file
- [ ] JSDoc documentation complete
- [ ] Example usage in JSDoc
- [ ] Proper cleanup for side effects
- [ ] Memoization used where appropriate
- [ ] Dependencies correctly specified
- [ ] Exported from hooks/index.ts

---

[← Back to Index](../component-guidelines.md) |
[Previous: Compound Components](./compound-components.md) |
[Next: Utils & Constants →](./utils-and-constants.md)
