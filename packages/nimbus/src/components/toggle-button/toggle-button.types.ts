import type { ToggleButtonRootProps } from "./toggle-button.slots";
import type { ToggleButtonProps as AriaToggleButtonProps } from "react-aria-components";

type ToggleButtonRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "xs" | "md" | "2xs";
  /**
   * Variant variant
   * @default "outline"
   */
  variant?: "outline" | "ghost";
  /**
   * Tone variant
   * @default "primary"
   */
  tone?: "primary" | "critical" | "neutral" | "info";
};

/**
 * Additional properties we want to exclude from the ToggleButton component.
 * These are chakra-ui props we don't want exposed for non-polymorphic components.
 */
type ExcludedProps =
  // chakra-ui props we don't want exposed
  "css" | "colorScheme" | "unstyled" | "recipe" | "as" | "asChild";

export type ToggleButtonProps = ToggleButtonRecipeVariantProps &
  AriaToggleButtonProps &
  Omit<ToggleButtonRootProps, keyof AriaToggleButtonProps | ExcludedProps> & {
    /**
     * Ref to the underlying button element
     */
    ref?: React.Ref<HTMLButtonElement>;
  };
