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
 *
 * @note This module requires a browser environment. Calling `toast()` during
 * server-side rendering (SSR) will throw because `createToaster` depends on
 * browser globals. Initialize toasts only after hydration or inside event
 * handlers (e.g. `onClick`, `useEffect`).
 */
let toasters: Map<ToastPlacement, ReturnType<typeof createToaster>> | null =
  null;

/**
 * Listeners notified when toasters are first initialized.
 * Used by ToastOutlet to defer rendering until a toast is actually created.
 */
const activationListeners = new Set<() => void>();

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

    // Notify outlet that toasters are now available
    activationListeners.forEach((listener) => listener());
  }
  return toasters;
}

/**
 * Reset all toaster instances back to their uninitialized state.
 *
 * Intended for test isolation only — calling this in production will
 * cause the next toast() call to recreate all toasters from scratch,
 * discarding any in-flight state.
 */
export function resetToasters(): void {
  toasters = null;
}

/**
 * Whether toasters have been initialized (i.e., at least one toast was created).
 */
export function isToastersActive(): boolean {
  return toasters !== null;
}

/**
 * Subscribe to toaster activation. The callback fires once when toasters
 * are first initialized. Returns an unsubscribe function.
 */
export function onToastersActivated(callback: () => void): () => void {
  // Already active — fire immediately
  if (toasters) {
    callback();
    return () => {};
  }
  activationListeners.add(callback);
  return () => {
    activationListeners.delete(callback);
  };
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
