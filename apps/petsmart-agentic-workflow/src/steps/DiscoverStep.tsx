import { Box, Text } from "@commercetools/nimbus";

export type FlavorMode = "contextual" | "orchestrated";

export const DiscoverStep = ({ mode }: { mode: FlavorMode }) => (
  <Box p="600">
    <Text textStyle="xl">Discover step - TODO</Text>
    <Text textStyle="sm" color="neutral.10">
      Mode: {mode}
    </Text>
  </Box>
);
