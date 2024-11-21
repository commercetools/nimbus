"use client";

import * as Slider from "@radix-ui/react-slider";
import type { DemoSliderProps } from ".";
import {
  StyledSliderRoot,
  StyledSliderTrack,
  StyledSliderRange,
  StyledSliderThumb,
} from "./slider.parts";

export const RadixSlider = (props: DemoSliderProps) => {
  const rootProps = {
    value: [props.value],
    onValueChange: (arr: number[]) => props.onValueChange(arr[0]),
  };

  return (
    <Slider.Root asChild {...rootProps}>
      <StyledSliderRoot colorPalette="primary">
        <Slider.Track asChild>
          <StyledSliderTrack data-part="track">
            <Slider.Range asChild>
              <StyledSliderRange data-part="range" />
            </Slider.Range>
          </StyledSliderTrack>
        </Slider.Track>
        <Slider.Thumb asChild>
          <StyledSliderThumb />
        </Slider.Thumb>
      </StyledSliderRoot>
    </Slider.Root>
  );
};
