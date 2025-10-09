import { type ButtonProps } from "../button";

/**
 * Main props interface for the IconButton component.
 */

export type IconButtonProps = ButtonProps & {
  /** explains the intended action, required for accessibility */
  "aria-label": string;
  ref?: React.Ref<HTMLButtonElement>;
};
