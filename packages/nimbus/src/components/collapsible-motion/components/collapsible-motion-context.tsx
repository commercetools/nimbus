import { createContext, useContext } from "react";
import type { CollapsibleMotionContextValue } from "../collapsible-motion.types";

/**
 * React Context for sharing CollapsibleMotion state between compound components
 */
export const CollapsibleMotionContext = createContext<
  CollapsibleMotionContextValue | undefined
>(undefined);

/**
 * Custom hook to consume CollapsibleMotion context
 */
export function useCollapsibleMotionContext(): CollapsibleMotionContextValue {
  const context = useContext(CollapsibleMotionContext);

  if (context === undefined) {
    throw new Error(
      "useCollapsibleMotionContext must be used within a CollapsibleMotion.Root component"
    );
  }

  return context;
}
