import { Box, Button, Code, Flex, Stack, Text } from "@commercetools/nimbus";
import { useState, type ReactNode } from "react";
import { tokensOf } from "../theme-tokens";
import { TokenPicker } from "../token-picker";
import { TokenTable } from "../token-table";

const DEFAULT_TOKEN = "400";

type SampleProps = {
  /** What the sample shows, such as "Padding". */
  label: string;
  /** The style prop with the token, such as `p="400"`. */
  code: string;
  children: ReactNode;
};

/** One use of the token: a label with the code, and a drawing below it. */
const Sample = ({ label, code, children }: SampleProps) => (
  <Stack gap="200" minWidth="0" maxWidth="full">
    <Flex align="baseline" gap="200" textStyle="sm">
      <Text fontWeight="600">{label}</Text>
      <Code variant="subtle">{code}</Code>
    </Flex>
    {/*
     * The drawing is decorative: the label says the same. On a narrow screen,
     * a large token scrolls sideways instead of squeezing the content.
     */}
    <Box overflowX="auto" aria-hidden>
      {children}
    </Box>
  </Stack>
);

type PreviewProps = {
  token: string;
  value: string;
};

/**
 * The selected token at its real size, in two common uses: the padding of a
 * card and the gap between two buttons.
 */
const Preview = ({ token, value }: PreviewProps) => (
  <Stack gap="500">
    <Flex align="baseline" gap="300" wrap="wrap" aria-live="polite">
      <Text textStyle="2xl" fontWeight="600">
        {token}
      </Text>
      <Text color="neutral.11">{value}</Text>
    </Flex>

    <Flex gap="800" rowGap="600" wrap="wrap" align="flex-start">
      <Sample label="Padding" code={`p="${token}"`}>
        <Box
          // A card with the token as its padding. The dashed line marks the
          // content, so the space between it and the border is the padding.
          width="fit-content"
          p={token}
          bg="bg"
          border="solid-25"
          borderColor="neutral.7"
          borderRadius="200"
        >
          <Stack
            gap="50"
            outline="1px dashed"
            outlineColor="primary.8"
            textStyle="sm"
            whiteSpace="nowrap"
          >
            <Text fontWeight="600">Order 1042</Text>
            <Text color="neutral.11">Shipped on 2 November</Text>
          </Stack>
        </Box>
      </Sample>

      <Sample label="Gap" code={`gap="${token}"`}>
        {/* `inert`: the buttons are part of the picture, not controls. */}
        <Flex gap={token} inert>
          <Button size="xs" variant="outline">
            Cancel
          </Button>
          <Button size="xs" variant="solid" colorPalette="primary">
            Save
          </Button>
        </Flex>
      </Sample>
    </Flex>
  </Stack>
);

/**
 * The spacing scale: a preview of the selected token, and a table of every
 * token with its size in px, a bar at the real size and a copy button.
 */
export const SpacingScale = () => {
  // The negative tokens mirror the positive ones; the page explains them.
  const tokens = tokensOf("spacing").filter((item) => !item.id.startsWith("-"));
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
          label="Spacing token"
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
            // The bar is as wide as the token: it uses the token.
            <Box
              key="sample"
              width={item.id}
              height="300"
              bg="primary.9"
              borderRadius="50"
              aria-hidden
            />,
          ],
        }))}
      />
    </Stack>
  );
};
