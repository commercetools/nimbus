import type { ToastPlacement } from "../toast.types";

/**
 * Default toast duration in milliseconds (6 seconds).
 */
export const DEFAULT_DURATION = 6000;

/**
 * Default placement when not specified by the consumer.
 */
export const DEFAULT_PLACEMENT: ToastPlacement = "top-end";

/**
 * All supported toast placements.
 */
export const ALL_PLACEMENTS: ToastPlacement[] = [
  "top-start",
  "top-end",
  "bottom-start",
  "bottom-end",
];

/**
 * Numpad-based hotkey mapping for toast placements.
 * Each array element is checked against `event[key]` (for modifiers)
 * or `event.code` (for key codes). All keys must match for the hotkey
 * to trigger.
 */
export const PLACEMENT_HOTKEYS: Record<ToastPlacement, string[]> = {
  "top-start": ["altKey", "shiftKey", "Digit7"],
  "top-end": ["altKey", "shiftKey", "Digit9"],
  "bottom-start": ["altKey", "shiftKey", "Digit1"],
  "bottom-end": ["altKey", "shiftKey", "Digit3"],
};
