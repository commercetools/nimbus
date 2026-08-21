import { DialogTrigger as RaDialogTrigger } from "react-aria-components";

import { PopoverRootSlot } from "../popover.slots";
import type { PopoverRootProps } from "../popover.types";
import { PopoverConfigProvider } from "./popover.context";

/**
 * Popover.Root - Establishes the popover's open state and styling context
 *
 * Renders React Aria's `DialogTrigger` via `asChild`. `DialogTrigger` mounts no
 * DOM element of its own, so Root adds nothing to the surrounding layout while
 * still installing the slot-recipe context that `Popover.Content` reads through
 * the portal.
 *
 * Root is the compound's configuration surface. `DialogTrigger` itself honours
 * only the three open-state props, so everything else Root accepts configures
 * the `Popover` and `Dialog` elements that `Popover.Content` renders, and travels
 * there through `PopoverConfigProvider`.
 *
 * The split is deliberate, not incidental: `isOpen`, `defaultOpen` and
 * `onOpenChange` go to `DialogTrigger` and are kept out of the published config.
 * React Aria's `Popover` declares the same three props and derives its own state
 * from them when set, so forwarding them would leave the trigger toggling one
 * state while the surface renders another.
 *
 * Accepts no style props: with no element of its own there is nothing for them
 * to attach to, so the style-props JSDoc tag is deliberately absent here. The
 * `root` slot exists only so `withProvider` can install that context.
 */
export const PopoverRoot = (props: PopoverRootProps) => {
  const { children, isOpen, defaultOpen, onOpenChange, ...config } = props;

  return (
    <PopoverRootSlot asChild>
      <RaDialogTrigger
        isOpen={isOpen}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <PopoverConfigProvider value={config}>{children}</PopoverConfigProvider>
      </RaDialogTrigger>
    </PopoverRootSlot>
  );
};

PopoverRoot.displayName = "Popover.Root";
