import type { MehButtonRootProps } from "./meh-button.slots.tsx";
import type { AriaButtonProps } from "react-aria";

type MehButtonVariantProps = MehButtonRootProps & AriaButtonProps;

export interface MehButtonProps extends MehButtonVariantProps {
  children?: React.ReactNode;
}
