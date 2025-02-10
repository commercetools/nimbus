import type { ReactNode } from "react";
import type { ButtonRootProps } from "./button.slots.tsx";
import type { AriaButtonProps } from "react-aria";

/** combine chakra-button props with aria-button props */
type FunctionalButtonProps = ButtonRootProps & AriaButtonProps;

export interface ButtonProps extends FunctionalButtonProps {
  /** Icon displayed at the start of the button */
  startIcon?: ReactNode;
  /** Icon displayed at the start of the button */
  endIcon?: ReactNode;
}
