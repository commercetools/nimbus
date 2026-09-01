import { useMemo, useState } from "react";
import { Partition, hierarchy } from "@visx/hierarchy";
import type { HierarchyRectangularNode } from "@visx/hierarchy";
import { Group } from "@visx/group";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact, formatPercent } from "../../chart/format";
import type { TreemapNode } from "../treemap";
import { emText } from "../../chart/typography";

export interface SunburstChartProps {
  width: number;
  height: number;
  data: TreemapNode;
  ariaLabel?: string;
}

/** Point on a circle for an angle measured clockwise from 12 o'clock. */
function polar(r: number, angle: number): [number, number] {
  return [r * Math.sin(angle), -r * Math.cos(angle)];
}

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
}: SunburstChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{ name: string; value: number } | null>(
    null
  );

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
        const radius = Math.max(0, Math.min(innerWidth, innerHeight) / 2);
        const cx = innerWidth / 2;
        const cy = innerHeight / 2;
        return (
          <>
            <Partition<TreemapNode> root={root} size={[Math.PI * 2, radius]}>
              {(part) => (
                <Group top={cy} left={cx}>
                  {part
                    .descendants()
                    .filter((node) => node.depth > 0)
                    .map((node, i) => {
                      const fill = color(topLevelAncestor(node).data.name);
                      const dimmed =
                        hover != null && hover.name !== node.data.name;
                      return (
                        <path
                          key={`${node.data.name}-${i}`}
                          d={arcPath(node.y0, node.y1, node.x0, node.x1)}
                          fill={fill}
                          stroke={theme.surface}
                          strokeWidth={1}
                          opacity={
                            (dimmed ? 0.4 : 1) *
                            Math.max(0.55, 1 - (node.depth - 1) * 0.15)
                          }
                          onMouseEnter={() =>
                            setHover({
                              name: node.data.name,
                              value: node.value ?? 0,
                            })
                          }
                          onMouseLeave={() => setHover(null)}
                        />
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
                      : formatCompact(total)}
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
                  `Value: ${formatCompact(hover.value)}`,
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
