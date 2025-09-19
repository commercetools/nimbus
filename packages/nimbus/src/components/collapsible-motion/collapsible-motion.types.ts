// Re-export compound component interfaces
export type { CollapsibleMotionRootProps } from "./components/collapsible-motion-root";
export type { CollapsibleMotionTriggerProps } from "./components/collapsible-motion-trigger";
export type { CollapsibleMotionContentProps } from "./components/collapsible-motion-content";
export type { CollapsibleMotionContextValue } from "./components/collapsible-motion-context";

/**
 * Props for the render prop version of CollapsibleMotion (backward compatibility)
 */
export interface CollapsibleMotionRenderPropProps {
  /**
   * The content to be collapsed/expanded
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
   * Render prop for the trigger element
   * Provides toggle function and current state
   */
  renderTrigger?: (props: {
    toggle: () => void;
    isExpanded: boolean;
    buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      "aria-expanded"?: string | boolean;
      "aria-controls"?: string;
      disabled?: boolean;
    };
  }) => React.ReactNode;

  /**
   * Data attributes for testing and analytics
   */
  [key: `data-${string}`]: unknown;
}
