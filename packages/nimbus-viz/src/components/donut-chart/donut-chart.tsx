import { useMemo, useState } from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { ChartContainer } from "../../chart/chart-container";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact, formatPercent } from "../../chart/format";
import type { CategoryDatum } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface DonutChartProps {
  width: number;
  height: number;
  data: CategoryDatum[];
  ariaLabel?: string;
}

/**
 * Part-to-whole as a donut. Color is identity here (one hue per slice, fixed
 * order) — legitimate, unlike magnitude bars. The hole shows the total, or the
 * hovered slice's share.
 */
export function DonutChart({
  width,
  height,
  data,
  ariaLabel,
}: DonutChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<string | null>(null);
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const color = useEntityColors(
    useMemo(() => data.map((d) => d.category), [data])
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const colorFor = (i: number) => color(data[i].category);
  const active = hover ? data.find((d) => d.category === hover) : null;
  const table = {
    columns: ["Category", "Value", "Share"],
    rows: data.map((d) => [
      d.category,
      d.value,
      formatPercent(total ? d.value / total : 0),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      ariaLabel={ariaLabel ?? `Donut chart of ${data.length} categories`}
      legend={data.map((d, i) => ({ label: d.category, color: colorFor(i) }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const radius = Math.max(0, Math.min(innerWidth, innerHeight) / 2);
        const inner = radius * 0.62;
        return (
          <Group top={innerHeight / 2} left={innerWidth / 2}>
            <Pie<CategoryDatum>
              data={data}
              pieValue={(d) => d.value}
              outerRadius={radius}
              innerRadius={inner}
              padAngle={0.02}
              cornerRadius={3}
            >
              {(pie) =>
                pie.arcs.map((arc) => {
                  const i = data.indexOf(arc.data);
                  const dimmed = hover != null && hover !== arc.data.category;
                  return (
                    <path
                      key={arc.data.category}
                      d={pie.path(arc) ?? ""}
                      fill={colorFor(i)}
                      opacity={dimmed ? 0.4 : 1}
                      onMouseEnter={() => setHover(arc.data.category)}
                      onMouseLeave={() => setHover(null)}
                    />
                  );
                })
              }
            </Pie>
            <text
              textAnchor="middle"
              dy={-2}
              style={emText(20)}
              fontWeight={700}
              fill={theme.ink}
            >
              {active
                ? formatPercent(active.value / total)
                : formatCompact(total)}
            </text>
            <text
              textAnchor="middle"
              dy={16}
              style={emText(11)}
              fill={theme.mutedInk}
            >
              {active ? active.category : "Total"}
            </text>
          </Group>
        );
      }}
    </ChartContainer>
  );
}
