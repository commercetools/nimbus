import { TooltipRoot } from "./components/tooltip.root";
import { TooltipContent } from "./components/tooltip.content";

/**
 * Tooltip
 * ============================================================
 * A tooltip component for displaying helpful information on hover or focus.
 * Features automatic positioning, accessibility support, and customizable appearance.
 *
 * @example
 * ```tsx
 * <Tooltip.Root>
 *   <Button>Hover me</Button>
 *   <Tooltip.Content>
 *     <Text>Helpful information</Text>
 *   </Tooltip.Content>
 * </Tooltip.Root>
 * ```
 *
 * @see https://nimbus-documentation.vercel.app/components/feedback/tooltip
 */
export const Tooltip = {
  /**
   * # Tooltip.Root
   *
   * The root component that provides state management and positioning logic.
   * Wraps the trigger element and tooltip content, handling hover and focus interactions.
   *
   * @example
   * ```tsx
   * <Tooltip.Root placement="top" delay={200}>
   *   <IconButton aria-label="Info">
   *     <InfoIcon />
   *   </IconButton>
   *   <Tooltip.Content>Additional information</Tooltip.Content>
   * </Tooltip.Root>
   * ```
   */
  Root: TooltipRoot,

  /**
   * # Tooltip.Content
   *
   * The tooltip content container that appears on trigger hover or focus.
   * Automatically positions itself relative to the trigger element.
   *
   * @example
   * ```tsx
   * <Tooltip.Root>
   *   <span tabIndex={0}>Hover or focus me</span>
   *   <Tooltip.Content>
   *     <Stack gap="100">
   *       <Text fontWeight="600">Tooltip Title</Text>
   *       <Text>Detailed description goes here.</Text>
   *     </Stack>
   *   </Tooltip.Content>
   * </Tooltip.Root>
   * ```
   */
  Content: TooltipContent,
};
