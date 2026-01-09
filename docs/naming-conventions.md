# Naming Conventions

This document consolidates all naming conventions used across the Nimbus design
system, including component names, file names, type names, and import patterns.
Following these conventions ensures consistency and maintainability across the
codebase.

## Component Names

### General Rules

- **PascalCase**: All component names use PascalCase
- **Descriptive**: Names describe purpose, not implementation
- **Domain-first**: Business domain before technical term

```typescript
// ✅ CORRECT
(Button, TextInput, DateRangePicker, DataTable);

// ❌ INCORRECT
(button, text_input, date - range - picker, Table_Data);
```

### Compound Component Naming

- **Root first**: `.Root` property is always first
- **Descriptive parts**: Use clear, semantic names for parts

```typescript
// ✅ CORRECT
Menu.Root;
Menu.Trigger;
Menu.Content;
Menu.Item;

Dialog.Root;
Dialog.Trigger;
Dialog.Content;
Dialog.Title;

// ❌ INCORRECT
(Menu.A, Menu.B); // Non-descriptive
(Dialog.Part1, Dialog.Part2); // Generic
```

### Component File Names

Component names in files use **kebab-case**:

```
button.tsx
text-input.tsx
date-range-picker.tsx
data-table.tsx
```

**Match between file and export**:

- `button.tsx` exports `Button`
- `text-input.tsx` exports `TextInput`
- `date-range-picker.tsx` exports `DateRangePicker`

---

## File Naming Patterns

All component-related files follow predictable patterns:

| File Type           | Pattern                     | Example                |
| ------------------- | --------------------------- | ---------------------- |
| Main component      | `{component}.tsx`           | `button.tsx`           |
| Types               | `{component}.types.ts`      | `button.types.ts`      |
| Recipe              | `{component}.recipe.ts`     | `button.recipe.ts`     |
| Slots               | `{component}.slots.tsx`     | `button.slots.tsx`     |
| Stories             | `{component}.stories.tsx`   | `button.stories.tsx`   |
| i18n                | `{component}.i18n.ts`       | `button.i18n.ts`       |
| Developer docs      | `{component}.dev.mdx`       | `button.dev.mdx`       |
| Documentation tests | `{component}.docs.spec.tsx` | `button.docs.spec.tsx` |
| Designer docs       | `{component}.mdx`           | `button.mdx`           |
| Unit tests          | `{utility}.spec.ts`         | `format-date.spec.ts`  |
| Barrel export       | `index.ts`                  | `index.ts`             |

### Directory Structure

```
components/
├── button/
│   ├── button.tsx            # Main component
│   ├── button.types.ts       # Type definitions
│   ├── button.recipe.ts      # Chakra UI recipe
│   ├── button.slots.tsx      # Slot components
│   ├── button.stories.tsx    # Storybook stories
│   ├── button.dev.mdx        # Developer documentation
│   ├── button.docs.spec.tsx  # Documentation tests
│   ├── button.mdx            # Designer documentation
│   └── index.ts              # Barrel export
```

---

## Type Naming Conventions

### Core Type Patterns

| Type Category           | Pattern                      | Example                        |
| ----------------------- | ---------------------------- | ------------------------------ |
| **Recipe Props**        | `{Component}RecipeProps`     | `ButtonRecipeProps`            |
| **Slot Props (Root)**   | `{Component}RootSlotProps`   | `MenuRootSlotProps`            |
| **Slot Props (Parts)**  | `{Component}{Part}SlotProps` | `MenuTriggerSlotProps`         |
| **Main Props**          | `{Component}Props`           | `ButtonProps`                  |
| **Sub-component Props** | `{Component}{Part}Props`     | `MenuTriggerProps`             |
| **Helper Types**        | `Excluded{Component}Props`   | `ExcludedNumberInputProps`     |
| **Utility Types**       | Descriptive names            | `SortDescriptor`, `ColumnItem` |
| **Context Values**      | `{Component}ContextValue`    | `DataTableContextValue`        |

### Recipe Props

Recipe props type follows `{Component}RecipeProps`:

```typescript
// ✅ CORRECT
type ButtonRecipeProps = {
  size?: RecipeProps<"button">["size"];
  variant?: RecipeProps<"button">["variant"];
} & UnstyledProp;

type MenuRecipeProps = {
  size?: RecipeProps<"menu">["size"];
} & UnstyledProp;
```

### Slot Props

Slot props follow a two-part pattern:

**Single-Slot Components:**

| Pattern   | Example                    |
| --------- | -------------------------- |
| Component | `{ComponentName}Root`      |
| Type      | `{ComponentName}RootProps` |

```typescript
// ✅ CORRECT
export type ButtonRootProps = HTMLChakraProps<"button", ButtonRecipeProps>;
export const ButtonRoot: SlotComponent<HTMLButtonElement, ButtonRootProps> = ...
```

**Multi-Slot Components:**

| Pattern        | Example                          |
| -------------- | -------------------------------- |
| Root Component | `{ComponentName}RootSlot`        |
| Root Type      | `{ComponentName}RootSlotProps`   |
| Part Component | `{ComponentName}{Part}Slot`      |
| Part Type      | `{ComponentName}{Part}SlotProps` |

```typescript
// ✅ CORRECT - Multi-slot
export type MenuRootSlotProps = HTMLChakraProps<"div">;
export const MenuRootSlot: SlotComponent<HTMLDivElement, MenuRootSlotProps> = ...

export type MenuTriggerSlotProps = HTMLChakraProps<"button">;
export const MenuTriggerSlot: SlotComponent<HTMLButtonElement, MenuTriggerSlotProps> = ...

export type MenuItemSlotProps = HTMLChakraProps<"div">;
export const MenuItemSlot: SlotComponent<HTMLDivElement, MenuItemSlotProps> = ...
```

### Main Component Props

The public API props type always uses `{Component}Props`:

```typescript
// ✅ CORRECT
export type ButtonProps = ButtonRootSlotProps & {
  isLoading?: boolean;
  startIcon?: React.ReactNode;
};

export type MenuProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
```

### Helper Types

Helper types use descriptive names based on their purpose:

```typescript
// ✅ CORRECT - Descriptive helper types
type ExcludedButtonProps = "css" | "colorScheme";
type ConflictingMenuProps = keyof RaMenuProps;
type SortDescriptor = {
  column: string;
  direction: "asc" | "desc";
};

// ❌ INCORRECT - Generic names
type ButtonHelper = ...;
type MenuUtils = ...;
```

---

## React Aria Import Convention (CRITICAL)

**ALWAYS prefix React Aria imports with "Ra":**

```typescript
// ✅ CORRECT
import { Button as RaButton } from "react-aria-components";
import { MenuProps as RaMenuProps } from "react-aria-components";
import { TextFieldProps as RaTextFieldProps } from "react-aria-components";
import { useButton as useRaButton } from "react-aria";

// ❌ INCORRECT
import { Button } from "react-aria-components";
import { MenuProps } from "react-aria-components";
import { useButton } from "react-aria";
```

**Why this is critical:**

- **Prevents naming conflicts**: Nimbus has `Button`, React Aria has `Button`
- **Makes source clear**: Code readers know `RaButton` is from React Aria
- **Required convention**: Failure causes type conflicts and build errors

**Apply to all React Aria imports:**

- Components: `RaButton`, `RaMenu`, `RaTextField`
- Props: `RaButtonProps`, `RaMenuProps`
- Hooks: `useRaButton`, `useRaMenu`
- Types: `RaAriaButtonProps`, `RaMenuTriggerProps`

---

## Slot Name Mapping (CRITICAL)

Slot component names MUST match recipe slot definitions:

```typescript
// In recipe file (button.recipe.ts)
export const buttonSlotRecipe = defineSlotRecipe({
  slots: ["root", "icon", "spinner"],
  // ...
});

// In slots file (button.slots.tsx) - second parameter MUST match
export const ButtonRoot = withProvider("button", "root"); // ✅ matches "root"
export const ButtonIcon = withContext("span", "icon"); // ✅ matches "icon"
export const ButtonSpinner = withContext("span", "spinner"); // ✅ matches "spinner"

// ❌ INCORRECT - mismatched slot names
export const ButtonRoot = withProvider("button", "container"); // Should be "root"
export const ButtonIcon = withContext("span", "iconElement"); // Should be "icon"
```

**Recipe slot name requirements:**

- Use lowercase
- Use semantic names: `root`, `trigger`, `content`, `item`
- Match across recipe and slots files

---

## Variable Naming

### Constants

```typescript
// ✅ CORRECT - UPPER_SNAKE_CASE for true constants
const MAX_ITEMS = 100;
const DEFAULT_PAGE_SIZE = 20;
const API_BASE_URL = "https://api.example.com";

// ✅ CORRECT - PascalCase for React components
const Button = () => {};
const MenuItem = () => {};

// ✅ CORRECT - camelCase for most variables
const userId = "123";
const isLoading = false;
const handleClick = () => {};
```

### React Hooks

```typescript
// ✅ CORRECT - use prefix + camelCase
(useState, useEffect, useContext);
(useButton, useMenu, useDataTable); // Custom hooks
(useComponentState, useFormValidation);

// ❌ INCORRECT - missing "use" prefix
buttonState(); // Should be useButtonState()
tableData(); // Should be useTableData()
```

### Event Handlers

```typescript
// ✅ CORRECT - handle prefix + PascalCase action
(handleClick, handleChange, handleSubmit);
(handleMenuOpen, handleItemSelect, handleSortChange);

// ❌ INCORRECT - inconsistent patterns
onClick(); // Too short, prefer handleClick
onPress(); // React Aria internal, use handlePress for our handlers
clickHandler(); // Suffix pattern, prefer prefix
```

---

## Recipe and Slot Naming

### Recipe Names

Recipe names use camelCase and end with "Recipe" or "SlotRecipe":

```typescript
// Standard recipes
export const buttonRecipe = defineRecipe({
  /* ... */
});
export const badgeRecipe = defineRecipe({
  /* ... */
});

// Slot recipes
export const menuSlotRecipe = defineSlotRecipe({
  /* ... */
});
export const dialogSlotRecipe = defineSlotRecipe({
  /* ... */
});
```

### Recipe Registration

When registering in theme, use the same name:

```typescript
// In theme/recipes.ts
export const recipes = {
  button: buttonRecipe,
  badge: badgeRecipe,
  menu: menuSlotRecipe,
  dialog: dialogSlotRecipe,
};
```

---

## i18n Message IDs

Message IDs follow the pattern `Nimbus.{ComponentName}.{messageKey}`:

```typescript
// ✅ CORRECT
defineMessages({
  clearLabel: {
    id: "Nimbus.DatePicker.clearLabel",
    defaultMessage: "Clear date",
    description: "Label for the clear button in date picker",
  },
  invalidDate: {
    id: "Nimbus.DatePicker.invalidDate",
    defaultMessage: "Invalid date format",
    description: "Error message for invalid date input",
  },
});

// ❌ INCORRECT
("nimbus.datePicker.clearLabel"); // Lowercase, wrong format
("DatePicker.clear"); // Missing "Nimbus" prefix
("Nimbus.DatePicker.CLEAR_LABEL"); // UPPER_CASE, should be camelCase
```

**Pattern rules:**

- Prefix: `Nimbus` (PascalCase)
- Component: `{ComponentName}` (PascalCase)
- Key: `{messageKey}` (camelCase)
- Separator: `.` (dot)

---

## Storybook Story Names

Story names use PascalCase and describe the variant or state:

```typescript
// ✅ CORRECT
export const Base: Story = {
  /* ... */
};
export const WithIcon: Story = {
  /* ... */
};
export const Loading: Story = {
  /* ... */
};
export const Disabled: Story = {
  /* ... */
};
export const SizeVariants: Story = {
  /* ... */
};

// ❌ INCORRECT
export const base: Story = {
  /* ... */
}; // lowercase
export const with_icon: Story = {
  /* ... */
}; // snake_case
export const loading_state: Story = {
  /* ... */
}; // snake_case
```

### Story Organization Order

Stories should follow this naming and order:

1. `Base` - Default/minimal example
2. `Size*` - Size variants (SizeSmall, SizeMedium, SizeLarge)
3. `Variant*` - Visual variants
4. State stories - Interactive states (Loading, Disabled, Invalid)
5. `Controlled` - Controlled component example
6. `Complex` - Complex usage patterns
7. `SmokeTest` - Comprehensive test story

---

## Test File Naming

### Unit Tests

Unit test files use `.spec.ts` or `.spec.tsx`:

```
format-date.spec.ts
use-pagination.spec.ts
button.docs.spec.tsx
```

### Test Describe Blocks

```typescript
// ✅ CORRECT - Component name + category
describe("Button - Basic Rendering", () => {});
describe("Menu - Keyboard Navigation", () => {});
describe("DataTable - Sorting", () => {});

// ❌ INCORRECT - Too vague
describe("Button tests", () => {});
describe("Tests", () => {});
```

### Test Names

```typescript
// ✅ CORRECT - Descriptive, behavior-focused
test("renders with default props", () => {});
test("calls onClick when clicked", () => {});
test("shows loading spinner when isLoading is true", () => {});
test("disables interaction when disabled", () => {});

// ❌ INCORRECT - Too vague or implementation-focused
test("works", () => {});
test("button test", () => {});
test("checks state", () => {});
```

---

## Documentation Section IDs

Documentation section IDs use kebab-case:

```typescript
/**
 * @docs-section basic-rendering
 * @docs-section keyboard-navigation
 * @docs-section form-integration
 * @docs-section controlled-mode
 */
```

---

## Export Naming

### Named Exports (Preferred)

```typescript
// ✅ CORRECT - Named exports
export const Button = () => {};
export type ButtonProps = {};
export const useButton = () => {};

// ❌ AVOID - Default exports
export default Button; // Harder to refactor, inconsistent naming
```

### Barrel Exports

```typescript
// In index.ts
export { Button } from "./button";
export type { ButtonProps } from "./button.types";
export { buttonRecipe } from "./button.recipe";

// ✅ CORRECT - Re-export with same names
// ❌ INCORRECT - Renaming on export
export { Button as NimbusButton } from "./button"; // Don't rename
```

---

## Cross-References

For file-type-specific naming details, see:

- **Type Definitions**: `docs/file-type-guidelines/types.md`
- **Recipes**: `docs/file-type-guidelines/recipes.md`
- **Slots**: `docs/file-type-guidelines/slots.md`
- **Stories**: `docs/file-type-guidelines/stories.md`
- **i18n**: `docs/file-type-guidelines/i18n.md`
- **Documentation**: `docs/file-type-guidelines/documentation.md`
- **JSDoc Standards**: `docs/jsdoc-standards.md`

---

## Quick Reference Checklist

### Component Files

- [ ] File name is kebab-case
- [ ] Export name is PascalCase
- [ ] File and export names match (button.tsx → Button)

### Types

- [ ] Main props use `{Component}Props`
- [ ] Slot props use `{Component}{Part}SlotProps`
- [ ] Recipe props use `{Component}RecipeProps`
- [ ] React Aria imports prefixed with `Ra`

### Recipes & Slots

- [ ] Recipe name is camelCase + "Recipe"
- [ ] Slot names match recipe slot definitions
- [ ] Theme registration uses same name

### Tests & Stories

- [ ] Test files use `.spec.ts` or `.spec.tsx`
- [ ] Story names are PascalCase
- [ ] Describe blocks include component name + category
- [ ] @docs-section IDs are kebab-case

### Exports

- [ ] Use named exports (not default)
- [ ] Barrel exports preserve original names
- [ ] Public API types are exported

---

## Common Mistakes to Avoid

### ❌ Wrong: Inconsistent Casing

```typescript
// File: Button.tsx (should be button.tsx)
export const button = () => {}; // Should be Button

export type buttonProps = {}; // Should be ButtonProps
```

### ❌ Wrong: Missing React Aria Prefix

```typescript
import { Button } from "react-aria-components"; // Conflicts with our Button
// Should be: import { Button as RaButton } from "react-aria-components";
```

### ❌ Wrong: Mismatched Slot Names

```typescript
// Recipe
export const menuSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content"],
});

// Slots - WRONG
export const MenuRoot = withProvider("div", "container"); // Should be "root"
```

### ❌ Wrong: Generic Helper Type Names

```typescript
type MenuHelper = {}; // Too vague
type Utils = {}; // Too generic

// Should be descriptive:
type ExcludedMenuProps = "css" | "colorScheme";
type MenuSelectionState = {};
```

---

## Examples by Component Tier

### Tier 1: Simple Component (Button)

```typescript
// File: button.tsx
export const Button = () => {};

// File: button.types.ts
export type ButtonRecipeProps = {};
export type ButtonRootSlotProps = HTMLChakraProps<"button", ButtonRecipeProps>;
export type ButtonProps = ButtonRootSlotProps & { isLoading?: boolean };

// File: button.recipe.ts
export const buttonRecipe = defineRecipe({
  /* ... */
});

// File: button.slots.tsx
export const ButtonRoot = withProvider("button", "root");

// File: button.stories.tsx
export const Base: Story = {};
export const Loading: Story = {};
export const Disabled: Story = {};
```

### Tier 3: Compound Component (Menu)

```typescript
// File: menu.tsx
export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
};

// File: menu.types.ts
export type MenuRecipeProps = {};
export type MenuRootSlotProps = HTMLChakraProps<"div">;
export type MenuTriggerSlotProps = HTMLChakraProps<"button">;
export type MenuItemSlotProps = HTMLChakraProps<"div">;

export type MenuRootProps = {};
export type MenuTriggerProps = {};
export type MenuItemProps = {};

// File: menu.recipe.ts
export const menuSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content", "item"],
});

// File: menu.slots.tsx
export const MenuRootSlot = withProvider("div", "root");
export const MenuTriggerSlot = withContext("button", "trigger");
export const MenuContentSlot = withContext("div", "content");
export const MenuItemSlot = withContext("div", "item");
```
