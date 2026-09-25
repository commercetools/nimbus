import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  MeterRootSlotProps,
  MeterHeaderSlotProps,
  MeterLabelSlotProps,
  MeterValueSlotProps,
  MeterTrackSlotProps,
  MeterSegmentSlotProps,
  MeterLegendSlotProps,
  MeterLegendItemSlotProps,
  MeterLegendSwatchSlotProps,
} from "./meter.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusMeter",
});

// Meter Root - Main container, carries role="meter"
export const MeterRootSlot: SlotComponent<HTMLDivElement, MeterRootSlotProps> =
  withProvider<HTMLDivElement, MeterRootSlotProps>("div", "root");

// Meter Header - Row holding label and value text
export const MeterHeaderSlot: SlotComponent<
  HTMLDivElement,
  MeterHeaderSlotProps
> = withContext<HTMLDivElement, MeterHeaderSlotProps>("div", "header");

// Meter Label - Label text
export const MeterLabelSlot: SlotComponent<
  HTMLSpanElement,
  MeterLabelSlotProps
> = withContext<HTMLSpanElement, MeterLabelSlotProps>("span", "label");

// Meter Value - Formatted value text
export const MeterValueSlot: SlotComponent<
  HTMLSpanElement,
  MeterValueSlotProps
> = withContext<HTMLSpanElement, MeterValueSlotProps>("span", "value");

// Meter Track - Background bar
export const MeterTrackSlot: SlotComponent<
  HTMLDivElement,
  MeterTrackSlotProps
> = withContext<HTMLDivElement, MeterTrackSlotProps>("div", "track");

// Meter Segment - One filled part of the track
export const MeterSegmentSlot: SlotComponent<
  HTMLDivElement,
  MeterSegmentSlotProps
> = withContext<HTMLDivElement, MeterSegmentSlotProps>("div", "segment");

// Meter Legend - List explaining the segments
export const MeterLegendSlot: SlotComponent<
  HTMLUListElement,
  MeterLegendSlotProps
> = withContext<HTMLUListElement, MeterLegendSlotProps>("ul", "legend");

// Meter Legend Item - One entry of the legend
export const MeterLegendItemSlot: SlotComponent<
  HTMLLIElement,
  MeterLegendItemSlotProps
> = withContext<HTMLLIElement, MeterLegendItemSlotProps>("li", "legendItem");

// Meter Legend Swatch - Color sample of a legend entry
export const MeterLegendSwatchSlot: SlotComponent<
  HTMLSpanElement,
  MeterLegendSwatchSlotProps
> = withContext<HTMLSpanElement, MeterLegendSwatchSlotProps>(
  "span",
  "legendSwatch"
);
