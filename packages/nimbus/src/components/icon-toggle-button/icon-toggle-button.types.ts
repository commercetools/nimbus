import type { ToggleButtonProps } from "@/components/toggle-button";

export interface IconToggleButtonProps
  extends Omit<ToggleButtonProps, "aria-label" | "aria-labelledby"> {
  "aria-label": string;
}