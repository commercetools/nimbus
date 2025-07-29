import { forwardRef } from "react";
import { ToolbarSeparator as ToolbarSeparatorSlot } from "../toolbar.slots.tsx";
import type { ToolbarSeparatorProps } from "../toolbar.types.ts";
import { Separator } from "react-aria-components";
import { useRecipe } from "@chakra-ui/react";

export const ToolbarSeparator = ({
  ref: forwardedRef,
  ...props
}: ToolbarSeparatorProps) => {
  return (
    <ToolbarSeparatorSlot {...props} ref={forwardedRef} asChild>
      <Separator />
    </ToolbarSeparatorSlot>
  );
};

// Manually assign a displayName for debugging purposes
ToolbarSeparator.displayName = "Toolbar.Separator";
