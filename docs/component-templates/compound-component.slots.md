# Compound Component Slots Template

Template for compound component slot components. Replace: ComponentName,
component-name, componentName

```tsx
/**
 * Template for compound component slot components
 * Replace: ComponentName, component-name, componentName
 */

import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { componentNameSlotRecipe } from "./component-name.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: componentNameSlotRecipe,
});

// CRITICAL: Export both type AND component for each slot

/**
 * Props for ComponentNameRootSlot
 */
export type ComponentNameRootSlotProps = HTMLChakraProps<"div">; // Change element type as needed

/**
 * Root slot component that provides recipe context to child slots
 */
export const ComponentNameRootSlot = withProvider<
  HTMLDivElement, // Change element type as needed
  ComponentNameRootSlotProps
>("div", "root"); // Change element type as needed

/**
 * Props for ComponentNameTriggerSlot
 */
export type ComponentNameTriggerSlotProps = HTMLChakraProps<"button">; // Change element type as needed

/**
 * Trigger slot component that consumes recipe context
 */
export const ComponentNameTriggerSlot = withContext<
  HTMLButtonElement, // Change element type as needed
  ComponentNameTriggerSlotProps
>("button", "trigger"); // Change element type as needed

/**
 * Props for ComponentNameContentSlot
 */
export type ComponentNameContentSlotProps = HTMLChakraProps<"div">; // Change element type as needed

/**
 * Content slot component that consumes recipe context
 */
export const ComponentNameContentSlot = withContext<
  HTMLDivElement, // Change element type as needed
  ComponentNameContentSlotProps
>("div", "content"); // Change element type as needed

/**
 * Props for ComponentNameItemSlot
 */
export type ComponentNameItemSlotProps = HTMLChakraProps<"div">; // Change element type as needed

/**
 * Item slot component that consumes recipe context
 */
export const ComponentNameItemSlot = withContext<
  HTMLDivElement, // Change element type as needed
  ComponentNameItemSlotProps
>("div", "item"); // Change element type as needed

// Add more slots as needed following the same pattern:
// export type ComponentNameOtherSlotProps = HTMLChakraProps<'element'>;
// export const ComponentNameOtherSlot = withContext<HTMLElement, ComponentNameOtherSlotProps>('element', 'slotName');
```

## Common Slot Patterns

### Menu-like Components

```tsx
// Root (provider)
export const MenuRootSlot = withProvider<HTMLDivElement, MenuRootSlotProps>(
  "div",
  "root"
);

// Trigger
export const MenuTriggerSlot = withContext<
  HTMLButtonElement,
  MenuTriggerSlotProps
>("button", "trigger");

// Content (dropdown/popover)
export const MenuContentSlot = withContext<
  HTMLDivElement,
  MenuContentSlotProps
>("div", "content");

// Items
export const MenuItemSlot = withContext<HTMLDivElement, MenuItemSlotProps>(
  "div",
  "item"
);

// Optional: Separators, labels, etc.
export const MenuSeparatorSlot = withContext<
  HTMLHRElement,
  MenuSeparatorSlotProps
>("hr", "separator");
export const MenuLabelSlot = withContext<HTMLDivElement, MenuLabelSlotProps>(
  "div",
  "label"
);
```

### Popover-like Components

```tsx
// Root (provider)
export const PopoverRootSlot = withProvider<
  HTMLDivElement,
  PopoverRootSlotProps
>("div", "root");

// Trigger
export const PopoverTriggerSlot = withContext<
  HTMLButtonElement,
  PopoverTriggerSlotProps
>("button", "trigger");

// Content
export const PopoverContentSlot = withContext<
  HTMLDivElement,
  PopoverContentSlotProps
>("div", "content");

// Header parts
export const PopoverHeaderSlot = withContext<
  HTMLDivElement,
  PopoverHeaderSlotProps
>("div", "header");
export const PopoverBodySlot = withContext<
  HTMLDivElement,
  PopoverBodySlotProps
>("div", "body");

// Actions
export const PopoverCloseSlot = withContext<
  HTMLButtonElement,
  PopoverCloseSlotProps
>("button", "close");
```

### Form-like Components

```tsx
// Root (provider)
export const FormRootSlot = withProvider<HTMLFormElement, FormRootSlotProps>(
  "form",
  "root"
);

// Field containers
export const FormFieldSlot = withContext<HTMLDivElement, FormFieldSlotProps>(
  "div",
  "field"
);

// Labels and inputs
export const FormLabelSlot = withContext<HTMLLabelElement, FormLabelSlotProps>(
  "label",
  "label"
);
export const FormInputSlot = withContext<HTMLInputElement, FormInputSlotProps>(
  "input",
  "input"
);

// Help and error text
export const FormHelpTextSlot = withContext<
  HTMLDivElement,
  FormHelpTextSlotProps
>("div", "helpText");
export const FormErrorTextSlot = withContext<
  HTMLDivElement,
  FormErrorTextSlotProps
>("div", "errorText");
```

## Key Requirements

1. **Both Types and Components**: Every slot MUST export both the TypeScript
   type and the component
2. **Provider Pattern**: Root slot uses `withProvider`, all others use
   `withContext`
3. **Naming Convention**: `ComponentName{SlotName}Slot` for components,
   `ComponentName{SlotName}SlotProps` for types
4. **Element Types**: Choose appropriate HTML element types for each slot's
   semantic purpose
5. **Recipe Context**: All slots automatically receive recipe context (variants,
   size, etc.) from the root
