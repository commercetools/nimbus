import { SliderBase } from "./slider-base";
import type { SliderBaseProps, SliderProps } from "./slider.types";

/**
 * # Slider
 *
 * A single-thumb slider for selecting one numeric value within a range. Wraps
 * React Aria's Slider with Nimbus styling; the current value is shown in a
 * tooltip on the handle while hovering, focusing, or dragging. Provide an
 * `aria-label` (or use inside `FormField`) for the accessible name.
 */
export const Slider = (props: SliderProps) => {
  // SliderBaseProps intentionally widens value/onChange to `number | number[]`
  // so the shared implementation can serve both Slider and RangeSlider; the
  // cast narrows back since SliderProps only ever supplies the `number` arm.
  return <SliderBase {...(props as SliderBaseProps)} />;
};

Slider.displayName = "Slider";
