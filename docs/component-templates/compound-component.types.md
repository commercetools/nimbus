# Compound Component Types Template

Template for compound component type definitions. Replace: ComponentName,
component-name, componentName

```typescript
/**
 * Template for compound component type definitions
 * Replace: ComponentName, component-name, componentName
 */

import { type ReactNode } from "react";
import {
  type ComponentNameRootSlotProps,
  type ComponentNameTriggerSlotProps,
  type ComponentNameItemSlotProps,
  // Import other slot props as needed...
} from "./component-name.slots";

// =============================================================================
// Component Props
// =============================================================================

/**
 * Props for the ComponentName.Root component
 * Root handles all configuration, variants, and state management
 */
export type ComponentNameRootProps = ComponentNameRootSlotProps & {
  /**
   * Whether the component is open (controlled)
   */
  isOpen?: boolean;

  /**
   * Default open state (uncontrolled)
   * @default false
   */
  defaultIsOpen?: boolean;

  onOpenChange?: (isOpen: boolean) => void;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  // Add more configuration/state props...
};

/**
 * Props for ComponentName.Trigger
 * Sub-components only define behavioral props
 */
export type ComponentNameTriggerProps = ComponentNameTriggerSlotProps & {
  /**
   * ARIA label for accessibility
   */
  "aria-label"?: string;

  icon?: ReactNode;
  // Add more behavioral props...
};

/**
 * Props for ComponentName.Item
 */
export type ComponentNameItemProps = ComponentNameItemSlotProps & {
  /**
   * Unique item value
   */
  value: string;

  /**
   * Whether the item is disabled
   * @default false
   */
  isDisabled?: boolean;

  onSelect?: (value: string) => void;
  // Add more item-specific props...
};

// Add additional component prop interfaces following the same pattern...

// =============================================================================
// Hook Types (if component exports custom hooks)
// =============================================================================

export type UseComponentNameOptions = {
  defaultIsOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  // Add hook-specific options...
};

export type UseComponentNameReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  // Add hook-specific return values...
};

// =============================================================================
// Context Types (if component uses context for state sharing)
// =============================================================================

export type ComponentNameContextValue = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  value?: string;
  onSelect: (value: string) => void;
  // Reference slot props for variants/sizes
  variant?: ComponentNameRootSlotProps["variant"];
  size?: ComponentNameRootSlotProps["size"];
};
```

## Pattern Summary

**The Type Hierarchy:**

```
SlotProps (from *.slots.tsx)
  ├─ HTMLChakraProps<Element> (HTML element props)
  └─ RecipeVariantProps (variant, size, etc.)
       ↓ extends
ComponentProps (*.types.ts)
  └─ Behavioral props only (state, callbacks, config)
```

**Key Principles:**

1. **Always extend slot props** - Never extend raw `ComponentProps<Element>`
2. **Root handles configuration** - Variants, sizes, state management on Root
   only
3. **Sub-components are behavioral** - Only define interaction/behavior props
4. **Controlled/Uncontrolled** - Support both with `value`/`defaultValue`
   patterns
5. **Document everything** - All props need JSDoc with `@default` tags
