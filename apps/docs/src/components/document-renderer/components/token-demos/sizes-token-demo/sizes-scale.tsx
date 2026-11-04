import { Box, Code, Table } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import orderBy from "lodash/orderBy";
import type { ReactElement } from "react";
import { themeSizeTokensAtom } from "@/atoms/theme-size-tokens.ts";
import { CopyButton } from "../copy-button";
import { useCopy } from "../use-copy";

/** Root font size that rem values are shown for. */
const ROOT_FONT_SIZE = 16;

type SizeGroup = "regular" | "fraction" | "large" | "breakpoint" | "other";

interface SizeToken {
  id: string;
  label: string;
  group: string;
  value: {
    originalValue: string;
  };
}

/** The order of the content and viewport tokens. */
const OTHER_ORDER = [
  "full",
  "fit",
  "min",
  "max",
  "prose",
  "vw",
  "vh",
  "svw",
  "svh",
  "lvw",
  "lvh",
  "dvw",
  "dvh",
];

/** What the content and viewport tokens mean. */
const MEANING: Record<string, string> = {
  max: "The intrinsic preferred width of the content.",
  min: "The intrinsic minimum width of the content.",
  fit: "The available space, but not more than max-content.",
  prose: "60 characters wide, measured with the ch unit.",
  full: "100% of the parent.",
  vw: "100% of the viewport width.",
  vh: "100% of the viewport height.",
  svw: "100% of the small viewport width.",
  svh: "100% of the small viewport height.",
  lvw: "100% of the large viewport width.",
  lvh: "100% of the large viewport height.",
  dvw: "100% of the dynamic viewport width. Not stable, even when the viewport is unchanged.",
  dvh: "100% of the dynamic viewport height. Not stable, even when the viewport is unchanged.",
};

const formatRem = (px: number) =>
  `${parseFloat((px / ROOT_FONT_SIZE).toFixed(4))}rem`;

/** `33.333333%` as `33.33%`. */
const formatPercent = (value: string) =>
  `${parseFloat(parseFloat(value).toFixed(2))}%`;

/** Sorts the tokens of one group the way a reader expects. */
const sortGroup = (tokens: SizeToken[], group: SizeGroup): SizeToken[] => {
  switch (group) {
    case "fraction":
      return orderBy(
        tokens,
        [
          (item) => parseInt(item.id.split("/")[1]),
          (item) => {
            const [a, b] = item.id.split("/");
            return parseFloat(a) / parseFloat(b);
          },
        ],
        ["asc", "asc"]
      );
    case "other":
      // The parent and the content first, then text, then the viewport.
      return orderBy(tokens, (item) => {
        const index = OTHER_ORDER.indexOf(item.id);
        return index === -1 ? OTHER_ORDER.length : index;
      });
    default:
      return orderBy(tokens, (item) => parseFloat(item.value.originalValue));
  }
};

type CopyCellProps = {
  token: string;
  copied: string | null;
  onCopy: (token: string) => void;
};

const CopyCell = ({ token, copied, onCopy }: CopyCellProps) => (
  <Table.Cell textAlign="right">
    <CopyButton token={token} copied={copied} onCopy={onCopy} />
  </Table.Cell>
);

const CopyHeader = () => (
  <Table.ColumnHeader>
    <Box srOnly>Copy</Box>
  </Table.ColumnHeader>
);

interface SizesScaleProps {
  /** Which group of size tokens to show. */
  group: SizeGroup;
}

/**
 * The size tokens of one group, as a table with a copy button for each token.
 * The columns and the picture depend on the group: numeric sizes are drawn at
 * their real size, named and breakpoint sizes relative to the widest one,
 * fractions as a share of the column, and content and viewport sizes are
 * explained in words.
 */
export const SizesScale = ({ group }: SizesScaleProps): ReactElement | null => {
  const sizeTokens = useAtomValue(themeSizeTokensAtom) as SizeToken[] | null;
  const { copied, copy } = useCopy();

  if (!sizeTokens) return null;

  const tokens = sortGroup(
    sizeTokens.filter((item) => item.group === group),
    group
  );
  if (tokens.length === 0) return null;

  const px = (item: SizeToken) => parseFloat(item.value.originalValue);
  const widest = Math.max(...tokens.map(px));

  return (
    <Box mb="800" mt="400">
      <Table.Root size="sm" tableLayout="fixed">
        <Table.ColumnGroup>
          <Table.Column width={group === "regular" ? "10ch" : "20ch"} />
          {group === "regular" && <Table.Column width="10ch" />}
          <Table.Column width={group === "other" ? "16ch" : "12ch"} />
          <Table.Column />
          <Table.Column width="1200" />
        </Table.ColumnGroup>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Token</Table.ColumnHeader>
            {group === "regular" && (
              <Table.ColumnHeader textAlign="right">px</Table.ColumnHeader>
            )}
            <Table.ColumnHeader
              textAlign={group === "other" ? "left" : "right"}
            >
              {group === "regular"
                ? "rem"
                : group === "fraction"
                  ? "Share"
                  : group === "other"
                    ? "CSS value"
                    : "px"}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {group === "other" ? "Meaning" : "Size"}
            </Table.ColumnHeader>
            <CopyHeader />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tokens.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <Code variant="subtle">{item.label}</Code>
              </Table.Cell>
              {group === "regular" && (
                <Table.Cell textAlign="right">{px(item)}px</Table.Cell>
              )}
              <Table.Cell textAlign={group === "other" ? "left" : "right"}>
                {group === "regular"
                  ? formatRem(px(item))
                  : group === "fraction"
                    ? formatPercent(item.value.originalValue)
                    : group === "other"
                      ? item.value.originalValue
                      : `${px(item)}px`}
              </Table.Cell>
              <Table.Cell>
                {group === "other" ? (
                  (MEANING[item.id] ?? "")
                ) : (
                  <Box aria-hidden>
                    {group === "fraction" ? (
                      // The track is the parent, the bar is the share of it.
                      <Box bg="primary.3" borderRadius="50">
                        <Box
                          width={item.id}
                          height="300"
                          bg="primary.9"
                          borderRadius="50"
                        />
                      </Box>
                    ) : (
                      <Box
                        // Numeric sizes are at their real size. Named and
                        // breakpoint sizes are scaled to the widest one.
                        width={
                          group === "regular"
                            ? item.id
                            : `${(px(item) / widest) * 100}%`
                        }
                        height="300"
                        bg="primary.9"
                        borderRadius="50"
                      />
                    )}
                  </Box>
                )}
              </Table.Cell>
              <CopyCell token={item.id} copied={copied} onCopy={copy} />
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
