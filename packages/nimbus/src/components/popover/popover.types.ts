
import type { DialogTriggerProps, PopoverProps, ButtonProps } from "react-aria-components";

export interface PopoverRootSlotProps extends DialogTriggerProps {
  children: React.ReactNode;
}

export type PopoverContentSlotProps = PopoverProps;

export type PopoverComponents = {
  Root: React.FC<PopoverRootSlotProps>;
  Trigger: React.ForwardRefExoticComponent<ButtonProps>;
  Content: React.FC<PopoverContentSlotProps>;
  Dialog: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Close: React.ForwardRefExoticComponent<ButtonProps>;
};



