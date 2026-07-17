import { DialogTrigger as RaDialogTrigger } from "react-aria-components";
import type { PopoverRootProps } from "../popover.types";
import { PopoverProvider } from "./popover.context";

export const PopoverRoot = (props: PopoverRootProps) => {
  const { children, isOpen, onOpenChange, defaultOpen = false } = props;

  return (
    <PopoverProvider value={props}>
      <RaDialogTrigger
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
      >
        {children}
      </RaDialogTrigger>
    </PopoverProvider>
  );
};

PopoverRoot.displayName = "Popover.Root";
