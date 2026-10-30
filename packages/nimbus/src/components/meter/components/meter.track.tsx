import { MeterSegmentSlot, MeterTrackSlot } from "../meter.slots";
import type { MeterTrackProps } from "../meter.types";
import { useMeterContext } from "./meter.context";

/**
 * CSS width of a segment: its share of the track, minus its share of the gaps
 * between segments, so the fill ends exactly at the value
 */
const getSegmentWidth = (widthPercent: number, gapShare: number) =>
  gapShare > 0
    ? `calc(${widthPercent}% - ${Number(gapShare.toFixed(4))} * var(--meter-segment-gap))`
    : `${widthPercent}%`;

/**
 * # Meter.Track
 *
 * The bar. Draws the value, or each segment in array order.
 *
 * @supportsStyleProps
 */
export const MeterTrack = (props: MeterTrackProps) => {
  const { ref, ...restProps } = props;
  const { items } = useMeterContext();

  return (
    <MeterTrackSlot ref={ref} {...restProps}>
      {items.map((item) =>
        item.widthPercent > 0 ? (
          <MeterSegmentSlot
            key={item.id}
            colorPalette={item.colorPalette}
            style={{ width: getSegmentWidth(item.widthPercent, item.gapShare) }}
          />
        ) : null
      )}
    </MeterTrackSlot>
  );
};

MeterTrack.displayName = "Meter.Track";
