import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";
import type { AriaCheckboxProps } from "react-aria";

type SwitchRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "sm" | "md";
};

/**
 * List of props that should be excluded from the root props when combining with ARIA props
 */
export type ExcludedSwitchProps =
  | "asChild"
  | "isIndeterminate"
  | "colorScheme"
  | "validationState"
  | "validationBehavior"
  | "validate";

/**
 * Props for the Switch component root element.
 */
export type SwitchRootProps = HTMLChakraProps<"label">;

/**
 * Main props interface for the Switch component.
 * Combines root element props with ARIA toggle functionality props.
 */
export type SwitchProps = SwitchRecipeVariantProps &
  Omit<SwitchRootProps, ExcludedSwitchProps | "onChange"> &
  Omit<AriaCheckboxProps, ExcludedSwitchProps> & {
    /**
     * The content to display next to the switch.
     * Can be a string or React node.
     */
    children?: React.ReactNode;
    ref?: React.Ref<HTMLInputElement>;
  };
