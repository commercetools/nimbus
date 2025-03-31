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
import { Text } from "../text";
import { Button } from "../button";

/**
 * Alert
 * ============================================================
 * Provides feedback to the user about the status of an action or system event
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ children, ...props }, ref) => {
    return (
      <AlertRoot ref={ref} {...props} role="alert">
        <AlertIcon alignItems="flex-start">
          <ErrorOutline />
        </AlertIcon>
        <Stack flex="1" gap="200">
          <Box>
            <AlertTitle>
              <Text fontWeight="600">Alert title</Text>
            </AlertTitle>
            <AlertDescription>
              <Text>Description goes right here below the title</Text>
            </AlertDescription>
          </Box>
          <AlertActions>
            <Stack direction="row" gap="8px" alignItems="center">
              <Button>Dismiss</Button>
              <Button>Button</Button>
            </Stack>
          </AlertActions>
        </Stack>
        <AlertDismiss>
          <IconButton variant="ghost" size="2xs" aria-label="Dismiss">
            <Clear />
          </IconButton>
        </AlertDismiss>
      </AlertRoot>
    );
  }
);
Alert.displayName = "Alert";
