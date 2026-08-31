import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";

/** One group's raw samples; the density is estimated here, not supplied. */
export interface SampleGroup {
  label: string;
  samples: number[];
}

export interface ViolinPlotProps {
  width: number;
  height: number;
  groups: SampleGroup[];
  ariaLabel?: string;
}

/** Number of points at which each group's density is evaluated. */
const RESOLUTION = 40;

function mean(xs: number[]): number {
  return xs.reduce((s, v) => s + v, 0) / xs.length;
}

function stddev(xs: number[], mu: number): number {
  if (xs.length < 2) return 0;
  const variance =
    xs.reduce((s, v) => s + (v - mu) * (v - mu), 0) / (xs.length - 1);
  return Math.sqrt(variance);
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Gaussian KDE evaluated across `RESOLUTION` points spanning [lo, hi]. */
function density(
  samples: number[],
  lo: number,
  hi: number
): Array<{ v: number; d: number }> {
  const n = samples.length;
  const mu = mean(samples);
  const sd = stddev(samples, mu);
  // Silverman's rule of thumb; guard degenerate (all-equal) samples.
  const h = (sd > 0 ? 0.9 * sd * Math.pow(n, -0.2) : (hi - lo) / 12) || 1;
  const out: Array<{ v: number; d: number }> = [];
  for (let i = 0; i < RESOLUTION; i += 1) {
    const v = lo + ((hi - lo) * i) / (RESOLUTION - 1);
    let sum = 0;
    for (const x of samples) {
      const u = (v - x) / h;
      sum += Math.exp(-0.5 * u * u);
    }
    out.push({ v, d: sum / (n * h * Math.sqrt(2 * Math.PI)) });
  }
  return out;
}

/**
 * Violin plot — a grouped distribution that shows each group's full shape
 * (kernel-density estimate mirrored around its center), not just a five-number
 * summary. The median is marked with a line inside each violin. Like the box
 * plot, the category axis carries identity, so every violin uses one accent
 * fill; hovering shows the group's median and sample count.
 */
export function ViolinPlot({
  width,
  height,
  groups,
  ariaLabel,
}: ViolinPlotProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const yDomain = useMemo(
    () => extent(groups.flatMap((g) => g.samples)) as [number, number],
    [groups]
  );
  const stats = useMemo(
    () =>
      groups.map((g) => {
        const sorted = [...g.samples].sort((a, b) => a - b);
        return {
          density: density(g.samples, yDomain[0], yDomain[1]),
          median: sorted.length ? median(sorted) : 0,
          n: g.samples.length,
        };
      }),
    [groups, yDomain]
  );
  const densityMax = useMemo(
    () => Math.max(1e-9, ...stats.flatMap((s) => s.density.map((p) => p.d))),
    [stats]
  );

  if (width <= 0 || height <= 0 || groups.length === 0) return null;

  const label = ariaLabel ?? `Violin plot of ${groups.length} groups`;
  const table = {
    columns: ["Group", "n", "Median"],
    rows: groups.map((g, i) => [
      g.label,
      stats[i].n,
      formatCompact(stats[i].median),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 16, bottom: 28, left: 44 }}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleBand({
          domain: groups.map((g) => g.label),
          range: [0, innerWidth],
          padding: 0.3,
        });
        const yScale = scaleLinear({
          domain: yDomain,
          range: [innerHeight, 0],
          nice: true,
        });
        const halfBand = xScale.bandwidth() / 2;
        const wScale = scaleLinear({
          domain: [0, densityMax],
          range: [0, halfBand * 0.95],
        });
        return (
          <>
            <GridRows
              ticks={yScale.ticks(4)}
              y={(t) => yScale(t)}
              width={innerWidth}
            />
            <AxisLeft
              scale={yScale}
              numTicks={4}
              hideAxisLine
              hideTicks
              tickFormat={(v) => formatCompact(v as number)}
              tickLabelProps={leftTickLabel(theme)}
            />
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              tickLabelProps={bottomTickLabel(theme)}
            />
            {groups.map((g, i) => {
              const cx = (xScale(g.label) ?? 0) + halfBand;
              const s = stats[i];
              const active = hover == null || hover === i;
              const right = s.density.map(
                (p) => `L${cx + wScale(p.d)},${yScale(p.v)}`
              );
              const leftBack = [...s.density]
                .reverse()
                .map((p) => `L${cx - wScale(p.d)},${yScale(p.v)}`);
              const first = s.density[0];
              const d = [
                `M${cx + wScale(first.d)},${yScale(first.v)}`,
                ...right.slice(1),
                ...leftBack,
                "Z",
              ].join(" ");
              return (
                <g
                  key={g.label}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <path
                    d={d}
                    fill={theme.accent}
                    fillOpacity={active ? 0.28 : 0.12}
                    stroke={theme.ink}
                    strokeWidth={1.25}
                  />
                  <line
                    x1={cx - halfBand * 0.4}
                    x2={cx + halfBand * 0.4}
                    y1={yScale(s.median)}
                    y2={yScale(s.median)}
                    stroke={theme.ink}
                    strokeWidth={2}
                  />
                </g>
              );
            })}
            {hover != null && groups[hover] && (
              <SvgTooltip
                x={(xScale(groups[hover].label) ?? 0) + halfBand}
                innerWidth={innerWidth}
                lines={[
                  groups[hover].label,
                  `median: ${formatCompact(stats[hover].median)}`,
                  `n = ${stats[hover].n}`,
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
