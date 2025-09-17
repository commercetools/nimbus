import { useState, useRef, useEffect, forwardRef } from "react";
import { useId } from "react";
import type { CollapsibleMotionProps } from "./collapsible-motion.types";

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
  // State management - controlled vs uncontrolled
  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : uncontrolledExpanded;

  // Content measurement
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for ARIA attributes
  const panelId = `collapsible-panel-${useId()}`;

  // Toggle function
  const toggle = () => {
    if (disabled) return;

    const newExpanded = !isExpanded;

    if (isControlled) {
      onExpandedChange?.(newExpanded);
    } else {
      setUncontrolledExpanded(newExpanded);
    }
  };

  // Measure content height using ResizeObserver
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setMeasuredHeight(entries[0].contentRect.height);
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [children]); // Re-measure when children change

  // Calculate current height for animation
  const currentHeight = isExpanded ? measuredHeight || "auto" : minHeight;

  // ARIA props for trigger button
  const buttonProps = {
    "aria-expanded": isExpanded,
    "aria-controls": panelId,
    disabled: disabled || undefined,
  };

  // Container styles for animation
  const containerStyle: React.CSSProperties = {
    height: currentHeight,
    transition: `height ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    overflow: "hidden",
    visibility: minHeight === 0 && !isExpanded ? "hidden" : "visible",
  };

  return (
    <div ref={forwardedRef} {...props}>
      {renderTrigger?.({ toggle, isExpanded, buttonProps })}

      <div
        id={panelId}
        style={containerStyle}
        aria-hidden={!isExpanded}
        // Prevent focus on content when collapsed for accessibility
        tabIndex={isExpanded ? undefined : -1}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
});

CollapsibleMotion.displayName = "CollapsibleMotion";
