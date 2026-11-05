# Writing Types: Generics and Event Handler Types

## Generic Components

### When to Use Generics

For components that work with different data types:

```typescript
// For components that handle collections
export type SelectProps<T = string> = {
  options: SelectOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
};

export type SelectOption<T = string> = {
  label: string;
  value: T;
  isDisabled?: boolean;
};
```

### Generic Constraints

```typescript
// With constraints
export type DataTableProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: ColumnDef<T>[];
};

// With default type
export type ListProps<T = unknown> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};
```

## Event Handler Types

### Standard Events

```typescript
import { type MouseEvent, type KeyboardEvent } from "react";

export type InteractiveProps = {
  /**
   * Callback when element is clicked
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback for keyboard events
   */
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
};
```

### Custom Events

```typescript
export type CustomComponentProps = {
  /**
   * Called when selection changes
   */
  onSelectionChange?: (selectedKeys: Set<string>) => void;

  /**
   * Called when value is committed
   */
  onCommit?: (value: string) => void;
};
```
