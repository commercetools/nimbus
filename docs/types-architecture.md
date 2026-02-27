# Nimbus Types Architecture Reference

This document provides the established patterns and architecture for all Nimbus
component type definitions, based on the comprehensive types standardization
completed in January 2025.

## Universal Four-Layer Architecture

All Nimbus component types follow this consistent layered pattern:

```typescript
// Layer 1: Recipe Props (Styling Variants)
type ComponentRecipeProps = {
  size?: RecipeProps<"component">["size"];
  variant?: RecipeProps<"component">["variant"];
} & UnstyledProp;

// Layer 2: Slot Props (Chakra Foundation)
type ComponentRootSlotProps = HTMLChakraProps<"element", ComponentRecipeProps>;

// Layer 3: Helper Types (for complex components)
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

## Component Tier System

### Tier 1: Simple Components

**Examples:** Button, Avatar, Separator, Icon, Badge

- Single props interface
- 2-3 type layers
- Standard recipe (or no recipe)
- Type Structure: `RecipeProps → RootSlotProps → MainProps`
- File Size: ~10-30 lines

### Tier 2: Slot-Based Components

**Examples:** TextInput, NumberInput, MoneyInput, PasswordInput, SearchInput

- Multiple slot prop types
- Slot recipe for multi-element styling
- React Aria integration
- Type Structure: `RecipeProps → Multiple SlotProps → MainProps`
- File Size: ~50-100 lines

### Tier 3: Compound Components

**Examples:** Menu, Dialog, Card, Tabs, Accordion, Tooltip

- Multiple sub-component prop interfaces
- Slot recipe with context
- Root handles configuration
- Type Structure: `RootSlotProps (with recipe) + Multiple SubComponentProps`
- File Size: ~100-200 lines

### Tier 4: Complex Compositions

**Examples:** DataTable, DatePicker, Pagination, ComboBox, RichTextInput

- All Tier 3 features plus:
- Context types for state sharing
- Generic types: `<T extends object>`
- Multiple helper types
- Extensive conflict resolution
- Type Structure: `All of above + ContextValue + Helper types + Generics`
- File Size: ~200-400 lines

## Standard File Structure

Every types file follows this sequential structure with section dividers:

```typescript
/**
 * Type definitions for the {ComponentName} component.
 *
 * {Brief description of component purpose}
 * Component tier: {1, 2, 3, or 4} ({Category})
 */

// ============================================================
// RECIPE PROPS
// ============================================================
// Styling variants (size, variant, colorPalette, etc.)
// Only present when component has custom styling recipes

// ============================================================
// SLOT PROPS
// ============================================================
// Chakra HTML props for each visual element
// Root slot props always present

// ============================================================
// HELPER TYPES (when needed)
// ============================================================
// Conflict documentation, utility types, generic constraints
// Only in Tier 3/4 components

// ============================================================
// MAIN PROPS
// ============================================================
// Public API with comprehensive JSDoc on every property
```

## Naming Conventions

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

### React Aria Import Pattern

Always prefix React Aria imports with "Ra":

```typescript
// ✅ Correct
import { Button as RaButton } from "react-aria-components";
import { MenuProps as RaMenuProps } from "react-aria-components";

// ❌ Incorrect
import { Button } from "react-aria-components";
```

## JSDoc Requirements

1. **File-level JSDoc**: Required on every types file with tier classification
2. **Property-level JSDoc**: Required on every property in interfaces/types
3. **@default tags**: Required for all properties with defaults
4. **Interface-level JSDoc**: Recommended for complex or public-facing
   interfaces

```typescript
/**
 * Type definitions for the Button component.
 *
 * A foundational interactive button component.
 * Component tier: 1 (Simple)
 */

export type ButtonProps = ButtonSlotProps & {
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
};
```

## Conflict Resolution Patterns

### Strategy 1: Omit with keyof (Preferred)

```typescript
type FunctionalProps = AriaComponentProps &
  Omit<SlotProps, keyof AriaComponentProps>;
```

### Strategy 2: Explicit Exclusion List (Best for Documentation)

```typescript
/**
 * Props excluded due to conflicts with React Aria.
 * - onChange: HTML FormEventHandler vs React Aria's custom handler
 * - value: HTML string vs React Aria's typed value
 */
type ExcludedComponentProps = "onChange" | "value" | "defaultValue";

export type ComponentProps = Omit<
  SlotProps,
  keyof AriaProps | ExcludedComponentProps
> &
  AriaProps;
```

## Component Tier Examples

### Tier 1 - Simple (Button)

```typescript
/**
 * Type definitions for the Button component.
 * Component tier: 1 (Simple)
 */

type ButtonRecipeProps = {
  size?: RecipeProps<"button">["size"];
  variant?: RecipeProps<"button">["variant"];
} & UnstyledProp;

export type ButtonRootSlotProps = HTMLChakraProps<"button", ButtonRecipeProps>;

export type ButtonProps = ButtonRootSlotProps & {
  isLoading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};
```

### Tier 3 - Compound (Menu)

```typescript
/**
 * Type definitions for the Menu component.
 * Component tier: 3 (Compound)
 */

type MenuRecipeProps = SlotRecipeProps<"menu">;

export type MenuRootSlotProps = HTMLChakraProps<"div", MenuRecipeProps>;
export type MenuTriggerSlotProps = HTMLChakraProps<"button">;
export type MenuItemSlotProps = HTMLChakraProps<"div">;

export type MenuRootProps = MenuRootSlotProps & {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export type MenuTriggerProps = MenuTriggerSlotProps & {
  ref?: React.Ref<HTMLButtonElement>;
};
```

### Tier 4 - Complex (DataTable)

```typescript
/**
 * Type definitions for the DataTable component.
 * Component tier: 4 (Complex composition)
 */

// Recipe Props
type DataTableRecipeProps = {
  density?: SlotRecipeProps<"dataTable">["density"];
  truncated?: SlotRecipeProps<"dataTable">["truncated"];
} & UnstyledProp;

// Slot Props
export type DataTableRootProps = HTMLChakraProps<"div", DataTableRecipeProps>;

// Helper Types
export type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

export type DataTableColumnItem<T extends object> = {
  id: string;
  header: ReactNode;
  accessor: (row: T) => ReactNode;
  // ... additional properties
};

// Main Props
export type DataTableProps<T extends object> = DataTableRootProps & {
  columns: DataTableColumnItem<T>[];
  data: T[];
  // ... additional properties
};
```

## Validation Checklist

- [ ] File-level JSDoc with component description and tier classification
- [ ] Section dividers in correct order (Recipe → Slot → Helper → Main)
- [ ] All naming follows conventions table
- [ ] Every property has JSDoc with @default tags
- [ ] React Aria imports use "Ra" prefix
- [ ] Conflicts explicitly documented in Helper Types section
- [ ] Recipe variants inherited through slot props (not explicit)
- [ ] Ref forwarding included in public props
- [ ] Only consumer-facing types in types file
- [ ] Internal types colocated with implementation

## Reference Files

This architecture is implemented across 19 refactored component types files:

**Tier 1 (5 files):** Button, Avatar, Separator, Icon, Badge **Tier 2 (7
files):** TextInput, NumberInput, MoneyInput, PasswordInput, SearchInput,
MultilineTextInput, TimeInput **Tier 3 (4 files):** Menu, Dialog, Card, Tabs
**Tier 4 (3 files):** DataTable, DatePicker, Pagination

Refer to these files for production-ready examples of each pattern.

---

**Last Updated:** January 2025 **Standardization Completed:** January 2025
