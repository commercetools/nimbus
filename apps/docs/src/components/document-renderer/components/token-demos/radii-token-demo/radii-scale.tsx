import { Flex, Stack, Text } from "@commercetools/nimbus";
import { useState, type ComponentProps } from "react";
import { tokensOf } from "../theme-tokens";
import { TokenPicker } from "../token-picker";
import { TokenTable } from "../token-table";

const DEFAULT_TOKEN = "200";

type ShapeProps = ComponentProps<typeof Flex> & {
  radius: string;
};

/** A shape with the radius, in the colors of the primary palette. */
const Shape = ({ radius, children, ...props }: ShapeProps) => (
  <Flex
    align="center"
    justify="center"
    flexShrink={0}
    bg="primary.3"
    color="primary.11"
    border="solid-25"
    borderColor="primary.7"
    borderRadius={radius}
    {...props}
  >
    {children}
  </Flex>
);

/**
 * The selected radius on elements of different heights: a tag, a button, a
 * square and a card. The same radius looks rounder on a smaller element.
 */
const Preview = ({ token, value }: { token: string; value: string }) => (
  <Stack gap="300">
    <Flex align="baseline" gap="300" wrap="wrap" aria-live="polite">
      <Text textStyle="2xl" fontWeight="600">
        {token}
      </Text>
      <Text color="neutral.11">{value}</Text>
    </Flex>

    {/* The picture is decorative: the values above say the same. */}
    <Flex align="center" gap="500" wrap="wrap" aria-hidden>
      <Shape radius={token} height="600" px="300" textStyle="xs">
        Tag
      </Shape>
      <Shape radius={token} height="1000" px="400" textStyle="sm">
        Button
      </Shape>
      <Shape radius={token} boxSize="1000" />
      <Shape radius={token} width="4800" height="2400" textStyle="sm">
        Card
      </Shape>
    </Flex>
  </Stack>
);

/**
 * The radius scale: a preview of the selected token on elements of different
 * sizes, and a table of every token with its value, a sample and a copy
 * button.
 */
export const RadiiScale = () => {
  const tokens = tokensOf("radii");
  const [selected, setSelected] = useState(DEFAULT_TOKEN);

  const current = tokens.find((item) => item.id === selected) ?? tokens[0];
  if (!current) return null;

  return (
    <Stack gap="500" my="600">
      <Stack
        gap="500"
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="300"
        p="500"
      >
        <TokenPicker
          label="Radius token"
          tokens={tokens.map((item) => item.id)}
          value={current.id}
          onChange={setSelected}
        />
        <Preview token={current.id} value={current.value} />
      </Stack>

      <TokenTable
        columns={[
          { header: "px", width: "10ch", align: "right" },
          { header: "Sample" },
        ]}
        rows={tokens.map((item) => ({
          id: item.id,
          highlight: item.id === current.id,
          cells: [
            item.value,
            <Shape key="sample" radius={item.id} boxSize="1200" aria-hidden />,
          ],
        }))}
      />
    </Stack>
  );
};
