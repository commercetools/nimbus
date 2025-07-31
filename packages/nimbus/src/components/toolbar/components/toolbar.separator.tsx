import { forwardRef } from "react";
import { ToolbarSeparator as ToolbarSeparatorSlot } from "../toolbar.slots.tsx";
import type { ToolbarSeparatorProps } from "../toolbar.types.ts";
import { Separator } from "react-aria-components";
import { useRecipe } from "@chakra-ui/react";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ToolbarSeparator = ({
  ref: forwardedRef,
  ...props
}: ToolbarSeparatorProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);
  return (
    <ToolbarSeparatorSlot {...styleProps} ref={forwardedRef} asChild>
      <Separator {...functionalProps} />
    </ToolbarSeparatorSlot>
  );
};

// Manually assign a displayName for debugging purposes
ToolbarSeparator.displayName = "Toolbar.Separator";
