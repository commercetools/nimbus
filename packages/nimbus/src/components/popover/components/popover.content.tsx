import {
  Dialog as RaDialog,
  Popover as RaPopover,
} from "react-aria-components";

import { PopoverContentSlot, PopoverDialogSlot } from "../popover.slots";
import type { PopoverContentProps } from "../popover.types";
import { usePopoverConfigContext } from "./popover.context";
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
 * The overlay's behaviour is not configured here. `Popover.Root` owns all of it
 * and publishes it through `PopoverConfigProvider`; this component applies what
 * it receives, routing `role` to the dialog and everything else to the surface.
 * Nothing is merged or overridden, so there is exactly one place a given option
 * can come from.
 *
 * `offset` and `maxHeight` are the two names React Aria and Chakra share across
 * the two parts. Both are style props here and positioning inputs on
 * `Popover.Root`. `maxHeight` in particular cannot be styled on this element at
 * all: React Aria assigns `overlay.style.maxHeight` imperatively on every
 * position pass, so the inline value outranks the recipe's class. Cap the surface
 * on `Popover.Root`.
 *
 * React Aria filters what reaches the dialog element, so `title`, `tabIndex`
 * and the keyboard and focus handlers (`onKeyDown`, `onFocus`, `onBlur`) do not
 * arrive — put those on your own content element instead. What does arrive:
 * `id`, `className`, `data-*`, `aria-*`, `dir` / `lang` / `hidden` / `inert`,
 * and the mouse, pointer, touch, scroll, animation and transition event
 * families. (`translate` is a Chakra style prop, so it is consumed as CSS here
 * rather than reaching the DOM.)
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

  // Configuration published by Popover.Root. `role` targets the dialog element,
  // the rest configures the surface. Undefined when used without a Root, which
  // leaves React Aria's own defaults in place.
  const { role, ...overlayConfig } = usePopoverConfigContext() ?? {};

  return (
    <PopoverContentSlot {...styleProps} asChild>
      <RaPopover ref={ref} {...overlayConfig}>
        <PopoverDialogSlot asChild>
          <RaDialog
            role={role}
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
