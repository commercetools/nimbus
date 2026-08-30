import { useMemo, useState } from "react";
import { Sankey } from "@visx/sankey";
import type { SankeyNode } from "@visx/sankey";
import { Group } from "@visx/group";
import { ChartFrame } from "../../chart/chart-frame";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { FlowGraph, FlowLink, FlowNode } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface SankeyDiagramProps {
  width: number;
  height: number;
  graph: FlowGraph;
  ariaLabel?: string;
}

type LaidNode = SankeyNode<FlowNode, FlowLink>;

/**
 * A FLOW specialist: proportional ribbons between nodes via `@visx/sankey`
 * (d3-sankey layout). This is the mark Vega-Lite could not express — the reason
 * the foundation is a single library (visx). Node color from the shared
 * entity→color scale; links inherit their source node's color.
 */
export function SankeyDiagram({
  width,
  height,
  graph,
  ariaLabel,
}: SankeyDiagramProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{
    kind: "node" | "link";
    i: number;
  } | null>(null);
  const nodeColor = useEntityColors(
    useMemo(() => graph.nodes.map((n) => n.name), [graph])
  );

  if (width <= 0 || height <= 0 || graph.nodes.length === 0) return null;

  return (
    <ChartFrame
      width={width}
      height={height}
      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      ariaLabel={ariaLabel ?? "Sankey flow diagram"}
    >
      {({ innerWidth, innerHeight }) => (
        <Sankey<FlowNode, FlowLink>
          // Clone: d3-sankey mutates its input with layout fields.
          root={{
            nodes: graph.nodes.map((n) => ({ ...n })),
            links: graph.links.map((l) => ({ ...l })),
          }}
          size={[innerWidth, innerHeight]}
          nodeWidth={12}
          nodePadding={14}
        >
          {({ graph: laid, createPath }) => (
            <Group>
              {laid.links.map((link, i) => {
                const source = link.source as LaidNode;
                const isHover = hover?.kind === "link" && hover.i === i;
                return (
                  <path
                    key={`link-${i}`}
                    d={createPath(link) || ""}
                    fill="none"
                    stroke={nodeColor(source.name)}
                    strokeOpacity={isHover ? 0.6 : 0.35}
                    strokeWidth={Math.max(1, link.width ?? 1)}
                    onMouseEnter={() => setHover({ kind: "link", i })}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}
              {laid.nodes.map((node, i) => {
                const x0 = node.x0 ?? 0;
                const x1 = node.x1 ?? 0;
                const y0 = node.y0 ?? 0;
                const y1 = node.y1 ?? 0;
                const leftHalf = x0 < innerWidth / 2;
                const isHover = hover?.kind === "node" && hover.i === i;
                return (
                  <Group key={`node-${i}`}>
                    <rect
                      x={x0}
                      y={y0}
                      width={Math.max(0, x1 - x0)}
                      height={Math.max(0, y1 - y0)}
                      rx={2}
                      fill={nodeColor(node.name)}
                      stroke={isHover ? theme.ink : "none"}
                      strokeWidth={isHover ? 1.5 : 0}
                      onMouseEnter={() => setHover({ kind: "node", i })}
                      onMouseLeave={() => setHover(null)}
                    />
                    <text
                      x={leftHalf ? x1 + 6 : x0 - 6}
                      y={(y0 + y1) / 2}
                      dy="0.32em"
                      textAnchor={leftHalf ? "start" : "end"}
                      style={emText(10)}
                      fill={theme.ink}
                    >
                      {node.name}
                    </text>
                  </Group>
                );
              })}
              {hover &&
                (() => {
                  if (hover.kind === "node") {
                    const node = laid.nodes[hover.i];
                    if (!node) return null;
                    return (
                      <SvgTooltip
                        x={((node.x0 ?? 0) + (node.x1 ?? 0)) / 2}
                        innerWidth={innerWidth}
                        top={Math.max(0, (node.y0 ?? 0) - 4)}
                        lines={[
                          node.name,
                          `Total: ${formatCompact(node.value ?? 0)}`,
                        ]}
                      />
                    );
                  }
                  const link = laid.links[hover.i];
                  if (!link) return null;
                  const source = link.source as LaidNode;
                  const target = link.target as LaidNode;
                  return (
                    <SvgTooltip
                      x={((source.x1 ?? 0) + (target.x0 ?? 0)) / 2}
                      innerWidth={innerWidth}
                      top={Math.max(
                        0,
                        ((link.y0 ?? 0) + (link.y1 ?? 0)) / 2 - 20
                      )}
                      lines={[
                        `${source.name} → ${target.name}`,
                        formatCompact(link.value ?? 0),
                      ]}
                    />
                  );
                })()}
            </Group>
          )}
        </Sankey>
      )}
    </ChartFrame>
  );
}
