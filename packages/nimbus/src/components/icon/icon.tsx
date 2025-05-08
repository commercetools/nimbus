import { forwardRef } from "react";
import { IconRootSlot } from "./icon.slots";
import type { IconProps } from "./icon.types";

/**
 * Icon
 * displays icon components
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ ...props }, ref) => {
    return <IconRootSlot ref={ref} asChild={!props.as} {...props} />;
  }
);

Icon.displayName = "Icon";
