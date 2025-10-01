# Type Definitions Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Main Component](./main-component.md) |
[Next: Stories →](./stories.md)

## Purpose

Type definition files (`{component-name}.types.ts`) contain the **public API
contract** for a component - interfaces and types intended for consumer use.
They ensure type safety and provide clear contracts for component APIs, while
keeping implementation details encapsulated.

## When to Use

**Always required** - Every component must have a types file that defines:

- Component props interfaces (public API)
- Variant and option types (consumed by users)
- Shared/reusable types across component parts

**Note:** Hook types can be defined either in the component's types file or
colocated in the hook file itself, depending on whether the hook is primarily
an internal implementation detail or a public API exported for consumers.

## Type Visibility and Organization

### Public API Types (in {component-name}.types.ts)

Types that component **consumers** need to import and use:

```typescript
// ✅ These belong in component-name.types.ts
export interface ComponentNameProps {
  // Props that users will pass to the component
}

export interface UseComponentNameOptions {
  // Options for a public hook that users can import
}

export interface UseComponentNameReturn {
  // Return type for a public hook
}

export type ComponentVariant = "solid" | "outline" | "ghost";
// Variants that users specify
```

**Characteristics of Public API Types:**

- Imported by component consumers
- Referenced in component documentation
- Part of the component's external contract
- Changes require semver consideration

### Internal Implementation Types (colocated)

Types used only within component implementation should be defined where they're
used:

```typescript
// ✅ In utils/sanitize-svg.ts
interface SanitizationOptions {
  allowStyles?: boolean;
  forbiddenAttributes?: string[];
  // Only used by sanitization utility
}

// ✅ In hooks/use-internal-state.ts
interface InternalHookState {
  processing: boolean;
  cache: Map<string, any>;
  // Only used within this hook
}

// ✅ In components/component-internal.tsx
interface InternalComponentState {
  // Private component state
}
```

**Characteristics of Internal Types:**

- Never imported by consumers
- Implementation details
- Can change without affecting users
- Colocated with their usage for better maintainability

## File Structure

### Basic Props Interface

```typescript
// component-name.types.ts
import { type ComponentNameSlotProps } from "./component-name.slots";

export interface ComponentNameProps extends ComponentNameSlotProps {
  /**
   * Component-specific prop
   * @default "default"
   */
  customProp?: string;

  /**
   * Whether the component is disabled
   * @default false
   */
  isDisabled?: boolean;
}
```

### Multiple Interface Pattern

```typescript
// menu.types.ts
import { type MenuRootSlotProps, type MenuTriggerSlotProps, type MenuItemSlotProps } from "./menu.slots";

// Main component props - extends slot props and includes configuration
export interface MenuRootProps extends MenuRootSlotProps {
  /**
   * Controlled open state
   */
  isOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Default open state for uncontrolled usage
   */
  defaultOpen?: boolean;
}

// Sub-component props - extend slot props
export interface MenuTriggerProps extends MenuTriggerSlotProps {
  // Component-specific props only
}

// Item props
export interface MenuItemProps extends MenuItemSlotProps {
  /**
   * Unique value for the menu item
   */
  value: string;

  /**
   * Whether the item is disabled
   */
  isDisabled?: boolean;
}

// Public hook types (only if hook is exported for consumers)
export interface UseMenuReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
```

## Naming Conventions

### Props Interfaces

Follow these patterns consistently:

| Component Type | Pattern                      | Example           |
| -------------- | ---------------------------- | ----------------- |
| Main props     | `{ComponentName}Props`       | `ButtonProps`     |
| Slot props     | `{ComponentName}SlotProps`   | `ButtonSlotProps` |
| Root props     | `{ComponentName}RootProps`   | `MenuRootProps`   |
| Sub-component  | `{ComponentName}{Part}Props` | `MenuItemProps`   |

### Type Exports

```typescript
// ✅ Component-specific types (not recipe variants)
export type NotificationPosition = "top" | "bottom" | "center";
export type DataFetchStatus = "idle" | "loading" | "success" | "error";

// ✅ Interface exports
export interface ButtonProps {
  /* ... */
}

// ✅ Hook return types
export interface UseButtonReturn {
  /* ... */
}

// Note: Recipe variants (variant, size, tone) are automatically inherited
// when extending slot props - no explicit declarations needed
```

## Extending Base Interfaces

### HTML Element Props

```typescript
import { type ButtonSlotProps } from "./button.slots";

// ✅ For components with slots - extend slot props
export interface ButtonProps extends ButtonSlotProps {
  // Component-specific props only
  isLoading?: boolean;
}

// ✅ For components with slots - extend slot props
export interface BadgeProps extends BadgeSlotProps {
  // Component-specific props only
}
```

### Chakra UI Props

```typescript
import { type BoxSlotProps } from "./box.slots";

// For components with slots - extend slot props
export interface BoxProps extends BoxSlotProps {
  // Component-specific props only
}
```

### Recipe Variant Props

**Recipe variants are automatically inherited through slot props:**

Slot props automatically include recipe variants through Chakra UI's `RecipeProps`
type. When your component props interface extends a slot props interface, it
inherits all recipe variants (like `variant`, `size`, `tone`) without needing
explicit declarations.

```typescript
import { type ButtonSlotProps } from "./button.slots";

// ✅ Good - extends slot props (which automatically include recipe variants)
// ButtonSlotProps extends RecipeProps<"button">, so ButtonProps inherits
// all recipe variants like variant, size, tone, etc.
export interface ButtonProps extends ButtonSlotProps {
  // Component-specific props only
  isLoading?: boolean;
}

// ✅ For compound components - configuration on root
export interface MenuRootProps extends MenuRootSlotProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

// ✅ Sub-components extend slot props
export interface MenuTriggerProps extends MenuTriggerSlotProps {
  // Component-specific props only
}
```

**Exception - Functional Overlap:**

When a property affects both styling AND component behavior:

```typescript
export interface TabsProps extends TabsSlotProps {
  /**
   * Tab orientation - affects both layout AND keyboard navigation
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
}
```

## JSDoc Documentation

### Required Documentation

**JSDoc is required for every property within interfaces and types**, but JSDoc
on the interface/type definition itself is optional:

```typescript
// JSDoc on the interface definition is optional (but recommended for complex interfaces)
export interface ButtonProps extends ButtonSlotProps {
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Icon to display before the button text
   * @example <Icon name="add" />
   */
  startIcon?: React.ReactNode;
}

// For complex or public-facing interfaces, JSDoc is still valuable:
/**
 * Configuration options for the usePagination hook
 * @see {@link usePagination} for usage examples
 */
export interface UsePaginationOptions {
  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Current active page
   * @default 1
   */
  currentPage?: number;
}
```

### Documentation Standards

- **Required:** JSDoc comments for every property within interfaces/types
- **Optional:** JSDoc comments for the interface/type definition itself
- Add `@default` tag for props with defaults
- Use `@example` for complex props
- Add `@deprecated` for legacy props
- Include `@see` for related documentation
- Consider adding interface-level JSDoc comments when:
  - The interface is complex or has non-obvious usage
  - It's part of a public API
  - Additional context would help developers

## Generic Components

### When to Use Generics

Consider generics for components that work with different data types:

```typescript
// For components that handle collections
export interface SelectProps<T = string> {
  options: SelectOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  isDisabled?: boolean;
}
```

### Generic Constraints

```typescript
// With constraints
export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
}

// With default type
export interface ListProps<T = unknown> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}
```

## Event Handler Types

### Standard Events

```typescript
import { type MouseEvent, type KeyboardEvent } from "react";

export interface InteractiveProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
}
```

### Custom Events

```typescript
export interface CustomComponentProps {
  /**
   * Called when selection changes
   */
  onSelectionChange?: (selectedKeys: Set<string>) => void;

  /**
   * Called when value is committed
   */
  onCommit?: (value: string) => void;
}
```

## Common Patterns from Nimbus

### Simple Component (Button)

```typescript
// button.types.ts
import { type ButtonSlotProps } from "./button.slots";

export interface ButtonProps extends ButtonSlotProps {
  /**
   * Loading state
   */
  isLoading?: boolean;
}
```

### Compound Component (Menu)

```typescript
// menu.types.ts
import { type MenuRootSlotProps, type MenuItemSlotProps } from "./menu.slots";

// Root component handles configuration and state
export interface MenuRootProps extends MenuRootSlotProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
}

// Sub-components extend slot props but don't configure variants
export interface MenuItemProps extends MenuItemSlotProps {
  id: string;
  onAction?: () => void;
}
```

### Complex Component (DatePicker)

```typescript
// date-picker.types.ts
export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  format?: string;
}

export interface UseDatePickerOptions {
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

export interface UseDatePickerReturn {
  value: Date | undefined;
  setValue: (date: Date) => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}
```


## Related Guidelines

- [Main Component](./main-component.md) - Using types in components
- [Hooks](./hooks.md) - Hook return type patterns
- [Recipes](./recipes.md) - Recipe variant types

## Validation Checklist

- [ ] Types file exists with `.ts` extension
- [ ] **Only consumer-facing types in `{component-name}.types.ts`**
- [ ] **Internal types colocated with their usage**
- [ ] All public props interfaces exported
- [ ] Props follow naming convention (`{ComponentName}Props`)
- [ ] Extends appropriate base interface (slot props for recipe-based components)
- [ ] **Recipe variants automatically inherited through slot props (not explicit)**
- [ ] **Explicit variant declarations only when functional overlap exists**
- [ ] **JSDoc comments for all properties within interfaces/types**
- [ ] JSDoc comments for interfaces/types when they are complex or public-facing
      (optional)
- [ ] Default values documented with `@default`
- [ ] Event handlers properly typed
- [ ] Generic types used appropriately
- [ ] No inline complex types
- [ ] **No implementation details leaked in public API types**

---

[← Back to Index](../component-guidelines.md) |
[Previous: Main Component](./main-component.md) |
[Next: Stories →](./stories.md)
