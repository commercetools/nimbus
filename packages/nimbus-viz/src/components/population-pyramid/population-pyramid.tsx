import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { StackRow } from "../../chart/types";
import { emText } from "../../chart/typography";
import { bandByIndex, valueDomain } from "../../chart/scales";
import { stackKeys } from "../../chart/stack";
import { devWarn } from "../../chart/dev-warn";
import { ChartPatternDefs, patternFill } from "../../chart/patterns";
import { useForcedColors } from "../../chart/use-forced-colors";
import type { DatumInteractionProps } from "../../chart/interaction";

export interface PopulationPyramidProps extends DatumInteractionProps<StackRow> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /**
   * One row per band (e.g. an age bracket). The first two segments become the
   * left and right sides; further segments are ignored. Bands are drawn in the
   * given order, top to bottom.
   */
  data: StackRow[];
  /** Accessible label for the graphic. Defaults to
   *  "Population pyramid of N bands". */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /**
   * Fill each side with a per-key SVG texture (`chart/patterns.tsx`) in
   * addition to its color, so the two sides stay distinguishable by shape
   * alone — monochrome print, a photocopy, or `forced-colors` mode. Default
   * `false` (color only, unchanged). Turned on automatically (regardless
   * of this prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
}

/** Width of the central gutter reserved for band labels, in px. */
const GUTTER = 52;

/**
 * Population pyramid — two series of bars sharing one band axis, drawn back to
 * back around a central gutter that carries the band labels. Both sides share a
 * value scale so the two populations are directly comparable at every band. Two
 * categorical hues with a legend; hovering a bar shows its value.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function PopulationPyramid({
  width,
  height,
  data,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  texture,
}: PopulationPyramidProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<{ r: number; side: 0 | 1 } | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;

  // Segment keys are read as the union across all rows (not just row 0), so a
  // key missing from the first row still resolves to its real name (BC-5).
  const allKeys = useMemo(() => stackKeys(data), [data]);
  const keys = useMemo(
    () => [allKeys[0] ?? "Left", allKeys[1] ?? "Right"],
    [allKeys]
  );
  const color = useEntityColors(keys);
  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // -- one system foreground color for every key, with the per-key pattern
  // kind (below) as the only identity carrier.
  const colorForKey = (k: string) => (forcedColors ? "CanvasText" : color(k));
  // A side's length can't encode a negative magnitude: clamp before it
  // enters the width/domain math (BC-2). `data` (raw) is still what the
  // tooltip and data table read below, so a negative input stays visible
  // there.
  const hasNegative = data.some(
    (d) => (d.segments[0]?.value ?? 0) < 0 || (d.segments[1]?.value ?? 0) < 0
  );
  if (hasNegative) {
    devWarn(
      "population-pyramid:negative",
      "PopulationPyramid: negative segment values are drawn as 0 (a side length cannot encode a negative magnitude)."
    );
  }
  const clampedData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        segments: d.segments.map((s) => ({
          ...s,
          value: Math.max(0, s.value),
        })),
      })),
    [data]
  );
  // Both sides share this domain; valueDomain also widens a degenerate
  // all-zero/all-equal domain (BC-3) instead of collapsing to a single point.
  const wDomain = useMemo(
    () =>
      valueDomain(
        clampedData.map((d) =>
          Math.max(d.segments[0]?.value ?? 0, d.segments[1]?.value ?? 0)
        )
      ),
    [clampedData]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const label = ariaLabel ?? `Population pyramid of ${data.length} bands`;
  const table = {
    columns: ["Band", keys[0], keys[1]],
    rows: data.map((d) => [
      d.category,
      d.segments[0]?.value ?? 0,
      d.segments[1]?.value ?? 0,
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 16, bottom: 12, left: 16 }}
      ariaLabel={label}
      legend={keys.map((key) => ({ label: key, color: colorForKey(key) }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const half = Math.max(0, (innerWidth - GUTTER) / 2);
        const centerLeft = half;
        const centerRight = half + GUTTER;
        const yScale = bandByIndex(
          data.map((d) => d.category),
          {
            range: [0, innerHeight],
            padding: 0.2,
          }
        );
        const wScale = scaleLinear({
          domain: wDomain,
          range: [0, half],
          nice: true,
        });
        const bh = yScale.bandwidth;
        const hovered =
          hover != null ? data[hover.r]?.segments[hover.side] : null;
        const hoveredY = hover != null ? yScale.pos(hover.r) : 0;
        return (
          <>
            {effectiveTexture && (
              <ChartPatternDefs colors={keys.map((k) => colorForKey(k))} />
            )}
            {clampedData.map((row, r) => {
              const y = yScale.pos(r);
              const lv = row.segments[0]?.value ?? 0;
              const rv = row.segments[1]?.value ?? 0;
              const lw = wScale(lv);
              const rw = wScale(rv);
              const lActive =
                hover == null || (hover.r === r && hover.side === 0);
              const rActive =
                hover == null || (hover.r === r && hover.side === 1);
              return (
                <g key={r}>
                  <rect
                    x={centerLeft - lw}
                    y={y}
                    width={Math.max(0, lw)}
                    height={bh}
                    fill={
                      effectiveTexture ? patternFill(0) : colorForKey(keys[0])
                    }
                    opacity={lActive ? 1 : 0.4}
                    onMouseEnter={() => {
                      setHover({ r, side: 0 });
                      onDatumHover?.({
                        datum: data[r],
                        index: r,
                        seriesId: keys[0],
                      });
                    }}
                    onMouseLeave={() => {
                      setHover(null);
                      onDatumHover?.(null);
                    }}
                    onClick={() =>
                      onDatumClick?.({
                        datum: data[r],
                        index: r,
                        seriesId: keys[0],
                      })
                    }
                  />
                  <rect
                    x={centerRight}
                    y={y}
                    width={Math.max(0, rw)}
                    height={bh}
                    fill={
                      effectiveTexture ? patternFill(1) : colorForKey(keys[1])
                    }
                    opacity={rActive ? 1 : 0.4}
                    onMouseEnter={() => {
                      setHover({ r, side: 1 });
                      onDatumHover?.({
                        datum: data[r],
                        index: r,
                        seriesId: keys[1],
                      });
                    }}
                    onMouseLeave={() => {
                      setHover(null);
                      onDatumHover?.(null);
                    }}
                    onClick={() =>
                      onDatumClick?.({
                        datum: data[r],
                        index: r,
                        seriesId: keys[1],
                      })
                    }
                  />
                  <text
                    x={centerLeft + GUTTER / 2}
                    y={y + bh / 2}
                    dy="0.32em"
                    textAnchor="middle"
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {row.category}
                  </text>
                </g>
              );
            })}
            {hovered && (
              <SvgTooltip
                x={centerLeft + GUTTER / 2}
                innerWidth={innerWidth}
                top={Math.max(0, hoveredY - 4)}
                lines={[
                  `${data[hover!.r].category} · ${keys[hover!.side]}`,
                  valueFmt(hovered.value),
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
