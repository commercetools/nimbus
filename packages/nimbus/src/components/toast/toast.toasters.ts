import { createToaster } from "@chakra-ui/react";
import type { ToastPlacement } from "./toast.types";

// Define all possible placements
const ALL_PLACEMENTS: ToastPlacement[] = [
  "top-start",
  "top-end",
  "bottom-start",
  "bottom-end",
];

/**
 * Numpad-based hotkey mapping for toast placements.
 * Format follows Zag.js convention: each array element is checked against
 * `event[key]` (for modifiers) or `event.code` (for key codes).
 * All keys must match for the hotkey to trigger.
 */
const PLACEMENT_HOTKEYS: Record<ToastPlacement, string[]> = {
  "top-start": ["altKey", "shiftKey", "Digit7"],
  "top-end": ["altKey", "shiftKey", "Digit9"],
  "bottom-start": ["altKey", "shiftKey", "Digit1"],
  "bottom-end": ["altKey", "shiftKey", "Digit3"],
};

/**
 * Create toaster instances for all placements.
 * These toaster instances are shared between ToastOutlet (which renders them)
 * and ToastManager (which uses them to create toasts).
 */
export const toasters = new Map(
  ALL_PLACEMENTS.map((placement) => {
    const toaster = createToaster({
      placement,
      pauseOnPageIdle: true,
      hotkey: PLACEMENT_HOTKEYS[placement],
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
