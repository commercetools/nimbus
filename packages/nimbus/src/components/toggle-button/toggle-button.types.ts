import type { ToggleButtonRootProps } from "./toggle-button.slots";
import type { ToggleButtonProps as AriaToggleButtonProps } from "react-aria-components";

export interface ToggleButtonProps
  extends AriaToggleButtonProps,
    Omit<ToggleButtonRootProps, keyof AriaToggleButtonProps | "as" | "asChild"> {
  ref?: React.Ref<HTMLButtonElement>;
}