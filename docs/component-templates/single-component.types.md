# Single Component Types Template

Template for component type definitions. Replace: ComponentName, component-name,
componentName

```typescript
/**
 * Template for component type definitions
 * Replace: ComponentName, component-name, componentName
 */

import { type ComponentProps } from "react";
import { type RecipeVariantProps } from "@chakra-ui/react";
import { componentNameRecipe } from "./component-name.recipe";

/**
 * Props for the ComponentName component
 */
export interface ComponentNameProps
  extends ComponentProps<"div">, // Change element type as needed
    RecipeVariantProps<typeof componentNameRecipe> {
  /**
   * Component content
   */
  children?: React.ReactNode;

  /**
   * Whether the component is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the component is in a loading state
   * @default false
   */
  isLoading?: boolean;

  // Add component-specific props here
  /**
   * Custom prop description
   * @default 'default'
   */
  customProp?: string;
}

// Add other type definitions as needed

/**
 * Options for useComponentName hook
 */
export interface UseComponentNameOptions {
  /**
   * Initial value
   * @default ''
   */
  defaultValue?: string;

  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;
}

/**
 * Return type for useComponentName hook
 */
export interface UseComponentNameReturn {
  /**
   * Current value
   */
  value: string;

  /**
   * Set new value
   */
  setValue: (value: string) => void;

  /**
   * Whether the component is valid
   */
  isValid: boolean;
}
```
