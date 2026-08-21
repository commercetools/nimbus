import { Toaster, Toast as ChakraToast } from "@chakra-ui/react/toast";
import { getToasterEntries } from "../services/toast.toasters";
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
 * Heavy rendering implementation for ToastOutlet.
 *
 * This module is loaded via `React.lazy()` from the lightweight toast.outlet
 * shell. It imports `@chakra-ui/react/toast` (which pulls in @zag-js), so
 * consumers who never call `toast()` never pay for this chunk.
 *
 * @internal
 */
export default function ToastOutletImpl() {
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
