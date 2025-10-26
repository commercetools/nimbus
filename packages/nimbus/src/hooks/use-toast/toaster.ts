import { createToaster } from "@chakra-ui/react";

/**
 * Global toaster instance for creating toast notifications.
 * This singleton is used by the useToast hook and should not be used directly.
 *
 * @internal
 */
export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});
