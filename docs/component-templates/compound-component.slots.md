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

// Use the registered recipe key (must match theme/slot-recipes/index.ts)
const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusComponentName",
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
