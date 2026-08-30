import { useChartTheme } from "../../theme";
import { formatCompact, formatSignedPercent } from "../../chart/format";
import { CHART_FONT_STACK } from "../../chart/typography";

export interface StatCardProps {
  label: string;
  value: number;
  /** Prior value; when present, a signed delta vs. it is shown. */
  previous?: number;
  format?: (n: number) => string;
  ariaLabel?: string;
}

/**
 * A single headline value with an optional delta vs. a prior value. Valence is
 * carried by an arrow AND a sign, never color alone.
 */
export function StatCard({
  label,
  value,
  previous,
  format = formatCompact,
  ariaLabel,
}: StatCardProps) {
  const theme = useChartTheme();
  const hasDelta = previous != null && previous !== 0;
  const delta = hasDelta ? value - previous : 0;
  const pct = hasDelta ? delta / previous : 0;
  const up = delta >= 0;

  return (
    <div
      role="group"
      aria-label={ariaLabel ?? label}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: 4,
        fontFamily: CHART_FONT_STACK,
      }}
    >
      <span style={{ fontSize: 12, color: theme.mutedInk }}>{label}</span>
      <span
        style={{
          fontSize: 32,
          fontWeight: 700,
          lineHeight: 1.1,
          color: theme.ink,
        }}
      >
        {format(value)}
      </span>
      {hasDelta && (
        <span
          style={{
            fontSize: 13,
            color: up ? theme.positive : theme.negative,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span aria-hidden>{up ? "▲" : "▼"}</span>
          {formatSignedPercent(pct)}
          <span style={{ color: theme.mutedInk }}>vs prev</span>
        </span>
      )}
    </div>
  );
}
