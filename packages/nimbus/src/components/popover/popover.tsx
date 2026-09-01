import { PopoverRoot, PopoverTrigger, PopoverContent } from "./components";

/**
 * Popover
 * ============================================================
 * A positioned overlay for rich, interactive content anchored to a trigger.
 * Built on React Aria Components for accessibility and WCAG 2.1 AA compliance.
 *
 * Reach for Popover when the content is interactive — a filter panel, a
 * settings form, a context-sensitive action list. Use `Tooltip` for simple
 * non-interactive hints, and `Dialog` when the flow should block the page.
 *
 * Focus is contained within the popover and an outside press dismisses it,
 * which is React Aria's default. `isNonModal` on `Popover.Root` lifts neither:
 * it stops React Aria marking the rest of the page `inert` and locking page
 * scroll, so assistive technology can reach the surrounding page. Read the React
 * Aria guidance before using it, since it affects the screen reader experience.
 *
 * @example
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>Filters</Popover.Trigger>
 *   <Popover.Content aria-label="Filters">
 *     <Checkbox>Only active</Checkbox>
 *   </Popover.Content>
 * </Popover.Root>
 * ```
 *
 * @supportsStyleProps
 * @see https://nimbus-documentation.vercel.app/components/feedback/popover
 */
export const Popover = {
  /**
   * # Popover.Root
   *
   * Establishes the popover's open state and styling context, and must wrap
   * both the trigger and the content.
   *
   * Renders no DOM element of its own, so it does not affect the layout around
   * the trigger. Accepts `isOpen` / `defaultOpen` / `onOpenChange` for
   * controlled and uncontrolled use, and is the compound's single configuration
   * surface: placement, dismissal, animation, portal container and the dialog's
   * `role` are all set here and reach `Popover.Content` through context.
   *
   * @example
   * ```tsx
   * <Popover.Root defaultOpen>
   *   <Popover.Trigger>Open</Popover.Trigger>
   *   <Popover.Content aria-label="Details">Content</Popover.Content>
   * </Popover.Root>
   * ```
   */
  Root: PopoverRoot,

  /**
   * # Popover.Trigger
   *
   * The element that opens the popover when pressed. Renders its own button by
   * default; pass `asChild` to apply trigger behavior to your own pressable
   * element instead of nesting one button inside another.
   *
   * @example
   * ```tsx
   * <Popover.Trigger asChild>
   *   <IconButton aria-label="Options"><MoreVert /></IconButton>
   * </Popover.Trigger>
   * ```
   */
  Trigger: PopoverTrigger,

  /**
   * # Popover.Content
   *
   * The positioned overlay surface. Supplies its own dialog element, so no
   * `Dialog` needs to be added by hand for the accessibility contract to hold.
   *
   * Give it an `aria-label` (or `aria-labelledby`) whenever the content has no
   * visible heading. Pass a function child to dismiss the popover from within.
   *
   * @example
   * ```tsx
   * <Popover.Content aria-label="Confirm">
   *   {({ close }) => (
   *     <Stack gap="200">
   *       <Text>Discard your changes?</Text>
   *       <Button onPress={close}>Cancel</Button>
   *     </Stack>
   *   )}
   * </Popover.Content>
   * ```
   */
  Content: PopoverContent,
};

// Internal exports for react-docgen
export {
  PopoverRoot as _PopoverRoot,
  PopoverTrigger as _PopoverTrigger,
  PopoverContent as _PopoverContent,
};
