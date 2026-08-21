/**
 * Lightweight activation tracking for toast infrastructure.
 *
 * This module has ZERO transitive dependencies on @chakra-ui/react/toast or
 * @zag-js — it only tracks whether toasters have been initialized. This
 * allows ToastOutlet's shell component to subscribe to activation without
 * pulling the heavy toast rendering code into the main bundle.
 *
 * @internal
 */

/** Whether toasters have been initialized (at least one toast was created). */
let active = false;

/** Listeners notified when toasters are first initialized. */
const activationListeners = new Set<() => void>();

/** Whether toasters have been initialized. */
export function isToastersActive(): boolean {
  return active;
}

/**
 * Mark toasters as active and notify all listeners.
 * Called by toast.toasters.ts when `ensureToasters()` first runs.
 */
export function markToastersActive(): void {
  if (active) return;
  active = true;
  activationListeners.forEach((listener) => listener());
}

/**
 * Subscribe to toaster activation. The callback fires once when toasters
 * are first initialized. Returns an unsubscribe function.
 */
export function onToastersActivated(callback: () => void): () => void {
  if (active) {
    callback();
    return () => {};
  }
  activationListeners.add(callback);
  return () => {
    activationListeners.delete(callback);
  };
}

/**
 * Reset activation state (for testing only).
 */
export function resetActivation(): void {
  active = false;
}
