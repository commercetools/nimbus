import { useNumberFormatter } from "react-aria";
import type { TooltipContentProps } from "recharts";
import { useChartContext } from "../chart.context";
import {
  ChartLegendSwatchSlot,
  ChartTooltipItemSlot,
  ChartTooltipLabelSlot,
  ChartTooltipSlot,
  ChartTooltipValueSlot,
} from "../chart.slots";

/**
 * # ChartTooltip
 *
 * Content for the Recharts `<Tooltip content={...} />`. It is a live region
 * (`role="status"`, `aria-live="assertive"`), so a screen reader announces the
 * active data point. Each row shows the swatch, label and value of a series,
 * read from the resolved chart config. Entries that are not in the config
 * are left out.
 *
 * @example
 * ```tsx
 * <Tooltip content={<ChartTooltip />} />
 * ```
 */
export const ChartTooltip = (
  props: Partial<TooltipContentProps<number | string, string | number>>
) => {
  const { active, payload, label } = props;
  const { series } = useChartContext();
  const numberFormatter = useNumberFormatter();

  if (!active || !payload || payload.length === 0) return null;

  const rows = payload.flatMap((entry) => {
    const item =
      series.find((s) => s.key === String(entry.dataKey)) ??
      series.find((s) => s.key === String(entry.name));
    return item ? [{ item, value: entry.value }] : [];
  });

  if (rows.length === 0) return null;

  return (
    <ChartTooltipSlot role="status" aria-live="assertive">
      {label !== undefined && label !== "" && (
        <ChartTooltipLabelSlot>{String(label)}</ChartTooltipLabelSlot>
      )}
      {rows.map(({ item, value }) => (
        <ChartTooltipItemSlot key={item.key}>
          <ChartLegendSwatchSlot
            aria-hidden="true"
            style={{ color: item.color }}
          />
          <span>{item.label}</span>
          <ChartTooltipValueSlot>
            {typeof value === "number"
              ? numberFormatter.format(value)
              : String(value)}
          </ChartTooltipValueSlot>
        </ChartTooltipItemSlot>
      ))}
    </ChartTooltipSlot>
  );
};

ChartTooltip.displayName = "ChartTooltip";
