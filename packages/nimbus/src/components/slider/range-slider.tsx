import { SliderBase } from "./slider-base";
import type { SliderBaseProps, RangeSliderProps } from "./slider.types";

/**
 * # RangeSlider
 *
 * A two-thumb slider for selecting a `[min, max]` numeric range within bounds.
 * Wraps React Aria's Slider with two thumbs; the thumbs cannot cross.
 */
export const RangeSlider = (props: RangeSliderProps) => {
  // SliderBaseProps intentionally widens value/onChange to `number | number[]`
  // so the shared implementation can serve both Slider and RangeSlider; the
  // cast narrows back since RangeSliderProps only ever supplies the tuple arm.
  return <SliderBase {...(props as SliderBaseProps)} />;
};

RangeSlider.displayName = "RangeSlider";
