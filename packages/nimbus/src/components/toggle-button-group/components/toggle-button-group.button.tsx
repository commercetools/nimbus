import { ToggleButtonGroupButton as ToggleButtonGroupButtonSlot } from "../toggle-button-group.slots";
import type { ToggleButtonGroupButtonComponent } from "../toggle-button-group.types";

export const ToggleButtonGroupButton: ToggleButtonGroupButtonComponent = (
  props
) => {
  const { ref, children, ...rest } = props;
  return (
    <ToggleButtonGroupButtonSlot {...rest} ref={ref}>
      {children}
    </ToggleButtonGroupButtonSlot>
  );
};

ToggleButtonGroupButton.displayName = "ToggleButtonGroup.Button";
