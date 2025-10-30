import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { TextProps } from "../text";
import type { ButtonProps } from "../button";
import type { SemanticPalettesOnly } from "../../type-utils/shared-types";
import type { OmitUnwantedProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type AlertRecipeProps = {
  /** Visual style variant of the alert */
  variant?: SlotRecipeProps<"alert">["variant"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type AlertRootSlotProps = HTMLChakraProps<"div", AlertRecipeProps> & {
  /** Color palette variant of the alert */
  colorPalette?: Exclude<SemanticPalettesOnly, "neutral" | "primary">;
};

export type AlertIconSlotProps = HTMLChakraProps<"div">;

export type AlertActionsSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Alert.Root component.
 */
export type AlertProps = OmitUnwantedProps<AlertRootSlotProps> & {
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
export type AlertActionsProps = OmitUnwantedProps<AlertActionsSlotProps>;

/**
 * Props for the Alert.DismissButton component.
 */
export type AlertDismissButtonProps = OmitUnwantedProps<ButtonProps>;
