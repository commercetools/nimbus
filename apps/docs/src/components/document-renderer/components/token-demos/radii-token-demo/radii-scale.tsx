import { Flex, Stack, Text } from "@commercetools/nimbus";
import { Check } from "@commercetools/nimbus-icons";
import { useState, type ComponentProps, type ReactNode } from "react";
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

type Sample = {
  name: string;
  /** The radius token that the recipe of the Nimbus component uses. */
  nimbusToken: string;
  /** The size of the sample. */
  shape: ComponentProps<typeof Flex>;
  content?: ReactNode;
};

/**
 * Elements of different sizes. Checkbox, Tag (size `sm`), Button and Avatar
 * (size `md`) have the size from the recipe of the Nimbus component. A card
 * has no fixed size: it grows with its content.
 */
const SAMPLES: Sample[] = [
  {
    name: "Checkbox",
    nimbusToken: "50",
    shape: { boxSize: "400" },
    content: <Check />,
  },
  {
    name: "Tag",
    nimbusToken: "200",
    shape: { height: "600", px: "200", textStyle: "sm" },
    content: "Shoes",
  },
  {
    name: "Button",
    nimbusToken: "200",
    shape: { height: "1000", px: "400", textStyle: "md" },
    content: "Save",
  },
  {
    name: "Avatar",
    nimbusToken: "full",
    shape: { boxSize: "1000", textStyle: "sm", fontWeight: "500" },
    content: "AB",
  },
  {
    name: "Card",
    nimbusToken: "300",
    shape: { width: "4800", height: "2400" },
  },
];

/**
 * The selected radius on elements of different sizes. Below each element is
 * the radius that the Nimbus component uses, marked when it is the selected
 * token.
 */
const Preview = ({ token, value }: { token: string; value: string }) => (
  <Stack gap="300">
    <Flex align="baseline" gap="300" wrap="wrap" aria-live="polite">
      <Text textStyle="2xl" fontWeight="600">
        {token}
      </Text>
      <Text color="neutral.11">{value}</Text>
    </Flex>

    {/* The items stand on one line, so that the captions align. */}
    <Flex as="ul" align="flex-end" columnGap="400" rowGap="500" wrap="wrap">
      {SAMPLES.map((sample) => {
        const isMatch = sample.nimbusToken === token;
        return (
          // The fixed width keeps the samples in place when the check mark
          // appears.
          <Stack
            as="li"
            key={sample.name}
            minWidth="2800"
            gap="200"
            align="center"
          >
            <Shape radius={token} aria-hidden {...sample.shape}>
              {sample.content}
            </Shape>
            <Stack gap="0" align="center" textStyle="xs">
              <Text fontWeight="500">{sample.name}</Text>
              <Flex
                align="center"
                gap="50"
                color={isMatch ? "primary.11" : "neutral.11"}
                fontWeight={isMatch ? "500" : undefined}
              >
                {isMatch && <Check aria-hidden />}
                Nimbus uses {sample.nimbusToken}
              </Flex>
            </Stack>
          </Stack>
        );
      })}
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
            // Larger than twice the largest token, so that `600` is not
            // already a circle and looks different from `full`.
            <Shape key="sample" radius={item.id} boxSize="1600" aria-hidden />,
          ],
        }))}
      />
    </Stack>
  );
};
