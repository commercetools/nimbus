import { forwardRef } from "react";
import { ToggleButtonGroupRoot as ToggleButtonGroupRootSlot } from "../toggle-button-group.slots";
import type { ToggleButtonGroupRootComponent } from "../toggle-button-group.types";

const ToggleButtonGroupRoot: ToggleButtonGroupRootComponent = forwardRef(
  ({ children, ...rest }, ref) => {
    return (
      <ToggleButtonGroupRootSlot ref={ref} {...rest}>
        {children}
      </ToggleButtonGroupRootSlot>
    );
  }
);

ToggleButtonGroupRoot.displayName = "ToggleButtonGroup.Root";

export default ToggleButtonGroupRoot;
