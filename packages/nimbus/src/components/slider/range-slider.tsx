import { SliderBase } from "./slider-base";
import type { SliderBaseProps, RangeSliderProps } from "./slider.types";

/**
 * # RangeSlider
 *
 * A two-thumb slider for selecting a `[min, max]` numeric range within bounds.
 * Wraps React Aria's Slider with two thumbs; the thumbs cannot cross. Each
 * thumb's current value is shown in its own tooltip while it's hovered,
 * focused, or dragged.
 *
 * Each thumb needs its own accessible name — provide `thumbLabels` (e.g.
 * `["Minimum price", "Maximum price"]`); when omitted, the thumbs fall back
 * to localized "Minimum" / "Maximum" labels rather than being left
 * anonymous. The control as a whole still needs an accessible name of its
 * own too: provide an `aria-label` (or use inside `FormField`), same as
 * `Slider`.
 */
export const RangeSlider = (props: RangeSliderProps) => {
  // SliderBaseProps intentionally widens value/onChange to `number | number[]`
  // so the shared implementation can serve both Slider and RangeSlider; the
  // cast narrows back since RangeSliderProps only ever supplies the tuple arm.
  return <SliderBase {...(props as SliderBaseProps)} />;
};

RangeSlider.displayName = "RangeSlider";
