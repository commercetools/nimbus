import {
  Dialog as RaDialog,
  Popover as RaPopover,
} from "react-aria-components";

import { PopoverContentSlot, PopoverDialogSlot } from "../popover.slots";
import type { PopoverContentProps } from "../popover.types";
import { extractStyleProps } from "@/utils";

/**
 * Popover.Content - The positioned overlay surface
 *
 * Supplies its own dialog element. React Aria requires a `Dialog` inside a
 * `Popover` under a `DialogTrigger` for correct `role`, accessible naming and
 * Escape handling, so owning it here means consumers cannot omit it.
 *
 * A function child is forwarded to the dialog's render prop, so content can
 * dismiss its own popover via `{({ close }) => …}`.
 *
 * Two elements are rendered: the positioned surface (`RaPopover`, carrying the
 * `content` slot) and the dialog inside it (`RaDialog`, carrying the `dialog`
 * slot). Style props go to the surface, since that is the element the recipe
 * styles. Everything else — `id`, `className`, `data-*`, `aria-*` and event
 * handlers — goes to the dialog, which is the element with `role="dialog"` and
 * the one the trigger's `aria-controls` points at. `RaPopover` does not accept
 * `id` at all, and passing one here re-points `aria-controls` at it, so the
 * trigger-to-overlay link survives a consumer-supplied id.
 *
 * React Aria filters what reaches the dialog element, so `title`, `tabIndex`
 * and the keyboard and focus handlers (`onKeyDown`, `onFocus`, `onBlur`) do not
 * arrive — put those on your own content element instead. What does arrive:
 * `id`, `className`, `data-*`, `aria-*`, `dir` / `lang` / `hidden` / `inert` /
 * `translate`, and the mouse, pointer, touch, scroll, animation and transition
 * event families.
 *
 * @supportsStyleProps
 */
export const PopoverContent = ({
  children,
  ref,
  placement,
  offset,
  crossOffset,
  shouldFlip,
  containerPadding,
  boundaryElement,
  isNonModal,
  isKeyboardDismissDisabled,
  shouldCloseOnInteractOutside,
  triggerRef,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: PopoverContentProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <PopoverContentSlot {...styleProps} asChild>
      <RaPopover
        ref={ref}
        placement={placement}
        offset={offset}
        crossOffset={crossOffset}
        shouldFlip={shouldFlip}
        containerPadding={containerPadding}
        boundaryElement={boundaryElement}
        isNonModal={isNonModal}
        isKeyboardDismissDisabled={isKeyboardDismissDisabled}
        shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
        triggerRef={triggerRef}
      >
        <PopoverDialogSlot asChild>
          <RaDialog
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            {...restProps}
          >
            {children}
          </RaDialog>
        </PopoverDialogSlot>
      </RaPopover>
    </PopoverContentSlot>
  );
};

PopoverContent.displayName = "Popover.Content";
