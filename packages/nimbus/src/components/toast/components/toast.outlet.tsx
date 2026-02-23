import { useSyncExternalStore } from "react";
import { Toaster, Toast as ChakraToast } from "@chakra-ui/react";
import {
  getToasterEntries,
  isToastersActive,
  onToastersActivated,
} from "../services/toast.toasters";
import { ToastContent } from "./toast.content";
import { COLOR_PALETTE_MAP } from "../constants";
import type { ChakraToastData, ToastType } from "../toast.types";

/**
 * Returns the correct ARIA role and live-region politeness for a toast type.
 * Error toasts use `role="alert"` with `aria-live="assertive"`,
 * all others use `role="status"` with `aria-live="polite"`.
 *
 * An explicit `ariaLive` override (from `ToastOptions`) takes precedence
 * over the type-based default.
 */
const getARIAAttributes = (
  type?: ToastType,
  ariaLive?: "polite" | "assertive" | "off"
) => {
  const liveDefault = type === "error" ? "assertive" : "polite";
  const live = ariaLive ?? liveDefault;
  const role = live === "assertive" ? ("alert" as const) : ("status" as const);
  return { role, "aria-live": live as "polite" | "assertive" };
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
                {...getARIAAttributes(type, toast.meta?.["aria-live"])}
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
