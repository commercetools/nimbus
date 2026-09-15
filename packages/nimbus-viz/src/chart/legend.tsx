import type { ReactNode } from "react";
import { useChartTheme } from "../theme";
import { CHART_FONT_STACK, LABEL_PX } from "./typography";

export interface LegendItem {
  label: string;
  color: string;
}

export interface LegendProps {
  items: LegendItem[];
  /**
   * Escape hatch for a custom item render (a different marker shape, a
   * value/count beside the label, a click-to-toggle affordance…). Given one
   * `LegendItem` and its index; return the full `<li>` content — the default
   * swatch + label is not merged in, so re-render the label if you still
   * want it. Omit for the default swatch + label every chart uses today.
   */
  renderItem?: (item: LegendItem, index: number) => ReactNode;
}

/**
 * A minimal categorical legend. Present whenever ≥2 series are drawn, so series
 * identity is never carried by color alone. Text uses ink tokens, never the
 * series color.
 */
export function Legend({ items, renderItem }: LegendProps) {
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
        fontSize: LABEL_PX,
        lineHeight: 1.4,
        fontFamily: CHART_FONT_STACK,
        color: theme.mutedInk,
      }}
    >
      {items.map((item, i) => (
        <li
          key={item.label}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          {renderItem ? (
            renderItem(item, i)
          ) : (
            <>
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
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
