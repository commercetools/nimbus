import { CollapsibleMotionRoot } from "./components/collapsible-motion-root";
import { CollapsibleMotionTrigger } from "./components/collapsible-motion-trigger";
import { CollapsibleMotionContent } from "./components/collapsible-motion-content";

// Exports for internal use by react-docgen
export {
  CollapsibleMotionRoot as _CollapsibleMotionRoot,
  CollapsibleMotionTrigger as _CollapsibleMotionTrigger,
  CollapsibleMotionContent as _CollapsibleMotionContent,
};

export const CollapsibleMotion = {
  Root: CollapsibleMotionRoot,
  Trigger: CollapsibleMotionTrigger,
  Content: CollapsibleMotionContent,
};
