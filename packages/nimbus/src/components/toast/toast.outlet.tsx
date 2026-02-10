import {
  Toaster,
  Toast as ChakraToast,
  useToastStyles,
  chakra,
} from "@chakra-ui/react";
import {
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
  Clear,
} from "@commercetools/nimbus-icons";
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
 * Renders the icon indicator for a toast using recipe styles.
 * Uses `useToastStyles` to consume the indicator slot styles
 * from the overridden toast recipe.
 */
function ToastIcon({ children }: { children: React.ReactNode }) {
  const styles = useToastStyles();
  return <chakra.div css={styles.indicator}>{children}</chakra.div>;
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
  const msg = useLocalizedStringFormatter(toastMessagesStrings);

  return (
    <>
      {Array.from(toasters.entries()).map(([placement, toaster]) => (
        <Toaster key={placement} toaster={toaster}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(toast: any) => {
            const type = (toast.type as ToastType) || "info";
            const closable =
              toast.meta?.closable !== undefined
                ? (toast.meta.closable as boolean)
                : true;
            const ariaAttributes = getARIAAttributes(type);

            return (
              <ChakraToast.Root
                colorPalette={COLOR_PALETTE_MAP[type]}
                {...ariaAttributes}
              >
                <ToastIcon>{ICON_MAP[type]}</ToastIcon>

                {toast.title && (
                  <ChakraToast.Title fontWeight="600">
                    {toast.title}
                  </ChakraToast.Title>
                )}

                {toast.description && (
                  <ChakraToast.Description>
                    {toast.description}
                  </ChakraToast.Description>
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
                  <ChakraToast.CloseTrigger aria-label={msg.format("dismiss")}>
                    <Clear role="img" />
                  </ChakraToast.CloseTrigger>
                )}
              </ChakraToast.Root>
            );
          }}
        </Toaster>
      ))}
    </>
  );
}
