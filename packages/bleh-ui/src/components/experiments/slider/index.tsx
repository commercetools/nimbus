export type DemoSliderProps = {
  min: number;
  max: number;
  value: number;
  step: number;
  onValueChange: (value: number) => void;
};

export * from "./react-aria-slider.tsx";
export * from "./radix-slider.tsx";
