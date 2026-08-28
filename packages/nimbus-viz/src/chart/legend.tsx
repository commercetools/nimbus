import { useChartTheme } from "../theme";

export interface LegendItem {
  label: string;
  color: string;
}

/**
 * A minimal categorical legend. Present whenever ≥2 series are drawn, so series
 * identity is never carried by color alone. Text uses ink tokens, never the
 * series color.
 */
export function Legend({ items }: { items: LegendItem[] }) {
  const theme = useChartTheme();
  return (
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        margin: 0,
        padding: 0,
        listStyle: "none",
        font: "12px/1.4 system-ui, sans-serif",
        color: theme.mutedInk,
      }}
    >
      {items.map((item) => (
        <li
          key={item.label}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: item.color,
              display: "inline-block",
            }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
