import { useMemo, useState } from "react";
import { Partition, hierarchy } from "@visx/hierarchy";
import type { HierarchyRectangularNode } from "@visx/hierarchy";
import { Group } from "@visx/group";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatPercent } from "../../chart/format";
import { useChartFormatters } from "../../chart/format-locale";
import { ChartPatternDefs, patternFill } from "../../chart/patterns";
import { useForcedColors } from "../../chart/use-forced-colors";
import type { TreemapNode } from "../treemap";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";
import { ValueLabel } from "../../chart/value-labels";

export interface SunburstChartProps extends DatumInteractionProps<TreemapNode> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Root of the hierarchy to lay out; leaves carry `value`, parents sum theirs. */
  data: TreemapNode;
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /**
   * Fill each arc with a per-branch SVG texture (`chart/patterns.tsx`) in
   * addition to its color, so branches stay distinguishable by shape alone
   * — monochrome print, a photocopy, or `forced-colors` mode, where the OS
   * flattens hue and the color-only encoding stops working. Default `false`
   * (color only, unchanged). Turned on automatically (regardless of this
   * prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
  /**
   * Draw each leaf's formatted value just outside the plot's outer edge, at
   * its midpoint angle (`chart/value-labels.tsx`'s `ValueLabel`, the same
   * outer-rim `polar()`-style placement `DonutChart`/`RadialBarChart` use).
   * Only the OUTERMOST ring (`node.depth === root.height`) is ever
   * labeled -- an inner ring's arcs sit directly beneath deeper rings drawn
   * on top of them, so a label there would float disconnected from its own
   * arc and clutter across levels; this is the same restraint `Treemap`
   * applies via its own minimum-cell-size gate, just keyed on depth instead
   * of pixels. An outermost arc also still needs `MIN_LABEL_ARC_WIDTH` px of
   * width at its mid-radius and `MIN_LABEL_THICKNESS` px of ring thickness
   * (this chart's own `Heatmap`-style size gate) before it gets a label.
   * Default `false` (no change from today's unlabeled arcs).
   */
  showValues?: boolean;
}

/** Point on a circle for an angle measured clockwise from 12 o'clock. */
function polar(r: number, angle: number): [number, number] {
  return [r * Math.sin(angle), -r * Math.cos(angle)];
}

/**
 * Minimum arc size (px) before the outermost ring's value label is drawn --
 * same thresholds `Heatmap`/`RadialBarChart` use for their own in-mark
 * labels, applied here to an arc's width at its mid-radius and its ring's
 * radial thickness.
 */
const MIN_LABEL_ARC_WIDTH = 26;
const MIN_LABEL_THICKNESS = 16;

/** SVG path for an annular sector centered on the origin. */
function arcPath(r0: number, r1: number, a0: number, a1: number): string {
  const largeArc = a1 - a0 > Math.PI ? 1 : 0;
  const [x0o, y0o] = polar(r1, a0);
  const [x1o, y1o] = polar(r1, a1);
  const [x1i, y1i] = polar(r0, a1);
  const [x0i, y0i] = polar(r0, a0);
  return [
    `M${x0o},${y0o}`,
    `A${r1},${r1} 0 ${largeArc} 1 ${x1o},${y1o}`,
    `L${x1i},${y1i}`,
    `A${r0},${r0} 0 ${largeArc} 0 ${x0i},${y0i}`,
    "Z",
  ].join(" ");
}

/** Walk up from a node to its top-level ancestor (the root's direct child). */
function topLevelAncestor<Datum>(
  node: HierarchyRectangularNode<Datum>
): HierarchyRectangularNode<Datum> {
  let current = node;
  while (current.parent && current.parent.depth > 0) {
    current = current.parent;
  }
  return current;
}

/**
 * Sunburst — the radial counterpart to the treemap for hierarchical
 * part-to-whole. Each ring is a level of the hierarchy and an arc's sweep is its
 * share of the parent; every node is colored by its top-level ancestor (via the
 * shared entity→color scale) and dimmed slightly with depth. The center reads
 * the total, or a hovered node's value and share.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function SunburstChart({
  width,
  height,
  data,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  texture,
  showValues,
}: SunburstChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<{ name: string; value: number } | null>(
    null
  );
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;

  const root = useMemo(() => {
    const built = hierarchy<TreemapNode>(data, (d) => d.children).sum(
      (d) => d.value ?? 0
    );
    built.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    return built;
  }, [data]);

  const topLevelNames = useMemo(
    () => root.children?.map((c) => c.data.name) ?? [root.data.name],
    [root]
  );
  const color = useEntityColors(topLevelNames);
  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // -- one system foreground color for every branch, with the per-branch
  // pattern kind (below) as the only identity carrier.
  const colorForKey = (name: string) =>
    forcedColors ? "CanvasText" : color(name);
  const total = root.value ?? 0;

  if (width <= 0 || height <= 0 || total <= 0) return null;

  const label = ariaLabel ?? `Sunburst of ${root.leaves().length} segments`;
  const table = {
    columns: ["Segment", "Value", "Share"],
    rows: root
      .leaves()
      .map((l) => [
        l.data.name,
        l.value ?? 0,
        formatPercent((l.value ?? 0) / (total || 1)),
      ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        // Reserve a rim for the outermost ring's value labels when shown
        // (mirrors DonutChart's rim reservation for its own outer-radius
        // labels) -- untouched when `showValues` is unset, so the default
        // sunburst is unaffected.
        const radius = Math.max(
          0,
          Math.min(innerWidth, innerHeight) / 2 - (showValues ? 14 : 0)
        );
        const cx = innerWidth / 2;
        const cy = innerHeight / 2;
        return (
          <>
            <Partition<TreemapNode> root={root} size={[Math.PI * 2, radius]}>
              {(part) => (
                <Group top={cy} left={cx}>
                  {effectiveTexture && (
                    <ChartPatternDefs
                      colors={topLevelNames.map((name) => colorForKey(name))}
                    />
                  )}
                  {part
                    .descendants()
                    .filter((node) => node.depth > 0)
                    .map((node, i) => {
                      const topName = topLevelAncestor(node).data.name;
                      const fill = effectiveTexture
                        ? patternFill(topLevelNames.indexOf(topName))
                        : colorForKey(topName);
                      // Outline the hovered node only; never dim its
                      // siblings (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` --
                      // the shared convention, replacing a per-chart "dim
                      // everyone else" opacity ternary). The depth-based
                      // fade below is unrelated to hover and stays as-is.
                      const isHovered =
                        hover != null && hover.name === node.data.name;
                      // Only the outermost ring can plausibly carry a
                      // label without floating disconnected beneath a
                      // deeper ring drawn on top of it -- see the
                      // `showValues` TSDoc.
                      const isOutermost = node.depth === root.height;
                      const mid = (node.x0 + node.x1) / 2;
                      const midR = (node.y0 + node.y1) / 2;
                      const arcWidth = midR * (node.x1 - node.x0);
                      const canLabel =
                        isOutermost &&
                        arcWidth >= MIN_LABEL_ARC_WIDTH &&
                        node.y1 - node.y0 >= MIN_LABEL_THICKNESS;
                      const [lx, ly] = polar(radius + 12, mid);
                      return (
                        <g key={`${node.data.name}-${i}`}>
                          <path
                            d={arcPath(node.y0, node.y1, node.x0, node.x1)}
                            fill={fill}
                            stroke={isHovered ? theme.ink : theme.surface}
                            strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 1}
                            opacity={Math.max(
                              0.55,
                              1 - (node.depth - 1) * 0.15
                            )}
                            onMouseEnter={() => {
                              setHover({
                                name: node.data.name,
                                value: node.value ?? 0,
                              });
                              onDatumHover?.({ datum: node.data, index: i });
                            }}
                            onMouseLeave={() => {
                              setHover(null);
                              onDatumHover?.(null);
                            }}
                            onClick={() =>
                              onDatumClick?.({ datum: node.data, index: i })
                            }
                          />
                          {showValues && canLabel && (
                            <ValueLabel
                              x={lx}
                              y={ly}
                              text={valueFmt(node.value ?? 0)}
                              anchor={mid > Math.PI ? "end" : "start"}
                            />
                          )}
                        </g>
                      );
                    })}
                  <text
                    textAnchor="middle"
                    dy={-2}
                    style={emText(18)}
                    fontWeight={700}
                    fill={theme.ink}
                  >
                    {hover
                      ? formatPercent(hover.value / total)
                      : valueFmt(total)}
                  </text>
                  <text
                    textAnchor="middle"
                    dy={16}
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {hover ? hover.name : "Total"}
                  </text>
                </Group>
              )}
            </Partition>
            {hover && (
              <SvgTooltip
                x={cx}
                innerWidth={innerWidth}
                top={4}
                lines={[
                  hover.name,
                  `Value: ${valueFmt(hover.value)}`,
                  `Share: ${formatPercent(hover.value / total)}`,
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
