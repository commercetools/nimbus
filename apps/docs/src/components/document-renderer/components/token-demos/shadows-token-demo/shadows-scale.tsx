import {
  Box,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  ToggleButtonGroup,
} from "@commercetools/nimbus";
import {
  useColorScaleMode,
  type ColorScaleMode,
} from "@/atoms/color-scale-mode";
import { CopyButton } from "../copy-button";
import { tokensOf } from "../theme-tokens";
import { useCopy } from "../use-copy";

/**
 * Every shadow token on a card, with its value and a copy button. A switch
 * shows the cards in light or dark mode. It follows the color mode of the site
 * until the reader picks one, and it shares the pick with the color scales.
 */
export const ShadowsScale = () => {
  const tokens = tokensOf("shadows");
  const [mode, setMode] = useColorScaleMode();
  const { copied, copy } = useCopy();

  if (tokens.length === 0) return null;

  return (
    <Stack gap="400" my="600">
      <Flex justify="flex-end">
        <ToggleButtonGroup.Root
          size="sm"
          colorPalette="primary"
          disallowEmptySelection
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const key = [...keys][0];
            if (key != null) setMode(key as ColorScaleMode);
          }}
          aria-label="Color mode of the samples"
        >
          <ToggleButtonGroup.Button id="light">Light</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="dark">Dark</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </Flex>

      {/*
        `light` and `dark` force the color mode for everything inside. The text
        uses palette steps: `fg` keeps the value of the mode of the site.
      */}
      <Box
        className={mode}
        bg="bg"
        color="neutral.12"
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
                {item.value}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  );
};
