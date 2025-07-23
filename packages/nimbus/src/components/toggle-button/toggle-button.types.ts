import type { ToggleButtonRootProps } from "./toggle-button.slots";
import type { ToggleButtonProps as AriaToggleButtonProps } from "react-aria-components";

/**
 * Additional properties we want to exclude from the ToggleButton component.
 * These are chakra-ui props we don't want exposed for non-polymorphic components.
 */
type ExcludedProps =
  // chakra-ui props we don't want exposed
  "css" | "colorScheme" | "unstyled" | "recipe" | "as" | "asChild";

export interface ToggleButtonProps
  extends AriaToggleButtonProps,
    Omit<ToggleButtonRootProps, keyof AriaToggleButtonProps | ExcludedProps> {
  ref?: React.Ref<HTMLButtonElement>;
}
