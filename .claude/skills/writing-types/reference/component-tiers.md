# Writing Types: Component Tiers

## Component Tier Decision Matrix

### Tier 1: Simple Components

**Examples:** Button, Avatar, Separator, Icon, Badge

**Type Structure:**

```
RecipeProps → RootSlotProps → MainProps
```

**Files:** ~10-30 lines

**Template:**

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
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Reference to the button element
   */
  ref?: React.Ref<HTMLButtonElement>;
};
```

### Tier 2: Slot-Based Components

**Examples:** TextInput, NumberInput, MoneyInput, PasswordInput

**Type Structure:**

```
RecipeProps → Multiple SlotProps → MainProps
```

**Files:** ~50-100 lines

**Slot Pattern:**

- `RootSlotProps` - Container element
- `InputSlotProps` - Input element
- `LeadingElementSlotProps` - Start decoration
- `TrailingElementSlotProps` - End decoration

**Template:**

```typescript
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type TextInputRecipeProps = SlotRecipeProps<"textInput">;

// ============================================================
// SLOT PROPS
// ============================================================

export type TextInputRootSlotProps = HTMLChakraProps<
  "div",
  TextInputRecipeProps
>;
export type TextInputInputSlotProps = HTMLChakraProps<"input">;
export type TextInputLeadingElementSlotProps = HTMLChakraProps<"div">;
export type TextInputTrailingElementSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

export type TextInputProps = TextInputRootSlotProps & {
  /**
   * Input value (controlled)
   */
  value?: string;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;

  /**
   * Reference to the input element
   */
  ref?: React.Ref<HTMLInputElement>;
};
```

### Tier 3: Compound Components

**Examples:** Menu, Dialog, Card, Tabs, Accordion

**Type Structure:**

```
RootSlotProps (with recipe) + Multiple SubComponentProps
```

**Files:** ~100-200 lines

**Naming Pattern:**

- Root: `{Component}RootProps`
- Parts: `{Component}{Part}Props`

**Template:**

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

### Tier 4: Complex Compositions

**Examples:** DataTable, DatePicker, Pagination, ComboBox

**Type Structure:**

```
All of above + ContextValue + Helper types + Generics
```

**Files:** ~200-400 lines

**Additional Patterns:**

- Generic types: `<T extends object>`
- Context value types
- Helper types (SortDescriptor, ColumnItem, etc.)

**Template:**

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
  };
```
