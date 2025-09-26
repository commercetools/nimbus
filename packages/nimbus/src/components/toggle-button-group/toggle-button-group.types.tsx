import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import { buttonGroupRecipe } from "./toggle-button-group.recipe";
import type {
  AriaToggleButtonGroupProps,
  AriaToggleButtonProps,
} from "react-aria";
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components";
import type { PropsWithChildren } from "react";

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
  PropsWithChildren<ToggleButtonGroupRootProps> & {
    ref?: React.Ref<typeof RacToggleButtonGroup>;
  };

/** Type signature for the main `ToggleButtonGroup` component. */
export type ToggleButtonGroupRootComponent = React.FC<ToggleButtonGroupProps>;

// ============================================================
// Button Sub-Component (`<ToggleButtonGroup.Button>`)
// ============================================================

/** Base Chakra styling props for the `button` slot. */
type ToggleButtonGroupButtonSlotProps = HTMLChakraProps<
  "button",
  RecipeProps<"button">
>;

// /** Combined props for the button element (Chakra styles + Aria behavior). */
// export type ToggleButtonGroupButtonProps = ToggleButtonGroupButtonSlotProps &
//   AriaToggleButtonProps & {
//     ref?: React.Ref<typeof RacToggleButton>;
//   };
//
// /** Type signature for the `ToggleButtonGroup.Button` sub-component. */
// export type ToggleButtonGroupButtonComponent =
//   React.FC<ToggleButtonGroupButtonProps>;

export interface ToggleButtonGroupRootProps
  extends HTMLChakraProps<"div">,
    AriaToggleButtonGroupProps,
    RecipeVariantProps<typeof buttonGroupRecipe> {
  children: ReactNode;
  ref?: React.Ref<typeof RacToggleButtonGroup>;
}

export interface ToggleButtonGroupButtonProps
  extends HTMLChakraProps<"button">,
    AriaToggleButtonProps {
  children: ReactNode;
  ref?: React.Ref<typeof RacToggleButton>;
}
