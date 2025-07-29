import { forwardRef } from "react";
import { ToolbarGroup as ToolbarGroupSlot } from "../toolbar.slots.tsx";
import type { ToolbarGroupProps } from "../toolbar.types.ts";
import { Group } from "react-aria-components";

export const ToolbarGroup = ({
  ref: forwardedRef,
  ...props
}: ToolbarGroupProps) => {
  const { children, ...rest } = props;

  return (
    <ToolbarGroupSlot {...rest} ref={forwardedRef} role="group" asChild>
      <Group>{children}</Group>
    </ToolbarGroupSlot>
  );
};
// Manually assign a displayName for debugging purposes
ToolbarGroup.displayName = "Toolbar.Group";
