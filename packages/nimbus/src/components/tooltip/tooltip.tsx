import { TooltipRoot } from "./components/tooltip.root";
import { TooltipContent } from "./components/tooltip.content";

// Exports for internal use by react-docgen
export { TooltipRoot as _TooltipRoot, TooltipContent as _TooltipContent };

// Export compound component object
export const Tooltip = {
  Root: TooltipRoot,
  Content: TooltipContent,
};
