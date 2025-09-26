import { ToggleButtonGroupButton as ToggleButtonGroupButtonSlot } from "../toggle-button-group.slots";
import type { ToggleButtonGroupButtonProps } from "../toggle-button-group.types";

export const ToggleButtonGroupButton = (
  props: ToggleButtonGroupButtonProps
) => {
  const { ref, children, ...rest } = props;
  return (
    <ToggleButtonGroupButtonSlot {...rest} ref={ref}>
      {children}
    </ToggleButtonGroupButtonSlot>
  );
};
