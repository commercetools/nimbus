import { useRef, forwardRef } from "react";
import type { CollapsibleMotionProps } from "./collapsible-motion.types";
import { useDisclosure } from "react-aria";
import { useDisclosureState } from "react-stately";
import { useCollapsibleAnimation } from "./hooks/use-collapsible-animation";

/**
 * CollapsibleMotion - A simple, performant component for smooth collapsible content
 *
 * This simplified implementation provides the same functionality as the complex version
 * but with significantly less code and better performance. Uses CSS transitions and
 * ResizeObserver for smooth, efficient animations.
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
 * <CollapsibleMotion
 *   renderTrigger={({ toggle, isExpanded }) => (
 *     <button onClick={toggle}>
 *       {isExpanded ? 'Collapse' : 'Expand'}
 *     </button>
 *   )}
 * >
 *   <p>This content will expand and collapse smoothly</p>
 * </CollapsibleMotion>
 * ```
 *
 * ### Controlled Usage
 * ```tsx
 * const [expanded, setExpanded] = useState(false);
 *
 * <CollapsibleMotion
 *   isExpanded={expanded}
 *   onExpandedChange={setExpanded}
 *   renderTrigger={({ toggle, isExpanded, buttonProps }) => (
 *     <button {...buttonProps} onClick={toggle}>
 *       Toggle Content
 *     </button>
 *   )}
 * >
 *   <p>Controlled collapsible content</p>
 * </CollapsibleMotion>
 * ```
 */
export const CollapsibleMotion = forwardRef<
  HTMLDivElement,
  CollapsibleMotionProps
>(function CollapsibleMotion(
  {
    children,
    defaultExpanded = false,
    isExpanded: controlledExpanded,
    onExpandedChange,
    animationDuration = 200,
    minHeight = 0,
    disabled = false,
    renderTrigger,
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

  // React Aria handles ARIA attributes automatically via panelProps

  // Toggle function that respects disabled state
  const toggle = () => {
    if (disabled) return;
    disclosureState.toggle();
  };

  return (
    <div ref={forwardedRef} {...props}>
      {renderTrigger?.({
        toggle,
        isExpanded: disclosureState.isExpanded,
        buttonProps,
      })}

      <div
        ref={panelRef}
        {...panelProps}
        style={{
          ...containerStyle,
          ...panelProps.style,
        }}
        // Prevent focus on content when collapsed for accessibility
        tabIndex={disclosureState.isExpanded ? undefined : -1}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
});

CollapsibleMotion.displayName = "CollapsibleMotion";
