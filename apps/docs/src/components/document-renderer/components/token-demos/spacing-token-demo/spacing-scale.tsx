import { Box, Code, Flex, Stack, Table, Text } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { themeSpacingTokensAtom } from "@/atoms/spacing-tokens.ts";
import { CopyButton } from "../copy-button";
import { TokenPicker } from "../token-picker";
import { useCopy } from "../use-copy";

const DEFAULT_TOKEN = "400";

/** Root font size that rem values are shown for. */
const ROOT_FONT_SIZE = 16;

const formatRem = (px: number) =>
  `${parseFloat((px / ROOT_FONT_SIZE).toFixed(4))}rem`;

type PreviewProps = {
  token: string;
  px: number;
};

/**
 * The selected token at its real size, as padding around a row of items and as
 * the gap between them.
 */
const Preview = ({ token, px }: PreviewProps) => (
  <Stack gap="300">
    <Flex align="baseline" gap="300" wrap="wrap" aria-live="polite">
      <Text textStyle="2xl" fontWeight="600">
        {token}
      </Text>
      <Text color="neutral.11">
        {px}px · {formatRem(px)}
      </Text>
    </Flex>

    {/* The picture is decorative: the values above say the same. */}
    <Box overflowX="auto" aria-hidden>
      <Box
        // Padding: the space inside the container.
        bg="primary.3"
        borderRadius="200"
        p={token}
        width="fit-content"
      >
        <Flex
          // Gap: the space between the items.
          bg="primary.6"
          gap={token}
          borderRadius="100"
        >
          {[0, 1, 2].map((item) => (
            <Box
              key={item}
              width="1400"
              height="800"
              flexShrink={0}
              bg="bg"
              border="1px solid"
              borderColor="primary.7"
              borderRadius="100"
            />
          ))}
        </Flex>
      </Box>
    </Box>

    <Flex gap="500" wrap="wrap" textStyle="sm" color="neutral.11">
      <Flex align="center" gap="150">
        <Box boxSize="300" borderRadius="50" bg="primary.3" />
        <Text>
          Padding <Code variant="subtle">p="{token}"</Code>
        </Text>
      </Flex>
      <Flex align="center" gap="150">
        <Box boxSize="300" borderRadius="50" bg="primary.6" />
        <Text>
          Gap <Code variant="subtle">gap="{token}"</Code>
        </Text>
      </Flex>
    </Flex>
  </Stack>
);

/**
 * The spacing scale: a preview of the selected token, and a table of every
 * token with its size in px and rem, a bar at the real size, and a copy button.
 */
export const SpacingScale = () => {
  const tokens = useAtomValue(themeSpacingTokensAtom);
  const [selected, setSelected] = useState(DEFAULT_TOKEN);
  const { copied, copy } = useCopy();
  const current = tokens.find((item) => item.id === selected) ?? tokens[0];
  if (!current) return null;

  return (
    <Stack gap="500" my="600">
      <Stack
        gap="500"
        border="1px solid"
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
        <Preview
          token={current.id}
          px={parseFloat(current.value.originalValue)}
        />
      </Stack>

      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Token</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">px</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">rem</Table.ColumnHeader>
            <Table.ColumnHeader>Size</Table.ColumnHeader>
            <Table.ColumnHeader>
              <Box srOnly>Copy</Box>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tokens.map((item) => {
            const px = parseFloat(item.value.originalValue);
            const isSelected = item.id === current.id;
            return (
              <Table.Row
                key={item.id}
                bg={isSelected ? "primary.3" : undefined}
              >
                <Table.Cell>
                  <Code variant="subtle">{item.id}</Code>
                </Table.Cell>
                <Table.Cell textAlign="right">{px}px</Table.Cell>
                <Table.Cell textAlign="right">{formatRem(px)}</Table.Cell>
                <Table.Cell>
                  {/* The bar is as wide as the token: it uses the token. */}
                  <Box
                    width={item.id}
                    height="300"
                    bg="primary.9"
                    borderRadius="50"
                    aria-hidden
                  />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <CopyButton token={item.id} copied={copied} onCopy={copy} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};
