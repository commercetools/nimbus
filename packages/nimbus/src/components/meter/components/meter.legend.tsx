import { useLayoutEffect } from "react";
import {
  MeterLegendItemSlot,
  MeterLegendSlot,
  MeterLegendSwatchSlot,
} from "../meter.slots";
import type { MeterLegendProps } from "../meter.types";
import { useMeterContext } from "./meter.context";

/**
 * # Meter.Legend
 *
 * Color, name and value of each segment. Renders nothing for a single value.
 *
 * @supportsStyleProps
 */
export const MeterLegend = (props: MeterLegendProps) => {
  const { ref, ...restProps } = props;
  const { isSegmented, items, registerLegend } = useMeterContext();

  // Lets Meter.Root know that segments have a legend
  useLayoutEffect(() => registerLegend(), [registerLegend]);

  if (!isSegmented || items.length === 0) return null;

  return (
    // Hidden from assistive tech: the meter's aria-valuetext already
    // announces the same information
    <MeterLegendSlot ref={ref} {...restProps} aria-hidden="true">
      {items.map((item) => (
        <MeterLegendItemSlot key={item.id}>
          <MeterLegendSwatchSlot colorPalette={item.colorPalette} />
          <span>{item.label}</span>
          <span>{item.formattedValue}</span>
        </MeterLegendItemSlot>
      ))}
    </MeterLegendSlot>
  );
};

MeterLegend.displayName = "Meter.Legend";
