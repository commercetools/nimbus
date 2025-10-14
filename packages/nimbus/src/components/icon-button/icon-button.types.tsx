import { type ButtonProps } from "../button";

// ============================================================
// MAIN PROPS
// ============================================================

export type IconButtonProps = ButtonProps & {
  /** explains the intended action, required for accessibility */
  "aria-label": string;
  ref?: React.Ref<HTMLButtonElement>;
};
