import type { ButtonRootProps } from "./button.slots.tsx";
import type { AriaButtonProps } from "react-aria";

/** combine chakra-button props with aria-button props */
type FunctionalButtonProps = AriaButtonProps &
  Omit<ButtonRootProps, keyof AriaButtonProps | "slot"> & {
    [key: `data-${string}`]: unknown;
  };

export interface ButtonProps extends FunctionalButtonProps {
  // TODO: evaluate if we should require setting a tone
  // tone: FunctionalButtonProps["tone"];
  ref?: React.Ref<HTMLButtonElement>;
  /** A slot name for the component. Slots allow the component to receive props from a parent component. */
  slot?: string | null;
}
