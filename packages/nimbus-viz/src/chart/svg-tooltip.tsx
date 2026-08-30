import { useChartTheme } from "../theme";
import { emText } from "./typography";

export interface SvgTooltipProps {
  /** Anchor x in inner (plot) coordinates. */
  x: number;
  /** Plot width, used to flip the box so it never overflows the right edge. */
  innerWidth: number;
  /** First line is the bold header (ink); the rest are muted detail lines. */
  lines: string[];
  top?: number;
}

/**
 * A small SVG readout box, drawn inside the plot's coordinate system. Shared by
 * the hover interactions of the axis-based charts. (Assembly note: SVG vs
 * HTML-portal tooltip is still an open call — this is the SVG take.)
 */
export function SvgTooltip({ x, innerWidth, lines, top = 4 }: SvgTooltipProps) {
  const theme = useChartTheme();
  const boxW = 10 + 6.5 * Math.max(...lines.map((l) => l.length));
  const boxH = 8 + 15 * lines.length;
  const left = x + 10 + boxW > innerWidth ? x - 10 - boxW : x + 10;
  return (
    <g
      pointerEvents="none"
      transform={`translate(${Math.max(0, left)}, ${top})`}
    >
      <rect
        width={boxW}
        height={boxH}
        rx={6}
        fill={theme.surface}
        stroke={theme.grid}
      />
      {lines.map((line, i) => (
        <text
          key={line}
          x={8}
          y={17 + i * 15}
          style={emText(11)}
          fontFamily="system-ui, sans-serif"
          fontWeight={i === 0 ? 600 : 400}
          fill={i === 0 ? theme.ink : theme.mutedInk}
        >
          {line}
        </text>
      ))}
    </g>
  );
}
