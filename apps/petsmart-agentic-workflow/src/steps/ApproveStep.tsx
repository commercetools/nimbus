import { Box, Text } from "@commercetools/nimbus";

export type FlavorMode = "contextual" | "orchestrated";

export const ApproveStep = ({ mode }: { mode: FlavorMode }) => (
  <Box p="600">
    <Text textStyle="xl">Approve step - TODO</Text>
    <Text textStyle="sm" color="neutral.10">
      Mode: {mode}
    </Text>
  </Box>
);
