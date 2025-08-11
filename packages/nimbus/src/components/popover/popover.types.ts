
import type { DialogTriggerProps, PopoverProps, ButtonProps } from "react-aria-components";

export interface PopoverRootSlotProps extends DialogTriggerProps {
  children: React.ReactNode;
}

export type PopoverContentSlotProps = PopoverProps;

export type PopoverComponents = {
  Root: React.FC<PopoverRootSlotProps>;
  Content: React.FC<PopoverContentSlotProps>;
  Close: React.ForwardRefExoticComponent<ButtonProps>;
};



