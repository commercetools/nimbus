/**
 * Development Toolbar
 *
 * Shows helpful development information and tools.
 * Only visible in development mode.
 */

import { useState } from "react";
import {
  Box,
  Stack,
  Text,
  Button,
  Badge,
  Card,
  Icon,
} from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";

interface DevToolbarProps {
  currentRoute?: string;
  buildTime?: number;
  validationErrors?: string[];
}

export const DevToolbar = ({
  currentRoute = "/",
  buildTime = 0,
  validationErrors = [],
}: DevToolbarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Only show in development
  if (import.meta.env.PROD) return null;
  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      bottom="0"
      right="0"
      zIndex="9999"
      borderTopLeftRadius="200"
      boxShadow="lg"
    >
      <Card.Root>
        <Card.Content>
          <Stack direction="column" gap="200">
            {/* Header */}
            <Stack direction="row" gap="200" alignItems="center">
              <Icon as={Icons.Code} color="primary.11" />
              <Text fontWeight="600" fontSize="350">
                Dev Tools
              </Text>
              <Stack direction="row" gap="100" ml="auto">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  <Icon as={isExpanded ? Icons.ExpandLess : Icons.ExpandMore} />
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setIsVisible(false)}
                  aria-label="Close"
                >
                  <Icon as={Icons.Close} />
                </Button>
              </Stack>
            </Stack>

            {/* Content (when expanded) */}
            {isExpanded && (
              <Stack direction="column" gap="300">
                {/* Current Route */}
                <Box>
                  <Text fontSize="300" color="neutral.11" fontWeight="500">
                    Current Route
                  </Text>
                  <Text fontSize="300" fontFamily="mono">
                    {currentRoute}
                  </Text>
                </Box>

                {/* Build Status */}
                <Box>
                  <Text fontSize="300" color="neutral.11" fontWeight="500">
                    Last Build
                  </Text>
                  <Stack direction="row" gap="200" alignItems="center">
                    <Badge
                      colorPalette={
                        validationErrors.length > 0 ? "critical" : "positive"
                      }
                      size="sm"
                    >
                      {validationErrors.length > 0 ? "Errors" : "OK"}
                    </Badge>
                    <Text fontSize="300">
                      {buildTime > 0 ? `${buildTime.toFixed(2)}s` : "N/A"}
                    </Text>
                  </Stack>
                </Box>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <Box>
                    <Text fontSize="300" color="critical.11" fontWeight="500">
                      Validation Errors ({validationErrors.length})
                    </Text>
                    <Stack direction="column" gap="100">
                      {validationErrors.slice(0, 3).map((error, idx) => (
                        <Text key={idx} fontSize="250" fontFamily="mono">
                          {error}
                        </Text>
                      ))}
                      {validationErrors.length > 3 && (
                        <Text fontSize="250" color="neutral.11">
                          +{validationErrors.length - 3} more...
                        </Text>
                      )}
                    </Stack>
                  </Box>
                )}

                {/* Actions */}
                <Stack direction="row" gap="200">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    <Icon as={Icons.Refresh} />
                    Reload
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      const route = prompt("Enter route path:", currentRoute);
                      if (route) window.location.pathname = route;
                    }}
                  >
                    <Icon as={Icons.Navigation} />
                    Go To Route
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Card.Content>
      </Card.Root>
    </Box>
  );
};
