import {
  createContext,
  useContext,
  type CSSProperties,
  type RefObject,
} from "react";

/**
 * Context value interface for CollapsibleMotion compound components
 */
export interface CollapsibleMotionContextValue {
  /** Function to toggle the expanded state */
  toggle: () => void;
  /** Whether the collapsible is currently expanded */
  isExpanded: boolean;
  /** Button props from React Aria for accessibility */
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    "aria-expanded"?: string | boolean;
    "aria-controls"?: string;
    disabled?: boolean;
  };
  /** Animation styles for the container */
  containerStyle: CSSProperties;
  /** Ref for the content element (for height measurement) */
  contentRef: RefObject<HTMLDivElement | null>;
  /** Panel props from React Aria for accessibility */
  panelProps: React.HTMLAttributes<HTMLDivElement>;
  /** Panel ref for React Aria (needs to be attached to the panel container) */
  panelRef: RefObject<HTMLDivElement | null>;
}

/**
 * React Context for sharing CollapsibleMotion state between compound components
 */
export const CollapsibleMotionContext = createContext<
  CollapsibleMotionContextValue | undefined
>(undefined);

/**
 * Custom hook to consume CollapsibleMotion context
 *
 * @throws {Error} When used outside of CollapsibleMotion.Root
 * @returns The CollapsibleMotion context value
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
