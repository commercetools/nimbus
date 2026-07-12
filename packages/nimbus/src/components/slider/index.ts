export { Slider } from "./slider";
// TODO(Task 3): restore once ./range-slider exists — re-exporting a
// not-yet-created module breaks Vite's import analysis for the *entire*
// package barrel (every story test fails to resolve), not just typecheck.
// export { RangeSlider } from "./range-slider";
export type { SliderProps, RangeSliderProps } from "./slider.types";
