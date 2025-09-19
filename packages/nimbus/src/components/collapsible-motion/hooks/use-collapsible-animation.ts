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
  /** Animation duration in milliseconds (default: 200) */
  animationDuration?: number;
}

/**
 * Custom hook for collapsible animation that handles height measurement and animation styles
 *
 * This hook provides automatic height measurement using ResizeObserver and returns
 * the complete animation styles needed for smooth collapsible animations.
 *
 * @param children - The content whose height should be measured (used as dependency for re-measurement)
 * @param options - Configuration options for the animation
 * @returns Object containing animation styles and content ref
 *
 * @example
 * ```tsx
 * const { containerStyle, contentRef } = useCollapsibleAnimation(children, {
 *   isExpanded: true,
 *   minHeight: 0,
 *   animationDuration: 200
 * });
 *
 * return (
 *   <div style={containerStyle}>
 *     <div ref={contentRef}>
 *       {children}
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useCollapsibleAnimation(
  children: ReactNode,
  options: UseCollapsibleAnimationOptions
) {
  const { isExpanded, minHeight = 0, animationDuration = 200 } = options;
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

  // Calculate current height for animation
  const currentHeight = isExpanded ? measuredHeight || "auto" : minHeight;

  // Container styles for animation
  const containerStyle: CSSProperties = {
    height: currentHeight,
    transition: `height ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    overflow: "hidden",
    visibility: minHeight === 0 && !isExpanded ? "hidden" : "visible",
  };

  return {
    containerStyle,
    contentRef,
  };
}
