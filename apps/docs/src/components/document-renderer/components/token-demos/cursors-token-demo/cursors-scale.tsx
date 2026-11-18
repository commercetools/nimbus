import { Code, SimpleGrid, Stack, Text } from "@commercetools/nimbus";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";

/**
 * The three CSS cursors that the tokens set, with their shape as MDN describes
 * it (https://developer.mozilla.org/en-US/docs/Web/CSS/cursor). The order is
 * also the order of the table.
 */
const CURSORS = [
  { value: "pointer", shape: "Typically a pointing hand" },
  { value: "default", shape: "Typically an arrow" },
  { value: "not-allowed", shape: "Shows that an action is not possible" },
];

/** The tokens in the order of their kind: buttons, inputs, lists, disabled. */
const TOKEN_ORDER = [
  "button",
  "switch",
  "checkbox",
  "radio",
  "slider",
  "menuitem",
  "option",
  "disabled",
];

/** An area that shows the cursor when the mouse pointer is over it. */
const TryArea = ({ value, shape }: { value: string; shape: string }) => (
  <Stack
    as="li"
    cursor={value}
    align="center"
    justify="center"
    gap="100"
    minHeight={{ base: "auto", md: "2400" }}
    p={{ base: "300", md: "400" }}
    textAlign="center"
    borderRadius="200"
    border="solid-25"
    borderStyle="dashed"
    borderColor="neutral.7"
    bg="neutral.2"
  >
    <Code variant="subtle">{value}</Code>
    <Text textStyle="xs" color="neutral.11">
      {shape}
    </Text>
  </Stack>
);

/**
 * The cursor tokens: an area to try each of the three CSS cursors, and a
 * table of the tokens with the CSS cursor they set and a copy button. The
 * table lists the tokens with the same cursor next to each other.
 */
export const CursorsScale = () => {
  const tokens = tokensOf("cursor").sort(
    (a, b) => TOKEN_ORDER.indexOf(a.id) - TOKEN_ORDER.indexOf(b.id)
  );

  return (
    <Stack gap="500" my="600">
      <Stack
        gap="300"
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="300"
        p="500"
      >
        <Text textStyle="sm" color="neutral.11">
          Move the mouse pointer over an area to see its cursor.
        </Text>
        <SimpleGrid
          as="ul"
          gridTemplateColumns="repeat(auto-fit, minmax(160px, 1fr))"
          gap="300"
        >
          {CURSORS.map((cursor) => (
            <TryArea key={cursor.value} {...cursor} />
          ))}
        </SimpleGrid>
      </Stack>

      <TokenTable
        minWidth="xs"
        columns={[{ header: "CSS cursor" }]}
        rows={tokens.map((item) => ({
          id: item.id,
          cells: [
            <Code key="value" variant="subtle">
              {item.value}
            </Code>,
          ],
        }))}
      />
    </Stack>
  );
};
