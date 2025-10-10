import type { ToggleButtonProps } from "../toggle-button";

export type IconToggleButtonProps = Omit<ToggleButtonProps, "aria-label"> & {
  /** explains the intended action, required for accessibility */
  "aria-label": string;
  ref?: React.Ref<HTMLButtonElement>;
};
