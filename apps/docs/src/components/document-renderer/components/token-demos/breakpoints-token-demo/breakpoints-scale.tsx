import { Box, Code, Flex, Stack, Text } from "@commercetools/nimbus";
import { useSyncExternalStore } from "react";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";

/** Root font size of the browser, which `rem` in media queries uses. */
const ROOT_FONT_SIZE = 16;

/** The right end of the ruler, in px. Wider windows sit at the end. */
const RULER_END = 1800;

interface Range {
  /** The breakpoint, or `base` for the widths below the first breakpoint. */
  id: string;
  /** First width of the range, in px. */
  from: number;
  /** First width of the next range, in px. `null` for the last range. */
  to: number | null;
}

/** `768px` as `48rem`, as in the media queries that Nimbus builds. */
const toRem = (px: number) => `${px / ROOT_FONT_SIZE}rem`;

/** The ranges from `base` to the largest breakpoint, ordered by width. */
const rangesOf = (breakpoints: { id: string; px: number }[]): Range[] => {
  const sorted = [...breakpoints].sort((a, b) => a.px - b.px);
  return [
    { id: "base", from: 0, to: sorted[0]?.px ?? null },
    ...sorted.map((item, index) => ({
      id: item.id,
      from: item.px,
      to: sorted[index + 1]?.px ?? null,
    })),
  ];
};

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

/** The width of the browser window, the width that media queries test. */
const useWindowWidth = () =>
  useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => 0
  );

/**
 * The active range: the largest breakpoint whose media query matches, as the
 * browser decides it.
 */
const activeRange = (ranges: Range[]) =>
  [...ranges]
    .reverse()
    .find(
      (range) =>
        range.from === 0 ||
        window.matchMedia(`screen and (min-width: ${toRem(range.from)})`)
          .matches
    ) ?? ranges[0];

/**
 * The breakpoints on a ruler, with a marker at the width of the browser window
 * and the active breakpoint, and a table of the tokens with their range and
 * media query.
 */
export const BreakpointsScale = () => {
  const width = useWindowWidth();
  const breakpoints = tokensOf("breakpoints").map((item) => ({
    id: item.id,
    px: parseFloat(item.value),
  }));
  const ranges = rangesOf(breakpoints);
  const active = width > 0 ? activeRange(ranges) : null;

  const position = (px: number) =>
    `${(Math.min(px, RULER_END) / RULER_END) * 100}%`;

  return (
    <Stack gap="500" my="600">
      <Stack
        gap="400"
        border="solid-25"
        borderColor="border"
        borderRadius="300"
        p="500"
      >
        <Flex align="baseline" gap="300" wrap="wrap" aria-live="polite">
          <Text textStyle="2xl" fontWeight="600">
            {active ? active.id : "–"}
          </Text>
          <Text color="neutral.11">
            {active
              ? `Your browser window is ${width}px wide.`
              : "The width of your browser window is not known."}
          </Text>
        </Flex>

        {/* The ruler is decorative: the text above and the table say the same. */}
        <Box position="relative" pt="800" aria-hidden>
          {active && (
            <Box
              position="absolute"
              top="0"
              bottom="0"
              left={position(width)}
              width="0"
              borderLeft="solid-50"
              borderColor="neutral.12"
              zIndex="docked"
            >
              <Text
                position="absolute"
                top="0"
                transform="translateX(-50%)"
                textStyle="xs"
                fontWeight="600"
                whiteSpace="nowrap"
                bg="bg"
                px="100"
              >
                {width}px
              </Text>
            </Box>
          )}
          <Flex height="1200" borderRadius="200" overflow="hidden">
            {ranges.map((range) => {
              const isActive = range.id === active?.id;
              const end = range.to ?? RULER_END;
              return (
                <Flex
                  key={range.id}
                  flexBasis={`${((Math.min(end, RULER_END) - range.from) / RULER_END) * 100}%`}
                  flexShrink={0}
                  align="center"
                  px="200"
                  // A line between two ranges, inside the width of the range.
                  borderLeft={range.from > 0 ? "solid-25" : undefined}
                  borderColor="bg"
                  bg={isActive ? "primary.9" : "primary.3"}
                  color={isActive ? "primary.contrast" : "primary.11"}
                  textStyle="sm"
                  fontWeight="600"
                >
                  {range.id}
                </Flex>
              );
            })}
          </Flex>
          <Box position="relative" height="600" mt="100">
            {ranges.slice(1).map((range) => (
              <Text
                key={range.id}
                position="absolute"
                left={position(range.from)}
                transform="translateX(-50%)"
                textStyle="xs"
                color="neutral.11"
              >
                {range.from}
              </Text>
            ))}
          </Box>
        </Box>
      </Stack>

      <TokenTable
        minWidth="2xl"
        columns={[
          { header: "From", width: "10ch", align: "right" },
          { header: "Up to", width: "10ch", align: "right" },
          { header: "Media query" },
        ]}
        rows={ranges.slice(1).map((range) => ({
          id: range.id,
          highlight: range.id === active?.id,
          cells: [
            `${range.from}px`,
            range.to === null ? "—" : `${range.to - 1}px`,
            <Code key="query" variant="subtle">
              {`@media screen and (min-width: ${toRem(range.from)})`}
            </Code>,
          ],
        }))}
      />
    </Stack>
  );
};
