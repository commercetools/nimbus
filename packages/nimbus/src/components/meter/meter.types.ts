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
   * focus of the view. Also sets the default text style of the parts:
   * `sm` → `xs`, `md` → `sm`, `lg` → `md`. Use the `textStyle` style prop
   * on Root or on one part to change the text.
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusMeter">["size"];
  /**
   * Where the parts are placed. `stacked` puts label and value on one line
   * above the track; `inline` puts label, track and value on one line. The
   * order in which the parts are written does not change the result.
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
  Omit<AriaMeterProps, "valueLabel" | "label"> & {
    [key: `data-${string}`]: string;
    translate?: "yes" | "no";
  };

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
   * `maxValue`. Negative values are treated as `0`, and segments
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
 * A value from which the fill of a single-value meter changes color.
 */
export type MeterThreshold = {
  /**
   * The threshold applies when the value is greater than or equal to this
   * number, in the same unit as `value`
   */
  from: number;
  /**
   * Color palette of the fill from this threshold on
   */
  colorPalette: NimbusColorPalette;
};

/**
 * A meter shows either one `value` or several `segments`, never both.
 */
type MeterDataProps =
  | {
      /**
       * The measured value. A value outside `minValue`–`maxValue` is clamped
       * to the range, like the native `<meter>` element.
       * @default 0
       */
      value?: number;
      segments?: never;
      /**
       * Lower bound of the range
       * @default 0
       */
      minValue?: number;
      /**
       * Changes the fill color when the value reaches a threshold, for
       * example `warning` from 80 and `critical` from 95. The threshold with
       * the highest `from` that the value reaches wins; below all thresholds,
       * `colorPalette` is used. The order in the array does not matter.
       */
      thresholds?: MeterThreshold[];
    }
  | {
      value?: never;
      /**
       * Several measured parts of one total, drawn in array order inside
       * one track. Render `Meter.Legend` to show the name and value of each
       * segment. The parts add up to the total.
       */
      segments: MeterSegment[];
      /**
       * Lower bound of the range. With `segments` it is always `0`, so the
       * parts add up to the total.
       * @default 0
       */
      minValue?: 0;
      thresholds?: never;
    };

/**
 * A segment as `Meter.Track` and `Meter.Legend` draw it.
 */
export type MeterResolvedSegment = MeterSegment & {
  /** Amount that is drawn, after negative values and overflow are cut */
  clampedValue: number;
  /** Width in percent of the track */
  widthPercent: number;
  /** Number of segment gaps this segment gives up, so the fill ends at the value */
  gapShare: number;
  /** Formatted `clampedValue`, as shown in the legend */
  formattedValue: string;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type MeterRootProps = OmitInternalProps<
  MeterRootSlotProps,
  "value" | "children" | "minValue"
> &
  MeterDataProps & {
    /**
     * The meter parts: `Meter.Label`, `Meter.Value`, `Meter.Track` and
     * `Meter.Legend`
     */
    children?: React.ReactNode;
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
     * Replaces the formatted total in `Meter.Value` and in the text
     * announced to assistive technology (e.g. "50 of 100 GB")
     */
    valueLabel?: string;
    /**
     * Color palette of the fill in single-value mode, below all
     * `thresholds`. Use a semantic palette (`positive`, `warning`,
     * `critical`) to communicate a state.
     * @default "primary"
     */
    colorPalette?: NimbusColorPalette;
  };

export type MeterLabelProps = OmitInternalProps<MeterLabelSlotProps> & {
  /**
   * Ref forwarding to the label element
   */
  ref?: React.Ref<HTMLSpanElement>;
};

export type MeterValueProps = OmitInternalProps<
  MeterValueSlotProps,
  "children"
> & {
  /**
   * Ref forwarding to the value text element
   */
  ref?: React.Ref<HTMLSpanElement>;
};

export type MeterTrackProps = OmitInternalProps<
  MeterTrackSlotProps,
  "children"
> & {
  /**
   * Ref forwarding to the track element
   */
  ref?: React.Ref<HTMLDivElement>;
};

export type MeterLegendProps = OmitInternalProps<
  MeterLegendSlotProps,
  "children"
> & {
  /**
   * Ref forwarding to the legend list element
   */
  ref?: React.Ref<HTMLUListElement>;
};

// ============================================================
// CONTEXT TYPES
// ============================================================

/**
 * Values that `Meter.Root` computes and the parts show
 */
export type MeterContextValue = {
  /** Whether the meter shows `segments` (not a single `value`) */
  isSegmented: boolean;
  /** Segments to draw; a single value is one segment without a palette */
  items: MeterResolvedSegment[];
  /** Formatted total, or `valueLabel` when it is set */
  totalText: string;
  /**
   * Registers a mounted `Meter.Legend`, so Root can warn about segments
   * without a legend. Returns the function that unregisters it.
   */
  registerLegend: () => () => void;
};
