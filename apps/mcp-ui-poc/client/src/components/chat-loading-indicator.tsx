import { Box, Flex } from "@commercetools/nimbus";

export const ChatLoadingIndicator = () => (
  <Box
    padding="400"
    backgroundColor="neutral.2"
    borderRadius="200"
    width="fit-content"
  >
    <Flex gap="200" alignItems="center">
      <Box
        as="span"
        display="inline-block"
        width="8px"
        height="8px"
        borderRadius="full"
        backgroundColor="primary.9"
        animation="pulse"
      />
      <Box
        as="span"
        display="inline-block"
        width="8px"
        height="8px"
        borderRadius="full"
        backgroundColor="primary.9"
        animation="pulse"
        animationDelay="0.2s"
      />
      <Box
        as="span"
        display="inline-block"
        width="8px"
        height="8px"
        borderRadius="full"
        backgroundColor="primary.9"
        animation="pulse"
        animationDelay="0.4s"
      />
    </Flex>
  </Box>
);
