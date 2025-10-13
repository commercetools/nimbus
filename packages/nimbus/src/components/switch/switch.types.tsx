import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { AriaCheckboxProps } from "react-aria";

type SwitchRecipeProps = SlotRecipeProps<"switch">;

export type SwitchRootProps = HTMLChakraProps<"label", SwitchRecipeProps>;

export type SwitchLabelProps = HTMLChakraProps<"span">;

export type SwitchTrackProps = HTMLChakraProps<"span">;

export type SwitchThumbProps = HTMLChakraProps<"span">;

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
 * Main props interface for the Switch component.
 * Combines root element props with ARIA toggle functionality props.
 */
export type SwitchProps = Omit<
  SwitchRootProps,
  ExcludedSwitchProps | "onChange"
> &
  Omit<AriaCheckboxProps, ExcludedSwitchProps> & {
    /**
     * The content to display next to the switch.
     * Can be a string or React node.
     */
    children?: React.ReactNode;
    ref?: React.Ref<HTMLInputElement>;
  };
