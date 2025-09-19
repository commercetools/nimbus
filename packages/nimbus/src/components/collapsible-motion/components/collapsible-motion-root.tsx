import { useRef, forwardRef } from "react";
import { useDisclosure } from "react-aria";
import { useDisclosureState } from "react-stately";
import { useCollapsibleAnimation } from "../hooks/use-collapsible-animation";
import { CollapsibleMotionContext } from "./collapsible-motion-context";

/**
 * Props for CollapsibleMotion.Root component
 */
export interface CollapsibleMotionRootProps {
  /**
   * The child components (Trigger and Content)
   */
  children: React.ReactNode;

  /**
   * Whether the content is expanded by default (uncontrolled mode)
   */
  defaultExpanded?: boolean;

  /**
   * Whether the content is expanded (controlled mode)
   */
  isExpanded?: boolean;

  /**
   * Callback fired when the expanded state changes
   */
  onExpandedChange?: (isExpanded: boolean) => void;

  /**
   * Duration of the expand/collapse animation in milliseconds
   * @default 200
   */
  animationDuration?: number;

  /**
   * The minimum height of the content when collapsed (in pixels)
   * @default 0
   */
  minHeight?: number;

  /**
   * Whether the collapsible is disabled
   */
  disabled?: boolean;

  /**
   * Data attributes for testing and analytics
   */
  [key: `data-${string}`]: unknown;
}

/**
 * CollapsibleMotion.Root - The root container component that manages state and provides context
 *
 * This component contains all the state management logic and provides context to
 * CollapsibleMotion.Trigger and CollapsibleMotion.Content components.
 *
 * ## Features
 * - 🎨 Smooth height animations with CSS transitions
 * - ♿ Proper ARIA attributes for accessibility
 * - 🎛️ Both controlled and uncontrolled modes
 * - 🎯 Focus management for screen readers
 * - 📱 Responsive and mobile-friendly
 * - ⚡ High performance with ResizeObserver
 *
 * ## Usage
 *
 * ### Basic Usage
 * ```tsx
 * <CollapsibleMotion.Root>
 *   <CollapsibleMotion.Trigger>
 *     <Button>Toggle Content</Button>
 *   </CollapsibleMotion.Trigger>
 *   <CollapsibleMotion.Content>
 *     <Box p={4}>This content will expand and collapse smoothly</Box>
 *   </CollapsibleMotion.Content>
 * </CollapsibleMotion.Root>
 * ```
 *
 * ### Controlled Usage
 * ```tsx
 * const [expanded, setExpanded] = useState(false);
 *
 * <CollapsibleMotion.Root
 *   isExpanded={expanded}
 *   onExpandedChange={setExpanded}
 * >
 *   <CollapsibleMotion.Trigger>
 *     <Button>Toggle Content</Button>
 *   </CollapsibleMotion.Trigger>
 *   <CollapsibleMotion.Content>
 *     <Box p={4}>Controlled collapsible content</Box>
 *   </CollapsibleMotion.Content>
 * </CollapsibleMotion.Root>
 * ```
 */
export const CollapsibleMotionRoot = forwardRef<
  HTMLDivElement,
  CollapsibleMotionRootProps
>(function CollapsibleMotionRoot(
  {
    children,
    defaultExpanded = false,
    isExpanded: controlledExpanded,
    onExpandedChange,
    animationDuration = 200,
    minHeight = 0,
    disabled = false,
    ...props
  },
  forwardedRef
) {
  // Use React Aria's disclosure state management
  const disclosureState = useDisclosureState({
    defaultExpanded,
    isExpanded: controlledExpanded,
    onExpandedChange,
  });

  // Animation styles using custom hook
  const { containerStyle, contentRef } = useCollapsibleAnimation(children, {
    isExpanded: disclosureState.isExpanded,
    minHeight,
    animationDuration,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  // Use React Aria's disclosure hook for ARIA props
  const { buttonProps, panelProps } = useDisclosure(
    { isDisabled: disabled },
    disclosureState,
    panelRef
  );

  // Toggle function that respects disabled state
  const toggle = () => {
    if (disabled) return;
    disclosureState.toggle();
  };

  // Context value to provide to child components
  const contextValue = {
    toggle,
    isExpanded: disclosureState.isExpanded,
    buttonProps,
    containerStyle,
    contentRef,
    panelProps,
    panelRef,
  };

  return (
    <CollapsibleMotionContext.Provider value={contextValue}>
      <div ref={forwardedRef} {...props}>
        {children}
      </div>
    </CollapsibleMotionContext.Provider>
  );
});

CollapsibleMotionRoot.displayName = "CollapsibleMotion.Root";
