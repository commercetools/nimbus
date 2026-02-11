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
import { IconButton } from "../icon-button";
import { useLocalizedStringFormatter } from "@/hooks";
import { toastMessagesStrings } from "./toast.messages";
import { toasters } from "./toast.toasters";
import type { ToastType } from "./toast.types";

const ICON_MAP: Record<ToastType, React.ReactElement> = {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toast: any;
  toaster: CreateToasterReturn;
}) {
  const styles = useToastStyles();
  const msg = useLocalizedStringFormatter(toastMessagesStrings);
  const type = (toast.type as ToastType) || "info";
  const closable =
    toast.meta?.closable !== undefined
      ? (toast.meta.closable as boolean)
      : true;

  return (
    <>
      <chakra.div css={styles.indicator}>{ICON_MAP[type]}</chakra.div>

      {toast.title && (
        <ChakraToast.Title fontWeight="600">{toast.title}</ChakraToast.Title>
      )}

      {toast.description && (
        <ChakraToast.Description>{toast.description}</ChakraToast.Description>
      )}

      {toast.action && (
        <ChakraToast.ActionTrigger
          onClick={() => {
            const action = toast.action as {
              label?: string;
              onClick?: () => void;
            };
            action.onClick?.();
          }}
        >
          {typeof toast.action === "object" &&
          toast.action &&
          "label" in toast.action
            ? String(toast.action.label)
            : "Action"}
        </ChakraToast.ActionTrigger>
      )}

      {closable && (
        <chakra.div css={styles.closeTrigger}>
          <IconButton
            aria-label={msg.format("dismiss")}
            variant="ghost"
            size="2xs"
            onPress={() => toaster.dismiss(toast.id)}
          >
            <Clear role="img" />
          </IconButton>
        </chakra.div>
      )}
    </>
  );
}

/**
 * ToastOutlet - Renders all toast regions.
 *
 * Mount this component once at the root of your application.
 * Toasts appear when created via the `toast()` imperative API.
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
  return (
    <>
      {Array.from(toasters.entries()).map(([placement, toaster]) => (
        <Toaster key={placement} toaster={toaster}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(toast: any) => {
            const type = (toast.type as ToastType) || "info";

            return (
              <ChakraToast.Root
                colorPalette={COLOR_PALETTE_MAP[type]}
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
