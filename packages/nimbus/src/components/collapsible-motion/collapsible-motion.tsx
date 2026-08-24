import {
  CollapsibleMotionRoot,
  CollapsibleMotionTrigger,
  CollapsibleMotionContent,
} from "./components";

// Exports for internal use by react-docgen
export {
  CollapsibleMotionRoot as _CollapsibleMotionRoot,
  CollapsibleMotionTrigger as _CollapsibleMotionTrigger,
  CollapsibleMotionContent as _CollapsibleMotionContent,
};

type CollapsibleMotionNamespace = {
  Root: typeof CollapsibleMotionRoot;
  Trigger: typeof CollapsibleMotionTrigger;
  Content: typeof CollapsibleMotionContent;
};

export const CollapsibleMotion: CollapsibleMotionNamespace = {
  /**
   * # CollapsibleMotion.Root
   *
   * The root container component that manages state and provides context.
   * Handles both controlled and uncontrolled modes for expanded/collapsed state.
   *
   * @example
   * ```tsx
   * <CollapsibleMotion.Root defaultExpanded={false}>
   *   <CollapsibleMotion.Trigger>Toggle</CollapsibleMotion.Trigger>
   *   <CollapsibleMotion.Content>Content here</CollapsibleMotion.Content>
   * </CollapsibleMotion.Root>
   * ```
   */
  Root: CollapsibleMotionRoot,

  /**
   * # CollapsibleMotion.Trigger
   *
   * The trigger button that toggles the collapsible content.
   * Handles keyboard and mouse interactions with proper ARIA attributes.
   *
   * @example
   * ```tsx
   * <CollapsibleMotion.Trigger>
   *   Click to expand
   * </CollapsibleMotion.Trigger>
   * ```
   */
  Trigger: CollapsibleMotionTrigger,

  /**
   * # CollapsibleMotion.Content
   *
   * The collapsible content container with smooth expand/collapse animations.
   * Automatically handles ARIA attributes for accessibility.
   *
   * @example
   * ```tsx
   * <CollapsibleMotion.Content>
   *   <Text>Your collapsible content</Text>
   * </CollapsibleMotion.Content>
   * ```
   */
  Content: CollapsibleMotionContent,
};
