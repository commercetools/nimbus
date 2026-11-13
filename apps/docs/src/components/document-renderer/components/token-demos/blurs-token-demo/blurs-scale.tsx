import { Box, Flex, SimpleGrid, Stack, Text } from "@commercetools/nimbus";
import { CopyButton } from "../copy-button";
import { tokensOf } from "../theme-tokens";
import { useCopy } from "../use-copy";

/**
 * Colored dots and two lines of text: sharp edges that show how strong a blur
 * is.
 */
const Content = () => (
  <Stack flex="1" minWidth="0" gap="150" p="300" whiteSpace="nowrap">
    <Flex gap="150">
      <Box boxSize="600" borderRadius="full" bg="primary.9" />
      <Box boxSize="600" borderRadius="full" bg="critical.9" />
      <Box boxSize="600" borderRadius="full" bg="positive.9" />
    </Flex>
    <Text fontWeight="600" color="neutral.12">
      Order 1024
    </Text>
    <Text textStyle="sm" color="neutral.11">
      Ships on Friday
    </Text>
  </Stack>
);

/**
 * The same content twice, side by side. A panel over the right copy blurs what
 * is behind it with the CSS `backdrop-filter` property; the left copy stays
 * sharp for comparison. The panel has no background, so that the blur is easy
 * to see. The `backdropBlur` prop is not used: it has no effect in Nimbus
 * (https://github.com/commercetools/nimbus/issues/2143).
 */
const Sample = ({ token }: { token: string }) => (
  <Flex
    position="relative"
    overflow="hidden"
    bg="bg"
    border="solid-25"
    borderColor="border"
    borderRadius="200"
    aria-hidden
  >
    <Content />
    <Content />
    <Box
      position="absolute"
      top="0"
      bottom="0"
      left="50%"
      right="0"
      backdropFilter={`blur({blurs.${token}})`}
      borderLeft="solid-25"
      borderColor="border"
    />
  </Flex>
);

/** Every blur token on a sample, with its value and a copy button. */
export const BlursScale = () => {
  const tokens = tokensOf("blurs");
  const { copied, copy } = useCopy();

  return (
    <SimpleGrid
      my="600"
      columns={{ base: 1, md: 2 }}
      columnGap="600"
      rowGap="600"
    >
      {tokens.map((item) => (
        <Stack key={item.id} gap="200">
          <Sample token={item.id} />
          <Flex align="center" gap="200">
            <Text fontFamily="mono" textStyle="sm" fontWeight="600">
              {item.id}
            </Text>
            <Text textStyle="xs" color="neutral.11">
              {item.value}
            </Text>
            <CopyButton token={item.id} copied={copied} onCopy={copy} />
          </Flex>
        </Stack>
      ))}
    </SimpleGrid>
  );
};
