import { useSyncExternalStore } from "react";
import {
  Toaster,
  Toast as ChakraToast,
  useToastStyles,
  chakra,
} from "@chakra-ui/react";
import type { CreateToasterReturn } from "@chakra-ui/react";
import {
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
  Clear,
} from "@commercetools/nimbus-icons";
import { IconButton } from "../icon-button/icon-button";
import { Button } from "../button/button";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { useLocalizedStringFormatter } from "@/hooks";
import {
  getToasterEntries,
  isToastersActive,
  onToastersActivated,
} from "./toast.toasters";
import { toastMessagesStrings } from "./toast.messages";
import type { ToastType, ToastVariant } from "./toast.types";

/**
 * Internal type representing the toast data object passed by Chakra UI's Toaster
 * render prop. Only covers the fields accessed by the outlet.
 */
type ChakraToastData = {
  id?: string;
  type?: string;
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  meta?: {
    closable?: boolean;
    variant?: ToastVariant;
    icon?: React.ReactElement;
  };
};

const ICON_MAP: Record<Exclude<ToastType, "loading">, React.ReactElement> = {
  info: <Info />,
  success: <CheckCircleOutline />,
  warning: <WarningAmber />,
  error: <ErrorOutline />,
};

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
 * Inner content of a toast, rendered inside ChakraToast.Root (the recipe provider).
 * Uses `useToastStyles` to apply recipe slot styles to custom elements.
 */
function ToastContent({
  toast,
  toaster,
}: {
  toast: ChakraToastData;
  toaster: CreateToasterReturn;
}) {
  const styles = useToastStyles();
  const msg = useLocalizedStringFormatter(toastMessagesStrings);
  const type = (toast.type as ToastType) || "info";
  const variant = toast.meta?.variant || "accent-start";
  const closable = toast.meta?.closable ?? false;
  const customIcon = toast.meta?.icon;

  return (
    <>
      <chakra.div css={styles.indicator}>
        {type === "loading" ? (
          <LoadingSpinner
            size="sm"
            // "white" is a valid LoadingSpinner colorPalette (see loading-spinner.types.ts).
            // On the solid variant the background is the colorPalette color, so white
            // provides the necessary contrast. On other variants the background is neutral,
            // so "primary" matches the icon color used by ICON_MAP entries.
            colorPalette={variant === "solid" ? "white" : "primary"}
          />
        ) : (
          (customIcon ?? ICON_MAP[type])
        )}
      </chakra.div>

      {toast.title && <ChakraToast.Title>{toast.title}</ChakraToast.Title>}

      {toast.description && (
        <ChakraToast.Description>{toast.description}</ChakraToast.Description>
      )}

      {toast.action && (
        <ChakraToast.ActionTrigger asChild>
          <Button variant={variant === "solid" ? "solid" : "outline"} size="sm">
            {typeof toast.action === "object" &&
            toast.action &&
            "label" in toast.action
              ? String(toast.action.label)
              : "Action"}
          </Button>
        </ChakraToast.ActionTrigger>
      )}

      {closable && (
        <ChakraToast.CloseTrigger asChild>
          <IconButton
            aria-label={msg.format("dismiss")}
            variant="subtle"
            size="2xs"
            onPress={() => toaster.dismiss(toast.id)}
          >
            <Clear role="img" />
          </IconButton>
        </ChakraToast.CloseTrigger>
      )}
    </>
  );
}

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
 * toast is actually created. This avoids mounting zag-js state machines
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
