import type {
  ConditionalValue,
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { TextProps } from "../text/text";
import type { HeadingProps } from "../heading/heading";
import type { ButtonProps } from "../button/button.types";
import type { NimbusColorPalette } from "../../type-utils/shared-types";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type AlertRecipeProps = {
  /** Visual style variant of the alert */
  variant?: SlotRecipeProps<"nimbusAlert">["variant"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type AlertRootSlotProps = HTMLChakraProps<"div", AlertRecipeProps> & {
  /**
   * Color palette of the alert. Accepts every Nimbus palette. `critical`,
   * `warning`, `positive`, `info` and `primary` get their own icon; every
   * other palette gets the `neutral` icon. For a responsive value, the icon
   * and the default `role` come from the base value.
   */
  colorPalette?: ConditionalValue<NimbusColorPalette>;
};

export type AlertIconSlotProps = HTMLChakraProps<"div">;

export type AlertActionsSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Alert.Root component.
 */
export type AlertProps = OmitInternalProps<AlertRootSlotProps> & {
  [key: `data-${string}`]: unknown;
  ref?: React.Ref<HTMLDivElement>;
  /** Hides the status icon, including a custom `Alert.Icon`. */
  hideIcon?: boolean;
};

/**
 * Type signature for the main Alert component.
 */
export type AlertRootComponent = React.FC<AlertProps>;

/**
 * Props for the Alert.Icon component.
 */
export type AlertIconProps = AlertIconSlotProps;

/**
 * Props for the Alert.Title component.
 */
export type AlertTitleProps = Omit<HeadingProps, "ref"> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * Props for the Alert.Description component.
 */
export type AlertDescriptionProps = Omit<TextProps, "ref"> & {
  ref?: React.Ref<HTMLElement>;
};

/**
 * Props for the Alert.Actions component.
 */
export type AlertActionsProps = OmitInternalProps<AlertActionsSlotProps>;

/**
 * Props for the Alert.DismissButton component.
 */
export type AlertDismissButtonProps = OmitInternalProps<ButtonProps>;
