# Context Files Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Utils & Constants](./utils-and-constants.md) |
[Next: Architecture Decisions →](./architecture-decisions.md)

## Purpose

Context files (`{component-name}-context.tsx` or
`{component-name}.custom-context.tsx`) provide React Context for sharing state
and functionality between component parts, especially in compound components and
complex compositions.

## When to Use

### Create Context When:

- **State needs sharing** between compound component parts
- **Complex coordination** required between components
- **React Aria context** needs custom wrapper
- **Provider pattern** needed for configuration
- **Cross-component communication** without prop drilling

### DON'T Create Context When:

- Simple props suffice
- State is local to one component
- React Aria handles state automatically
- Over-engineering simple components

## File Patterns

### Standard Context Pattern

```typescript
// accordion-context.tsx
import { createContext, useContext, useState } from 'react';

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(
  undefined
);

/**
 * Provider for accordion state management
 */
export function AccordionProvider({
  children,
  allowMultiple = false,
  defaultExpanded = [],
}: AccordionProviderProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }

      return next;
    });
  };

  return (
    <AccordionContext.Provider
      value={{
        expandedItems,
        toggleItem,
        allowMultiple,
      }}
    >
      {children}
    </AccordionContext.Provider>
  );
}

/**
 * Hook to access accordion context
 * @throws Error if used outside AccordionProvider
 */
export function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (context === undefined) {
    throw new Error(
      'useAccordionContext must be used within an AccordionProvider'
    );
  }

  return context;
}
```

### Custom React Aria Context

```typescript
// date-picker.custom-context.tsx
import { DatePickerStateProvider } from 'react-aria-components';
import { useDatePickerState } from 'react-stately';
import type { DatePickerCustomContextProps } from './date-picker.types';

/**
 * Custom context wrapper for React Aria DatePicker
 * Provides additional state management on top of React Aria
 */
export function DatePickerCustomContext({
  children,
  value,
  onChange,
  minDate,
  maxDate,
  locale = 'en-US',
  ...props
}: DatePickerCustomContextProps) {
  // Use React Aria state
  const state = useDatePickerState({
    value,
    onChange,
    minValue: minDate,
    maxValue: maxDate,
    ...props,
  });

  // Add custom logic
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [highlightedDate, setHighlightedDate] = useState<Date>();

  // Custom methods
  const goToToday = () => {
    state.setValue(new Date());
    setHighlightedDate(new Date());
  };

  const clearDate = () => {
    state.setValue(null);
    setHighlightedDate(undefined);
  };

  return (
    <DatePickerStateProvider value={state}>
      <DatePickerCustomContextProvider
        value={{
          isCalendarOpen,
          setIsCalendarOpen,
          highlightedDate,
          setHighlightedDate,
          goToToday,
          clearDate,
          locale,
        }}
      >
        {children}
      </DatePickerCustomContextProvider>
    </DatePickerStateProvider>
  );
}
```

## Context Patterns

### Basic State Sharing

```typescript
// menu-context.tsx
interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeItem?: string;
  setActiveItem: (id: string) => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>();

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
```

### Controlled/Uncontrolled Pattern

```typescript
// tabs-context.tsx
interface TabsContextValue {
  selectedTab: string;
  setSelectedTab: (id: string) => void;
  orientation: 'horizontal' | 'vertical';
}

export function TabsProvider({
  children,
  value,
  defaultValue = '',
  onChange,
  orientation = 'horizontal',
}: TabsProviderProps) {
  // Support both controlled and uncontrolled
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const selectedTab = isControlled ? value : internalValue;

  const setSelectedTab = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <TabsContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        orientation,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}
```

### Complex State Management

```typescript
// data-table-context.tsx
interface DataTableContextValue {
  data: any[];
  columns: ColumnDef[];
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  selection: SelectionState;
  setSelection: (selection: SelectionState) => void;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
  filters: FilterState[];
  setFilters: (filters: FilterState[]) => void;
}

export function DataTableProvider({
  children,
  data,
  columns,
  enableSorting = true,
  enableSelection = false,
  enablePagination = true,
  enableFilters = false,
}: DataTableProviderProps) {
  // Multiple state management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selection, setSelection] = useState<SelectionState>(new Set());
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<FilterState[]>([]);

  // Computed values
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (enableFilters && filters.length > 0) {
      result = applyFilters(result, filters);
    }

    // Apply sorting
    if (enableSorting && sorting.length > 0) {
      result = applySorting(result, sorting);
    }

    // Apply pagination
    if (enablePagination) {
      const start = pagination.pageIndex * pagination.pageSize;
      result = result.slice(start, start + pagination.pageSize);
    }

    return result;
  }, [data, filters, sorting, pagination, enableFilters, enableSorting, enablePagination]);

  return (
    <DataTableContext.Provider
      value={{
        data: processedData,
        columns,
        sorting,
        setSorting: enableSorting ? setSorting : noop,
        selection,
        setSelection: enableSelection ? setSelection : noop,
        pagination,
        setPagination: enablePagination ? setPagination : noop,
        filters,
        setFilters: enableFilters ? setFilters : noop,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
}
```

## Hook Pattern for Context

### Basic Hook

```typescript
/**
 * Hook to access component context
 * @throws Error if used outside provider
 */
export function useComponentContext() {
  const context = useContext(ComponentContext);

  if (context === undefined) {
    throw new Error(
      "useComponentContext must be used within ComponentProvider"
    );
  }

  return context;
}
```

### Hook with Selector

```typescript
/**
 * Hook with optional selector for performance
 */
export function useComponentContext<T>(
  selector?: (context: ComponentContextValue) => T
): T | ComponentContextValue {
  const context = useContext(ComponentContext);

  if (context === undefined) {
    throw new Error(
      "useComponentContext must be used within ComponentProvider"
    );
  }

  return selector ? selector(context) : context;
}

// Usage
const isOpen = useComponentContext((ctx) => ctx.isOpen);
```

## Integration with Components

### Root Component Integration

```typescript
// components/accordion.root.tsx
import { AccordionProvider } from '../accordion-context';

export const AccordionRoot = (props: AccordionRootProps) => {
  const {
    children,
    allowMultiple,
    defaultExpanded,
    ...restProps
  } = props;

  return (
    <AccordionProvider
      allowMultiple={allowMultiple}
      defaultExpanded={defaultExpanded}
    >
      <AccordionRootSlot {...restProps}>
        {children}
      </AccordionRootSlot>
    </AccordionProvider>
  );
};
```

### Child Component Usage

```typescript
// components/accordion.item.tsx
import { useAccordionContext } from '../accordion-context';

export const AccordionItem = (props: AccordionItemProps) => {
  const { id, children } = props;
  const { expandedItems, toggleItem } = useAccordionContext();

  const isExpanded = expandedItems.has(id);

  return (
    <AccordionItemSlot data-expanded={isExpanded}>
      {children}
    </AccordionItemSlot>
  );
};
```

## File Naming Patterns

### Standard Context

```
component-name-context.tsx     // Most common
component-name.context.tsx      // Alternative
```

### Custom React Aria Context

```
component-name.custom-context.tsx  // For React Aria wrappers
```

### Provider Components

```
component-name-provider.tsx    // Standalone provider
```

## Examples from Nimbus

### Accordion Context

```typescript
// accordion-context.tsx
export function AccordionProvider({
  children,
  allowMultiple = false,
}: AccordionProviderProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }, [allowMultiple]);

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      {children}
    </AccordionContext.Provider>
  );
}
```

### Form Field Context

```typescript
// form-field-context.tsx
interface FormFieldContextValue {
  id: string;
  isRequired: boolean;
  isInvalid: boolean;
  isDisabled: boolean;
  errorMessage?: string;
}

export const FormFieldProvider = ({
  children,
  ...props
}: FormFieldProviderProps) => {
  const id = useId();

  return (
    <FormFieldContext.Provider
      value={{
        id,
        isRequired: props.isRequired || false,
        isInvalid: props.isInvalid || false,
        isDisabled: props.isDisabled || false,
        errorMessage: props.errorMessage,
      }}
    >
      {children}
    </FormFieldContext.Provider>
  );
};
```

## Performance Considerations

### Memoize Context Value

```typescript
// ✅ Good - memoized value
export function Provider({ children, ...props }) {
  const [state, setState] = useState();

  const value = useMemo(
    () => ({
      state,
      setState,
      // other values
    }),
    [state] // Only recreate when state changes
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

```

### Split Contexts

```typescript
// Split read and write contexts for performance
const StateContext = createContext();
const DispatchContext = createContext();

export function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export const useState = () => useContext(StateContext);
export const useDispatch = () => useContext(DispatchContext);
```


## Related Guidelines

- [Compound Components](./compound-components.md) - Using context in compound
  components
- [Hooks](./hooks.md) - Context hooks
- [Architecture Decisions](./architecture-decisions.md) - When to use context

## Validation Checklist

- [ ] Context file with appropriate naming pattern
- [ ] Provider component exported
- [ ] Hook for accessing context
- [ ] Error handling in hook
- [ ] Context value memoized
- [ ] TypeScript interfaces defined
- [ ] JSDoc documentation
- [ ] Controlled/uncontrolled support (if applicable)
- [ ] Integration with root component
- [ ] Performance optimizations considered

---

[← Back to Index](../component-guidelines.md) |
[Previous: Utils & Constants](./utils-and-constants.md) |
[Next: Architecture Decisions →](./architecture-decisions.md)
