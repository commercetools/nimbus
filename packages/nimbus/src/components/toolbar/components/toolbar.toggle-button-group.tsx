import { ToolbarToggleButtonGroupSlot } from "../toolbar.slots.tsx";
import type { ToolbarToggleButtonGroupProps } from "../toolbar.types.ts";
import { ToggleButtonGroup } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ToolbarToggleButtonGroup = ({
  ref: forwardedRef,
  ...props
}: ToolbarToggleButtonGroupProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <ToolbarToggleButtonGroupSlot ref={forwardedRef} {...styleProps} asChild>
      <ToggleButtonGroup {...functionalProps} />
    </ToolbarToggleButtonGroupSlot>
  );
};
// Manually assign a displayName for debugging purposes
ToolbarToggleButtonGroup.displayName = "Toolbar.ToolbarToggleButtonGroup";
