import { createToaster } from "@chakra-ui/react";
import type { ToastPlacement } from "./toast.types";

// Define all possible placements
const ALL_PLACEMENTS: ToastPlacement[] = [
  "top-start",
  "top",
  "top-end",
  "bottom-start",
  "bottom",
  "bottom-end",
];

// Numpad-based hotkey mapping for toast placements
const PLACEMENT_HOTKEYS: Record<ToastPlacement, string> = {
  "top-start": "Alt+Shift+7",
  top: "Alt+Shift+8",
  "top-end": "Alt+Shift+9",
  "bottom-start": "Alt+Shift+1",
  bottom: "Alt+Shift+2",
  "bottom-end": "Alt+Shift+3",
};

/**
 * Create toaster instances for all placements.
 * These toaster instances are shared between ToastOutlet (which renders them)
 * and ToastManager (which uses them to create toasts).
 */
export const toasters = new Map(
  ALL_PLACEMENTS.map((placement) => {
    const hotkey = PLACEMENT_HOTKEYS[placement];
    const toaster = createToaster({
      placement,
      pauseOnPageIdle: true,
      hotkey: hotkey ? [hotkey] : undefined,
    });

    return [placement, toaster];
  })
);

/**
 * Get toaster for a specific placement.
 */
export function getToaster(placement: ToastPlacement) {
  return toasters.get(placement);
}

/**
 * Default placement when not specified.
 */
export const DEFAULT_PLACEMENT: ToastPlacement = "top-end";
