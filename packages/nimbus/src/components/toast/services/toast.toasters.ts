import { createToaster } from "@chakra-ui/react/toast";
import type { ToastPlacement } from "../toast.types";
import { ALL_PLACEMENTS, PLACEMENT_HOTKEYS } from "../constants";
import { markToastersActive, resetActivation } from "./toast.activation";

/** Local alias to avoid exposing transitive @zag-js/toast types in declarations. */
type Toaster = ReturnType<typeof createToaster>;

/**
 * Lazily-initialized toaster instances per placement.
 *
 * Toasters are created on first access rather than at module load time.
 * This avoids module-level side effects, improving tree-shaking, SSR safety,
 * and test isolation. The underlying store is SSR-safe (no DOM access),
 * but lazy init is still preferred as a general best practice.
 *
 * @note This module requires a browser environment. Calling `toast()` during
 * server-side rendering (SSR) will throw because `createToaster` depends on
 * browser globals. Initialize toasts only after hydration or inside event
 * handlers (e.g. `onClick`, `useEffect`).
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

    // Notify the lightweight activation module (and thus ToastOutlet's shell)
    markToastersActive();
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
  resetActivation();
}

/**
 * Get toaster for a specific placement.
 */
export function getToaster(placement: ToastPlacement): Toaster | undefined {
  return ensureToasters().get(placement);
}

/**
 * Get all toaster entries (used by ToastOutlet for rendering).
 */
export function getToasterEntries(): Array<[ToastPlacement, Toaster]> {
  return Array.from(ensureToasters().entries());
}
