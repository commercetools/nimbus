import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { TextProps } from "../text";
import type { ButtonProps } from "../button";

// ============================================================
// RECIPE PROPS
// ============================================================

type AlertRecipeProps = {
  tone?: SlotRecipeProps<"alert">["tone"];
  variant?: SlotRecipeProps<"alert">["variant"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type AlertRootSlotProps = HTMLChakraProps<"div", AlertRecipeProps>;

export type AlertIconSlotProps = HTMLChakraProps<"div">;

export type AlertActionsSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Alert.Root component.
 */
export type AlertProps = AlertRootSlotProps & {
  [key: `data-${string}`]: unknown;
  ref?: React.Ref<HTMLDivElement>;
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
export type AlertTitleProps = Omit<TextProps, "ref"> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for the Alert.Description component.
 */
export type AlertDescriptionProps = Omit<TextProps, "ref"> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for the Alert.Actions component.
 */
export type AlertActionsProps = AlertActionsSlotProps;

/**
 * Props for the Alert.DismissButton component.
 */
export type AlertDismissButtonProps = ButtonProps;
