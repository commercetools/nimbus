import type { DialogTriggerProps, PopoverProps } from "react-aria-components";

export interface PopoverTriggerSlotProps extends DialogTriggerProps {
  children: React.ReactNode;
}

export type PopoverContentSlotProps = PopoverProps;
