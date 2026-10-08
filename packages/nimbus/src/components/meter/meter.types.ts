import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { AriaMeterProps } from "react-aria";
import type { NimbusColorPalette } from "@/type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type MeterRecipeProps = {
  /**
   * Thickness of the bar: `sm` (4px) for dense contexts like tables,
   * `md` (8px) for standard content, `lg` (12px) when the meter is the main
   * focus of the view
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusMeter">["size"];
  /**
   * Text style of the label, value and legend. `inherit` takes the text
   * style of the surrounding content. With a responsive `size`, the text
   * uses `sm` unless `textStyle` is set.
   * @default follows `size`: `sm` → `xs`, `md` → `sm`, `lg` → `md`
   */
  textStyle?: SlotRecipeProps<"nimbusMeter">["textStyle"];
  /**
   * Layout configuration for label and value positioning
   * @default "stacked"
   */
  layout?: SlotRecipeProps<"nimbusMeter">["layout"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type MeterRootSlotProps = Omit<
  HTMLChakraProps<"div", MeterRecipeProps>,
  "translate"
> &
  Omit<AriaMeterProps, "valueLabel"> & {
    [key: `data-${string}`]: string;
    translate?: "yes" | "no";
  };

export type MeterHeaderSlotProps = HTMLChakraProps<"div">;
export type MeterLabelSlotProps = HTMLChakraProps<"span">;
export type MeterValueSlotProps = HTMLChakraProps<"span">;
export type MeterTrackSlotProps = HTMLChakraProps<"div">;
export type MeterSegmentSlotProps = HTMLChakraProps<"div">;
export type MeterLegendSlotProps = HTMLChakraProps<"ul">;
export type MeterLegendItemSlotProps = HTMLChakraProps<"li">;
export type MeterLegendSwatchSlotProps = HTMLChakraProps<"span">;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * One measured part of a multi-segment meter.
 */
export type MeterSegment = {
  /**
   * Unique identifier of the segment, used as React key
   */
  id: string;
  /**
   * Human-readable name of the segment, shown in the legend and
   * announced to assistive technology
   */
  label: string;
  /**
   * Amount this segment contributes to the meter, in the same unit as
   * `minValue`/`maxValue`. Negative values are treated as `0`, and segments
   * are cut where the total reaches `maxValue`. The legend and the text
   * announced to assistive technology show the amount that is drawn.
   */
  value: number;
  /**
   * Color palette of the segment. When omitted, the next color of the
   * default segment color sequence is used.
   */
  colorPalette?: NimbusColorPalette;
};

/**
 * A meter shows either one `value` or several `segments`, never both.
 */
type MeterValueProps =
  | {
      /**
       * The measured value. A value outside `minValue`–`maxValue` is clamped
       * to the range, like the native `<meter>` element.
       * @default 0
       */
      value?: number;
      segments?: never;
    }
  | {
      value?: never;
      /**
       * Several measured parts of one total, drawn in array order inside
       * one track. A legend is rendered for them automatically.
       *
       * Segment values are counted from `minValue`, but the total includes
       * it: with `minValue={10}` and segments `30` and `20`, the total is
       * `60`. Keep `minValue` at `0` when the parts should add up to the
       * total.
       */
      segments: MeterSegment[];
    };

// ============================================================
// MAIN PROPS
// ============================================================

export type MeterProps = OmitInternalProps<
  MeterRootSlotProps,
  "value" | "children"
> &
  MeterValueProps & {
    /**
     * Ref forwarding to the root element (the element with `role="meter"`)
     */
    ref?: React.Ref<HTMLDivElement>;
    /**
     * Format options for the value text, the legend values and the
     * text announced to assistive technology
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     * @default { style: "percent" }
     */
    formatOptions?: Intl.NumberFormatOptions;
    /**
     * Replaces the formatted total in the visible value text and in the
     * text announced to assistive technology (e.g. "50 of 100 GB")
     */
    valueLabel?: string;
    /**
     * Color palette of the fill in single-value mode. Use a semantic palette
     * (`positive`, `warning`, `critical`) to communicate a state.
     * @default "primary"
     */
    colorPalette?: NimbusColorPalette;
  };
