import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
import { buttonGroupRecipe } from "./toggle-button-group.recipe";
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
// Root Component (`<ToggleButtonGroup>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type ToggleButtonGroupRootSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"div">
>;

/** Combined props for the root element (Chakra styles + Aria behavior + Recipe variants). */
type ToggleButtonGroupRootProps = ToggleButtonGroupRootSlotProps &
  AriaToggleButtonGroupProps &
  RecipeVariantProps<typeof buttonGroupRecipe>;

/** Final external props for the `<ToggleButtonGroup>` component, including `children`. */
export type ToggleButtonGroupProps =
  PropsWithChildren<ToggleButtonGroupRootProps>;

/** Type signature for the main `ToggleButtonGroup` component (using `forwardRef`). */
type ToggleButtonGroupRootComponent = ForwardRefExoticComponent<
  ToggleButtonGroupProps & RefAttributes<typeof RacToggleButtonGroup>
>;

// ============================================================
// Button Sub-Component (`<ToggleButtonGroup.Button>`)
// ============================================================

/** Base Chakra styling props for the `button` slot. */
type ToggleButtonGroupButtonSlotProps = HTMLChakraProps<
  "button",
  RecipeProps<"button">
>;

/** Combined props for the button element (Chakra styles + Aria behavior). */
export type ToggleButtonGroupButtonProps = ToggleButtonGroupButtonSlotProps &
  AriaToggleButtonProps;

/** Type signature for the `ToggleButtonGroup.Button` sub-component (using `forwardRef`). */
export type ToggleButtonGroupButtonComponent = ForwardRefExoticComponent<
  ToggleButtonGroupButtonProps & RefAttributes<typeof RacToggleButton>
>;

// ============================================================
// Compound Component Definition
// ============================================================

/** Type signature for the ToggleButtonGroup component including its static `.Button`. */
export type ToggleButtonGroupComponent = ToggleButtonGroupRootComponent & {
  Button: ToggleButtonGroupButtonComponent;
};
