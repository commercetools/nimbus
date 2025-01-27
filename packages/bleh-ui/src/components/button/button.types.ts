import type { ButtonRootProps } from "./button.slots.tsx";
import type { AriaButtonProps } from "react-aria";

/** combine chakra-button props with aria-button props */
type FunctionalButtonProps = ButtonRootProps & AriaButtonProps;

/** add our own custom props */
export interface ButtonProps extends FunctionalButtonProps {
  /** if true, button is busy with something (loading, processing, etc...) */
  busy?: boolean;
}
