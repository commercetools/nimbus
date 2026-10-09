import {
  MeterRoot,
  MeterLabel,
  MeterValue,
  MeterTrack,
  MeterLegend,
} from "./components";

/**
 * Meter
 * ============================================================
 * Displays a measured value within a known range, such as storage used or a
 * quota consumed. Use ProgressBar instead to show the progress of a task.
 *
 * Meter.Root holds all data (`value` or `segments`, range, formatting) and
 * computes one summary for assistive technology. The other parts show that
 * data; render only the parts you need, in any order.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/meter}
 *
 * @example
 * ```tsx
 * <Meter.Root value={62}>
 *   <Meter.Label>Storage</Meter.Label>
 *   <Meter.Value />
 *   <Meter.Track />
 * </Meter.Root>
 * ```
 */
export const Meter = {
  /**
   * # Meter.Root
   *
   * Holds all data of the meter and renders the element with `role="meter"`.
   * Takes `value` for one measurement or `segments` for several parts of one
   * total, and `size` and `layout` for the look. Without Meter.Label, set
   * `aria-label` on Root.
   *
   * @example
   * ```tsx
   * <Meter.Root value={62} size="lg" layout="inline">
   *   <Meter.Label>Storage</Meter.Label>
   *   <Meter.Track />
   *   <Meter.Value />
   * </Meter.Root>
   * ```
   */
  Root: MeterRoot,
  /**
   * # Meter.Label
   *
   * Visible name of the meter. The meter is labelled by it, so assistive
   * technology announces it with the value.
   *
   * @example
   * ```tsx
   * <Meter.Root value={62}>
   *   <Meter.Label>Storage</Meter.Label>
   *   <Meter.Track />
   * </Meter.Root>
   * ```
   */
  Label: MeterLabel,
  /**
   * # Meter.Value
   *
   * Formatted total, using `formatOptions` of Meter.Root, or its `valueLabel`
   * when it is set.
   *
   * @example
   * ```tsx
   * <Meter.Root value={50} formatOptions={{ style: "unit", unit: "gigabyte" }}>
   *   <Meter.Label>Storage</Meter.Label>
   *   <Meter.Value textStyle="xl" />
   *   <Meter.Track />
   * </Meter.Root>
   * ```
   */
  Value: MeterValue,
  /**
   * # Meter.Track
   *
   * The bar. Draws the value, or each segment in array order.
   *
   * @example
   * ```tsx
   * <Meter.Root value={62} aria-label="Storage">
   *   <Meter.Track />
   * </Meter.Root>
   * ```
   */
  Track: MeterTrack,
  /**
   * # Meter.Legend
   *
   * Color, name and value of each segment. Render it whenever Meter.Root has
   * `segments`, so the segments are not told apart by color only. Renders
   * nothing for a single value.
   *
   * @example
   * ```tsx
   * <Meter.Root segments={[
   *   { id: "images", label: "Images", value: 30 },
   *   { id: "videos", label: "Videos", value: 20 },
   * ]}>
   *   <Meter.Label>Storage</Meter.Label>
   *   <Meter.Track />
   *   <Meter.Legend />
   * </Meter.Root>
   * ```
   */
  Legend: MeterLegend,
};
