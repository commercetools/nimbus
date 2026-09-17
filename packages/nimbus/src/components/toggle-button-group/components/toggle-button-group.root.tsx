import { useMemo } from "react";
import { ToggleButtonGroupRoot as ToggleButtonGroupRootSlot } from "../toggle-button-group.slots";
import {
  ToggleButtonContext,
  type ToggleButtonContextValue,
} from "@/components/toggle-button/toggle-button.context";
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
  const resolvedActiveFillStyle =
    activeFillStyle ?? (selectionMode === "multiple" ? "tint" : "solid");

  const contextValue = useMemo<ToggleButtonContextValue>(
    () => ({
      variant: props.variant,
      activeFillStyle: resolvedActiveFillStyle,
      size: props.size,
      colorPalette: props.colorPalette,
    }),
    [props.variant, resolvedActiveFillStyle, props.size, props.colorPalette]
  );

  return (
    <ToggleButtonContext.Provider value={contextValue}>
      <ToggleButtonGroupRootSlot
        ref={ref}
        activeFillStyle={resolvedActiveFillStyle}
        selectionMode={selectionMode}
        {...rest}
      >
        {children}
      </ToggleButtonGroupRootSlot>
    </ToggleButtonContext.Provider>
  );
};

ToggleButtonGroupRoot.displayName = "ToggleButtonGroup.Root";
