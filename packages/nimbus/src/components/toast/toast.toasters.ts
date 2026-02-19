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
 * Lazily-initialized toaster instances per placement.
 *
 * Toasters are created on first access rather than at module load time.
 * This avoids module-level side effects, improving tree-shaking, SSR safety,
 * and test isolation. The underlying Zag.js store is SSR-safe (no DOM access),
 * but lazy init is still preferred as a general best practice.
 */
let toasters: Map<ToastPlacement, ReturnType<typeof createToaster>> | null =
  null;

function ensureToasters() {
  if (!toasters) {
    toasters = new Map(
      ALL_PLACEMENTS.map((placement) => {
        const toaster = createToaster({
          placement,
          // pauseOnPageIdle is a global setting applied at toaster creation time.
          // It cannot be overridden on a per-toast basis via ToastOptions.
          pauseOnPageIdle: true,
          hotkey: PLACEMENT_HOTKEYS[placement],
        });

        return [placement, toaster];
      })
    );
  }
  return toasters;
}

/**
 * Get toaster for a specific placement.
 */
export function getToaster(placement: ToastPlacement) {
  return ensureToasters().get(placement);
}

/**
 * Get all toaster entries (used by ToastOutlet for rendering).
 */
export function getToasterEntries() {
  return Array.from(ensureToasters().entries());
}

/**
 * Default placement when not specified.
 */
export const DEFAULT_PLACEMENT: ToastPlacement = "top-end";
