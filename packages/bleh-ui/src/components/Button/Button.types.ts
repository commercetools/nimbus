import type { ButtonRootProps } from "./Button.slots";

export interface ButtonProps extends ButtonRootProps {
  /** if true, button is busy with something (loading, processing, etc...) */
  busy?: boolean;
}
