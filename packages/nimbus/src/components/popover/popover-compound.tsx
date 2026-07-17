import { PopoverRoot } from "./components/popover.root";
import { PopoverTrigger } from "./components/popover.trigger";
import { PopoverContent } from "./components/popover.content";

/**
 * Popover
 * ============================================================
 * A compound component that displays floating content relative to a trigger.
 * Built with React Aria Components for accessibility and WCAG 2.1 AA compliance.
 *
 * Unlike Menu, the popover stays open when the user interacts with content
 * inside it — making it suitable for forms, settings panels, and filter UIs.
 *
 * @example
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger asChild>
 *     <Button>Open</Button>
 *   </Popover.Trigger>
 *   <Popover.Content>
 *     <Text>Interactive content here</Text>
 *   </Popover.Content>
 * </Popover.Root>
 * ```
 */
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
};

export {
  PopoverRoot as _PopoverRoot,
  PopoverTrigger as _PopoverTrigger,
  PopoverContent as _PopoverContent,
};
