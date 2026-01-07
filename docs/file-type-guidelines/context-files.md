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

**Note:** This is an illustrative example showing context patterns. Accordion in
Nimbus uses React Aria's DisclosureGroup which handles state internally.

```typescript
// Example context pattern (illustrative)
import { createContext, useContext, useState, type ReactNode } from 'react';

type AccordionContextValue = {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

type AccordionProviderProps = {
  children: ReactNode;
  allowMultiple?: boolean;
  defaultExpanded?: string[];
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

For components that extend React Aria with additional functionality, use React
Aria's `Provider` with context slots:

```typescript
// date-picker.custom-context.tsx
import { useContext } from "react";
import {
  Provider,
  ButtonContext,
  DatePickerStateContext,
  TimeFieldContext,
  useSlottedContext,
} from "react-aria-components";
import type { PressEvent, TimeValue } from "react-aria";
import { useLocale } from "react-aria-components";
import { datePickerMessages } from "../date-picker.messages";

/**
 * Custom context wrapper for React Aria DatePicker
 * Extends React Aria contexts with additional slots and functionality
 */
export const DatePickerCustomContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { locale } = useLocale();

  // Access existing React Aria contexts
  const buttonContext = useSlottedContext(ButtonContext) || {};
  const datePickerState = useContext(DatePickerStateContext);
  const noInputValue = datePickerState?.dateValue === null;

  const { timeValue, setTimeValue, granularity } = datePickerState!;
  const isDatePickerDisabled = buttonContext?.isDisabled;

  // Define custom slot configurations
  const buttonSlots = {
    calendarToggle: {
      ...buttonContext,
      onPress: (event: PressEvent) => {
        const activeElement = document?.activeElement as HTMLElement | null;
        if (activeElement) {
          activeElement.blur();
        }
        buttonContext.onPress?.(event);
      },
    },
    clear: {
      onPress: () => datePickerState?.setValue(null),
      "aria-label": datePickerMessages.getVariableLocale("clearInput", locale),
      isDisabled: isDatePickerDisabled,
      style: noInputValue ? { display: "none" } : undefined,
      "aria-hidden": noInputValue ? true : undefined,
    },
  };

  const timeInputSlots = {
    timeInput: {
      value: timeValue,
      onChange: (value: TimeValue | null) => {
        if (value !== null) {
          setTimeValue(value);
        }
      },
      granularity: granularity === "day" ? undefined : granularity,
      "aria-label": datePickerMessages.getVariableLocale("enterTime", locale),
    },
  };

  // Provide enhanced contexts with slots
  return (
    <Provider
      values={[
        [ButtonContext, { slots: buttonSlots }],
        [TimeFieldContext, { slots: timeInputSlots }],
      ]}
    >
      {children}
    </Provider>
  );
};
```

## Context Patterns

### Basic State Sharing

```typescript
// menu-context.tsx
import { createContext, useContext } from "react";
import type { MenuRootProps } from "./menu.types";
import type { MenuTriggerProps as RaMenuTriggerProps } from "react-aria-components";

// Context contains Menu props (excluding MenuTrigger-specific props)
export type MenuContextValue = Omit<
  MenuRootProps,
  keyof RaMenuTriggerProps | "children" | "trigger"
>;

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export const MenuProvider = MenuContext.Provider;

/**
 * Hook to access menu context
 * Note: Returns undefined if used outside MenuProvider (optional pattern)
 */
export const useMenuContext = () => {
  const context = useContext(MenuContext);
  return context;
};
```

### Controlled/Uncontrolled Pattern

```typescript
// tabs-context.tsx
import { createContext, useState, type ReactNode } from "react";

type TabsContextValue = {
  selectedTab: string;
  setSelectedTab: (id: string) => void;
  orientation: 'horizontal' | 'vertical';
}

type TabsProviderProps = {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

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

For components with complex state, keep context simple and move business logic
to the component implementation:

```typescript
// data-table-context.tsx
import { createContext, useContext } from "react";
import type { DataTableContextValue } from "../data-table.types";

export const DataTableContext = createContext<DataTableContextValue<
  Record<string, unknown>
> | null>(null);

DataTableContext.displayName = "DataTableContext";

/**
 * Hook to access data table context
 * @throws Error if used outside DataTable.Root
 */
export const useDataTableContext = <
  T extends object = Record<string, unknown>,
>(): DataTableContextValue<T> => {
  const context = useContext(
    DataTableContext
  ) as DataTableContextValue<T> | null;

  if (!context) {
    throw new Error("DataTable components must be used within DataTable.Root");
  }

  return context;
};
```

**Note:** Complex data processing (filtering, sorting, pagination) is typically
handled in the component implementation or via external libraries like TanStack
Table, not in the context provider.

## Hook Pattern for Context

### Basic Hook (with error throwing)

Use this pattern when context **must** be present:

```typescript
import { useContext } from "react";

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

### Optional Hook (without error throwing)

Use this pattern when context is **optional** or has sensible defaults:

```typescript
import { useContext } from "react";

/**
 * Hook to access component context
 * Returns undefined if used outside provider
 */
export function useComponentContext() {
  const context = useContext(ComponentContext);
  return context; // Can be undefined
}
```

### Hook with Selector (Advanced)

For performance optimization with large contexts:

```typescript
import { useContext } from "react";

type ComponentContextValue = {
  isOpen: boolean;
  data: any[];
  // ... other values
};

/**
 * Hook with optional selector for performance
 */
export function useComponentContext<T = ComponentContextValue>(
  selector?: (context: ComponentContextValue) => T
): T {
  const context = useContext(ComponentContext);

  if (context === undefined) {
    throw new Error(
      "useComponentContext must be used within ComponentProvider"
    );
  }

  return selector ? selector(context) : (context as T);
}

// Usage - select only what you need
const isOpen = useComponentContext((ctx) => ctx.isOpen);
const fullContext = useComponentContext();
```

## Integration with Components

### Root Component Integration

Illustrative example of how a root component might integrate a context provider:

```typescript
// components/accordion.root.tsx (illustrative example)
import { AccordionProvider } from '../accordion-context';
import { AccordionRootSlot } from '../accordion.slots';
import type { AccordionRootProps } from '../accordion.types';

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

Illustrative example of how a child component might consume context:

```typescript
// components/accordion.item.tsx (illustrative example)
import { useAccordionContext } from '../accordion-context';
import { AccordionItemSlot } from '../accordion.slots';
import type { AccordionItemProps } from '../accordion.types';

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

## Performance Considerations

### Memoize Context Value

```typescript
import { useMemo, useState, type ReactNode } from "react";

// ✅ Good - memoized value
export function Provider({
  children,
  ...props
}: {
  children: ReactNode;
}) {
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

## Related Guidelines

- [Compound Components](./compound-components.md) - Using context in compound
  components
- [Hooks](./hooks.md) - Context hooks
- [Architecture Decisions](./architecture-decisions.md) - When to use context

## Validation Checklist

- [ ] Context file with appropriate naming pattern (`{component}-context.tsx` or
      `{component}.custom-context.tsx`)
- [ ] Provider component exported
- [ ] Hook for accessing context
- [ ] Error handling in hook (optional - throw if context must be present,
      return undefined if optional)
- [ ] Context value memoized (when appropriate for performance)
- [ ] TypeScript interfaces defined
- [ ] JSDoc documentation for context and hooks
- [ ] Controlled/uncontrolled support (if applicable)
- [ ] Integration with root component (if applicable)
- [ ] All imports included in code examples
- [ ] Performance optimizations considered

---

[← Back to Index](../component-guidelines.md) |
[Previous: Utils & Constants](./utils-and-constants.md) |
[Next: Architecture Decisions →](./architecture-decisions.md)
