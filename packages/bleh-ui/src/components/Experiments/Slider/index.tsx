export type DemoSliderProps = {
  min: number;
  max: number;
  value: number;
  step: number;
  onValueChange: (value: number) => void;
};

export * from "./ReactAriaSlider";
export * from "./RadixSlider";
