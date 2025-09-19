import React, { forwardRef } from "react";
import { useCollapsibleMotionContext } from "./collapsible-motion-context";

/**
 * Props for CollapsibleMotion.Trigger component
 */
export interface CollapsibleMotionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The trigger element content (typically a button or clickable element)
   */
  children: React.ReactNode;
}

/**
 * CollapsibleMotion.Trigger - The trigger button that toggles the collapsible content
 *
 * This component renders a button with proper ARIA attributes for accessibility.
 * It automatically handles the toggle functionality when clicked.
 *
 * @example
 * ```tsx
 * <CollapsibleMotion.Root>
 *   <CollapsibleMotion.Trigger>
 *     <Button>Toggle Content</Button>
 *   </CollapsibleMotion.Trigger>
 *   <CollapsibleMotion.Content>
 *     Content here
 *   </CollapsibleMotion.Content>
 * </CollapsibleMotion.Root>
 * ```
 *
 * @example
 * Custom styling:
 * ```tsx
 * <CollapsibleMotion.Trigger className="custom-trigger" onClick={customHandler}>
 *   <span>Custom Trigger</span>
 * </CollapsibleMotion.Trigger>
 * ```
 */
export const CollapsibleMotionTrigger = forwardRef<
  HTMLButtonElement,
  CollapsibleMotionTriggerProps
>(function CollapsibleMotionTrigger(
  { children, onClick, ...props },
  forwardedRef
) {
  const { buttonProps, toggle } = useCollapsibleMotionContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Call the toggle function from context
    toggle();
    // Call custom onClick if provided
    onClick?.(event);
  };

  // If children is a single React element, clone it with the button props
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      ref: forwardedRef,
      ...buttonProps,
      ...props,
      onClick: handleClick,
      // Preserve existing props from the child
      ...(children.props || {}),
    });
  }

  // Fallback: wrap in button if children is not a valid React element
  return (
    <button
      ref={forwardedRef}
      {...buttonProps}
      {...props}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});

CollapsibleMotionTrigger.displayName = "CollapsibleMotion.Trigger";
