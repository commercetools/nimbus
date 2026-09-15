import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scalePoint } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { strokeDasharrayFor } from "../../chart/stroke-styles";
import { useForcedColors } from "../../chart/use-forced-colors";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { Series, SeriesPoint } from "../../chart/types";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";

export interface BumpChartProps extends DatumInteractionProps<SeriesPoint> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** The series to rank. At each x-index the series are ranked by their `y`
   *  value (highest = rank 1); points with a null `y` are skipped at that
   *  index. Each series' `label` is drawn at its last point. */
  series: Series[];
  /** Accessible label for the SVG frame; states what the ranking shows and its
   *  takeaway. Defaults to a label naming the ranked series. */
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /** Formats date displays (axis ticks, tooltip dates). Defaults to a locale-aware short month+day formatter (e.g. `Aug 28`); overrides any surrounding `ChartLocaleProvider`. */
  dateFormat?: (d: Date) => string;
  /**
   * Distinguish series by a `strokeDasharray` rhythm
   * (`chart/stroke-styles.ts`), in addition to color, so series stay
   * distinguishable without color alone — monochrome print, a photocopy, or
   * `forced-colors` mode. A fill `patternFill` (`chart/patterns.tsx`) is not
   * used here: the rank line has no fill area at all, so the stroke's dash
   * rhythm is the one non-color channel. Only the line itself carries the
   * dash — the per-rank point markers stay plain solid-filled circles either
   * way. Default `false` (color only, unchanged). Turned on automatically
   * (regardless of this prop) when the OS is already in a forced-colors
   * context — see `useForcedColors`.
   */
  texture?: boolean;
}

/** One series' rank at a single x-index (rank 1 = highest y). */
interface RankPoint {
  i: number;
  rank: number;
}

/**
 * Rank-over-time. At each x the series are ranked by their y value (1 = best);
 * the y-axis plots rank inverted (rank 1 at top), so lines that rise are
 * climbing the ranking. One smooth line per series (fixed-order categorical
 * hue), a dot at each rank, and a direct ink label at each series' last point —
 * so identity never rides on color alone and no legend is needed.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function BumpChart({
  width,
  height,
  series,
  ariaLabel,
  children,
  dateFormat,
  valueFormat,
  onDatumClick,
  onDatumHover,
  texture,
}: BumpChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const dateFmt = dateFormat ?? formatters.dayMonth;
  // x can be a date or a plain numeric index (a rank-over-categories bump
  // chart); only the date half is locale-threaded, per `dateFormat` above.
  const fmtX = (x: number | Date): string =>
    x instanceof Date ? dateFmt(x) : valueFmt(x);
  const [hover, setHover] = useState<{ si: number; i: number } | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;
  const color = useEntityColors(
    useMemo(() => series.map((s) => s.id), [series])
  );
  // In forced-colors context, real hues aren't preserved by the OS anyway --
  // one system foreground color for every series, with the line's dash
  // rhythm (below) as the only identity carrier.
  const colorFor = (id: string) => (forcedColors ? "CanvasText" : color(id));

  const n = useMemo(
    () => series.reduce((m, s) => Math.max(m, s.data.length), 0),
    [series]
  );

  const ranked = useMemo(() => {
    const perSeries = series.map((s) => ({
      id: s.id,
      label: s.label,
      points: [] as RankPoint[],
    }));
    for (let i = 0; i < n; i++) {
      const column = series
        .map((s, si) => ({ si, y: s.data[i]?.y }))
        .filter((d): d is { si: number; y: number } => d.y != null)
        .sort((a, b) => b.y - a.y);
      column.forEach((d, rankIdx) => {
        perSeries[d.si].points.push({ i, rank: rankIdx + 1 });
      });
    }
    return perSeries;
  }, [series, n]);

  if (width <= 0 || height <= 0 || series.length === 0) return null;

  const table = {
    columns: ["Series", "Latest value", "Latest rank"],
    rows: ranked.map((s, si) => [
      s.label,
      series[si].data[series[si].data.length - 1]?.y ?? "",
      s.points[s.points.length - 1]?.rank ?? "",
    ]),
  };

  const ranks = Array.from({ length: series.length }, (_, k) => k + 1);
  const indices = Array.from({ length: n }, (_, k) => k);
  const step = Math.max(1, Math.ceil(n / 6));
  const tickIndices = indices.filter((k) => k % step === 0);

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 96, bottom: 28, left: 32 }}
      ariaLabel={
        ariaLabel ??
        `Bump chart ranking ${series.map((s) => s.label).join(", ")} over time`
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scalePoint<number>({
          domain: indices,
          range: [0, innerWidth],
          padding: 0.5,
        });
        const yScale = scalePoint<number>({
          domain: ranks,
          range: [0, innerHeight],
          padding: 0.5,
        });
        const px = (i: number) => xScale(i) ?? 0;
        const py = (rank: number) => yScale(rank) ?? 0;

        return (
          <ChartScaleProvider
            value={{
              yScale: (v) => yScale(v) ?? 0,
              xScale: (v) => xScale(Number(v)) ?? 0,
              xBandwidth: 0,
              innerWidth,
              innerHeight,
            }}
          >
            <GridRows ticks={ranks} y={py} width={innerWidth} />
            <AxisLeft
              scale={yScale}
              hideAxisLine
              hideTicks
              tickFormat={(v) => `#${Number(v)}`}
              tickLabelProps={leftTickLabel(theme)}
            />
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              tickValues={tickIndices}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => {
                const x = series[0]?.data[Number(v)]?.x;
                return x != null ? fmtX(x) : `${Number(v)}`;
              }}
              tickLabelProps={bottomTickLabel(theme)}
            />

            {ranked.map((s, si) => {
              const stroke = colorFor(s.id);
              const dash = effectiveTexture
                ? strokeDasharrayFor(si)
                : undefined;
              const last = s.points[s.points.length - 1];
              return (
                // Bold the hovered series' line (strokeWidth) and its
                // hovered point (r); never dim the other series -- the
                // existing bump mechanisms below, unchanged.
                <g key={s.id}>
                  <LinePath<RankPoint>
                    data={s.points}
                    x={(d) => px(d.i)}
                    y={(d) => py(d.rank)}
                    curve={curveMonotoneX}
                    stroke={stroke}
                    strokeWidth={hover?.si === si ? 3 : 2}
                    strokeDasharray={dash}
                    fill="none"
                  />
                  {s.points.map((d) => (
                    <circle
                      key={d.i}
                      cx={px(d.i)}
                      cy={py(d.rank)}
                      r={hover?.si === si && hover?.i === d.i ? 6 : 4}
                      fill={stroke}
                      stroke={theme.surface}
                      strokeWidth={1.5}
                      onMouseEnter={() => {
                        setHover({ si, i: d.i });
                        onDatumHover?.({
                          datum: series[si].data[d.i],
                          index: d.i,
                          seriesId: s.id,
                        });
                      }}
                      onMouseLeave={() => {
                        setHover(null);
                        onDatumHover?.(null);
                      }}
                      onClick={() =>
                        onDatumClick?.({
                          datum: series[si].data[d.i],
                          index: d.i,
                          seriesId: s.id,
                        })
                      }
                    />
                  ))}
                  {last && (
                    <text
                      x={px(last.i) + 10}
                      y={py(last.rank)}
                      dy={4}
                      style={emText(11)}
                      fill={theme.ink}
                    >
                      {s.label}
                    </text>
                  )}
                </g>
              );
            })}
            {hover &&
              (() => {
                const rp = ranked[hover.si]?.points.find(
                  (p) => p.i === hover.i
                );
                const datum = series[hover.si]?.data[hover.i];
                if (!rp || !datum || datum.y == null) return null;
                return (
                  <SvgTooltip
                    x={px(hover.i)}
                    innerWidth={innerWidth}
                    top={Math.max(0, py(rp.rank) - 8)}
                    lines={[
                      series[hover.si].label,
                      `Rank #${rp.rank}`,
                      `${fmtX(datum.x)}: ${valueFmt(datum.y)}`,
                    ]}
                  />
                );
              })()}
            {children}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
