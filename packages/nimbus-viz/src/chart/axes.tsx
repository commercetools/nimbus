import { useChartTheme } from "../theme";
import type { ChartRoles } from "../theme";

/**
 * Themed tick-label props for a visx `AxisLeft` (right-aligned, inset).
 * Baked once so every chart's axis reads the same and no chart repeats the
 * `as const` dance the visx `textAnchor` literal type requires.
 */
export function leftTickLabel(theme: ChartRoles) {
  return () =>
    ({
      fill: theme.mutedInk,
      textAnchor: "end",
      dx: -6,
      dy: 3,
    }) as const;
}

/** Themed tick-label props for a visx `AxisBottom` (centered, below). */
export function bottomTickLabel(theme: ChartRoles) {
  return () =>
    ({
      fill: theme.mutedInk,
      textAnchor: "middle",
      dy: 2,
    }) as const;
}

/** Horizontal gridlines across the plot at the given y-tick values. */
export function GridRows({
  ticks,
  y,
  width,
}: {
  ticks: number[];
  y: (v: number) => number;
  width: number;
}) {
  const theme = useChartTheme();
  return (
    <>
      {ticks.map((t) => (
        <line
          key={t}
          x1={0}
          x2={width}
          y1={y(t)}
          y2={y(t)}
          stroke={theme.grid}
          strokeWidth={1}
        />
      ))}
    </>
  );
}
