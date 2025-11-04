import type { ToggleButtonProps } from "../toggle-button/toggle-button.types";

// ============================================================
// MAIN PROPS
// ============================================================

export type IconToggleButtonProps = Omit<ToggleButtonProps, "aria-label"> & {
  /**
   * Required accessible label for the icon button
   */
  "aria-label": string;
  /**
   * Ref forwarding to the button element
   */
  ref?: React.Ref<HTMLButtonElement>;
};
