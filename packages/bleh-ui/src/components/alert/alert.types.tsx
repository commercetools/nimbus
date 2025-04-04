import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
import { alertRecipe } from "./alert.recipe";
import type { TextProps } from "../text";
import type { ButtonProps } from "../button";
import type {
  FC,
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from "react";

// ============================================================
// Root Component (`<Alert>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
export type AlertRootProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined root props including Chakra styles and recipe variants. */
type AlertVariantProps = AlertRootProps &
  RecipeVariantProps<typeof alertRecipe>;

/** Final external props for the `<Alert>` component (variants + children + data-* attrs). */
export type AlertProps = PropsWithChildren<AlertVariantProps> & {
  // Allow passthrough of data-* attributes
  [key: `data-${string}`]: unknown;
};

/** Type signature for the main `Alert` component (using `forwardRef`). */
type AlertRootComponent = ForwardRefExoticComponent<
  AlertProps & RefAttributes<HTMLDivElement>
>;

// ============================================================
// Icon Slot
// ============================================================

/** Base Chakra styling props for the `icon` slot (`div`). */
export type AlertIconProps = HTMLChakraProps<"div", RecipeProps<"div">>;

// ============================================================
// Title Sub-Component (`<Alert.Title>`)
// ============================================================

/** Props for the `Alert.Title` sub-component (inherits from Text). */
export type AlertTitleProps = TextProps;

// ============================================================
// Description Sub-Component (`<Alert.Description>`)
// ============================================================

/** Props for the `Alert.Description` sub-component (inherits from Text). */
export type AlertDescriptionProps = TextProps;

// ============================================================
// Actions Sub-Component (`<Alert.Actions>`)
// ============================================================

/** Base Chakra styling props for the `actions` slot (`div`). */
export type AlertActionsProps = HTMLChakraProps<"div", RecipeProps<"div">>;

// ============================================================
// DismissButton Sub-Component (`<Alert.DismissButton>`)
// ============================================================

/** Props for the `Alert.DismissButton` sub-component (inherits from Button). */
export type AlertDismissButtonProps = ButtonProps;

// ============================================================
// Compound Component Definition
// ============================================================

/**
 * Type signature for the complete Alert component, including:
 * - The main Alert component (ForwardRefExoticComponent accepting AlertProps).
 * - Static sub-components (Title, Description, Actions, DismissButton).
 */
export type AlertComponent = AlertRootComponent & {
  Title: FC<AlertTitleProps>;
  Description: FC<AlertDescriptionProps>;
  Actions: FC<AlertActionsProps>;
  DismissButton: FC<AlertDismissButtonProps>;
};
