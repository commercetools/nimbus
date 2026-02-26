# Compound Component Template

Template for compound component main file (exports only). Replace:
ComponentName, component-name, componentName

````tsx
/**
 * Template for compound component main file (exports only)
 * Replace: ComponentName, component-name, componentName
 */

// Import from barrel export index for consistent module resolution
import {
  ComponentNameRoot,
  ComponentNameTrigger,
  ComponentNameContent,
  ComponentNameItem,
} from "./components";
// Import other sub-components as needed from the barrel export

/**
 * ComponentName
 * ============================================================
 * {DESCRIPTION - Brief description of this compound component}
 *
 * @example
 * ```tsx
 * <ComponentName.Root variant="outline" size="md">
 *   <ComponentName.Trigger>Open</ComponentName.Trigger>
 *   <ComponentName.Content>
 *     <ComponentName.Item value="1">Option 1</ComponentName.Item>
 *     <ComponentName.Item value="2">Option 2</ComponentName.Item>
 *   </ComponentName.Content>
 * </ComponentName.Root>
 * ```
 */
export const ComponentName = {
  Root: ComponentNameRoot, // MUST BE FIRST - primary entry point
  Trigger: ComponentNameTrigger,
  Content: ComponentNameContent,
  Item: ComponentNameItem,
  // Add other exports as needed
};
````
