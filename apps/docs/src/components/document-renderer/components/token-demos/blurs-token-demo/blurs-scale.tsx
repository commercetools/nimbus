import { Box, Flex } from "@commercetools/nimbus";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";

/** Three colored dots: something sharp to blur. */
const Pattern = () => (
  <Flex gap="200" align="center" justify="center" width="3200" height="1200">
    <Box boxSize="800" borderRadius="full" bg="primary.9" />
    <Box boxSize="800" borderRadius="full" bg="critical.9" />
    <Box boxSize="800" borderRadius="full" bg="positive.9" />
  </Flex>
);

/**
 * The pattern, blurred with the CSS `filter` property. The frame clips the
 * blur, so that a strong blur stays inside its row.
 */
const BlurSample = ({ token }: { token: string }) => (
  <Box overflow="hidden" width="fit-content" aria-hidden>
    <Box filter={`blur({blurs.${token}})`}>
      <Pattern />
    </Box>
  </Box>
);

/**
 * The pattern with a panel over its right half. The panel blurs what is behind
 * it with the CSS `backdrop-filter` property, and the left half stays sharp for
 * comparison. The `backdropBlur` prop is not used: it has no effect in Nimbus,
 * because the global styles reset `--backdrop-blur` with `!important`.
 */
const BackdropSample = ({ token }: { token: string }) => (
  <Box position="relative" width="fit-content" aria-hidden>
    <Pattern />
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
  </Box>
);

/**
 * The blur tokens with their value, a sample for `filter` and a sample for
 * `backdropFilter`, and a copy button.
 */
export const BlursScale = () => (
  <Box my="600">
    <TokenTable
      columns={[
        { header: "px", width: "8ch", align: "right" },
        { header: "filter", width: "1/3" },
        { header: "backdropFilter" },
      ]}
      rows={tokensOf("blurs").map((item) => ({
        id: item.id,
        cells: [
          item.value,
          <BlurSample key="blur" token={item.id} />,
          <BackdropSample key="backdrop" token={item.id} />,
        ],
      }))}
    />
  </Box>
);
