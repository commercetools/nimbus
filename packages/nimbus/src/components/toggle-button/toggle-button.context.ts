import { createContext, useContext } from "react";
import type { ToggleButtonProps } from "./toggle-button.types";

export type ToggleButtonContextValue = Pick<
  ToggleButtonProps,
  "variant" | "activeFillStyle" | "size" | "colorPalette"
>;

export const ToggleButtonContext =
  createContext<ToggleButtonContextValue | null>(null);

export const useToggleButtonContext = () => useContext(ToggleButtonContext);
