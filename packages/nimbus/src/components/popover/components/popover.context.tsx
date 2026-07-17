import { createContext, useContext } from "react";
import type { PopoverRootProps } from "../popover.types";

export type PopoverContextValue = PopoverRootProps;

export const PopoverContext = createContext<PopoverContextValue | undefined>(
  undefined
);

export const usePopoverRootContext = (): PopoverContextValue => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopoverRootContext must be used within Popover.Root");
  }
  return context;
};

export const PopoverProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: PopoverContextValue;
}) => {
  return <PopoverContext value={value}>{children}</PopoverContext>;
};
