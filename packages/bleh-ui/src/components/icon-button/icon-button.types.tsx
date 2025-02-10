import { type ButtonProps } from "@/components";

/**
 * Main props interface for the IconButton component.
 */

export interface IconButtonProps
  extends Omit<ButtonProps, "startIcon" | "endIcon"> {
  /** explains the intended action, required for accessibility */
  "aria-label": string;
}
