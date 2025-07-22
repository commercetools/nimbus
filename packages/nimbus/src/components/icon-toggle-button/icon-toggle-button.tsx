import { ToggleButton } from "@/components/toggle-button";
import type { IconToggleButtonProps } from "./icon-toggle-button.types";

/**
 * IconToggleButton
 * ============================================================
 * A toggle button with only an icon as child. It is based
 * on the regular `ToggleButton` component, but with a few adjustments.
 * 
 * Features:
 * - Requires aria-label for accessibility
 * - Square aspect ratio with no padding
 * - All ToggleButton functionality preserved
 */
export const IconToggleButton = ({ 
  "aria-label": ariaLabel, 
  children, 
  ref,
  ...props 
}: IconToggleButtonProps) => {
  return (
    <ToggleButton
      ref={ref}
      aria-label={ariaLabel}
      px={0}
      py={0}
      {...props}
    >
      {children}
    </ToggleButton>
  );
};

IconToggleButton.displayName = "IconToggleButton";