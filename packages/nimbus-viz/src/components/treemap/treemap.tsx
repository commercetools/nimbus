import { useMemo, useState } from "react";
import { Treemap as VisxTreemap, hierarchy } from "@visx/hierarchy";
import type { HierarchyRectangularNode } from "@visx/hierarchy";
import { Group } from "@visx/group";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatPercent } from "../../chart/format";
import { useChartFormatters } from "../../chart/format-locale";
import { ChartPatternDefs, patternFill } from "../../chart/patterns";
import { useForcedColors } from "../../chart/use-forced-colors";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";

/** A node in a nested part-to-whole hierarchy. Leaves carry `value`. */
export interface TreemapNode {
  name: string;
  value?: number;
  children?: TreemapNode[];
}

export interface TreemapProps extends DatumInteractionProps<TreemapNode> {
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
   * Fill each leaf with a per-branch SVG texture (`chart/patterns.tsx`) in
   * addition to its color, so branches stay distinguishable by shape alone
   * — monochrome print, a photocopy, or `forced-colors` mode, where the OS
   * flattens hue and the color-only encoding stops working. Default `false`
   * (color only, unchanged). Turned on automatically (regardless of this
   * prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
}

/** Minimum cell size (px) before a label is drawn inside it. */
const MIN_LABEL_WIDTH = 44;
const MIN_LABEL_HEIGHT = 20;
/** Visual gap between adjacent cells, in px (drawn as a surface-colored stroke). */
const CELL_GAP = 2;

/** Walk up from a leaf to its top-level ancestor (the root's direct child). */
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
 * Hierarchical part-to-whole. Each leaf is colored by its TOP-LEVEL ancestor
 * (via the shared entity→color scale), so every descendant of "Marketing"
 * shares one hue regardless of nesting depth. Cells are separated by a 2px
 * surface-colored gap; labels only render once a cell is large enough to hold
 * them (same size-gating idea as the heatmap's cell labels).
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function Treemap({
  width,
  height,
  data,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  texture,
}: TreemapProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);
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

  if (width <= 0 || height <= 0 || (root.value ?? 0) <= 0) return null;

  const label = ariaLabel ?? `Treemap of ${root.leaves().length} segments`;
  const table = {
    columns: ["Segment", "Value", "Share"],
    rows: root
      .leaves()
      .map((l) => [
        l.data.name,
        l.value ?? 0,
        formatPercent((l.value ?? 0) / (root.value ?? 1)),
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
      {({ innerWidth, innerHeight }) => (
        <VisxTreemap<TreemapNode> root={root} size={[innerWidth, innerHeight]}>
          {(laidOut) => (
            <Group>
              {effectiveTexture && (
                <ChartPatternDefs
                  colors={topLevelNames.map((name) => colorForKey(name))}
                />
              )}
              {laidOut.leaves().map((leaf, i) => {
                const nodeWidth = Math.max(0, leaf.x1 - leaf.x0);
                const nodeHeight = Math.max(0, leaf.y1 - leaf.y0);
                const topName = topLevelAncestor(leaf).data.name;
                const fill = effectiveTexture
                  ? patternFill(topLevelNames.indexOf(topName))
                  : colorForKey(topName);
                const showLabel =
                  nodeWidth > MIN_LABEL_WIDTH && nodeHeight > MIN_LABEL_HEIGHT;
                return (
                  <Group
                    key={`${leaf.data.name}-${i}`}
                    left={leaf.x0}
                    top={leaf.y0}
                    onMouseEnter={() => {
                      setHover(i);
                      onDatumHover?.({ datum: leaf.data, index: i });
                    }}
                    onMouseLeave={() => {
                      setHover(null);
                      onDatumHover?.(null);
                    }}
                    onClick={() =>
                      onDatumClick?.({ datum: leaf.data, index: i })
                    }
                  >
                    <rect
                      width={nodeWidth}
                      height={nodeHeight}
                      fill={fill}
                      stroke={hover === i ? theme.ink : theme.surface}
                      strokeWidth={CELL_GAP}
                    />
                    {showLabel && (
                      <>
                        <text
                          x={6}
                          y={16}
                          style={emText(11)}
                          fontWeight={600}
                          fill={theme.surface}
                        >
                          {leaf.data.name}
                        </text>
                        {nodeHeight > 34 && (
                          <text
                            x={6}
                            y={30}
                            style={emText(10)}
                            fill={theme.surface}
                            opacity={0.85}
                          >
                            {valueFmt(leaf.value ?? 0)}
                          </text>
                        )}
                      </>
                    )}
                  </Group>
                );
              })}
              {hover != null &&
                laidOut.leaves()[hover] &&
                (() => {
                  const leaf = laidOut.leaves()[hover];
                  const total = root.value ?? 0;
                  const share = total > 0 ? (leaf.value ?? 0) / total : 0;
                  return (
                    <SvgTooltip
                      x={leaf.x0 + (leaf.x1 - leaf.x0) / 2}
                      innerWidth={innerWidth}
                      top={Math.max(0, leaf.y0 - 4)}
                      lines={[
                        leaf.data.name,
                        `Value: ${valueFmt(leaf.value ?? 0)}`,
                        `Share: ${formatPercent(share)}`,
                      ]}
                    />
                  );
                })()}
            </Group>
          )}
        </VisxTreemap>
      )}
    </ChartContainer>
  );
}
