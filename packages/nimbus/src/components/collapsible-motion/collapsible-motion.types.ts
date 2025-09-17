/**
 * Props for the simplified CollapsibleMotion component
 */
export interface CollapsibleMotionProps {
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
    buttonProps: {
      "aria-expanded": boolean;
      "aria-controls": string;
      disabled?: boolean;
    };
  }) => React.ReactNode;

  /**
   * Data attributes for testing and analytics
   */
  [key: `data-${string}`]: unknown;
}
