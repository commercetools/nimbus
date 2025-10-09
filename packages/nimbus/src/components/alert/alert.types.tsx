import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";
import type { TextProps } from "../text";
import type { ButtonProps } from "../button";

// ============================================================
// Root Component (`<Alert>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
export type AlertRootProps = HTMLChakraProps<"div">;

type AlertRecipeVariantProps = {
  /** Tone variant */
  tone?: "critical" | "info" | "warning" | "positive";
  /** Variant variant */
  variant?: "flat" | "outlined";
};

/** Final external props for the `<Alert>` component (variants + children + data-* attrs). */
// TODO: Why do we need to omit the tone and variant props to have the types parse correctly?
export type AlertProps = Omit<AlertRootProps, "tone" | "variant"> & {
  // Allow passthrough of data-* attributes
  [key: `data-${string}`]: unknown;
  ref?: React.Ref<HTMLDivElement>;
} & AlertRecipeVariantProps;

/** Type signature for the main `Alert` component. */
export type AlertRootComponent = React.FC<AlertProps>;

// ============================================================
// Icon Slot
// ============================================================

/** Base Chakra styling props for the `icon` slot (`div`). */
export type AlertIconProps = HTMLChakraProps<"div">;

// ============================================================
// Title Sub-Component (`<Alert.Title>`)
// ============================================================

/** Props for the `Alert.Title` sub-component (inherits from Text). */
export type AlertTitleProps = Omit<TextProps, "ref"> & {
  ref?: React.Ref<HTMLDivElement>;
};

// ============================================================
// Description Sub-Component (`<Alert.Description>`)
// ============================================================

/** Props for the `Alert.Description` sub-component (inherits from Text). */
export type AlertDescriptionProps = Omit<TextProps, "ref"> & {
  ref?: React.Ref<HTMLDivElement>;
};

// ============================================================
// Actions Sub-Component (`<Alert.Actions>`)
// ============================================================

/** Base Chakra styling props for the `actions` slot (`div`). */
export type AlertActionsProps = HTMLChakraProps<"div">;

// ============================================================
// DismissButton Sub-Component (`<Alert.DismissButton>`)
// ============================================================

/** Props for the `Alert.DismissButton` sub-component (inherits from Button). */
export type AlertDismissButtonProps = ButtonProps;
