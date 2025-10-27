# Compound Component Template

Template for compound component main file (exports only). Replace:
ComponentName, component-name, componentName

````tsx
/**
 * Template for compound component main file (exports only)
 * Replace: ComponentName, component-name, componentName
 */

import { ComponentNameRoot } from "./components/component-name.root";
import { ComponentNameTrigger } from "./components/component-name.trigger";
import { ComponentNameContent } from "./components/component-name.content";
import { ComponentNameItem } from "./components/component-name.item";
// Import other sub-components as needed

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

// Internal exports for react-docgen
export {
  ComponentNameRoot as _ComponentNameRoot,
  ComponentNameTrigger as _ComponentNameTrigger,
  ComponentNameContent as _ComponentNameContent,
  ComponentNameItem as _ComponentNameItem,
  // Export other internals as needed
};
````
