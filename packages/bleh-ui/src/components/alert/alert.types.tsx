import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
import { alertRecipe } from "./alert.recipe";
import type { TextProps } from "../text";
import type { ButtonProps } from "../button";
import type { PropsWithChildren } from "react";

/**
 * Slot component types
 */

export type AlertRootProps = HTMLChakraProps<"div", RecipeProps<"div">>;

export type AlertTitleProps = TextProps;

export type AlertDescriptionProps = TextProps;

export type AlertIconProps = HTMLChakraProps<"div", RecipeProps<"div">>;

export type AlertActionsProps = HTMLChakraProps<"div", RecipeProps<"div">>;

export type AlertDismissButtonProps = ButtonProps;

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type AlertVariantProps = AlertRootProps &
  RecipeVariantProps<typeof alertRecipe> & {
    [key: `data-${string}`]: unknown;
  };

/**
 * Main props interface for the Alert component.
 * Extends AlertVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type AlertProps = PropsWithChildren<AlertVariantProps>;
