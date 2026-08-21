import { lazy, Suspense, useEffect, useSyncExternalStore } from "react";
import {
  isToastersActive,
  onToastersActivated,
} from "../services/toast.activation";
import { NUMPAD_HOTKEYS } from "../constants";

/**
 * Lazy-loaded heavy rendering implementation.
 *
 * This dynamic import is the key to toast code-splitting: the impl module
 * imports `@chakra-ui/react/toast` (which pulls in @zag-js, ~18 KB gz).
 * By loading it lazily, consumers who never call `toast()` never pay for
 * the toast rendering infrastructure.
 *
 * In the nimbus library build (Vite lib mode), this `import()` is preserved
 * as a dynamic import in the ESM output. The consumer's bundler then handles
 * code-splitting it into a separate chunk.
 */
const ToastOutletImpl = lazy(() => import("./toast.outlet.impl"));

/**
 * Subscribe function for useSyncExternalStore.
 * Bridges the imperative onToastersActivated callback into React's
 * concurrent-safe external store subscription model.
 */
function subscribeToActivation(onStoreChange: () => void) {
  return onToastersActivated(onStoreChange);
}

/**
 * ToastOutlet - Renders all toast regions.
 *
 * Mount this component once at the root of your application (NimbusProvider
 * does this automatically and prevents duplicates when nested).
 * Toasts appear when created via the `toast()` imperative API.
 *
 * The outlet defers rendering of `<Toaster>` instances until the first
 * toast is actually created. This avoids mounting internal state machines
 * (and their DOM event listeners) when toasts are never used, and
 * eliminates spurious `act(...)` warnings in JSDOM-based tests.
 *
 * This shell component is deliberately lightweight — it imports only from
 * the `toast.activation` module (no @chakra-ui/react/toast dependencies).
 * The heavy rendering code is loaded via `React.lazy()` only when toasters
 * become active, keeping @zag-js out of the main bundle for consumers who
 * never use toast.
 *
 * @example
 * ```tsx
 * import { ToastOutlet } from "@commercetools/nimbus";
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <ToastOutlet />
 *     </>
 *   );
 * }
 * ```
 *
 * @internal
 */
export function ToastOutlet() {
  const active = useSyncExternalStore(subscribeToActivation, isToastersActive);

  // Supplement zag-js hotkeys with numpad support.
  // Zag only matches `Digit*` codes; this listener handles `Numpad*` equivalents.
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || !event.shiftKey) return;
      const regionId = NUMPAD_HOTKEYS[event.code];
      if (!regionId) return;
      document.getElementById(regionId)?.focus();
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ToastOutletImpl />
    </Suspense>
  );
}
