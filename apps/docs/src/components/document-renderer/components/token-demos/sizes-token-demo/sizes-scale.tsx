import { Box, Code } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import orderBy from "lodash/orderBy";
import type { ReactElement, ReactNode } from "react";
import { themeSizeTokensAtom } from "@/atoms/theme-size-tokens.ts";
import { TokenTable, type TokenTableColumn } from "../token-table";

type SizeGroup =
  "regular" | "large" | "breakpoint" | "fraction" | "content" | "viewport";

interface SizeToken {
  id: string;
  /** The group of the theme atom. `other` holds content and viewport sizes. */
  group: string;
  value: {
    originalValue: string;
  };
}

/** The viewport tokens, in the order of the table. */
const VIEWPORT_ORDER = ["vw", "vh", "svw", "svh", "lvw", "lvh", "dvw", "dvh"];

/** The content tokens, in the order of the table. */
const CONTENT_ORDER = ["full", "fit", "min", "max", "prose"];

/**
 * What the content and viewport tokens mean, after the MDN pages for
 * `min-content`, `max-content`, `fit-content` and `ch`, and the definitions of
 * the viewport units in CSS Values and Units Level 4.
 */
const MEANING: Record<string, ReactNode> = {
  full: "100% of the parent.",
  fit: (
    <>
      The available space, but not more than <Code variant="subtle">max</Code>{" "}
      and not less than <Code variant="subtle">min</Code>.
    </>
  ),
  min: "As narrow as the content allows. Text wraps at every space, so the element is as wide as the longest word.",
  max: "As wide as the content needs. Text does not wrap, even if it overflows.",
  prose: "60 times the width of the character 0 in the current font.",
  vw: (
    <>
      The viewport width. The same as <Code variant="subtle">lvw</Code>.
    </>
  ),
  vh: (
    <>
      The viewport height. The same as <Code variant="subtle">lvh</Code>.
    </>
  ),
  svw: "The viewport width when the browser interface is shown.",
  svh: "The viewport height when the browser interface is shown.",
  lvw: "The viewport width when the browser interface is hidden.",
  lvh: "The viewport height when the browser interface is hidden.",
  dvw: "The current viewport width. It changes when the browser interface shows or hides.",
  dvh: "The current viewport height. It changes when the browser interface shows or hides.",
};

/** The group of a token on this page: content and viewport are apart. */
const groupOf = (item: SizeToken): SizeGroup => {
  if (item.group !== "other") return item.group as SizeGroup;
  return VIEWPORT_ORDER.includes(item.id) ? "viewport" : "content";
};

/** The position of a token in a fixed order; unknown tokens go last. */
const positionIn = (order: string[], id: string) => {
  const index = order.indexOf(id);
  return index === -1 ? order.length : index;
};

/** Sorts the tokens of one group the way a reader expects. */
const sortGroup = (tokens: SizeToken[], group: SizeGroup): SizeToken[] => {
  switch (group) {
    case "fraction":
      // By the denominator, then by the share: 1/2, 1/3, 2/3, 1/4 …
      return orderBy(
        tokens,
        [
          (item) => parseInt(item.id.split("/")[1]),
          (item) => parseFloat(item.value.originalValue),
        ],
        ["asc", "asc"]
      );
    case "content":
      return orderBy(tokens, (item) => positionIn(CONTENT_ORDER, item.id));
    case "viewport":
      return orderBy(tokens, (item) => positionIn(VIEWPORT_ORDER, item.id));
    default:
      return orderBy(tokens, (item) => parseFloat(item.value.originalValue));
  }
};

/** `33.333333%` as `33.33%`. */
const formatPercent = (value: string) =>
  `${parseFloat(parseFloat(value).toFixed(2))}%`;

/** A bar of the given width, or a share of a track for a fraction. */
const Bar = ({ width, track }: { width: string; track?: boolean }) => {
  const bar = (
    <Box width={width} height="300" bg="primary.9" borderRadius="50" />
  );
  return (
    <Box aria-hidden>
      {track ? (
        // The track is the parent, the bar is the share of it.
        <Box bg="primary.3" borderRadius="50">
          {bar}
        </Box>
      ) : (
        bar
      )}
    </Box>
  );
};

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
  if (!sizeTokens) return null;

  const tokens = sortGroup(
    sizeTokens.filter((item) => groupOf(item) === group),
    group
  );
  if (tokens.length === 0) return null;

  const value = (item: SizeToken) => item.value.originalValue;
  const px = (item: SizeToken) => parseFloat(value(item));
  const widest = Math.max(...tokens.map(px));

  const table = (
    columns: TokenTableColumn[],
    cells: (item: SizeToken) => ReactNode[],
    options: { tokenWidth?: string; minWidth?: string } = {}
  ) => (
    <Box mb="800" mt="400">
      <TokenTable
        columns={columns}
        rows={tokens.map((item) => ({ id: item.id, cells: cells(item) }))}
        {...options}
      />
    </Box>
  );

  switch (group) {
    case "regular":
      // The bars are at their real size, up to 384px: the table is wide
      // enough for the largest bar and scrolls on a narrow screen.
      return table(
        [{ header: "px", width: "10ch", align: "right" }, { header: "Sample" }],
        (item) => [value(item), <Bar key="bar" width={item.id} />],
        { minWidth: "2xl" }
      );
    case "fraction":
      return table(
        [
          { header: "Share", width: "12ch", align: "right" },
          { header: "Sample" },
        ],
        (item) => [
          formatPercent(value(item)),
          <Bar key="bar" width={item.id} track />,
        ]
      );
    case "content":
    case "viewport":
      return table(
        [{ header: "CSS value", width: "16ch" }, { header: "Meaning" }],
        (item) => [value(item), MEANING[item.id] ?? ""]
      );
    default:
      // Named and breakpoint sizes are scaled to the widest one.
      return table(
        [{ header: "px", width: "10ch", align: "right" }, { header: "Sample" }],
        (item) => [
          value(item),
          <Bar key="bar" width={`${(px(item) / widest) * 100}%`} />,
        ],
        group === "breakpoint" ? { tokenWidth: "18ch" } : {}
      );
  }
};
