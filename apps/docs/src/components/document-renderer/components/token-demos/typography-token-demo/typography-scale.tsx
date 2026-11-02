import {
  Box,
  Code,
  IconButton,
  system,
  Table,
  Text,
} from "@commercetools/nimbus";
import { Check, ContentCopy } from "@commercetools/nimbus-icons";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { useCopy } from "../use-copy";

/** Root font size that rem values are shown for. */
const ROOT_FONT_SIZE = 16;

/** Text below this size, in px, is marked as deprecated. */
const MIN_FONT_SIZE = 12;

const SAMPLE = "Sphinx of black quartz, judge my vow";

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
}

interface Config {
  /** Headers for the value columns. */
  headers: string[];
  /** Widths of the value columns. */
  widths: string[];
  rows: () => Row[];
}

const formatRem = (px: number) =>
  `${parseFloat((px / ROOT_FONT_SIZE).toFixed(4))}rem`;

/** The tokens of one category, in the order of the theme. */
const tokensOf = (category: string) =>
  Array.from(system.tokens.categoryMap.get(category) ?? [], ([id, token]) => ({
    id,
    value: String(token.value),
  }));

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
    widths: ["12ch", "12ch"],
    rows: () => {
      const styles = (system._config.theme?.textStyles ?? {}) as Record<
        string,
        { value: { fontSize: string; lineHeight: string } }
      >;
      return Object.entries(styles).map(([id, style]) => ({
        id,
        fontSizePx: parseFloat(style.value.fontSize),
        values: [style.value.fontSize, style.value.lineHeight],
        // Large styles wrap, so that the sample is not cut off.
        sample: (
          <Box aria-hidden>
            <Text textStyle={id}>{SAMPLE}</Text>
          </Box>
        ),
      }));
    },
  },
  fonts: {
    headers: ["Font stack"],
    widths: ["28ch"],
    rows: () =>
      tokensOf("fonts").map(({ id, value }) => ({
        id,
        values: [
          <Text key="v" textStyle="sm" color="neutral.11">
            {value}
          </Text>,
        ],
        sample: (
          <Sample fontFamily={id} fontSize="600" lineHeight="1.2">
            {SAMPLE}
          </Sample>
        ),
      })),
  },
  fontSizes: {
    headers: ["px", "rem"],
    widths: ["8ch", "10ch"],
    rows: () =>
      tokensOf("fontSizes").map(({ id, value }) => ({
        id,
        fontSizePx: parseFloat(value),
        values: [value, formatRem(parseFloat(value))],
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
    rows: () =>
      tokensOf("fontWeights").map(({ id, value }) => ({
        id,
        values: [value],
        sample: (
          <Sample fontWeight={id} fontSize="500">
            {SAMPLE}
          </Sample>
        ),
      })),
  },
  letterSpacings: {
    headers: ["Value"],
    widths: ["10ch"],
    rows: () =>
      tokensOf("letterSpacings").map(({ id, value }) => ({
        id,
        values: [value],
        sample: (
          <Sample letterSpacing={id} fontSize="500">
            {SAMPLE}
          </Sample>
        ),
      })),
  },
  lineHeights: {
    headers: ["px", "rem"],
    widths: ["8ch", "10ch"],
    rows: () =>
      tokensOf("lineHeights").map(({ id, value }) => ({
        id,
        values: [value, formatRem(parseFloat(value))],
        // The colored band is the height of one line.
        sample: (
          <Box bg="primary.3" borderRadius="100" overflow="hidden" aria-hidden>
            <Text lineHeight={id} fontSize="400" truncate>
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

  return (
    <Box mb="800" mt="400">
      <Table.Root size="sm" tableLayout="fixed">
        <Table.ColumnGroup>
          <Table.Column width="14ch" />
          {config.widths.map((width, index) => (
            <Table.Column key={index} width={width} />
          ))}
          <Table.Column />
          <Table.Column width="1200" />
        </Table.ColumnGroup>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Token</Table.ColumnHeader>
            {config.headers.map((header) => (
              <Table.ColumnHeader key={header}>{header}</Table.ColumnHeader>
            ))}
            <Table.ColumnHeader>Sample</Table.ColumnHeader>
            <Table.ColumnHeader>
              <Box srOnly>Copy</Box>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => {
            const small =
              row.fontSizePx !== undefined && row.fontSizePx < MIN_FONT_SIZE;
            return (
              <Table.Row key={row.id} bg={small ? "warning.3" : undefined}>
                <Table.Cell>
                  <Code variant="subtle">{row.id}</Code>
                  {small && (
                    <Text
                      textStyle="xs"
                      fontWeight="600"
                      color="warning.11"
                      mt="100"
                    >
                      Deprecated
                    </Text>
                  )}
                </Table.Cell>
                {row.values.map((value, index) => (
                  <Table.Cell key={index}>{value}</Table.Cell>
                ))}
                <Table.Cell>{row.sample}</Table.Cell>
                <Table.Cell textAlign="right">
                  <IconButton
                    size="2xs"
                    variant="ghost"
                    aria-label={`Copy token ${row.id}`}
                    onClick={() => copy(row.id)}
                  >
                    {copied === row.id ? <Check /> : <ContentCopy />}
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
