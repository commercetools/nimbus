import {
  Dialog as RaDialog,
  Popover as RaPopover,
} from "react-aria-components";

import { PopoverContentSlot, PopoverDialogSlot } from "../popover.slots";
import type { PopoverContentProps } from "../popover.types";
import { usePopoverConfigContext } from "./popover.context";
import { extractStyleProps } from "@/utils";

/**
 * Popover.Content - The positioned overlay surface, with its own dialog element
 *
 * Renders two elements: the positioned surface (`RaPopover`, `content` slot),
 * which takes the style props the recipe targets, and the dialog inside it
 * (`RaDialog`, `dialog` slot), which takes everything else. The dialog is what
 * the trigger's `aria-controls` points at, and `RaPopover` rejects `id`, so
 * routing a consumer-supplied `id` to the dialog keeps that link intact.
 *
 * @supportsStyleProps
 */
export const PopoverContent = ({
  children,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: PopoverContentProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  // Published by Popover.Root; absent without one, leaving React Aria's
  // defaults. `role` belongs to the dialog, the rest to the surface.
  const { role, ...overlayConfig } = usePopoverConfigContext() ?? {};

  return (
    <PopoverContentSlot {...styleProps} asChild>
      <RaPopover ref={ref} {...overlayConfig}>
        <PopoverDialogSlot asChild>
          {/*
            `role` is applied after the spread so Root stays the only source of
            it. PopoverContentProps excludes the name, so a typed consumer
            cannot reach this; an untyped one is dropped rather than allowed to
            outrank the configuration Root published.
          */}
          <RaDialog
            {...restProps}
            role={role}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
          >
            {children}
          </RaDialog>
        </PopoverDialogSlot>
      </RaPopover>
    </PopoverContentSlot>
  );
};

PopoverContent.displayName = "Popover.Content";
