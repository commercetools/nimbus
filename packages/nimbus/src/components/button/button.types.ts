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
  // we need 'null' as a valid slot value for use with components from react-aria-components,
  // in react-aria slots "An explicit null value indicates that the local props completely override all props received from a parent."
  slot?: string | null | undefined;
  ref?: React.Ref<HTMLButtonElement>;
  /** A slot name for the component. Slots allow the component to receive props from a parent component. */
  slot?: string | null;
}
