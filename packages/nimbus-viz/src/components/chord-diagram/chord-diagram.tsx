import { useMemo, useState } from "react";
import { Group } from "@visx/group";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import { emText } from "../../chart/typography";

/** A square matrix of flows between a shared set of entities. */
export interface FlowMatrix {
  labels: string[];
  /** `matrix[i][j]` = flow FROM entity i TO entity j. */
  matrix: number[][];
}

export interface ChordDiagramProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** The square flow matrix and its entity labels. `matrix[i][j]` is the flow
   *  from entity i to entity j; negatives are clamped to 0. */
  data: FlowMatrix;
  /** Accessible label for the SVG frame; states what the flows show and their
   *  takeaway. Defaults to `"Chord diagram of N entities"`. */
  ariaLabel?: string;
}

interface Arc {
  a0: number;
  a1: number;
}
interface Ribbon {
  i: number;
  j: number;
  s: Arc;
  t: Arc;
  value: number;
}

/** Radians of gap between adjacent groups. */
const PAD = 0.04;

function polar(r: number, angle: number): [number, number] {
  return [r * Math.sin(angle), -r * Math.cos(angle)];
}

function arcPath(r0: number, r1: number, a0: number, a1: number): string {
  const largeArc = a1 - a0 > Math.PI ? 1 : 0;
  const [x0o, y0o] = polar(r1, a0);
  const [x1o, y1o] = polar(r1, a1);
  const [x1i, y1i] = polar(r0, a1);
  const [x0i, y0i] = polar(r0, a0);
  return `M${x0o},${y0o} A${r1},${r1} 0 ${largeArc} 1 ${x1o},${y1o} L${x1i},${y1i} A${r0},${r0} 0 ${largeArc} 0 ${x0i},${y0i} Z`;
}

function ribbonPath(s: Arc, t: Arc, r: number): string {
  const [sx0, sy0] = polar(r, s.a0);
  const [sx1, sy1] = polar(r, s.a1);
  const [tx0, ty0] = polar(r, t.a0);
  const [tx1, ty1] = polar(r, t.a1);
  const ss = s.a1 - s.a0 > Math.PI ? 1 : 0;
  const ts = t.a1 - t.a0 > Math.PI ? 1 : 0;
  return `M${sx0},${sy0} A${r},${r} 0 ${ss} 1 ${sx1},${sy1} Q0,0 ${tx0},${ty0} A${r},${r} 0 ${ts} 1 ${tx1},${ty1} Q0,0 ${sx0},${sy0} Z`;
}

/**
 * Chord diagram — flows between a single set of entities laid out around a
 * circle. Each entity's arc spans its total outbound flow; a ribbon links the
 * two entities of every pair, its ends sized by the flow in each direction.
 * Entities are colored in fixed order (legend always present); hovering a ribbon
 * or an arc highlights it and reads out the value.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function ChordDiagram({
  width,
  height,
  data,
  ariaLabel,
}: ChordDiagramProps) {
  const theme = useChartTheme();
  const [hoverRibbon, setHoverRibbon] = useState<number | null>(null);
  const [hoverArc, setHoverArc] = useState<number | null>(null);
  const { labels, matrix } = data;
  const color = useEntityColors(labels);

  const layout = useMemo(() => {
    const n = labels.length;
    const rowSum = matrix.map((row) =>
      row.reduce((s, v) => s + Math.max(0, v), 0)
    );
    const grand = rowSum.reduce((s, v) => s + v, 0);
    const perUnit = grand > 0 ? (Math.PI * 2 - PAD * n) / grand : 0;
    const groups: Arc[] = [];
    const sub: Arc[][] = [];
    let ang = 0;
    for (let i = 0; i < n; i += 1) {
      const g0 = ang;
      const subs: Arc[] = [];
      for (let j = 0; j < n; j += 1) {
        const v = Math.max(0, matrix[i]?.[j] ?? 0);
        const a0 = ang;
        ang += v * perUnit;
        subs.push({ a0, a1: ang });
      }
      groups.push({ a0: g0, a1: ang });
      ang += PAD;
      sub.push(subs);
    }
    const ribbons: Ribbon[] = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = i; j < n; j += 1) {
        const vij = Math.max(0, matrix[i]?.[j] ?? 0);
        const vji = Math.max(0, matrix[j]?.[i] ?? 0);
        if (vij <= 0 && vji <= 0) continue;
        ribbons.push({
          i,
          j,
          s: sub[i][j],
          t: sub[j][i],
          value: vij + (i !== j ? vji : 0),
        });
      }
    }
    return { groups, ribbons, rowSum };
  }, [labels, matrix]);

  if (width <= 0 || height <= 0 || labels.length === 0) return null;

  const label = ariaLabel ?? `Chord diagram of ${labels.length} entities`;
  const table = {
    columns: ["Entity", "Total outbound"],
    rows: labels.map((l, i) => [l, layout.rowSum[i]]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      ariaLabel={label}
      legend={labels.map((l) => ({ label: l, color: color(l) }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const cx = innerWidth / 2;
        const cy = innerHeight / 2;
        const outer = Math.max(0, Math.min(innerWidth, innerHeight) / 2 - 24);
        const ring = Math.max(6, outer * 0.06);
        const inner = outer - ring;
        const ribbonOpacity = (rb: Ribbon, idx: number): number => {
          if (hoverRibbon != null) return hoverRibbon === idx ? 0.85 : 0.1;
          if (hoverArc != null)
            return rb.i === hoverArc || rb.j === hoverArc ? 0.75 : 0.1;
          return 0.45;
        };
        const tip = (() => {
          if (hoverRibbon != null) {
            const rb = layout.ribbons[hoverRibbon];
            return [
              `${labels[rb.i]} ↔ ${labels[rb.j]}`,
              formatCompact(rb.value),
            ];
          }
          if (hoverArc != null) {
            return [
              labels[hoverArc],
              `total ${formatCompact(layout.rowSum[hoverArc])}`,
            ];
          }
          return null;
        })();
        return (
          <>
            <Group top={cy} left={cx}>
              {layout.ribbons.map((rb, idx) => (
                <path
                  key={`r-${rb.i}-${rb.j}`}
                  d={ribbonPath(rb.s, rb.t, inner)}
                  fill={color(labels[rb.i])}
                  opacity={ribbonOpacity(rb, idx)}
                  onMouseEnter={() => setHoverRibbon(idx)}
                  onMouseLeave={() => setHoverRibbon(null)}
                />
              ))}
              {layout.groups.map((g, i) => {
                const mid = (g.a0 + g.a1) / 2;
                const [lx, ly] = polar(outer + 10, mid);
                return (
                  <g key={`g-${i}`}>
                    <path
                      d={arcPath(inner, outer, g.a0, g.a1)}
                      fill={color(labels[i])}
                      onMouseEnter={() => setHoverArc(i)}
                      onMouseLeave={() => setHoverArc(null)}
                    />
                    <text
                      x={lx}
                      y={ly}
                      dy="0.32em"
                      textAnchor={mid > Math.PI ? "end" : "start"}
                      style={emText(10)}
                      fill={theme.mutedInk}
                    >
                      {labels[i]}
                    </text>
                  </g>
                );
              })}
            </Group>
            {tip && (
              <SvgTooltip x={cx} innerWidth={innerWidth} top={4} lines={tip} />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
