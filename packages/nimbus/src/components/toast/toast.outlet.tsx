import { useSyncExternalStore } from "react";
import { Toaster, Toast as ChakraToast } from "@chakra-ui/react";
import {
  getToasterEntries,
  isToastersActive,
  onToastersActivated,
} from "./toast.toasters";
import { ToastContent } from "./components";
import type { ChakraToastData, ToastType } from "./toast.types";

const COLOR_PALETTE_MAP: Record<ToastType, string> = {
  info: "info",
  success: "positive",
  warning: "warning",
  error: "critical",
  loading: "neutral",
};

const getARIAAttributes = (type?: ToastType) => {
  if (type === "warning" || type === "error") {
    return { role: "alert" as const, "aria-live": "assertive" as const };
  }
  return { role: "status" as const, "aria-live": "polite" as const };
};

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

  if (!active) {
    return null;
  }

  return (
    <>
      {getToasterEntries().map(([placement, toaster]) => (
        <Toaster
          key={placement}
          toaster={toaster}
          data-react-aria-top-layer="true"
        >
          {(chakraToast) => {
            const toast = chakraToast as ChakraToastData;
            const type = (toast.type as ToastType) || "info";
            const variant = toast.meta?.variant || "accent-start";

            return (
              <ChakraToast.Root
                colorPalette={COLOR_PALETTE_MAP[type]}
                variant={variant}
                {...getARIAAttributes(type)}
              >
                <ToastContent toast={toast} toaster={toaster} />
              </ChakraToast.Root>
            );
          }}
        </Toaster>
      ))}
    </>
  );
}
