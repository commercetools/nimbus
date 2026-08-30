import { useMemo } from "react";
import { Treemap as VisxTreemap, hierarchy } from "@visx/hierarchy";
import type { HierarchyRectangularNode } from "@visx/hierarchy";
import { Group } from "@visx/group";
import { ChartFrame } from "../../chart/chart-frame";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import { emText } from "../../chart/typography";

/** A node in a nested part-to-whole hierarchy. Leaves carry `value`. */
export interface TreemapNode {
  name: string;
  value?: number;
  children?: TreemapNode[];
}

export interface TreemapProps {
  width: number;
  height: number;
  data: TreemapNode;
  ariaLabel?: string;
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
 */
export function Treemap({ width, height, data, ariaLabel }: TreemapProps) {
  const theme = useChartTheme();

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

  if (width <= 0 || height <= 0 || (root.value ?? 0) <= 0) return null;

  const label = ariaLabel ?? `Treemap of ${root.leaves().length} segments`;

  return (
    <ChartFrame
      width={width}
      height={height}
      margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
      ariaLabel={label}
    >
      {({ innerWidth, innerHeight }) => (
        <VisxTreemap<TreemapNode> root={root} size={[innerWidth, innerHeight]}>
          {(laidOut) => (
            <Group>
              {laidOut.leaves().map((leaf, i) => {
                const nodeWidth = Math.max(0, leaf.x1 - leaf.x0);
                const nodeHeight = Math.max(0, leaf.y1 - leaf.y0);
                const fill = color(topLevelAncestor(leaf).data.name);
                const showLabel =
                  nodeWidth > MIN_LABEL_WIDTH && nodeHeight > MIN_LABEL_HEIGHT;
                return (
                  <Group
                    key={`${leaf.data.name}-${i}`}
                    left={leaf.x0}
                    top={leaf.y0}
                  >
                    <rect
                      width={nodeWidth}
                      height={nodeHeight}
                      fill={fill}
                      stroke={theme.surface}
                      strokeWidth={CELL_GAP}
                    />
                    {showLabel && (
                      <>
                        <text
                          x={6}
                          y={16}
                          style={emText(11)}
                          fontWeight={600}
                          fontFamily="system-ui, sans-serif"
                          fill={theme.surface}
                        >
                          {leaf.data.name}
                        </text>
                        {nodeHeight > 34 && (
                          <text
                            x={6}
                            y={30}
                            style={emText(10)}
                            fontFamily="system-ui, sans-serif"
                            fill={theme.surface}
                            opacity={0.85}
                          >
                            {formatCompact(leaf.value ?? 0)}
                          </text>
                        )}
                      </>
                    )}
                  </Group>
                );
              })}
            </Group>
          )}
        </VisxTreemap>
      )}
    </ChartFrame>
  );
}
