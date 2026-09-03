import { ToggleButtonGroupRoot as ToggleButtonGroupRootSlot } from "../toggle-button-group.slots";
import type { ToggleButtonGroupRootComponent } from "../toggle-button-group.types";

/**
 * # ToggleButtonGroup
 *
 * A set of closely related, mutually exclusive or complementary actions that are important enough to be displayed directly in the interface for quick access.
 *
 */
export const ToggleButtonGroupRoot: ToggleButtonGroupRootComponent = (
  props
) => {
  const { ref, children, activeFillStyle, selectionMode, ...rest } = props;
  // FEC-1170: default the active-fill weight from selectionMode. Single-select
  // leads the eye with a solid fill; multi-select stays quiet (tint) so several
  // active buttons don't compete for attention. Explicitly overridable via the
  // `activeFillStyle` prop.
  const resolvedActiveFillStyle =
    activeFillStyle ?? (selectionMode === "multiple" ? "tint" : "solid");
  return (
    <ToggleButtonGroupRootSlot
      ref={ref}
      activeFillStyle={resolvedActiveFillStyle}
      selectionMode={selectionMode}
      {...rest}
    >
      {children}
    </ToggleButtonGroupRootSlot>
  );
};

ToggleButtonGroupRoot.displayName = "ToggleButtonGroup.Root";
