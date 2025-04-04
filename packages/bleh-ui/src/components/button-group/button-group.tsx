import { forwardRef } from "react";
import {
  ButtonGroupRoot,
  ButtonGroupButton as ButtonGroupButtonSlot,
} from "./button-group.slots";
import type {
  ButtonGroupButtonComponent,
  ButtonGroupComponent,
} from "./button-group.types";

/**
 * ButtonGroup
 * ============================================================
 * To group multiple `Button` components together, visually and logically, representing a set of related actions.
 */

export const ButtonGroup: ButtonGroupComponent = forwardRef(
  ({ children, ...rest }, ref) => {
    return (
      <ButtonGroupRoot ref={ref} {...rest}>
        {children}
      </ButtonGroupRoot>
    );
  }
) as ButtonGroupComponent; // Cast to ensure the type matches `ButtonGroupComponent` so we can assign the `Button` sub-component later

ButtonGroup.displayName = "ButtonGroup";

const ToggleButton: ButtonGroupButtonComponent = forwardRef(
  ({ children, ...rest }, ref) => {
    return (
      <ButtonGroupButtonSlot {...rest} ref={ref}>
        {children}
      </ButtonGroupButtonSlot>
    );
  }
);
ToggleButton.displayName = "ToggleButton";

ButtonGroup.Button = ToggleButton;
