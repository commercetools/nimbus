import { forwardRef } from "react";
import { ToolbarSeparator as ToolbarSeparatorSlot } from "../toolbar.slots.tsx";
import type { ToolbarSeparatorProps } from "../toolbar.types.ts";

export const ToolbarSeparator = forwardRef<
  HTMLDivElement,
  ToolbarSeparatorProps
>((props, forwardedRef) => {
  const { orientation = "vertical", ...rest } = props;

  return (
    <ToolbarSeparatorSlot
      {...rest}
      ref={forwardedRef}
      role="separator"
      aria-orientation={orientation}
      data-orientation={orientation}
    />
  );
});

// Manually assign a displayName for debugging purposes
ToolbarSeparator.displayName = "Toolbar.Separator";
