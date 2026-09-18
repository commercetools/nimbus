import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { AriaCheckboxProps } from "react-aria";

// ============================================================
// RECIPE PROPS
// ============================================================

type SwitchRecipeProps = SlotRecipeProps<"nimbusSwitch">;

// ============================================================
// SLOT PROPS
// ============================================================

export type SwitchRootSlotProps = HTMLChakraProps<"label", SwitchRecipeProps>;

export type SwitchLabelSlotProps = HTMLChakraProps<"span">;

export type SwitchTrackSlotProps = HTMLChakraProps<"span">;

export type SwitchThumbSlotProps = HTMLChakraProps<"span">;

// ============================================================
// HELPER TYPES
// ============================================================

type ExcludedSwitchProps =
  | "isIndeterminate"
  | "colorScheme"
  | "validationState"
  | "validationBehavior"
  | "validate";

// ============================================================
// MAIN PROPS
// ============================================================

export type SwitchProps = OmitInternalProps<
  SwitchRootSlotProps,
  ExcludedSwitchProps | "onChange"
> &
  Omit<AriaCheckboxProps, ExcludedSwitchProps> & {
    /**
     * The label content to display next to the switch
     */
    children?: React.ReactNode;
    /**
     * Ref forwarding to the input element
     */
    ref?: React.Ref<HTMLInputElement>;
  };
