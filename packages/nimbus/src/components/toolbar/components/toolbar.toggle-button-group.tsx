import { forwardRef } from "react";
import {
  ToolbarGroup,
  ToolbarGroup as ToolbarGroupSlot,
} from "../toolbar.slots.tsx";
import type { ToolbarToggleButtonGroupProps } from "../toolbar.types.ts";
import { ToggleButtonGroup } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ToolbarToggleButtonGroup = ({
  ref: forwardedRef,
  ...props
}: ToolbarToggleButtonGroupProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <ToolbarGroupSlot ref={forwardedRef} {...styleProps} asChild>
      <ToggleButtonGroup {...functionalProps} />
    </ToolbarGroupSlot>
  );
};
// Manually assign a displayName for debugging purposes
ToolbarGroup.displayName = "Toolbar.ToggleButtonGroup";
