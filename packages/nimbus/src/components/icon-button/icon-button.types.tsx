import { type ButtonProps } from "@/components";

/**
 * Main props interface for the IconButton component.
 */

export interface IconButtonProps extends ButtonProps {
  /** explains the intended action, required for accessibility */
  "aria-label": string;
}
