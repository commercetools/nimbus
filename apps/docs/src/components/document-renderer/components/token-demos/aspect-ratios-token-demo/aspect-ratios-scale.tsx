import { Box, Flex } from "@commercetools/nimbus";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";

/**
 * The ratio of width to height of each token, as people say it. The token
 * values are rounded: `1.3333` is 4 : 3 and `1.7777` is 16 : 9.
 */
const RATIO: Record<string, string> = {
  square: "1 : 1",
  landscape: "4 : 3",
  portrait: "3 : 4",
  wide: "16 : 9",
  ultrawide: "3.6 : 1",
  golden: "1.618 : 1",
};

/** A shape with the height of the row and the width of the ratio. */
const Sample = ({ token }: { token: string }) => (
  <Flex aria-hidden>
    <Box
      height="1600"
      aspectRatio={token}
      bg="primary.3"
      border="solid-25"
      borderColor="primary.7"
      borderRadius="100"
    />
  </Flex>
);

/**
 * The aspect ratio tokens with their ratio, their value, a shape drawn with
 * the token, and a copy button.
 */
export const AspectRatiosScale = () => (
  <Box my="600">
    <TokenTable
      columns={[
        { header: "Ratio", width: "12ch" },
        { header: "Value", width: "10ch" },
        { header: "Sample" },
      ]}
      rows={tokensOf("aspectRatios").map((item) => ({
        id: item.id,
        cells: [
          RATIO[item.id] ?? "",
          item.value,
          <Sample key="sample" token={item.id} />,
        ],
      }))}
    />
  </Box>
);
