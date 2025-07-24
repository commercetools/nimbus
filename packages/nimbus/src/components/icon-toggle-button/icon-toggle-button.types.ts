import type { ToggleButtonProps } from "@/components/toggle-button";

export interface IconToggleButtonProps
  extends Omit<ToggleButtonProps, "aria-label"> {
  /** explains the intended action, required for accessibility */
  "aria-label": string;
  ref?: React.Ref<HTMLButtonElement>;
}
