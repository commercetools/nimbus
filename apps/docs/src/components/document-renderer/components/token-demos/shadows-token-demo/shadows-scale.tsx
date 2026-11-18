import { Box, Flex, SimpleGrid, Stack, Text } from "@commercetools/nimbus";
import { CopyButton } from "../copy-button";
import { tokensOf } from "../theme-tokens";
import { useCopy } from "../use-copy";

/**
 * Splits a shadow value before its color, so that the offsets and the color
 * each get a line: `0 1px 4px 0` and `hsla(0, 0%, 0%, 0.05)`.
 */
const splitValue = (value: string) => {
  const index = value.search(/\s(?:hsla?|rgba?)\(/);
  return index < 0 ? [value] : [value.slice(0, index), value.slice(index + 1)];
};

/**
 * Every shadow token on a card, with its value and a copy button. The cards
 * follow the color mode of the site.
 */
export const ShadowsScale = () => {
  const tokens = tokensOf("shadows");
  const { copied, copy } = useCopy();

  if (tokens.length === 0) return null;

  return (
    <Box
      my="600"
      bg="bg"
      border="solid-25"
      borderColor="border"
      borderRadius="300"
      p="600"
    >
      <SimpleGrid columns={{ base: 2, md: 4 }} columnGap="600" rowGap="800">
        {tokens.map((item) => (
          <Stack key={item.id} gap="200">
            <Box
              height="1600"
              borderRadius="200"
              bg="bg"
              boxShadow={item.id}
              mb="200"
              aria-hidden
            />
            <Flex justify="space-between" align="center" gap="200">
              <Text fontFamily="mono" textStyle="sm" fontWeight="600">
                {item.id}
              </Text>
              <CopyButton token={item.id} copied={copied} onCopy={copy} />
            </Flex>
            <Text textStyle="xs" color="neutral.11">
              {splitValue(item.value).map((part) => (
                <Box as="span" key={part} display="block">
                  {part}
                </Box>
              ))}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Box>
  );
};
