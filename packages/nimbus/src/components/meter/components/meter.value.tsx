import { Children, useEffect, useRef } from "react";
import { MeterValueSlot } from "../meter.slots";
import type { MeterValueProps } from "../meter.types";
import { useMeterContext } from "./meter.context";

/**
 * # Meter.Value
 *
 * Formatted total of the meter, or `valueLabel` of Meter.Root when it is set.
 * Children replace the visible text only.
 *
 * @supportsStyleProps
 */
export const MeterValue = (props: MeterValueProps) => {
  const { ref, children, ...restProps } = props;
  const { totalText, hasValueLabel } = useMeterContext();
  // Children that render nothing (`false`, `null`, `undefined`, an empty
  // string) leave the formatted total in place
  const hasChildren = Children.toArray(children).some((child) => child !== "");

  // Logged once per Meter.Value, also when StrictMode runs the effect twice
  const hasWarnedRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!hasChildren || hasValueLabel || hasWarnedRef.current) return;
    hasWarnedRef.current = true;
    console.warn(
      "Meter.Value: children change only the visible text. Set valueLabel on Meter.Root to the same text, so assistive technology announces it too."
    );
  }, [hasChildren, hasValueLabel]);

  return (
    <MeterValueSlot ref={ref} {...restProps}>
      {hasChildren ? children : totalText}
    </MeterValueSlot>
  );
};

MeterValue.displayName = "Meter.Value";
