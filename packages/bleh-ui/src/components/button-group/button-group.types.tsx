import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
import { buttonGroupRecipe } from "./button-group.recipe";
import type {
  AriaToggleButtonGroupProps,
  AriaToggleButtonProps,
} from "react-aria";
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components";
import type {
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from "react";

// ============================================================
// Root Component (`<ButtonGroup>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
export type ButtonGroupRootSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"div">
>;

/** Combined props for the root element (Chakra styles + Aria behavior + Recipe variants). */
export type ButtonGroupRootProps = ButtonGroupRootSlotProps &
  AriaToggleButtonGroupProps &
  RecipeVariantProps<typeof buttonGroupRecipe>;

/** Final external props for the `<ButtonGroup>` component, including `children`. */
export type ButtonGroupProps = PropsWithChildren<ButtonGroupRootProps>;

/** Type signature for the main `ButtonGroup` component (using `forwardRef`). */
export type ButtonGroupRootComponent = ForwardRefExoticComponent<
  ButtonGroupProps & RefAttributes<typeof RacToggleButtonGroup>
>;

// ============================================================
// Button Sub-Component (`<ButtonGroup.Button>`)
// ============================================================

/** Base Chakra styling props for the `button` slot. */
export type ButtonGroupButtonSlotProps = HTMLChakraProps<
  "button",
  RecipeProps<"button">
>;

/** Combined props for the button element (Chakra styles + Aria behavior). */
export type ButtonGroupButtonProps = ButtonGroupButtonSlotProps &
  AriaToggleButtonProps;

/** Type signature for the `ButtonGroup.Button` sub-component (using `forwardRef`). */
export type ButtonGroupButtonComponent = ForwardRefExoticComponent<
  ButtonGroupButtonProps & RefAttributes<typeof RacToggleButton>
>;

// ============================================================
// Compound Component Definition
// ============================================================

/** Type signature for the ButtonGroup component including its static `.Button`. */
export type ButtonGroupComponent = ButtonGroupRootComponent & {
  Button: ButtonGroupButtonComponent;
};
