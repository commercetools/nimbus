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
