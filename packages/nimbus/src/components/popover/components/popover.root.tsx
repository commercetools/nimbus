import { DialogTrigger as RaDialogTrigger } from "react-aria-components";

import { PopoverRootSlot } from "../popover.slots";
import type { PopoverRootProps } from "../popover.types";

/**
 * Popover.Root - Establishes the popover's open state and styling context
 *
 * Renders React Aria's `DialogTrigger` via `asChild`. `DialogTrigger` mounts no
 * DOM element of its own, so Root adds nothing to the surrounding layout while
 * still installing the slot-recipe context that `Popover.Content` reads through
 * the portal.
 *
 * Accepts no style props: with no element of its own there is nothing for them
 * to attach to, so the style-props JSDoc tag is deliberately absent here. The
 * `root` slot exists only so `withProvider` can install that context.
 */
export const PopoverRoot = (props: PopoverRootProps) => {
  const { children, isOpen, defaultOpen, onOpenChange } = props;

  return (
    <PopoverRootSlot asChild>
      <RaDialogTrigger
        isOpen={isOpen}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        {children}
      </RaDialogTrigger>
    </PopoverRootSlot>
  );
};

PopoverRoot.displayName = "Popover.Root";
