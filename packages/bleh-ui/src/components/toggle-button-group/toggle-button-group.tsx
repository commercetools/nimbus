import { forwardRef } from "react";
import {
  ToggleButtonGroupRoot,
  ToggleButtonGroupButton as ToggleButtonGroupButtonSlot,
} from "./toggle-button-group.slots";
import type {
  ToggleButtonGroupButtonComponent,
  ToggleButtonGroupComponent,
} from "./toggle-button-group.types";

/**
 * ToggleButtonGroup
 * ============================================================
 * To group multiple `Button` components together, visually and logically, representing a set of related actions.
 */

export const ToggleButtonGroup: ToggleButtonGroupComponent = forwardRef(
  ({ children, ...rest }, ref) => {
    return (
      <ToggleButtonGroupRoot ref={ref} {...rest}>
        {children}
      </ToggleButtonGroupRoot>
    );
  }
) as ToggleButtonGroupComponent; // Cast to ensure the type matches `ToggleButtonGroupComponent` so we can assign the `Button` sub-component later

ToggleButtonGroup.displayName = "ToggleButtonGroup";

const ToggleButton: ToggleButtonGroupButtonComponent = forwardRef(
  ({ children, ...rest }, ref) => {
    return (
      <ToggleButtonGroupButtonSlot {...rest} ref={ref}>
        {children}
      </ToggleButtonGroupButtonSlot>
    );
  }
);
ToggleButton.displayName = "ToggleButton";

ToggleButtonGroup.Button = ToggleButton;
