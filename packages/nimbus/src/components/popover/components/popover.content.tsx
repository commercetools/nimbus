import { Dialog as RaDialog } from "react-aria-components";
import { PopoverBase } from "../popover";
import type { PopoverContentProps } from "../popover.types";
import { usePopoverRootContext } from "./popover.context";

export const PopoverContent = ({
  ref: forwardedRef,
  children,
  width,
}: PopoverContentProps) => {
  const { placement = "bottom start", offset = 4 } = usePopoverRootContext();

  return (
    <PopoverBase
      placement={placement}
      offset={offset}
      shouldFlip
      style={{ width }}
    >
      <RaDialog
        ref={forwardedRef}
        aria-label="Popover"
        style={{ outline: "none" }}
      >
        {children}
      </RaDialog>
    </PopoverBase>
  );
};

PopoverContent.displayName = "Popover.Content";
