import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { TextProps } from "../text/text";
import type { HeadingProps } from "../heading/heading";
import type { ButtonProps } from "../button/button.types";
import type { SemanticPalettesOnly } from "../../type-utils/shared-types";
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
export type AlertProps = OmitInternalProps<AlertRootSlotProps> & {
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
 * Props for the Alert.Title component. Renders the Nimbus `Heading` primitive;
 * defaults to a non-heading element (`as="p"`), overridable via `as`.
 */
export type AlertTitleProps = Omit<HeadingProps, "ref"> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * Props for the Alert.Description component. Renders the Nimbus `Text` primitive.
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
