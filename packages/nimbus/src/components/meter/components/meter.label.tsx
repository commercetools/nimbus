import { Label as RaLabel } from "react-aria-components";
import { MeterLabelSlot } from "../meter.slots";
import type { MeterLabelProps } from "../meter.types";
import { useMeterContext } from "./meter.context";

/**
 * # Meter.Label
 *
 * Visible name of the meter. The meter is labelled by it through
 * `aria-labelledby`.
 *
 * @supportsStyleProps
 */
export const MeterLabel = (props: MeterLabelProps) => {
  const { ref, children, ...restProps } = props;
  // Throws outside Meter.Root, like the other parts
  useMeterContext();

  return (
    // The ref goes on the slot: React Aria types the label ref as
    // HTMLLabelElement, but inside a meter it renders a <span>
    <MeterLabelSlot ref={ref} {...restProps} asChild>
      <RaLabel>{children}</RaLabel>
    </MeterLabelSlot>
  );
};

MeterLabel.displayName = "Meter.Label";
