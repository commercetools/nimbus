import { Toaster, Toast as ChakraToast } from "@chakra-ui/react";
import {
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
  Clear,
} from "@commercetools/nimbus-icons";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { useLocalizedStringFormatter } from "@/hooks";
import { toastMessagesStrings } from "./toast.messages";
import {
  ToastRoot,
  ToastIcon,
  ToastTitle,
  ToastDescription,
  ToastActionTrigger,
  ToastCloseTrigger,
} from "./toast.slots";
import { toasters } from "./toast.toasters";
import type { ToastType } from "./toast.types";

/**
 * Animation styles for the Ark UI toast wrapper.
 *
 * Ark UI's Toast.Root sets CSS custom properties (--x, --y, --scale, --opacity, --height)
 * on the element to drive enter/exit animations. These transition styles consume those
 * variables. The data-state attribute transitions between "open" and "closed" to
 * differentiate enter vs exit timing.
 */
const toastAnimationStyles = {
  pointerEvents: "auto",
  translate: "var(--x) var(--y)",
  scale: "var(--scale)",
  opacity: "var(--opacity)",
  height: "var(--height)",
  willChange: "translate, opacity, scale",
  transition:
    "translate {durations.slower}, scale {durations.slower}, opacity {durations.slower}, height {durations.slower}",
  transitionTimingFunction: "cubic-bezier(0.21, 1.02, 0.73, 1)",
  "&[data-state=closed]": {
    transition:
      "translate {durations.slower}, scale {durations.slower}, opacity {durations.moderate}",
    transitionTimingFunction: "cubic-bezier(0.06, 0.71, 0.55, 1)",
  },
} as const;

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
              <ChakraToast.Root unstyled css={toastAnimationStyles}>
                <ToastRoot
                  colorPalette={COLOR_PALETTE_MAP[type]}
                  {...ariaAttributes}
                >
                  <ToastIcon alignItems="flex-start">
                    {ICON_MAP[type]}
                  </ToastIcon>

                  {toast.title && (
                    <ToastTitle fontWeight="600">{toast.title}</ToastTitle>
                  )}

                  {toast.description && (
                    <ToastDescription>{toast.description}</ToastDescription>
                  )}

                  {toast.action && (
                    <ToastActionTrigger>
                      <Button
                        variant="ghost"
                        size="xs"
                        onPress={() => {
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
                      </Button>
                    </ToastActionTrigger>
                  )}

                  {closable && (
                    <ToastCloseTrigger>
                      <IconButton
                        aria-label={msg.format("dismiss")}
                        variant="ghost"
                        size="2xs"
                        onPress={() => toaster.dismiss(toast.id)}
                      >
                        <Clear role="img" />
                      </IconButton>
                    </ToastCloseTrigger>
                  )}
                </ToastRoot>
              </ChakraToast.Root>
            );
          }}
        </Toaster>
      ))}
    </>
  );
}
