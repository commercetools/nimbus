/**
 * Error Boundary Component
 *
 * Displays friendly error messages when routes fail to load
 */

import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Box, Heading, Text, Button, Stack } from "@commercetools/nimbus";

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "Unknown error occurred";
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p="800"
    >
      <Stack gap="600" maxWidth="md" textAlign="center">
        <Box>
          {errorStatus && (
            <Heading as="h1" size="3xl" color="critical.11">
              {errorStatus}
            </Heading>
          )}
          <Heading as="h2" size="xl" mt="400">
            {errorStatus === 404 ? "Page Not Found" : "Something went wrong"}
          </Heading>
        </Box>

        <Text color="fg.muted">{errorMessage}</Text>

        <Box>
          <Button onClick={() => (window.location.href = "/")} variant="solid">
            Go Home
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
