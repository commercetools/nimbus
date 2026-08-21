import { DialogTrigger as RaDialogTrigger } from "react-aria-components";

import { PopoverRootSlot } from "../popover.slots";
import type { PopoverRootProps } from "../popover.types";
import { PopoverConfigProvider } from "./popover.context";

/**
 * Popover.Root - Establishes the popover's open state and styling context
 *
 * Renders React Aria's `DialogTrigger` via `asChild`, which mounts no DOM
 * element — hence no style props here, and no `@supportsStyleProps` tag.
 *
 * The prop split below is deliberate: `DialogTrigger` honours only the three
 * open-state props, and React Aria's `Popover` declares those same three and
 * derives its own state from them once set. Publishing them through the config
 * context would leave the trigger toggling one state while the surface renders
 * another, so they stop here and everything else travels on.
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
