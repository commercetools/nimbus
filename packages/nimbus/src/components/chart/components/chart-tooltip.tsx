import { useEffect } from "react";
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

/** Props of `ChartTooltip`: the content props that Recharts passes, plus `nameKey` */
export type ChartTooltipProps = Partial<
  TooltipContentProps<number | string, string | number>
> & {
  /**
   * Key of the data field that holds the category name. Set it for charts
   * whose payload entries carry no category name (radial charts name them
   * after the value key and use the row index as label). The category is
   * then read from the data row, and the label is left out.
   */
  nameKey?: string;
};

/**
 * # ChartTooltip
 *
 * Content for the Recharts `<Tooltip content={...} />`. A screen reader
 * announces the active data point through the polite live region of the chart
 * root, so the visible tooltip is hidden from assistive technology. Each row
 * shows the swatch, label and value of a series, read from the resolved chart
 * config. Entries that are not in the config are left out.
 *
 * @example
 * ```tsx
 * <Tooltip content={<ChartTooltip />} />
 * ```
 */
export const ChartTooltip = (props: ChartTooltipProps) => {
  const { active, payload, nameKey } = props;
  // With `nameKey`, the label would be the row index, not a name
  const label = nameKey === undefined ? props.label : undefined;
  const { series, announce } = useChartContext();
  const numberFormatter = useNumberFormatter();

  const rows =
    !active || !payload
      ? []
      : payload.flatMap((entry) => {
          const category =
            nameKey === undefined
              ? undefined
              : (entry.payload as Record<string, unknown> | undefined)?.[
                  nameKey
                ];
          const item =
            (category === undefined
              ? undefined
              : series.find((s) => s.key === String(category))) ??
            series.find((s) => s.key === String(entry.dataKey)) ??
            series.find((s) => s.key === String(entry.name));
          return item ? [{ item, value: entry.value }] : [];
        });

  const formatValue = (value: unknown) =>
    typeof value === "number" ? numberFormatter.format(value) : String(value);
  const text = [
    label === undefined || label === "" ? "" : String(label),
    ...rows.map(({ item, value }) => `${item.label} ${formatValue(value)}`),
  ]
    .filter(Boolean)
    .join(", ");
  const announcement = rows.length === 0 ? "" : text;

  useEffect(() => {
    announce(announcement);
  }, [announce, announcement]);
  // Clear the region when the tooltip goes away
  useEffect(() => () => announce(""), [announce]);

  if (rows.length === 0) return null;

  return (
    <ChartTooltipSlot aria-hidden="true">
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
          <ChartTooltipValueSlot>{formatValue(value)}</ChartTooltipValueSlot>
        </ChartTooltipItemSlot>
      ))}
    </ChartTooltipSlot>
  );
};

ChartTooltip.displayName = "ChartTooltip";
