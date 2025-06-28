import { PopoverRoot } from "./components/popover.root";
import { PopoverTrigger } from "./components/popover.trigger";
import { PopoverContent } from "./components/popover.content";

// Exports for internal use by react-docgen
export {
  PopoverRoot as _PopoverRoot,
  PopoverTrigger as _PopoverTrigger,
  PopoverContent as _PopoverContent,
};

// Export compound component object
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
};
