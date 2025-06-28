import { forwardRef } from "react";
import { Popover, Dialog } from "react-aria-components";
import { PopoverRootSlot } from "../popover.slots";
import type { PopoverContentProps } from "../popover.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * PopoverContent
 * ============================================================
 * Content component that renders the actual popover popup with styling.
 * Uses react-aria-components Popover and Dialog for accessibility and positioning.
 *
 * Features:
 * - Allows forwarding refs to the underlying DOM element
 * - Accepts all native HTML 'div' attributes (including aria- & data-attributes)
 * - Supports variants, sizes, and tones configured in the recipe
 * - Allows overriding styles by using style-props
 * - Proper accessibility with ARIA attributes
 * - Automatic positioning and collision detection
 */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    { children, placement = "bottom", offset = 4, shouldFlip = true, ...props },
    ref
  ) => {
    const [styleProps, restProps] = extractStyleProps(props);

    return (
      <Popover
        placement={placement}
        offset={offset}
        shouldFlip={shouldFlip}
        {...restProps}
      >
        <PopoverRootSlot asChild ref={ref} {...styleProps}>
          <Dialog>{children}</Dialog>
        </PopoverRootSlot>
      </Popover>
    );
  }
);

PopoverContent.displayName = "PopoverContent";
