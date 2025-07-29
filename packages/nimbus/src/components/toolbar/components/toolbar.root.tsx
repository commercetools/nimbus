import { forwardRef } from "react";
import { ToolbarRoot as ToolbarRootSlot } from "../toolbar.slots.tsx";
import type { ToolbarRootProps } from "../toolbar.types.ts";
import { Toolbar } from "react-aria-components";
import { useBreakpointValue, useChakraContext } from "@chakra-ui/react";

export const ToolbarRoot = ({
  ref: forwardedRef,
  ...props
}: ToolbarRootProps) => {
  const sysCtx = useChakraContext();
  const { children, orientation, ...rest } = props;

  // The react-aria Toolbar does not support responsive values for the
  // `orientation` prop. We normalize `orientation` to a string
  // ("horizontal" or "vertical") using `system.normalizeValue` and
  // `useBreakpointValue` to ensure a concrete value is passed.
  const computedOrientation = useBreakpointValue(
    sysCtx.normalizeValue(orientation)
  );

  return (
    <ToolbarRootSlot
      {...rest}
      orientation={orientation}
      ref={forwardedRef}
      asChild
    >
      <Toolbar orientation={computedOrientation}>{children}</Toolbar>
    </ToolbarRootSlot>
  );
};

// Manually assign a displayName for debugging purposes
ToolbarRoot.displayName = "Toolbar.Root";
