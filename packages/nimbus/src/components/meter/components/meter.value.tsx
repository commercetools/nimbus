import { MeterValueSlot } from "../meter.slots";
import type { MeterValueProps } from "../meter.types";
import { useMeterContext } from "./meter.context";

/**
 * # Meter.Value
 *
 * Formatted total of the meter, or `valueLabel` of Meter.Root when it is set.
 *
 * @supportsStyleProps
 */
export const MeterValue = (props: MeterValueProps) => {
  const { ref, ...restProps } = props;
  const { totalText } = useMeterContext();

  return (
    <MeterValueSlot ref={ref} {...restProps}>
      {totalText}
    </MeterValueSlot>
  );
};

MeterValue.displayName = "Meter.Value";
