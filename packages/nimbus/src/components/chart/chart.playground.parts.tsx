import { Badge, Box, Chart } from "@commercetools/nimbus";
import { ArrowDownward, ArrowUpward } from "@commercetools/nimbus-icons";

/** Numbers line up in columns when every digit has the same width */
export const figures = { fontVariantNumeric: "tabular-nums" } as const;

/**
 * The playground pages are visual regression pages, so their charts do not
 * animate: Chromatic would otherwise capture a frame in the middle of the
 * drawing.
 */
export const still = { isAnimationActive: false } as const;

/** A change against an earlier period. Green means better, also for a falling rate. */
export const Delta = ({
  children,
  falling,
}: {
  children: string;
  falling?: boolean;
}) => (
  <Badge size="2xs" colorPalette="positive">
    {falling ? <ArrowDownward /> : <ArrowUpward />}
    {children}
  </Badge>
);

/**
 * A small chart without axes, built from the Chart parts. The rows hold values
 * scaled to show the shape of a trend (see `toShape`), so it has no tooltip.
 */
export const Sparkline = ({
  label,
  data,
  dataKey,
  seriesLabel,
}: {
  label: string;
  data: Record<string, unknown>[];
  dataKey: string;
  seriesLabel: string;
}) => (
  <Box
    marginInline="-12px"
    css={{ "& .nimbus-chart__plot": { aspectRatio: "6 / 1" } }}
  >
    <Chart.Root
      aria-label={label}
      data={data}
      config={{ [dataKey]: { label: seriesLabel, palette: "ctviolet" } }}
      {...still}
    >
      <Chart.Plot>
        <Chart.Area dataKey={dataKey} />
      </Chart.Plot>
    </Chart.Root>
  </Box>
);
