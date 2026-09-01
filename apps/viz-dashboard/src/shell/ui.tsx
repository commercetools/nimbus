/* -------------------------------------------------------------------------- */
/* Shared page-building primitives.                                           */
/*                                                                            */
/* Every scenario page composes from these so the whole console reads as one  */
/* system: the same card, the same header rhythm, the same chart framing.     */
/* Chrome colors come from the nimbus-viz chart theme so cards and charts     */
/* re-theme together when the color mode flips.                               */
/* -------------------------------------------------------------------------- */

import type { ReactNode } from "react";
import { Box, Grid, Stack, Text, Icon } from "@commercetools/nimbus";
import {
  StatCard,
  Sparkline,
  ResponsiveContainer,
  ColorScaleProvider,
  useChartTheme,
} from "@commercetools/nimbus-viz";
import type { SeriesPoint } from "@commercetools/nimbus-viz";
import type { ComponentType } from "react";

/* -------------------------------------------------------------------------- */
/* Chart — wraps a chart in a size-measuring container, and (optionally) a    */
/* color scale so a page's series/categories get stable, distinct colors.     */
/* -------------------------------------------------------------------------- */

export function Chart({
  height = 280,
  colorDomain,
  children,
}: {
  height?: number;
  /** Entity ids/categories to assign colors to, in order. */
  colorDomain?: string[];
  children: (width: number, height: number) => ReactNode;
}) {
  const inner = (
    <ResponsiveContainer height={height}>{children}</ResponsiveContainer>
  );
  return colorDomain ? (
    <ColorScaleProvider domain={colorDomain}>{inner}</ColorScaleProvider>
  ) : (
    inner
  );
}

/* -------------------------------------------------------------------------- */
/* ChartCard — the console's one card. Header (title/subtitle + optional      */
/* action slot) over a body.                                                  */
/* -------------------------------------------------------------------------- */

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  span,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  /** Grid column span on wide viewports (used inside CardGrid). */
  span?: number;
}) {
  const theme = useChartTheme();
  return (
    <Box
      gridColumn={span ? { base: "auto", lg: `span ${span}` } : undefined}
      backgroundColor={theme.surface}
      border={`1px solid ${theme.grid}`}
      borderRadius="14px"
      padding="20px"
      display="flex"
      flexDirection="column"
    >
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        gap="12px"
        marginBottom="16px"
      >
        <Box>
          <Text fontSize="15px" fontWeight="600" color={theme.ink}>
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="12px" color={theme.mutedInk} marginTop="2px">
              {subtitle}
            </Text>
          )}
        </Box>
        {action && <Box flexShrink="0">{action}</Box>}
      </Box>
      <Box flex="1">{children}</Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* CardGrid — responsive 12-column grid; cards set their own `span`.          */
/* -------------------------------------------------------------------------- */

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "repeat(12, 1fr)" }}
      gap="16px"
      alignItems="stretch"
    >
      {children}
    </Grid>
  );
}

/* -------------------------------------------------------------------------- */
/* KpiTile / KpiRow — a headline metric with delta and an optional sparkline. */
/* -------------------------------------------------------------------------- */

export function KpiTile({
  label,
  value,
  previous,
  format,
  spark,
  icon,
  invertDelta,
}: {
  label: string;
  value: number;
  previous?: number;
  format?: (n: number) => string;
  /** Trailing trend for the embedded sparkline. */
  spark?: SeriesPoint[];
  icon?: ComponentType;
  /** For "lower is better" KPIs — a decrease reads as positive (green). */
  invertDelta?: boolean;
}) {
  const theme = useChartTheme();
  return (
    <Box
      backgroundColor={theme.surface}
      border={`1px solid ${theme.grid}`}
      borderRadius="14px"
      padding="18px"
      display="flex"
      flexDirection="column"
      gap="12px"
    >
      <Box display="flex" alignItems="center" gap="8px">
        {icon && (
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            width="26px"
            height="26px"
            borderRadius="8px"
            backgroundColor={theme.surfacePage}
            color={theme.accent}
            flexShrink="0"
          >
            <Icon as={icon} boxSize="16px" />
          </Box>
        )}
        <Text fontSize="12px" fontWeight="600" color={theme.mutedInk}>
          {label}
        </Text>
      </Box>
      <StatCard
        label=""
        value={value}
        previous={previous}
        format={format}
        invertDelta={invertDelta}
        ariaLabel={`${label}: ${format ? format(value) : value}`}
      />
      {spark && (
        <Box marginTop="2px">
          <ResponsiveContainer height={36}>
            {(width, height) => (
              <Sparkline
                width={width}
                height={height}
                data={spark}
                showEndDot
                ariaLabel={`${label} trend`}
              />
            )}
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
}

export function KpiRow({ children }: { children: ReactNode }) {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap="16px"
    >
      {children}
    </Grid>
  );
}

/* -------------------------------------------------------------------------- */
/* PageHeader — title + blurb, with an optional right-aligned control slot.   */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  title,
  blurb,
  action,
}: {
  title: string;
  blurb?: string;
  action?: ReactNode;
}) {
  const theme = useChartTheme();
  return (
    <Box
      display="flex"
      alignItems="flex-end"
      justifyContent="space-between"
      gap="16px"
      flexWrap="wrap"
    >
      <Box>
        <Text
          fontSize="24px"
          fontWeight="700"
          color={theme.ink}
          lineHeight="1.2"
        >
          {title}
        </Text>
        {blurb && (
          <Text fontSize="14px" color={theme.mutedInk} marginTop="4px">
            {blurb}
          </Text>
        )}
      </Box>
      {action && <Box flexShrink="0">{action}</Box>}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Page — vertical rhythm wrapper for a page's header + sections.             */
/* -------------------------------------------------------------------------- */

export function Page({ children }: { children: ReactNode }) {
  return (
    <Stack direction="column" gap="20px">
      {children}
    </Stack>
  );
}

/* -------------------------------------------------------------------------- */
/* Insight — a small inline callout for a data takeaway.                      */
/* -------------------------------------------------------------------------- */

export function Insight({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "positive" | "negative";
  children: ReactNode;
}) {
  const theme = useChartTheme();
  const color =
    tone === "positive"
      ? theme.positive
      : tone === "negative"
        ? theme.negative
        : theme.mutedInk;
  return (
    <Text fontSize="13px" color={color}>
      {children}
    </Text>
  );
}
