import { useChartTheme } from "../../theme";
import { formatCompact, formatSignedPercent } from "../../chart/format";
import {
  CHART_FONT_STACK,
  EMPHASIS_PX,
  LABEL_PX,
} from "../../chart/typography";

export interface StatCardProps {
  /** Metric name, shown above the value (e.g. "Monthly revenue"). */
  label: string;
  /** The headline number to display. */
  value: number;
  /** Prior value; when present, a signed delta vs. it is shown. */
  previous?: number;
  /** Formats the headline value. Defaults to `formatCompact` (e.g. `128.4k`). */
  format?: (n: number) => string;
  /**
   * For "lower is better" metrics (refund rate, processing time, churn…). When
   * true, a DECREASE is colored as positive and an increase as negative. The
   * arrow still points in the true direction — only the valence color flips.
   */
  invertDelta?: boolean;
  /** Accessible label for the card group. Defaults to `label`. */
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
  invertDelta = false,
  ariaLabel,
}: StatCardProps) {
  const theme = useChartTheme();
  const hasDelta = previous != null && previous !== 0;
  const delta = hasDelta ? value - previous : 0;
  const pct = hasDelta ? delta / previous : 0;
  const up = delta >= 0;
  // Arrow follows the true direction; color valence can be inverted for
  // "lower is better" metrics so an improvement always reads positive.
  const good = invertDelta ? !up : up;

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
      <span style={{ fontSize: LABEL_PX, color: theme.mutedInk }}>{label}</span>
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
            fontSize: EMPHASIS_PX,
            color: good ? theme.positive : theme.negative,
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
