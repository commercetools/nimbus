import {
  Toast as ChakraToast,
  useToastStyles,
  type CreateToasterReturn,
} from "@chakra-ui/react/toast";
import {
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
  Clear,
} from "@commercetools/nimbus-icons";
import { IconButton } from "../../icon-button/icon-button";
import { Button } from "../../button/button";
import { Box } from "../../box";
import { LoadingSpinner } from "../../loading-spinner/loading-spinner";
import { useLocalizedStringFormatter } from "@/hooks";
import { toastMessagesStrings } from "../toast.messages";
import type { ChakraToastData, ToastType } from "../toast.types";

const ICON_MAP: Record<Exclude<ToastType, "loading">, React.ReactElement> = {
  info: <Info />,
  success: <CheckCircleOutline />,
  warning: <WarningAmber />,
  error: <ErrorOutline />,
};

/**
 * Inner content of a toast, rendered inside ChakraToast.Root (the recipe provider).
 * Uses `useToastStyles` to apply recipe slot styles to custom elements.
 */
export function ToastContent({
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
      <Box css={styles.indicator}>
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
      </Box>

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
