import { Box, Stack, Text } from "@commercetools/nimbus";

/**
 * Banner indicating that the component supports Chakra UI style props
 */
export const StylePropsSupportBanner = () => {
  return (
    <Box
      mb="600"
      padding="400"
      backgroundColor="primary.subtle"
      borderRadius="200"
      borderLeft="4px solid"
      borderColor="primary.9"
    >
      <Stack direction="row" gap="200" alignItems="center">
        <Text fontSize="400" fontWeight="600" color="primary.11">
          ✓ Style Props Supported
        </Text>
      </Stack>
      <Text fontSize="350" color="primary.11" mt="100">
        This component accepts all Chakra UI style props for custom styling
        (margin, padding, color, layout, etc.).
      </Text>
    </Box>
  );
};
