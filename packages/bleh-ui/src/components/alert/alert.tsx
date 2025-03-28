import { forwardRef } from "react";
import {
  AlertRoot,
  AlertActions,
  AlertDescription,
  AlertDismiss,
  AlertIcon,
  AlertTitle,
} from "./alert.slots";
import type { AlertProps } from "./alert.types";
import { Box } from "../box";
import { Stack } from "../stack";
import { Clear, ErrorOutline } from "@bleh-ui/icons";
import { IconButton } from "../icon-button";

/**
 * Alert
 * ============================================================
 * Provides feedback to the user about the status of an action or system event
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ children, ...props }, ref) => {
    return (
      <AlertRoot ref={ref} {...props} role="alert">
        <AlertIcon alignItems="flex-start">
          <ErrorOutline />
        </AlertIcon>
        <Box flex="1">
          <AlertTitle>Alert title</AlertTitle>
          <AlertDescription>
            Description goes right here below the title Description goes right
            here below the title Description goes right here below the title
          </AlertDescription>
          <AlertActions>
            <Stack direction="row" gap="8px" alignItems="center">
              <button>Dismiss</button>
              <button>Button</button>
            </Stack>
          </AlertActions>
        </Box>
        <AlertDismiss>
          {/* TODO: get rid the the mandatory aria-label? */}
          <IconButton variant="ghost" size="2xs" aria-label="Dismiss">
            <Clear />
          </IconButton>
        </AlertDismiss>
      </AlertRoot>
    );
  }
);
Alert.displayName = "Alert";
