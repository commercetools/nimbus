# Single Component Slots Template

Template for slot components. Replace: ComponentName, component-name,
componentName

## Standard Recipe (Single Element)

```tsx
/**
 * Template for slot components
 * Replace: ComponentName, component-name, componentName
 */

import {
  createRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { componentNameRecipe } from "./component-name.recipe";

// Create context for standard recipe
const { withContext } = createRecipeContext({
  recipe: componentNameRecipe,
});

// CRITICAL: Export both type AND component

/**
 * Props for ComponentNameSlot
 */
export type ComponentNameSlotProps = HTMLChakraProps<"div">; // Change element type as needed

/**
 * Slot component that applies recipe styling
 */
export const ComponentNameSlot = withContext<
  HTMLDivElement, // Change element type as needed
  ComponentNameSlotProps
>("div", "root"); // Change element type as needed
```

## Compound Component with Multiple Slots

For compound components with multiple slots, use this pattern instead:

```tsx
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { componentNameSlotRecipe } from "./component-name.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: componentNameSlotRecipe,
});

// Root slot - provides context
export type ComponentNameRootSlotProps = HTMLChakraProps<"div">;
export const ComponentNameRootSlot = withProvider<
  HTMLDivElement,
  ComponentNameRootSlotProps
>("div", "root");

// Trigger slot - consumes context
export type ComponentNameTriggerSlotProps = HTMLChakraProps<"button">;
export const ComponentNameTriggerSlot = withContext<
  HTMLButtonElement,
  ComponentNameTriggerSlotProps
>("button", "trigger");

// Content slot
export type ComponentNameContentSlotProps = HTMLChakraProps<"div">;
export const ComponentNameContentSlot = withContext<
  HTMLDivElement,
  ComponentNameContentSlotProps
>("div", "content");

// Item slot
export type ComponentNameItemSlotProps = HTMLChakraProps<"div">;
export const ComponentNameItemSlot = withContext<
  HTMLDivElement,
  ComponentNameItemSlotProps
>("div", "item");
```
