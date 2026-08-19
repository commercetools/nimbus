import { DialogTrigger as RaDialogTrigger } from "react-aria-components";

import { PopoverRootSlot } from "../popover.slots";
import type { PopoverRootProps } from "../popover.types";
import { extractStyleProps } from "@/utils";

/**
 * Popover.Root - Establishes the popover's open state and styling context
 *
 * Renders React Aria's `DialogTrigger` via `asChild`. `DialogTrigger` mounts no
 * DOM element of its own, so Root adds nothing to the surrounding layout while
 * still installing the slot-recipe context that `Popover.Content` reads through
 * the portal.
 *
 * @supportsStyleProps
 */
export const PopoverRoot = (props: PopoverRootProps) => {
  const { children, isOpen, defaultOpen, onOpenChange, ...restProps } = props;

  const [styleProps] = extractStyleProps(restProps);

  return (
    <PopoverRootSlot {...styleProps} asChild>
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
