import { ToggleButtonGroupRoot as ToggleButtonGroupRootSlot } from "../toggle-button-group.slots";
import type { ToggleButtonGroupRootComponent } from "../toggle-button-group.types";

export const ToggleButtonGroupRoot: ToggleButtonGroupRootComponent = (
  props
) => {
  const { ref, children, ...rest } = props;
  return (
    <ToggleButtonGroupRootSlot ref={ref} {...rest}>
      {children}
    </ToggleButtonGroupRootSlot>
  );
};

ToggleButtonGroupRoot.displayName = "ToggleButtonGroup.Root";
