import { forwardRef } from "react";
import { ToolbarGroup as ToolbarGroupSlot } from "../toolbar.slots.tsx";
import type { ToolbarGroupProps } from "../toolbar.types.ts";
import { Group } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ToolbarGroup = ({
  ref: forwardedRef,
  ...props
}: ToolbarGroupProps) => {
  const { children, ...rest } = props;
  const [styleProps, functionalProps] = extractStyleProps(rest);

  return (
    <ToolbarGroupSlot ref={forwardedRef} {...styleProps} asChild>
      <Group {...functionalProps}>{children}</Group>
    </ToolbarGroupSlot>
  );
};
// Manually assign a displayName for debugging purposes
ToolbarGroup.displayName = "Toolbar.Group";
