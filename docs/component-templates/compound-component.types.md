# Compound Component Types Template

Template for compound component type definitions. Replace: ComponentName,
component-name, componentName

```typescript
/**
 * Template for compound component type definitions
 * Replace: ComponentName, component-name, componentName
 */

import { type ComponentProps, type ReactNode } from "react";
import { type RecipeVariantProps } from "@chakra-ui/react";
import { componentNameSlotRecipe } from "./component-name.recipe";

// Base variant props from slot recipe
type ComponentNameVariantProps = RecipeVariantProps<
  typeof componentNameSlotRecipe
>;

/**
 * Props for the ComponentName.Root component
 */
export interface ComponentNameRootProps
  extends ComponentProps<"div">, // Change element type as needed
    ComponentNameVariantProps {
  /**
   * Component content
   */
  children?: ReactNode;

  /**
   * Whether the component is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the component is open/expanded
   * @default false
   */
  isOpen?: boolean;

  /**
   * Default open state (uncontrolled mode)
   * @default false
   */
  defaultIsOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  // Add component-specific props here
  /**
   * Selected value (controlled)
   */
  value?: string;

  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Callback when selection changes
   */
  onChange?: (value: string) => void;
}

/**
 * Props for the ComponentName.Trigger component
 */
export interface ComponentNameTriggerProps extends ComponentProps<"button"> {
  // Change element type as needed
  /**
   * Trigger content
   */
  children?: ReactNode;

  /**
   * Whether the trigger is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * ARIA label for accessibility
   */
  "aria-label"?: string;

  /**
   * Custom trigger icon
   */
  icon?: ReactNode;
}

/**
 * Props for the ComponentName.Content component
 */
export interface ComponentNameContentProps extends ComponentProps<"div"> {
  // Change element type as needed
  /**
   * Content children
   */
  children?: ReactNode;

  /**
   * Placement of the content relative to trigger
   * @default 'bottom-start'
   */
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "bottom-start"
    | "left-start"
    | "right-start";

  /**
   * Whether to portalize the content
   * @default true
   */
  portalized?: boolean;

  /**
   * Custom portal container
   */
  portalContainer?: HTMLElement;
}

/**
 * Props for the ComponentName.Item component
 */
export interface ComponentNameItemProps extends ComponentProps<"div"> {
  // Change element type as needed
  /**
   * Item content
   */
  children?: ReactNode;

  /**
   * Item value for selection
   */
  value: string;

  /**
   * Whether the item is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the item is selected
   * @default false
   */
  isSelected?: boolean;

  /**
   * Callback when item is selected
   */
  onSelect?: (value: string) => void;

  /**
   * Leading icon or element
   */
  startContent?: ReactNode;

  /**
   * Trailing icon or element
   */
  endContent?: ReactNode;
}

// Optional: Additional component types as needed

/**
 * Props for the ComponentName.Separator component
 */
export interface ComponentNameSeparatorProps extends ComponentProps<"hr"> {
  /**
   * Separator orientation
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
}

/**
 * Props for the ComponentName.Label component
 */
export interface ComponentNameLabelProps extends ComponentProps<"div"> {
  /**
   * Label content
   */
  children?: ReactNode;
}

// Hook types (if component has hooks)

/**
 * Options for useComponentName hook
 */
export interface UseComponentNameOptions {
  /**
   * Initial open state
   * @default false
   */
  defaultIsOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Initial selected value
   */
  defaultValue?: string;

  /**
   * Callback when selection changes
   */
  onChange?: (value: string) => void;

  /**
   * Whether the component is controlled
   */
  isControlled?: boolean;
}

/**
 * Return type for useComponentName hook
 */
export interface UseComponentNameReturn {
  /**
   * Whether the component is open
   */
  isOpen: boolean;

  /**
   * Open the component
   */
  open: () => void;

  /**
   * Close the component
   */
  close: () => void;

  /**
   * Toggle the component
   */
  toggle: () => void;

  /**
   * Current selected value
   */
  value?: string;

  /**
   * Set selected value
   */
  setValue: (value: string) => void;

  /**
   * Whether a value is selected
   */
  hasSelection: boolean;

  /**
   * Clear the selection
   */
  clearSelection: () => void;
}

// Context types (if component uses context)

/**
 * Context value for ComponentName provider
 */
export interface ComponentNameContextValue {
  /**
   * Whether the component is open
   */
  isOpen: boolean;

  /**
   * Open the component
   */
  onOpen: () => void;

  /**
   * Close the component
   */
  onClose: () => void;

  /**
   * Current selected value
   */
  value?: string;

  /**
   * Select a value
   */
  onSelect: (value: string) => void;

  /**
   * Whether the component is disabled
   */
  isDisabled: boolean;

  /**
   * Component variant
   */
  variant?: ComponentNameVariantProps["variant"];

  /**
   * Component size
   */
  size?: ComponentNameVariantProps["size"];
}
```

## Type Design Guidelines

When creating interfaces for compound components:

- **Root components**: Extend their slot props (which include
  `HTMLChakraProps<Element>` and variant props) and React Aria props
- **Child components**: Extend their slot props (which include
  `HTMLChakraProps<Element>`) and React Aria props
- **State management**: Include controlled/uncontrolled patterns with optional
  state props and change handlers
- **Content flexibility**: Use `ReactNode` for content props to support flexible
  composition
- **Event patterns**: Include specific event handlers relevant to each
  component's interactions

Reference existing component types in the codebase for concrete implementation
examples.

## Key Requirements

1. **Variant Props**: Import and extend `RecipeVariantProps` from slot recipe
2. **Element Types**: Use appropriate HTML element types for each component
3. **Controlled/Uncontrolled**: Support both modes with `value`/`defaultValue`
   patterns
4. **Accessibility**: Include ARIA props like `aria-label`, `aria-describedby`
5. **Event Handlers**: Include appropriate event handlers for interactions
6. **Content Props**: Use `ReactNode` for flexible content acceptance
7. **JSDoc Documentation**: Document all props with descriptions and defaults
8. **Hook Types**: Include hook option and return types if component uses hooks
9. **Context Types**: Include context value types if component uses context
