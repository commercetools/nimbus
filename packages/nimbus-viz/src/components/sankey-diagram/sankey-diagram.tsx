import { useMemo, useState } from "react";
import { Sankey } from "@visx/sankey";
import type { SankeyNode } from "@visx/sankey";
import { Group } from "@visx/group";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { devWarn } from "../../chart/dev-warn";
import { ChartPatternDefs, patternFill } from "../../chart/patterns";
import { strokeDasharrayFor } from "../../chart/stroke-styles";
import { useForcedColors } from "../../chart/use-forced-colors";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { FlowGraph, FlowLink, FlowNode } from "../../chart/types";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";
import { ValueLabel } from "../../chart/value-labels";

export interface SankeyDiagramProps extends DatumInteractionProps<FlowNode> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** The flow graph: `nodes` plus weighted `links` that reference nodes by
   *  their index into `nodes`. The d3-sankey layout positions the rest. */
  graph: FlowGraph;
  /** Accessible label for the SVG frame; states what the flow shows and its
   *  takeaway. Defaults to `"Sankey flow diagram"`. */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /**
   * Distinguish nodes by a non-color channel, in addition to color, so
   * node/link identity stays legible without color alone — monochrome
   * print, a photocopy, or `forced-colors` mode. Nodes are real filled
   * `<rect>`s, so they get a fill `patternFill` (`chart/patterns.tsx`);
   * links are drawn as `fill="none"` paths with the ribbon width as
   * `strokeWidth` (there is no fill area to texture), so they get their
   * source node's `strokeDasharray` rhythm (`chart/stroke-styles.ts`)
   * instead. Default `false` (color only, unchanged). Turned on
   * automatically (regardless of this prop) when the OS is already in a
   * forced-colors context — see `useForcedColors`.
   */
  texture?: boolean;
  /**
   * Draw each NODE's total flow value directly outside its rect —
   * `chart/value-labels.tsx`'s `ValueLabel`, stacked below the node's
   * existing name label, flipped to whichever side keeps the text off the
   * ribbons: right of the node for the left half of the diagram, left of it
   * for the right half — the same anchor-flip logic `dumbbell-chart.tsx`
   * uses for its own paired end labels. Links are NOT labeled: a ribbon is a
   * diagonal, variable-width path, and (unlike a dumbbell's straight
   * horizontal connector) its midpoint can land on top of another node or a
   * crossing ribbon in a diagram with more than a couple of layers, so there
   * is no obviously clean single position for it the way there is for a
   * node's own rect. Default `false` — omitting it renders exactly as before
   * this existed.
   */
  showValues?: boolean;
}

type LaidNode = SankeyNode<FlowNode, FlowLink>;

/**
 * A FLOW specialist: proportional ribbons between nodes via `@visx/sankey`
 * (d3-sankey layout). This is the mark Vega-Lite could not express — the reason
 * the foundation is a single library (visx). Node color from the shared
 * entity→color scale; links inherit their source node's color.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function SankeyDiagram({
  width,
  height,
  graph,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  texture,
  showValues,
}: SankeyDiagramProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<{
    kind: "node" | "link";
    i: number;
  } | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;
  const nodeColor = useEntityColors(
    useMemo(() => graph.nodes.map((n) => n.name), [graph])
  );
  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // -- one system foreground color for every node, with the per-node
  // pattern fill / dash rhythm (below) as the only identity carrier.
  const colorForNode = (name: string) =>
    forcedColors ? "CanvasText" : nodeColor(name);
  const nodeIndex = useMemo(
    () => new Map(graph.nodes.map((n, i) => [n.name, i])),
    [graph]
  );

  if (width <= 0 || height <= 0 || graph.nodes.length === 0) return null;

  // BC-3 (docs/bug-classes.md): d3-sankey scales node/link geometry
  // proportional to `value / totalFlow`. When every link is 0 (or there are
  // none), `totalFlow` is 0 and that division yields NaN throughout the
  // laid-out graph -- render the same "nothing to show" as an empty graph
  // instead. A negative link value is clamped before layout for the same
  // reason a flow can't be negative.
  const hasNegativeLink = graph.links.some((l) => l.value < 0);
  if (hasNegativeLink) {
    devWarn(
      "sankey-diagram:negative",
      "SankeyDiagram: a negative link value is drawn as 0 (a flow cannot be negative)."
    );
  }
  const totalFlow = graph.links.reduce(
    (sum, l) => sum + Math.max(0, l.value),
    0
  );
  if (totalFlow <= 0) {
    devWarn(
      "sankey-diagram:zero-flow",
      "SankeyDiagram: every link is 0; nothing to lay out."
    );
    return null;
  }

  const nodeName = (idx: number) => graph.nodes[idx]?.name ?? String(idx);
  const table = {
    columns: ["From", "To", "Value"],
    rows: graph.links.map((l) => [
      nodeName(l.source),
      nodeName(l.target),
      l.value,
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      ariaLabel={ariaLabel ?? "Sankey flow diagram"}
      table={table}
    >
      {({ innerWidth, innerHeight }) => (
        <Sankey<FlowNode, FlowLink>
          // Clone: d3-sankey mutates its input with layout fields.
          root={{
            nodes: graph.nodes.map((n) => ({ ...n })),
            links: graph.links.map((l) => ({
              ...l,
              value: Math.max(0, l.value),
            })),
          }}
          size={[innerWidth, innerHeight]}
          nodeWidth={12}
          nodePadding={14}
        >
          {({ graph: laid, createPath }) => (
            <Group>
              {effectiveTexture && (
                <ChartPatternDefs
                  colors={graph.nodes.map((n) => colorForNode(n.name))}
                />
              )}
              {laid.links.map((link, i) => {
                const source = link.source as LaidNode;
                const isHover = hover?.kind === "link" && hover.i === i;
                return (
                  <path
                    key={`link-${i}`}
                    d={createPath(link) || ""}
                    fill="none"
                    stroke={colorForNode(source.name)}
                    strokeOpacity={isHover ? 0.6 : 0.35}
                    strokeWidth={Math.max(1, link.width ?? 1)}
                    strokeDasharray={
                      effectiveTexture
                        ? strokeDasharrayFor(nodeIndex.get(source.name) ?? 0)
                        : undefined
                    }
                    onMouseEnter={() => {
                      setHover({ kind: "link", i });
                      onDatumHover?.({
                        datum: graph.nodes[graph.links[i].source],
                        index: i,
                        seriesId: graph.nodes[graph.links[i].target].name,
                      });
                    }}
                    onMouseLeave={() => {
                      setHover(null);
                      onDatumHover?.(null);
                    }}
                    onClick={() =>
                      onDatumClick?.({
                        datum: graph.nodes[graph.links[i].source],
                        index: i,
                        seriesId: graph.nodes[graph.links[i].target].name,
                      })
                    }
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
                      fill={
                        effectiveTexture
                          ? patternFill(nodeIndex.get(node.name) ?? i)
                          : colorForNode(node.name)
                      }
                      stroke={isHover ? theme.ink : "none"}
                      strokeWidth={isHover ? 1.5 : 0}
                      onMouseEnter={() => {
                        setHover({ kind: "node", i });
                        onDatumHover?.({ datum: graph.nodes[i], index: i });
                      }}
                      onMouseLeave={() => {
                        setHover(null);
                        onDatumHover?.(null);
                      }}
                      onClick={() =>
                        onDatumClick?.({ datum: graph.nodes[i], index: i })
                      }
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
                    {showValues && (
                      <ValueLabel
                        x={leftHalf ? x1 + 6 : x0 - 6}
                        y={(y0 + y1) / 2 + 12}
                        text={valueFmt(node.value ?? 0)}
                        anchor={leftHalf ? "start" : "end"}
                      />
                    )}
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
                          `Total: ${valueFmt(node.value ?? 0)}`,
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
                        valueFmt(link.value ?? 0),
                      ]}
                    />
                  );
                })()}
            </Group>
          )}
        </Sankey>
      )}
    </ChartContainer>
  );
}
