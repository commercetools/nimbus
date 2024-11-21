import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import type { DemoSliderProps } from ".";

import {
  StyledSliderRoot,
  StyledSliderTrack,
  StyledSliderRange,
  StyledSliderThumb,
} from "./slider.parts";
import { useRef } from "react";
import { Box } from "@chakra-ui/react";

export const ReactAriaSlider = ({
  onValueChange,
  ...props
}: DemoSliderProps) => {
  /* react-aria does not compensate for the width of the thumb
    so we need to calculate offsets ourself
   */
  const rangeProps = {
    left: 0,
    right: 100 - (100 / props.max) * props.value + "%",
  };

  /** */

  const ref = useRef(null);

  const thumbProps = {
    position: "relative",
    top: "4",
    left: (() => {
      /** calculate percentage value */
      const percentVal = (100 / props.max) * props.value;
      const result = 50 - percentVal;

      return `${result}%`;
    })(),
  };

  return (
    <div>
      <StyledSliderRoot colorPalette="primary" asChild>
        <Slider data-part="root" {...props} onChange={onValueChange}>
          <StyledSliderTrack asChild>
            <SliderTrack data-part="track">
              <StyledSliderRange {...rangeProps} />
              <Box asChild>
                <SliderThumb data-part="thumb">
                  <StyledSliderThumb {...thumbProps} ref={ref} />
                </SliderThumb>
              </Box>
            </SliderTrack>
          </StyledSliderTrack>
        </Slider>
      </StyledSliderRoot>
    </div>
  );
};
