import { useState, useRef } from "react";
import { useObjectRef } from "react-aria";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import {
  Slider as RaSlider,
  SliderTrack as RaSliderTrack,
  SliderThumb as RaSliderThumb,
  SliderFill as RaSliderFill,
} from "react-aria-components";
import { mergeRefs, extractStyleProps } from "@/utils";
import { Tooltip } from "@/components/tooltip/tooltip";
import {
  SliderRootSlot,
  SliderTrackSlot,
  SliderFillSlot,
  SliderThumbSlot,
  SliderTickSlot,
} from "./slider.slots";
import { sliderSlotRecipe } from "./slider.recipe";
import type { SliderBaseProps } from "./slider.types";

/**
 * A single slider thumb wrapped in a value tooltip that is open while the thumb
 * is hovered, keyboard-focused, or being dragged. Each thumb owns its own
 * hover/focus state so RangeSlider's two thumbs are independent.
 */
type SliderValueThumbProps = {
  index: number;
  thumbLabel?: string;
  valueLabel: string;
  isDragging: boolean;
};

const SliderValueThumb = ({
  index,
  thumbLabel,
  valueLabel,
  isDragging,
}: SliderValueThumbProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isOpen = isHovered || isFocused || isDragging;

  return (
    <Tooltip.Root isOpen={isOpen} onOpenChange={() => {}}>
      <SliderThumbSlot asChild data-slot="thumb">
        <RaSliderThumb
          index={index}
          aria-label={thumbLabel}
          onHoverChange={setIsHovered}
          onFocusChange={setIsFocused}
        />
      </SliderThumbSlot>
      <Tooltip.Content>{valueLabel}</Tooltip.Content>
    </Tooltip.Root>
  );
};

/**
 * Shared internal implementation for Slider and RangeSlider. Renders the full
 * React Aria Slider anatomy for any number of thumbs (driven by state.values),
 * each thumb showing its current value in a tooltip.
 */
export const SliderBase = (props: SliderBaseProps) => {
  // minValue/maxValue/step/isDisabled are pulled off `props` directly (rather
  // than off `extractStyleProps`'s second return value below) because that
  // "rest" tuple member is typed `Omit<T, string>`, which collapses to `{}`
  // for any plain object — reading a named field off it would not type-check.
  //
  // Note: React Aria's Slider has no `isInvalid`/validation-state concept
  // (unlike text-style inputs), so there is nothing to normalize for that.
  const {
    ref: forwardedRef,
    thumbLabels,
    showTicks = false,
    tickStep,
    size,
    minValue = 0,
    maxValue = 100,
    step,
    isDisabled,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ recipe: sliderSlotRecipe });
  const [recipeProps, recipeLessProps] = recipe.splitVariantProps({
    size,
    ...restProps,
  });
  const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const resolvedTickStep = tickStep ?? step ?? 1;
  const ticks =
    showTicks && resolvedTickStep > 0
      ? Array.from(
          { length: Math.floor((maxValue - minValue) / resolvedTickStep) + 1 },
          (_, i) => minValue + i * resolvedTickStep
        )
      : [];

  const stateProps = {
    "data-disabled": isDisabled || undefined,
  };

  return (
    <SliderRootSlot
      asChild
      data-slot="root"
      {...recipeProps}
      {...styleProps}
      {...stateProps}
    >
      <RaSlider
        ref={ref}
        {...functionalProps}
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        isDisabled={isDisabled}
      >
        <SliderTrackSlot asChild data-slot="track">
          <RaSliderTrack>
            {({ state }) => (
              <>
                <SliderFillSlot asChild data-slot="fill">
                  <RaSliderFill />
                </SliderFillSlot>
                {state.values.map((_, i) => (
                  <SliderValueThumb
                    key={i}
                    index={i}
                    thumbLabel={thumbLabels?.[i]}
                    valueLabel={state.getThumbValueLabel(i)}
                    isDragging={state.isThumbDragging(i)}
                  />
                ))}
                {ticks.map((tickValue) => {
                  const percent =
                    ((tickValue - minValue) / (maxValue - minValue)) * 100;
                  return (
                    <SliderTickSlot
                      key={tickValue}
                      data-slot="tick"
                      style={{ left: `${percent}%` }}
                    />
                  );
                })}
              </>
            )}
          </RaSliderTrack>
        </SliderTrackSlot>
      </RaSlider>
    </SliderRootSlot>
  );
};

SliderBase.displayName = "SliderBase";
