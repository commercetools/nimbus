import { Box, Code, Flex, system, Table, Text } from "@commercetools/nimbus";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { CopyButton } from "../copy-button";
import { tokensOf } from "../theme-tokens";
import { useCopy } from "../use-copy";

/** Root font size that rem values are shown for. */
const ROOT_FONT_SIZE = 16;

/** Text below this size, in px, is marked as deprecated. */
const MIN_FONT_SIZE = 12;

/** Shows all letters: for fonts, weights and letter spacings. */
const PANGRAM = "Sphinx of black quartz, judge my vow";

/** Short text from a commerce UI: for text styles. */
const UI_TEXT = "Order details";

/** Text styles that are older names for styles of the main scale. */
const OLDER_TEXT_STYLES = ["caption", "detail", "body"];

type TypographyKind =
  | "textStyles"
  | "fonts"
  | "fontSizes"
  | "fontWeights"
  | "letterSpacings"
  | "lineHeights";

interface Row {
  id: string;
  /** The cells between the token name and the sample. */
  values: ReactNode[];
  sample: ReactNode;
  /** The size in px, to mark sizes that are too small. */
  fontSizePx?: number;
  /** Rows with a group are shown last, under a heading with the group name. */
  group?: string;
}

interface Config {
  /** Headers for the value columns. */
  headers: string[];
  /** Widths of the value columns. */
  widths: string[];
  /**
   * The narrowest width of the table, as a size token. On a narrower screen
   * the table scrolls sideways, so that the sample column does not get too
   * narrow.
   */
  minWidth: string;
  rows: () => Row[];
}

type TextStyle = { value: { fontSize: string; lineHeight: string } };

const textStyles = () =>
  Object.entries(
    (system._config.theme?.textStyles ?? {}) as Record<string, TextStyle>
  );

/** The text styles that use a value, such as all styles with a 16px size. */
const TextStylesWith = ({
  property,
  value,
}: {
  property: keyof TextStyle["value"];
  value: string;
}) => {
  const ids = textStyles()
    .filter(([, style]) => style.value[property] === value)
    .map(([id]) => id);
  if (ids.length === 0) return null;
  return (
    <Text fontFamily="mono" textStyle="sm" color="neutral.11">
      {ids.join(", ")}
    </Text>
  );
};

const formatRem = (px: number) =>
  `${parseFloat((px / ROOT_FONT_SIZE).toFixed(4))}rem`;

/** A sample line that stays on one line. */
const Sample = ({ children, ...props }: ComponentProps<typeof Text>) => (
  <Box overflow="hidden" aria-hidden>
    <Text truncate {...props}>
      {children}
    </Text>
  </Box>
);

const CONFIGS: Record<TypographyKind, Config> = {
  textStyles: {
    headers: ["Font size", "Line height"],
    widths: ["11ch", "11ch"],
    minWidth: "2xl",
    rows: () =>
      textStyles().map(([id, style]) => ({
        id,
        fontSizePx: parseFloat(style.value.fontSize),
        values: [style.value.fontSize, style.value.lineHeight],
        group: OLDER_TEXT_STYLES.includes(id) ? "Older names" : undefined,
        // Large styles wrap, so that the sample is not cut off.
        sample: (
          <Box aria-hidden>
            <Text textStyle={id}>{UI_TEXT}</Text>
          </Box>
        ),
      })),
  },
  fonts: {
    headers: ["Font stack"],
    widths: ["28ch"],
    minWidth: "xl",
    rows: () =>
      tokensOf("fonts").map(({ id, value }) => ({
        id,
        values: [
          <Text key="v" textStyle="sm" color="neutral.11">
            {value}
          </Text>,
        ],
        // The font stack is several lines high, so the sample can wrap.
        sample: (
          <Box aria-hidden>
            <Text fontFamily={id} fontSize="500" lineHeight="1.3">
              {PANGRAM}
            </Text>
          </Box>
        ),
      })),
  },
  fontSizes: {
    headers: ["px", "rem", "Text style"],
    widths: ["8ch", "10ch", "17ch"],
    minWidth: "xl",
    rows: () =>
      tokensOf("fontSizes").map(({ id, value }) => ({
        id,
        fontSizePx: parseFloat(value),
        values: [
          value,
          formatRem(parseFloat(value)),
          <TextStylesWith key="t" property="fontSize" value={value} />,
        ],
        sample: (
          <Sample fontSize={id} lineHeight="1.2">
            Ag
          </Sample>
        ),
      })),
  },
  fontWeights: {
    headers: ["Weight"],
    widths: ["8ch"],
    minWidth: "lg",
    rows: () =>
      tokensOf("fontWeights").map(({ id, value }) => ({
        id,
        values: [value],
        sample: (
          <Sample fontWeight={id} fontSize="500">
            {PANGRAM}
          </Sample>
        ),
      })),
  },
  letterSpacings: {
    headers: ["Value"],
    widths: ["10ch"],
    minWidth: "lg",
    rows: () =>
      tokensOf("letterSpacings").map(({ id, value }) => ({
        id,
        values: [value],
        sample: (
          <Sample letterSpacing={id} fontSize="500">
            {PANGRAM}
          </Sample>
        ),
      })),
  },
  lineHeights: {
    headers: ["px", "rem", "Text style"],
    widths: ["8ch", "10ch", "17ch"],
    minWidth: "xl",
    rows: () =>
      tokensOf("lineHeights").map(({ id, value }) => ({
        id,
        values: [
          value,
          formatRem(parseFloat(value)),
          <TextStylesWith key="t" property="lineHeight" value={value} />,
        ],
        // The colored band is the height of one line. The text is not clipped,
        // so a line that is lower than the text shows the text sticking out.
        sample: (
          <Box bg="primary.3" borderRadius="100" px="200" aria-hidden>
            <Text lineHeight={id} fontSize="400" whiteSpace="nowrap">
              One line of text
            </Text>
          </Box>
        ),
      })),
  },
};

interface TypographyScaleProps {
  /** Which typography tokens to show. */
  kind: TypographyKind;
}

/**
 * The typography tokens of one kind, as a table with the values, a sample set
 * in the token, and a copy button for the token name.
 */
export const TypographyScale = ({
  kind,
}: TypographyScaleProps): ReactElement | null => {
  const { copied, copy } = useCopy();
  const config = CONFIGS[kind];
  const rows = config.rows();
  if (rows.length === 0) return null;

  // Rows without a group first, then one body for each group.
  const groups = [...new Set([undefined, ...rows.map((row) => row.group)])];
  const columnCount = config.headers.length + 2;

  const renderRow = (row: Row) => {
    const deprecated =
      row.fontSizePx !== undefined && row.fontSizePx < MIN_FONT_SIZE;
    return (
      <Table.Row key={row.id} bg={deprecated ? "warning.3" : undefined}>
        <Table.Cell>
          <Flex align="center" gap="100">
            <Code variant="subtle">{row.id}</Code>
            <CopyButton token={row.id} copied={copied} onCopy={copy} />
          </Flex>
          {deprecated && (
            <Text textStyle="xs" fontWeight="600" color="warning.11" mt="100">
              Deprecated
            </Text>
          )}
        </Table.Cell>
        {row.values.map((value, index) => (
          <Table.Cell key={index}>{value}</Table.Cell>
        ))}
        <Table.Cell>{row.sample}</Table.Cell>
      </Table.Row>
    );
  };

  return (
    <Box mb="800" mt="400">
      <Table.ScrollArea maxWidth="full">
        <Table.Root size="sm" tableLayout="fixed" minWidth={config.minWidth}>
          <Table.ColumnGroup>
            <Table.Column width="calc(14ch + 2rem)" />
            {config.widths.map((width, index) => (
              <Table.Column key={index} width={width} />
            ))}
            <Table.Column />
          </Table.ColumnGroup>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Token</Table.ColumnHeader>
              {config.headers.map((header) => (
                <Table.ColumnHeader key={header}>{header}</Table.ColumnHeader>
              ))}
              <Table.ColumnHeader>Sample</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          {groups.map((group) => (
            <Table.Body key={group ?? ""}>
              {group && (
                <Table.Row>
                  <Table.ColumnHeader
                    colSpan={columnCount}
                    scope="rowgroup"
                    pt="600"
                    textStyle="xs"
                    fontWeight="600"
                    color="neutral.11"
                  >
                    {group}
                  </Table.ColumnHeader>
                </Table.Row>
              )}
              {rows.filter((row) => row.group === group).map(renderRow)}
            </Table.Body>
          ))}
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};
