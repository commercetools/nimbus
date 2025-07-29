import { forwardRef } from "react";
import { ToolbarRoot as ToolbarRootSlot } from "../toolbar.slots.tsx";
import type { ToolbarRootProps } from "../toolbar.types.ts";
import { Toolbar } from "react-aria-components";
import { useBreakpointValue } from "@chakra-ui/react";

export const ToolbarRoot = forwardRef<HTMLDivElement, ToolbarRootProps>(
  (props, forwardedRef) => {
    const { children, orientation, ...rest } = props;

    const currentOrientation = useBreakpointValue(orientation);

    return (
      <ToolbarRootSlot
        {...rest}
        orientation={currentOrientation}
        ref={forwardedRef}
        role="toolbar"
        aria-orientation={currentOrientation}
        data-orientation={currentOrientation}
        asChild
      >
        <Toolbar orientation={currentOrientation}>{children}</Toolbar>
      </ToolbarRootSlot>
    );
  }
);

// Manually assign a displayName for debugging purposes
ToolbarRoot.displayName = "Toolbar.Root";
