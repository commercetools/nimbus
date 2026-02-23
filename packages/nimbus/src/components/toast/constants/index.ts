import type { ToastPlacement, ToastType } from "../toast.types";

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
 *
 * Uses Ctrl+Shift to avoid conflicts with macOS special character insertion,
 * Windows input language switching, and screen reader navigation shortcuts.
 */
export const PLACEMENT_HOTKEYS: Record<ToastPlacement, string[]> = {
  "top-start": ["ctrlKey", "shiftKey", "Digit7"],
  "top-end": ["ctrlKey", "shiftKey", "Digit9"],
  "bottom-start": ["ctrlKey", "shiftKey", "Digit1"],
  "bottom-end": ["ctrlKey", "shiftKey", "Digit3"],
};

/**
 * Maps numpad key codes to their placement region IDs.
 *
 * Zag-js only accepts a single `event.code` per hotkey entry, so it can't
 * match both `Digit9` and `Numpad9`. This map lets us supplement zag's
 * built-in listener with numpad support via a separate keydown handler
 * in ToastOutlet.
 */
export const NUMPAD_HOTKEYS: Record<string, string> = {
  Numpad7: "toast-group:top-start",
  Numpad9: "toast-group:top-end",
  Numpad1: "toast-group:bottom-start",
  Numpad3: "toast-group:bottom-end",
};

/**
 * Maps toast semantic types to Nimbus color palettes.
 */
export const COLOR_PALETTE_MAP: Record<ToastType, string> = {
  info: "info",
  success: "positive",
  warning: "warning",
  error: "critical",
  loading: "neutral",
};
