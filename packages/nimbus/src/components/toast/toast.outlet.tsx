import { useEffect, useRef, useState } from "react";
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
import { Button } from "../button";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { toasters } from "./toast.toasters";
import type { ToastPlacement, ToastType, ToastVariant } from "./toast.types";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toast: any;
  toaster: CreateToasterReturn;
}) {
  const styles = useToastStyles();
  const type = (toast.type as ToastType) || "info";
  const variant = (toast.meta?.variant as ToastVariant) || "accent-start";
  const closable =
    toast.meta?.closable !== undefined
      ? (toast.meta.closable as boolean)
      : false;

  return (
    <>
      <chakra.div css={styles.indicator}>
        {type === "loading" ? (
          <LoadingSpinner
            size="xs"
            colorPalette={variant === "solid" ? "white" : "primary"}
          />
        ) : (
          ICON_MAP[type]
        )}
      </chakra.div>

      {toast.title && <ChakraToast.Title>{toast.title}</ChakraToast.Title>}

      {toast.description && (
        <ChakraToast.Description>{toast.description}</ChakraToast.Description>
      )}

      {toast.action && (
        <ChakraToast.ActionTrigger asChild>
          <Button
            variant={variant === "solid" ? "solid" : "outline"}
            size="sm"
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
        </ChakraToast.ActionTrigger>
      )}

      {closable && (
        <ChakraToast.CloseTrigger asChild>
          <IconButton
            // TODO: replace with i18n translated string once localization is wired up
            aria-label="__Dismiss"
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
 * Renders a single toast region on-demand.
 *
 * The Chakra/Ark `<Toaster>` always renders a `<div role="region">` into the DOM,
 * even when no toasts are active. To avoid polluting the DOM with empty landmark
 * regions, this wrapper subscribes to the underlying store and only mounts the
 * `<Toaster>` once the first toast for this placement is created.
 *
 * On first activation the Toaster's internal Zag machine may miss the initial
 * store event (it subscribes during mount, after the event was published).
 * We work around this by re-publishing existing toasts via `store.update()`
 * in an effect that runs after the machine has started.
 *
 * Once mounted the Toaster stays mounted to avoid repeated sync overhead.
 */
function OnDemandToaster({
  placement,
  toaster,
}: {
  placement: ToastPlacement;
  toaster: CreateToasterReturn;
}) {
  const [active, setActive] = useState(false);
  const needsSyncRef = useRef(false);

  // Subscribe to the store and activate on first toast
  useEffect(() => {
    return toaster.subscribe(() => {
      if (!active) {
        needsSyncRef.current = true;
        setActive(true);
      }
    });
  }, [toaster, active]);

  // After mount, re-publish existing toasts so the Zag machine picks them up
  useEffect(() => {
    if (!needsSyncRef.current) return;
    needsSyncRef.current = false;

    const visible = toaster.getVisibleToasts();
    for (const t of visible) {
      if (t.id) {
        toaster.update(t.id, {});
      }
    }
  });

  if (!active) return null;

  return (
    <Toaster key={placement} toaster={toaster}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(toast: any) => {
        const type = (toast.type as ToastType) || "info";
        const variant = (toast.meta?.variant as ToastVariant) || "accent-start";

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
  );
}

/**
 * ToastOutlet - Renders toast regions on-demand.
 *
 * Mount this component once at the root of your application (NimbusProvider
 * does this automatically). Toast regions are created lazily — no DOM elements
 * are rendered until the first toast for a given placement is created.
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
        <OnDemandToaster
          key={placement}
          placement={placement}
          toaster={toaster}
        />
      ))}
    </>
  );
}
