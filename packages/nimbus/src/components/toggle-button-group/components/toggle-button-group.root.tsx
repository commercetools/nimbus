import { ToggleButtonGroupRoot as ToggleButtonGroupRootSlot } from "../toggle-button-group.slots";
import type { ToggleButtonGroupRootProps } from "../toggle-button-group.types";

/**
 * A set of closely related, mutually exclusive or complementary actions that are important enough to be displayed directly in the interface for quick access.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/togglebuttongroup}
 */
export const ToggleButtonGroupRoot = (props: ToggleButtonGroupRootProps) => {
  const { ref, children, ...rest } = props;
  return (
    <ToggleButtonGroupRootSlot ref={ref} {...rest}>
      {children}
    </ToggleButtonGroupRootSlot>
  );
};
