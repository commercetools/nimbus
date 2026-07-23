import type { SliderSharedProps } from "../../slider.types";

// ============================================================
// PUBLIC PROPS
// ============================================================
/**
 * Props for the `RangeSlider` component — a two-thumb slider selecting a
 * `[min, max]` numeric range. Shares the whole prop surface of `Slider` (via
 * {@link SliderSharedProps}) but specializes `value`/`defaultValue`/`onChange`/
 * `onChangeEnd` to operate on a `[number, number]` tuple.
 */
export type RangeSliderProps = SliderSharedProps & {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
};
