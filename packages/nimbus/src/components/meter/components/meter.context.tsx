import { createContext, useContext } from "react";
import type { MeterContextValue } from "../meter.types";

export const MeterContext = createContext<MeterContextValue | undefined>(
  undefined
);

/**
 * Hook to access the values that Meter.Root computes
 * @returns Segments, value text and legend registration from Meter.Root
 * @throws Error if used outside of Meter.Root
 */
export const useMeterContext = (): MeterContextValue => {
  const context = useContext(MeterContext);
  if (!context) {
    throw new Error("useMeterContext must be used within Meter.Root");
  }
  return context;
};
