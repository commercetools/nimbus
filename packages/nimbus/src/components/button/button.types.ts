import type { ButtonRootProps } from "./button.slots.tsx";
import type { AriaButtonProps } from "react-aria";

/** combine chakra-button props with aria-button props */
type FunctionalButtonProps = ButtonRootProps &
  AriaButtonProps & {
    [key: `data-${string}`]: unknown;
  };

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ButtonProps extends FunctionalButtonProps {
  // TODO: evaluate if we should require setting a tone
  // tone: FunctionalButtonProps["tone"];
}
