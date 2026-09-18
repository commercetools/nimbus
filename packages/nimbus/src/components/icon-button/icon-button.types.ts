import { type ButtonProps } from "../button/button.types";

// ============================================================
// MAIN PROPS
// ============================================================

export type IconButtonProps = ButtonProps & {
  /**
   * Accessible label explaining the intended action.
   *
   * Required unless provided via React Aria's ButtonContext (when using `slot` attribute).
   * A runtime warning will be logged if neither the prop nor context provides an aria-label.
   *
   * @example
   * ```tsx
   * // Direct usage - aria-label required
   * <IconButton aria-label="Delete item"><Icons.Delete /></IconButton>
   *
   * // With slot - aria-label provided by context
   * <IconButton slot="clear"><Icons.Close /></IconButton>
   * ```
   */
  "aria-label"?: string;
  /**
   * Ref forwarding to the button element
   */
  ref?: React.Ref<HTMLButtonElement>;
};
