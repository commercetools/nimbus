import { forwardRef } from "react";
import { ToggleButtonGroupButton as ToggleButtonGroupButtonSlot } from "../toggle-button-group.slots";
import type { ToggleButtonGroupButtonComponent } from "../toggle-button-group.types";

const ToggleButtonGroupButton: ToggleButtonGroupButtonComponent = forwardRef(
  ({ children, ...rest }, ref) => {
    return (
      <ToggleButtonGroupButtonSlot {...rest} ref={ref}>
        {children}
      </ToggleButtonGroupButtonSlot>
    );
  }
);

ToggleButtonGroupButton.displayName = "ToggleButtonGroup.Button";

export default ToggleButtonGroupButton;
