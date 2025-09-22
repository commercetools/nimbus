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

Avoid This Structure:
component-name/
├── component-name.tsx
├── use-component-logic.ts  # Wrong location!
└── index.ts
```

## File Structure

### Basic Hook Structure

````typescript
// hooks/use-component-name.ts
import { useState, useEffect, useCallback, useMemo } from "react";
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

  // State
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string>();

  // Computed values
  const isValid = useMemo(() => {
    if (!validator) return true;
    return validator(value);
  }, [value, validator]);

  // Callbacks
  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  // Effects
  useEffect(() => {
    // Side effects if needed
  }, [value]);

  return {
    value,
    setValue: handleChange,
    error,
    isValid,
  };
}
````

### Hooks Index File

```typescript
// hooks/index.ts
export { useComponentName } from "./use-component-name";
export { useKeyboardNavigation } from "./use-keyboard-navigation";
export { useComponentState } from "./use-component-state";
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

  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;

  /**
   * Custom validation function
   */
  validator?: (value: string) => boolean;
}

export interface UseComponentNameReturn {
  /**
   * Current value
   */
  value: string;

  /**
   * Set new value
   */
  setValue: (value: string) => void;

  /**
   * Validation error
   */
  error?: string;

  /**
   * Whether value is valid
   */
  isValid: boolean;
}

// hooks/use-internal-processing.ts (INTERNAL HOOK TYPES - colocated)
interface InternalProcessingState {
  processing: boolean;
  cache: Map<string, CacheEntry>;
  retryCount: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
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

  return {
    isOpen,
    open,
    close,
    toggle,
  };
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

        case "ArrowUp":
          if (orientation === "vertical") {
            event.preventDefault();
            setFocusedIndex((prev) => Math.max(prev - 1, 0));
          }
          break;

        case "Enter":
        case " ":
          event.preventDefault();
          onSelect?.(items[focusedIndex]);
          break;

        case "Home":
          event.preventDefault();
          setFocusedIndex(0);
          break;

        case "End":
          event.preventDefault();
          setFocusedIndex(items.length - 1);
          break;
      }
    },
    [items, focusedIndex, onSelect, orientation]
  );

  return {
    focusedIndex,
    handleKeyDown,
    setFocusedIndex,
  };
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

  return {
    data,
    loading,
    error,
    refetch: fetch,
  };
}
```

### Form Validation Hook

```typescript
// hooks/use-form-validation.ts
export function useFormValidation({ rules, values }: UseFormValidationOptions) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (fieldName: string, value: any) => {
      const rule = rules[fieldName];
      if (!rule) return true;

      const error = rule(value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error || "",
      }));

      return !error;
    },
    [rules]
  );

  const validateAll = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(rules).forEach((fieldName) => {
      const error = rules[fieldName](values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, values]);

  const touch = useCallback((fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  return {
    errors,
    touched,
    validate,
    validateAll,
    touch,
    isValid: Object.keys(errors).length === 0,
  };
}
```

## Examples from Nimbus

### RichTextInput Hooks

```typescript
// rich-text-input/hooks/use-formatting-state.ts
export function useFormattingState(editor: Editor) {
  const [activeMarks, setActiveMarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const updateMarks = () => {
      const marks = Editor.marks(editor) || {};
      setActiveMarks(new Set(Object.keys(marks).filter((key) => marks[key])));
    };

    updateMarks();
    // Subscribe to editor changes
  }, [editor]);

  const toggleMark = useCallback(
    (mark: string) => {
      if (activeMarks.has(mark)) {
        Editor.removeMark(editor, mark);
      } else {
        Editor.addMark(editor, mark, true);
      }
    },
    [editor, activeMarks]
  );

  return {
    activeMarks,
    toggleMark,
    isBold: activeMarks.has("bold"),
    isItalic: activeMarks.has("italic"),
  };
}
```

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

  const next = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const previous = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const first = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const last = useCallback(() => {
    goToPage(totalPages);
  }, [totalPages, goToPage]);

  return {
    page,
    goToPage,
    next,
    previous,
    first,
    last,
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
 * @param options.defaultValue - Initial value (default: '')
 * @param options.onChange - Callback when value changes
 * @returns Object containing state and methods
 *
 * @example
 * ```tsx
 * const { value, setValue } = useComponentName({
 *   defaultValue: 'initial',
 *   onChange: (val) => console.log(val)
 * });
 * ```
 *
 * @see {@link https://example.com/docs} for more information
 */
````

## Testing Hooks

Use `@testing-library/react-hooks`:

```typescript
// hooks/use-counter.test.ts
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
