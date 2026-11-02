import { Box, Code, Flex, Text } from "@commercetools/nimbus";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";

/** An area that shows the cursor of the token when the pointer is over it. */
const TryArea = ({ token }: { token: string }) => (
  <Flex
    cursor={token}
    align="center"
    justify="center"
    height="1000"
    maxWidth="4800"
    borderRadius="200"
    border="solid-25"
    borderColor="border"
    borderStyle="dashed"
    bg="neutral.2"
    _hover={{ bg: "primary.3", borderColor: "primary.7" }}
    aria-hidden
  >
    <Text textStyle="xs" color="neutral.11">
      Point here
    </Text>
  </Flex>
);

/**
 * The cursor tokens with the CSS cursor they set, an area to try the cursor,
 * and a copy button.
 */
export const CursorsScale = () => (
  <Box my="600">
    <TokenTable
      columns={[{ header: "CSS value", width: "18ch" }, { header: "Try it" }]}
      rows={tokensOf("cursor").map((item) => ({
        id: item.id,
        cells: [
          <Code key="value" variant="subtle">
            {item.value}
          </Code>,
          <TryArea key="try" token={item.id} />,
        ],
      }))}
    />
  </Box>
);
