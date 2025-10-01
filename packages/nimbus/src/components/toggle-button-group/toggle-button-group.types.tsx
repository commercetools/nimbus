import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import { buttonGroupRecipe } from "./toggle-button-group.recipe";
import type {
  AriaToggleButtonGroupProps,
  AriaToggleButtonProps,
} from "react-aria";
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components";

// ============================================================
// Root Component (`<ToggleButtonGroup>`)
// ============================================================

/** Combined props for the root element (Chakra styles + Aria behavior + Recipe variants). */
export interface ToggleButtonGroupRootProps
  extends AriaToggleButtonGroupProps,
    RecipeVariantProps<typeof buttonGroupRecipe> {
  children: React.ReactNode;
  ref?: React.Ref<typeof RacToggleButtonGroup>;
}

/** Final external props for the `<ToggleButtonGroup>` component. */
export type ToggleButtonGroupProps = ToggleButtonGroupRootProps;

/** Type signature for the main `ToggleButtonGroup` component. */
export type ToggleButtonGroupRootComponent = React.FC<ToggleButtonGroupProps>;

// ============================================================
// Button Sub-Component (`<ToggleButtonGroup.Button>`)
// ============================================================

/** Combined props for the button element (Chakra styles + Aria behavior). */
export interface ToggleButtonGroupButtonProps extends AriaToggleButtonProps {
  children: React.ReactNode;
  ref?: React.Ref<typeof RacToggleButton>;
}

/** Type signature for the `ToggleButtonGroup.Button` sub-component. */
export type ToggleButtonGroupButtonComponent =
  React.FC<ToggleButtonGroupButtonProps>;
