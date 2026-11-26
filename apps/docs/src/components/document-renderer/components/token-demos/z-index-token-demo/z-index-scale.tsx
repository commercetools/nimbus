import { Box, Code, Flex, Text } from "@commercetools/nimbus";
import { CopyButton } from "../copy-button";
import { tokensOf } from "../theme-tokens";
import { useCopy } from "../use-copy";

/** Vertical offset between two cards, in px. */
const STEP_Y = 32;
/** Horizontal offset between two cards, in px, on a wide and a narrow frame. */
const STEP_X_MAX = 20;
const STEP_X_MIN = 6;
/** Height of one card, and the narrowest and widest width of a card, in px. */
const CARD_HEIGHT = 56;
const CARD_MIN_WIDTH = 208;
const CARD_MAX_WIDTH = 288;

/**
 * Every z-index token as a card. Each card sets `zIndex` to its token, and the
 * cards overlap, so a card with a higher token covers the cards with lower
 * tokens. Each card shows the token, its value and a copy button.
 */
export const ZIndexScale = () => {
  const tokens = tokensOf("zIndex");
  const { copied, copy } = useCopy();

  if (tokens.length === 0) return null;

  const steps = tokens.length - 1;
  // The horizontal offset shrinks with the frame, so that on a narrow screen
  // every card shows its value and copy button without scrolling.
  const stepX = `max(${STEP_X_MIN}px, min(${STEP_X_MAX}px, (100% - ${CARD_MIN_WIDTH}px) / ${steps}))`;

  return (
    <Box
      my="600"
      p="500"
      border="solid-25"
      borderColor="border"
      borderRadius="300"
      overflowX="auto"
    >
      <Box
        role="list"
        aria-label="Z-index tokens, from the lowest to the highest"
        position="relative"
        // A new stacking context: `hide` (-1) stays inside the frame.
        isolation="isolate"
        mx="auto"
        maxWidth={`${steps * STEP_X_MAX + CARD_MAX_WIDTH}px`}
        minWidth={`${steps * STEP_X_MIN + CARD_MIN_WIDTH}px`}
        height={`${steps * STEP_Y + CARD_HEIGHT}px`}
      >
        {tokens.map((item, index) => (
          <Box
            role="listitem"
            key={item.id}
            position="absolute"
            top={`${index * STEP_Y}px`}
            left={`calc(${index} * ${stepX})`}
            zIndex={item.id}
            width={`calc(100% - ${steps} * ${stepX})`}
            height={`${CARD_HEIGHT}px`}
            px="300"
            bg="bg"
            border="solid-25"
            borderColor="border.emphasized"
            borderRadius="200"
            boxShadow="2"
          >
            <Flex
              align="center"
              justify="space-between"
              gap="300"
              height={`${STEP_Y}px`}
            >
              <Flex align="baseline" gap="200" minWidth="0">
                <Code variant="subtle">{item.id}</Code>
                <Text textStyle="sm" color="neutral.11">
                  {item.value}
                </Text>
              </Flex>
              <CopyButton token={item.id} copied={copied} onCopy={copy} />
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
