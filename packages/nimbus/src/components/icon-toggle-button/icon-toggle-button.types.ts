import type { ToggleButtonProps } from "../toggle-button";

// ============================================================
// MAIN PROPS
// ============================================================

export type IconToggleButtonProps = Omit<ToggleButtonProps, "aria-label"> & {
  "aria-label": string;
  ref?: React.Ref<HTMLButtonElement>;
};
