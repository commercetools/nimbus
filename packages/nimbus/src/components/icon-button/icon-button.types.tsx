import { type ButtonProps } from "../button";

// ============================================================
// MAIN PROPS
// ============================================================

export type IconButtonProps = ButtonProps & {
  /**
   * Required accessible label explaining the intended action
   */
  "aria-label": string;
  /**
   * Ref forwarding to the button element
   */
  ref?: React.Ref<HTMLButtonElement>;
};
