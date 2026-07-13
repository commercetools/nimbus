import { useState, useRef, type CSSProperties } from "react";
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
import { useLocalizedStringFormatter } from "@/hooks";
import {
  SliderRootSlot,
  SliderTrackSlot,
  SliderFillSlot,
  SliderThumbSlot,
  SliderTickSlot,
} from "./slider.slots";
import { sliderSlotRecipe } from "./slider.recipe";
import { sliderMessagesStrings } from "./slider.messages";
import type { SliderBaseProps } from "./slider.types";

/**
 * A single slider thumb wrapped in a value tooltip that is open while the thumb
 * is hovered, keyboard-focused, or being dragged. Each thumb owns its own
 * hover/focus state so RangeSlider's two thumbs are independent.
 */
type SliderValueThumbProps = {
  index: number;
  thumbLabel?: string;
  /**
   * Fallback `aria-labelledby` for a thumb that has no `thumbLabel` of its
   * own (the sole thumb of a single-value Slider). React Aria always
   * composes the thumb's default `aria-labelledby` from the slider group's
   * own id, which only resolves to a name when the group itself carries a
   * literal `aria-label` — per the WAI-ARIA accname algorithm, a referenced
   * node's *own* `aria-labelledby` is not followed recursively, so when the
   * group is named indirectly (e.g. FormField's `<label>`), that chain
   * resolves to nothing. Forwarding the same id(s) here gives the thumb a
   * direct, one-hop reference to the real label element.
   */
  thumbAriaLabelledBy?: string;
  valueLabel: string;
  isDragging: boolean;
};

const SliderValueThumb = ({
  index,
  thumbLabel,
  thumbAriaLabelledBy,
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
          aria-labelledby={thumbAriaLabelledBy}
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
  // minValue/maxValue/step/isDisabled/isInvalid are pulled off `props`
  // directly (rather than off `extractStyleProps`'s second return value
  // below) because that "rest" tuple member is typed `Omit<T, string>`,
  // which collapses to `{}` for any plain object — reading a named field
  // off it would not type-check.
  //
  // Note: React Aria's Slider has no `isInvalid`/validation-state concept
  // (unlike text-style inputs), so `isInvalid` is a Nimbus-only prop (see
  // slider.types.ts) that is deliberately excluded from `restProps` below —
  // it must never reach `RaSlider`, only the `data-invalid` seam.
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
    isInvalid,
    orientation = "horizontal",
    ...restProps
  } = props;

  // The `enclosed` variant needs the fill widened to cup each thumb (see the
  // render-prop below); every other variant uses React Aria's default fill.
  const isEnclosed = props.variant === "enclosed";

  const recipe = useSlotRecipe({ recipe: sliderSlotRecipe });
  const [recipeProps, recipeLessProps] = recipe.splitVariantProps({
    size,
    ...restProps,
  });
  const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const msg = useLocalizedStringFormatter(sliderMessagesStrings);
  const defaultThumbLabels = [
    msg.format("minimumThumb"),
    msg.format("maximumThumb"),
  ];
  // Single sliders are named by their own aria-label/FormField label, so
  // only RangeSlider's two thumbs (total > 1) get localized defaults.
  const resolveThumbLabel = (index: number, total: number) =>
    thumbLabels?.[index] ?? (total > 1 ? defaultThumbLabels[index] : undefined);

  // Fallback accessible-name reference for a thumb with no `thumbLabel` of
  // its own — see the `thumbAriaLabelledBy` doc on SliderValueThumb below.
  // `aria-label` isn't forwarded here because the group's own literal
  // `aria-label` already resolves in one hop through the thumb's default
  // group-id reference; only the `aria-labelledby` chain is non-transitive.
  const groupAriaLabelledBy = props["aria-labelledby"];

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
    "data-invalid": isInvalid || undefined,
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
        orientation={orientation}
      >
        <SliderTrackSlot asChild data-slot="track">
          <RaSliderTrack>
            {({ state }) => {
              // `enclosed` fill: reach each thumb's OUTER edge, not the value
              // point, so the fill sits behind the whole knob — that is what
              // paints the thin primary ring through the thumb's transparent
              // border, and at value 0 keeps a visible sliver instead of a bare
              // knob. The interactive track is already inset by the thumb
              // radius (see the recipe), so React Aria positions the thumbs
              // natively-contained; the fill only needs a fixed radius of cup
              // on each thumb-bearing end. In this inset track's own units
              // (100% = the inset width) that is: start half a diameter before
              // the low thumb, span the thumb gap plus one full diameter. A
              // single slider's low end is the track start, so lowFrac is 0 and
              // the cup there simply reaches the bar's rounded cap. Must be
              // inline: React Aria sets the fill's main-axis size inline, which
              // beats a recipe class. Uses logical `insetInlineStart` (RTL-safe)
              // for horizontal and physical `bottom` for vertical, as React
              // Aria's own SliderFill does.
              // The filled region as track fractions (0–1): from the lowest
              // thumb (or the track start, for a single thumb) to the highest.
              // Drives two things — the enclosed fill cup below, and per-tick
              // `data-filled` so a tick sitting on the fill can flip to a
              // color that contrasts with the primary fill (see the recipe).
              const thumbPercents = state.values.map((_, i) =>
                state.getThumbPercent(i)
              );
              const lowFrac =
                thumbPercents.length > 1 ? Math.min(...thumbPercents) : 0;
              const highFrac = Math.max(...thumbPercents);

              let fillStyle: CSSProperties | undefined;
              if (isEnclosed) {
                const r = "var(--slider-thumb-size) / 2";
                const start = `calc(${lowFrac} * 100% - ${r})`;
                const span = `calc(${highFrac - lowFrac} * 100% + var(--slider-thumb-size))`;
                fillStyle =
                  orientation === "vertical"
                    ? { bottom: start, height: span }
                    : { insetInlineStart: start, width: span };
              }
              return (
                <>
                  <SliderFillSlot asChild data-slot="fill">
                    <RaSliderFill style={fillStyle} />
                  </SliderFillSlot>
                  {state.values.map((_, i) => {
                    const thumbLabel = resolveThumbLabel(
                      i,
                      state.values.length
                    );
                    return (
                      <SliderValueThumb
                        key={i}
                        index={i}
                        thumbLabel={thumbLabel}
                        thumbAriaLabelledBy={
                          thumbLabel === undefined
                            ? groupAriaLabelledBy
                            : undefined
                        }
                        valueLabel={state.getThumbValueLabel(i)}
                        isDragging={state.isThumbDragging(i)}
                      />
                    );
                  })}
                  {ticks.map((tickValue) => {
                    const frac = (tickValue - minValue) / (maxValue - minValue);
                    // A tick is centered on this point via its translate in the
                    // recipe. Mirrors how React Aria's own `SliderFill` anchors:
                    // horizontal uses the logical `insetInlineStart` so it flips
                    // under RTL, vertical anchors from `bottom` so the minimum
                    // sits at the bottom. Plain percent for every variant — in
                    // `enclosed` the interactive track is inset by the thumb
                    // radius (recipe), so `frac%` of that track already lands on
                    // the contained thumb centerline and a click there maps back
                    // to the same value.
                    const pos = `${frac * 100}%`;
                    // Mark ticks that land on the fill so the recipe can flip
                    // them to a fill-contrasting color. The epsilon absorbs
                    // floating-point drift at the boundary (a tick exactly under
                    // a thumb), where `frac` and the thumb percent share the same
                    // formula but may round differently.
                    const isFilled =
                      frac >= lowFrac - 1e-9 && frac <= highFrac + 1e-9;
                    const tickPositionStyle =
                      orientation === "vertical"
                        ? { bottom: pos }
                        : { insetInlineStart: pos };
                    return (
                      <SliderTickSlot
                        key={tickValue}
                        data-slot="tick"
                        data-filled={isFilled || undefined}
                        style={tickPositionStyle}
                      />
                    );
                  })}
                </>
              );
            }}
          </RaSliderTrack>
        </SliderTrackSlot>
      </RaSlider>
    </SliderRootSlot>
  );
};

SliderBase.displayName = "SliderBase";
