# Type Definitions Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Main Component](./main-component.md) |
[Next: Stories →](./stories.md)

## Purpose

Type definition files (`{component-name}.types.ts`) contain the **public API
contract** for a component - interfaces and types intended for consumer use.
They ensure type safety and provide clear contracts for component APIs, while
keeping implementation details encapsulated.

All types files follow a consistent, layered architecture that makes them
discoverable, maintainable, and self-documenting. This architecture enables
`react-docgen-typescript` to extract comprehensive API documentation for the
Nimbus documentation site.

## When to Use

**Always required** - Every component must have a types file that defines:

- Component props types (public API)
- Variant and option types (consumed by users)
- Shared/reusable types across component parts

**Note:** Hook types can be defined either in the component's types file or
colocated in the hook file itself, depending on whether the hook is primarily an
internal implementation detail or a public API exported for consumers.

## Core Architecture

### The Universal Four-Layer Pattern

Every Nimbus component type follows this consistent layered architecture:

```typescript
// Layer 1: Recipe Props (Styling Variants)
type ComponentRecipeProps = {
  size?: RecipeProps<"component">["size"];
  variant?: RecipeProps<"component">["variant"];
} & UnstyledProp;

// Layer 2: Slot Props (Chakra Foundation)
type ComponentRootSlotProps = HTMLChakraProps<"element", ComponentRecipeProps>;

// Layer 3: Helper Types (when needed - for complex components)
type ConflictingProps = keyof AriaProps;
type ExcludedProps = "css" | "colorScheme";

// Layer 4: Main Props (Public API)
export type ComponentProps = Omit<
  ComponentRootSlotProps,
  ConflictingProps | ExcludedProps
> &
  AriaProps & {
    ref?: React.Ref<HTMLElement>;
    customProp?: string;
  };
```

**Key Principle:** Slot props are ALWAYS the foundation. Never build props from
scratch.

## Type Visibility and Organization

### Public API Types (in {component-name}.types.ts)

Types that component **consumers** need to import and use:

```typescript
// ✅ These belong in component-name.types.ts
export type ComponentNameProps = {
  // Props that users will pass to the component
};

export type UseComponentNameOptions = {
  // Options for a public hook that users can import
};

export type UseComponentNameReturn = {
  // Return type for a public hook
};

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
type SanitizationOptions = {
  allowStyles?: boolean;
  forbiddenAttributes?: string[];
  // Only used by sanitization utility
};

// ✅ In hooks/use-internal-state.ts
type InternalHookState = {
  processing: boolean;
  cache: Map<string, any>;
  // Only used within this hook
};

// ✅ In components/component-internal.tsx
type InternalComponentState = {
  // Private component state
};
```

**Characteristics of Internal Types:**

- Never imported by consumers
- Implementation details
- Can change without affecting users
- Colocated with their usage for better maintainability

## Component Tiers

Components are classified into four tiers based on complexity. Understanding
your component's tier helps determine the appropriate type structure.

### Tier 1: Simple Components

**Examples:** Button, Avatar, Separator, Icon, Badge

**Characteristics:**

- Single props type
- 2-3 type layers
- Standard recipe (or no recipe)
- Minimal composition

**Type Structure:** `RecipeProps → RootSlotProps → MainProps`

**Files:** ~10-30 lines of types

### Tier 2: Slot-Based Components

**Examples:** TextInput, NumberInput, MoneyInput, PasswordInput, SearchInput

**Characteristics:**

- Multiple slot prop types for internal elements
- Slot recipe for multi-element styling
- React Aria integration
- Support for leading/trailing elements

**Type Structure:** `RecipeProps → Multiple SlotProps → MainProps`

**Slot Pattern:**

- `RootSlotProps` - Container element
- `InputSlotProps` - Input element
- `LeadingElementSlotProps` - Start decoration
- `TrailingElementSlotProps` - End decoration

**Files:** ~50-100 lines of types

### Tier 3: Compound Components

**Examples:** Menu, Dialog, Card, Tabs, Accordion, Tooltip

**Characteristics:**

- Multiple sub-component prop types
- Slot recipe with context
- Root component handles configuration
- Each part follows Tier 1/2 patterns

**Type Structure:** `RootSlotProps (with recipe) + Multiple SubComponentProps`

**Naming Pattern:**

- Root: `{Component}RootProps`
- Parts: `{Component}{Part}Props` (e.g., `MenuTriggerProps`,
  `DialogContentProps`)

**Files:** ~100-200 lines of types

### Tier 4: Complex Compositions

**Examples:** DataTable, DatePicker, Pagination, ComboBox, RichTextInput

**Characteristics:**

- All Tier 3 features plus:
- Context types for state sharing
- Generic types for data structures
- Multiple helper types
- Extensive conflict resolution

**Type Structure:** `All of above + ContextValue + Helper types + Generics`

**Additional Patterns:**

- Generic types: `<T extends object>`
- Context value types
- Helper types (SortDescriptor, ColumnItem, etc.)

**Files:** ~200-400 lines of types

## File Structure

### Standard Section Organization

Every types file follows this sequential reading order for maximum clarity:

```typescript
// Start directly with imports (no file-level JSDoc preamble)
import type {
  HTMLChakraProps,
  RecipeProps,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================
// Styling variants (size, variant, colorPalette, etc.)
// Only present when component has custom styling recipes

// ============================================================
// SLOT PROPS
// ============================================================
// Chakra HTML props for each visual element in the component
// Root slot props always present, additional slots for multi-element components

// ============================================================
// HELPER TYPES (when needed)
// ============================================================
// Explicit documentation of props that conflict between libraries
// Utility types, generic constraints, context values
// Only present in Tier 3/4 components

// ============================================================
// MAIN PROPS
// ============================================================
// Public API with comprehensive JSDoc on every property
// Sub-component props for compound components
```

### Basic Props Type (Tier 1)

```typescript
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type ButtonRecipeProps = {
  /**
   * Size variant of the button
   * @default "md"
   */
  size?: RecipeProps<"button">["size"];
  /**
   * Visual style variant of the button
   * @default "solid"
   */
  variant?: RecipeProps<"button">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ButtonRootSlotProps = HTMLChakraProps<"button", ButtonRecipeProps>;

// ============================================================
// MAIN PROPS
// ============================================================

export type ButtonProps = ButtonRootSlotProps & {
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
};
```

### Compound Component Pattern (Tier 3)

```typescript
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type {
  MenuProps as RaMenuProps,
  MenuItemProps as RaMenuItemProps,
} from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type MenuRecipeProps = SlotRecipeProps<"menu">;

// ============================================================
// SLOT PROPS
// ============================================================

export type MenuRootSlotProps = HTMLChakraProps<"div", MenuRecipeProps>;
export type MenuTriggerSlotProps = HTMLChakraProps<"button">;
export type MenuContentSlotProps = HTMLChakraProps<"div">;
export type MenuItemSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Menu.Root component.
 * Provides context and configuration for the entire menu.
 */
export type MenuRootProps = MenuRootSlotProps & {
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
   * @default false
   */
  defaultOpen?: boolean;
};

/**
 * Props for the Menu.Trigger component.
 */
export type MenuTriggerProps = MenuTriggerSlotProps & {
  /**
   * Reference to the button element
   */
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Props for the Menu.Item component.
 */
export type MenuItemProps = MenuItemSlotProps &
  RaMenuItemProps & {
    /**
     * Unique value for the menu item
     */
    value: string;

    /**
     * Whether the item is disabled
     * @default false
     */
    isDisabled?: boolean;

    /**
     * Reference to the item element
     */
    ref?: React.Ref<HTMLDivElement>;
  };
```

### Complex Component Pattern (Tier 4)

```typescript
import type { ReactNode } from "react";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type DataTableRecipeProps = {
  /**
   * Density variant controlling row height and padding
   * @default "default"
   */
  density?: SlotRecipeProps<"dataTable">["density"];
  /**
   * Whether to truncate cell content with ellipsis
   * @default false
   */
  truncated?: SlotRecipeProps<"dataTable">["truncated"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type DataTableRootSlotProps = HTMLChakraProps<
  "div",
  DataTableRecipeProps
>;
export type DataTableTableSlotProps = HTMLChakraProps<"table">;
// ... additional slot props

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * Sort direction from React Aria.
 */
export type SortDirection = "ascending" | "descending";

/**
 * Sort descriptor defining which column and direction to sort by.
 */
export type SortDescriptor = {
  column: string;
  direction: SortDirection;
};

/**
 * Column item configuration defining structure and behavior.
 */
export type DataTableColumnItem<T extends object = Record<string, unknown>> = {
  /** Unique identifier for the column */
  id: string;
  /** Header content */
  header: ReactNode;
  /** Function to extract cell value */
  accessor: (row: T) => ReactNode;
  // ... additional properties
};

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Main props for the DataTable component.
 */
export type DataTableProps<T extends object = Record<string, unknown>> =
  DataTableRootSlotProps & {
    /** Column configuration array */
    columns: DataTableColumnItem<T>[];
    /** Row data array */
    data: T[];
    // ... additional properties
  };
```

## Naming Conventions

All naming follows these exact patterns for maximum consistency:

| Type Category           | Pattern                      | Example                        |
| ----------------------- | ---------------------------- | ------------------------------ |
| **Recipe Props**        | `{Component}RecipeProps`     | `ButtonRecipeProps`            |
| **Slot Props (Root)**   | `{Component}RootSlotProps`   | `MenuRootSlotProps`            |
| **Slot Props (Parts)**  | `{Component}{Part}SlotProps` | `MenuTriggerSlotProps`         |
| **Main Props**          | `{Component}Props`           | `ButtonProps`                  |
| **Sub-component Props** | `{Component}{Part}Props`     | `MenuTriggerProps`             |
| **React Aria Imports**  | `Ra{Component}` prefix       | `RaButton`, `RaMenuProps`      |
| **Helper Types**        | `Excluded{Component}Props`   | `ExcludedNumberInputProps`     |
| **Utility Types**       | Descriptive names            | `SortDescriptor`, `ColumnItem` |
| **Context Values**      | `{Component}ContextValue`    | `DataTableContextValue`        |

### Import Naming Convention

**Always prefix React Aria imports with "Ra":**

```typescript
// ✅ Correct
import { Button as RaButton } from "react-aria-components";
import { MenuProps as RaMenuProps } from "react-aria-components";
import { TextFieldProps as RaTextFieldProps } from "react-aria-components";

// ❌ Incorrect
import { Button } from "react-aria-components";
import { MenuProps } from "react-aria-components";
```

### Type Exports

```typescript
// ✅ Component-specific types (not recipe variants)
export type NotificationPosition = "top" | "bottom" | "center";
export type DataFetchStatus = "idle" | "loading" | "success" | "error";

// ✅ Type exports
export type ButtonProps = {
  /* ... */
};

// ✅ Hook return types
export type UseButtonReturn = {
  /* ... */
};

// Note: Recipe variants (variant, size, colorPalette) are automatically inherited
// when extending slot props - no explicit declarations needed
```

## Extending Base Types

### HTML Element Props

```typescript
import { type ButtonSlotProps } from "./button.slots";

// ✅ For components with slots - extend slot props
export type ButtonProps = ButtonSlotProps & {
  // Component-specific props only
  isLoading?: boolean;
};

// ✅ For components with slots - extend slot props
export type BadgeProps = BadgeSlotProps & {
  // Component-specific props only
};
```

### Chakra UI Props

```typescript
import { type BoxSlotProps } from "./box.slots";

// For components with slots - extend slot props
export type BoxProps = BoxSlotProps & {
  // Component-specific props only
};
```

### Recipe Variant Props

**Recipe variants are automatically inherited through slot props:**

Slot props automatically include recipe variants through Chakra UI's
`RecipeProps` type. When your component props type extends a slot props type, it
inherits all recipe variants (like `variant`, `size`, `colorPalette`) without
needing explicit declarations.

```typescript
import { type ButtonSlotProps } from "./button.slots";

// ✅ Good - extends slot props (which automatically include recipe variants)
// ButtonSlotProps extends RecipeProps<"button">, so ButtonProps inherits
// all recipe variants like variant, size, colorPalette, etc.
export type ButtonProps = ButtonSlotProps & {
  // Component-specific props only
  isLoading?: boolean;
};

// ✅ For compound components - configuration on root
export type MenuRootProps = MenuRootSlotProps & {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

// ✅ Sub-components extend slot props
export type MenuTriggerProps = MenuTriggerSlotProps & {
  // Component-specific props only
};
```

**Exception - Functional Overlap:**

When a property affects both styling AND component behavior:

```typescript
export type TabsProps = TabsSlotProps & {
  /**
   * Tab orientation - affects both layout AND keyboard navigation
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
};
```

## JSDoc Documentation

### Required Documentation

**JSDoc is required for every property within types**:

```typescript
import type { ButtonSlotProps } from "./button.slots";

export type ButtonProps = ButtonSlotProps & {
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
};

// For complex or public-facing types, JSDoc is still valuable:
/**
 * Configuration options for the usePagination hook
 * @see {@link usePagination} for usage examples
 */
export type UsePaginationOptions = {
  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Current active page
   * @default 1
   */
  currentPage?: number;
};
```

### Documentation Standards

- **No file-level JSDoc preambles** - Types files start directly with imports
- **Required:** JSDoc comments for every property within types
- **Optional:** JSDoc comments on individual type definitions
- Add `@default` tag for props with defaults (especially recipe props)
- Use `@example` for complex props
- Add `@deprecated` for legacy props
- Include `@see` for related documentation
- Consider adding type-level JSDoc comments when:
  - The type is complex or has non-obvious usage
  - It's part of a public API
  - Additional context would help developers

## Generic Components

### When to Use Generics

Consider generics for components that work with different data types:

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
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
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

## Common Patterns from Nimbus

### Simple Component (Button - Tier 1)

```typescript
// button.types.ts
import { type ButtonSlotProps } from "./button.slots";

export type ButtonProps = ButtonSlotProps & {
  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Reference to the button element
   */
  ref?: React.Ref<HTMLButtonElement>;
};
```

### Compound Component (Menu - Tier 3)

```typescript
// menu.types.ts
import { type MenuRootSlotProps, type MenuItemSlotProps } from "./menu.slots";

// Root component handles configuration and state
export type MenuRootProps = MenuRootSlotProps & {
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
   * @default false
   */
  defaultOpen?: boolean;
};

// Sub-components extend slot props but don't configure variants
export type MenuItemProps = MenuItemSlotProps & {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Callback when item is activated
   */
  onAction?: () => void;

  /**
   * Reference to the item element
   */
  ref?: React.Ref<HTMLDivElement>;
};
```

### Complex Component (DatePicker - Tier 4)

```typescript
// date-picker.types.ts
export type DatePickerProps = {
  /**
   * Current date value
   */
  value?: Date;

  /**
   * Callback when date changes
   */
  onChange?: (date: Date) => void;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Locale for date formatting
   * @default "en-US"
   */
  locale?: string;

  /**
   * Date format string
   */
  format?: string;
};

export type UseDatePickerOptions = {
  /**
   * Default value for uncontrolled mode
   */
  defaultValue?: Date;

  /**
   * Callback when date changes
   */
  onChange?: (date: Date) => void;
};

export type UseDatePickerReturn = {
  /**
   * Current date value
   */
  value: Date | undefined;

  /**
   * Update the date value
   */
  setValue: (date: Date) => void;

  /**
   * Whether calendar is open
   */
  isOpen: boolean;

  /**
   * Open the calendar
   */
  open: () => void;

  /**
   * Close the calendar
   */
  close: () => void;
};
```

## Related Guidelines

- [Main Component](./main-component.md) - Using types in components
- [Hooks](./hooks.md) - Hook return type patterns
- [Recipes](./recipes.md) - Recipe variant types

## Validation Checklist

### File Structure

- [ ] Types file exists with `.ts` extension
- [ ] Section dividers in correct order (Recipe → Slot → Helper → Main)
- [ ] **Only consumer-facing types in `{component-name}.types.ts`**
- [ ] **Internal types colocated with their usage**

### Naming Conventions

- [ ] All naming follows conventions table
- [ ] Props follow naming convention (`{ComponentName}Props`)
- [ ] React Aria imports use "Ra" prefix
- [ ] Recipe props: `{Component}RecipeProps`
- [ ] Slot props: `{Component}RootSlotProps`, `{Component}{Part}SlotProps`
- [ ] Helper types: `Excluded{Component}Props` or descriptive names

### Type Construction

- [ ] Uses `type` syntax (not `interface`)
- [ ] Extends appropriate base type (slot props for recipe-based components)
- [ ] **Recipe variants automatically inherited through slot props (not
      explicit)**
- [ ] **Explicit variant declarations only when functional overlap exists**
- [ ] Conflicts explicitly documented in Helper Types section

### Documentation

- [ ] **JSDoc comments for all properties within types**
- [ ] JSDoc comments for types when they are complex or public-facing (optional)
- [ ] Default values documented with `@default` (especially recipe props)
- [ ] Complex props have `@example` tags
- [ ] Event handlers properly typed

### Type Safety

- [ ] Generic types used appropriately
- [ ] No inline complex types
- [ ] **No implementation details leaked in public API types**
- [ ] Ref forwarding included in public props
- [ ] Data attributes supported where applicable

---

[← Back to Index](../component-guidelines.md) |
[Previous: Main Component](./main-component.md) |
[Next: Stories →](./stories.md)
