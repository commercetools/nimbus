import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";

interface UseCollapsibleAnimationOptions {
  /** Whether the collapsible is expanded */
  isExpanded: boolean;
  /** Minimum height when collapsed (default: 0) */
  minHeight?: number;
}

/**
 * Custom hook for collapsible animation that handles height measurement and dynamic styles
 *
 * This hook provides automatic height measurement using ResizeObserver and returns
 * only the dynamic styles and data attributes needed for slot-based collapsible animations.
 * Static styles (transition, overflow, visibility) are handled by the recipe system.
 *
 * @param children - The content whose height should be measured (used as dependency for re-measurement)
 * @param options - Configuration options for the animation
 * @returns Object containing dynamic styles, data attributes, and content ref
 *
 * @example
 * ```tsx
 * const { dynamicStyles, dataAttributes, contentRef } = useCollapsibleAnimation(children, {
 *   isExpanded: true,
 *   minHeight: 0
 * });
 *
 * return (
 *   <CollapsibleMotionContentSlot
 *     {...dataAttributes}
 *     style={dynamicStyles}
 *   >
 *     <div ref={contentRef}>
 *       {children}
 *     </div>
 *   </CollapsibleMotionContentSlot>
 * );
 * ```
 */
export function useCollapsibleAnimation(
  children: ReactNode,
  options: UseCollapsibleAnimationOptions
) {
  const { isExpanded, minHeight = 0 } = options;
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const measureContent = () => {
      if (contentRef.current) {
        // Use scrollHeight to get the full content height regardless of current container height
        const height = contentRef.current.scrollHeight;
        if (height > 0) {
          setMeasuredHeight(height);
        }
      }
    };

    // Measure immediately on mount and when children change
    measureContent();

    // Also observe for dynamic content changes
    const observer = new ResizeObserver(() => {
      measureContent();
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [children]);

  // TODO: minheight is not working as expected
  // Calculate current height for animation - this is the only truly dynamic value
  const currentHeight = isExpanded
    ? measuredHeight !== null
      ? `${measuredHeight}px`
      : "auto"
    : typeof minHeight === "number"
      ? `${minHeight}px`
      : minHeight;

  // Only dynamic inline styles that can't be handled by recipe
  const dynamicStyles: CSSProperties = {
    height: currentHeight,
  };

  // Data attributes for recipe-based conditional styling
  const dataAttributes = {
    "data-expanded": isExpanded ? "true" : "false",
    "data-min-height": minHeight.toString(),
  } as const;

  return {
    dynamicStyles,
    dataAttributes,
    contentRef,
  };
}
