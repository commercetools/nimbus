import { useState, useRef, useEffect, type CSSProperties } from "react";
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
  // WCAG 2.1 SC 1.4.13 (Content on Hover or Focus): the value tooltip must be
  // dismissible with Escape without moving the pointer or focus. We can't lean
  // on React Aria's built-in tooltip Escape handling because we drive the
  // tooltip's open state ourselves (the tooltip must stay visible during a
  // pointer drag, which React Aria would otherwise close on press). React
  // Aria's internal tooltip state — and the document-level Escape listener it
  // uses to shield ancestors — desyncs from our controlled `isOpen` the moment
  // the value changes (an arrow key makes React Aria close its own state while
  // we keep the tooltip shown), so its shield can't be relied on. We therefore
  // own the tooltip's Escape entirely (effect below): `isDismissed` records the
  // press and suppresses the tooltip for the rest of this hover/focus/drag
  // "session"; once the thumb goes idle it re-arms (first effect) so a later
  // hover or focus reopens it.
  const [isDismissed, setIsDismissed] = useState(false);
  const wantsOpen = isHovered || isFocused || isDragging;
  const isOpen = wantsOpen && !isDismissed;

  useEffect(() => {
    // Re-arm once the thumb is neither hovered, focused, nor dragging, so a
    // fresh interaction shows the tooltip again.
    if (!wantsOpen && isDismissed) setIsDismissed(false);
  }, [wantsOpen, isDismissed]);

  useEffect(() => {
    if (!isOpen) return;
    // Register on `document` in the capture phase — the same way React Aria
    // does — and only while the tooltip is actually visible (`isOpen`), so this
    // fires exactly when there is a tooltip to dismiss. `stopPropagation()`
    // makes a first Escape dismiss only the tooltip, not an enclosing overlay
    // (e.g. a Dialog); once dismissed the tooltip closes, this listener
    // detaches, and the next Escape is free to reach the Dialog. Inferring the
    // dismissal from `onOpenChange` instead is unreliable — React Aria also
    // fires it on hover cooldown and value change, which would misread as
    // dismissals.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsDismissed(true);
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen]);

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
  const baseTicks =
    showTicks && resolvedTickStep > 0
      ? Array.from(
          { length: Math.floor((maxValue - minValue) / resolvedTickStep) + 1 },
          (_, i) => minValue + i * resolvedTickStep
        )
      : [];
  // The thumb can always travel to maxValue, so it carries a tick even when the
  // range isn't an exact multiple of tickStep — the final interval before
  // maxValue is then shorter than tickStep. Skip when maxValue already lands on
  // the last multiple (epsilon absorbs float drift, e.g. 0.1 steps).
  const ticks =
    baseTicks.length > 0 &&
    maxValue - baseTicks[baseTicks.length - 1] > resolvedTickStep * 1e-9
      ? [...baseTicks, maxValue]
      : baseTicks;

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
              // The filled region as track fractions (0–1): from the lowest
              // thumb (or the track start, for a single thumb) to the highest.
              // Drives two things — the fill cup below, and per-tick
              // `data-filled` so a tick sitting on the fill can flip to a
              // color that contrasts with the primary fill (see the recipe).
              const thumbPercents = state.values.map((_, i) =>
                state.getThumbPercent(i)
              );
              const lowFrac =
                thumbPercents.length > 1 ? Math.min(...thumbPercents) : 0;
              const highFrac = Math.max(...thumbPercents);

              // The fill reaches each thumb's OUTER edge, not the value point,
              // so it sits behind the whole knob — that paints the thin primary
              // ring through the thumb border and, at value 0, keeps a visible
              // sliver instead of a bare knob. Both variants share one inset
              // geometry (the interactive track is inset by the thumb radius —
              // see the recipe), so React Aria positions the thumbs
              // natively-contained and the fill only needs a fixed thumb-radius
              // cup on each thumb-bearing end. In the inset track's own units
              // (100% = the inset width): start half a diameter before the low
              // thumb, span the thumb gap plus one full diameter. A single
              // slider's low end is the track start (lowFrac 0), so the cup
              // there reaches the bar's rounded cap. Must be inline — React Aria
              // sets the fill's main-axis size inline, which beats a recipe
              // class. Logical `insetInlineStart` (RTL-safe) for horizontal,
              // physical `bottom` for vertical, as React Aria's own SliderFill.
              const r = "var(--slider-thumb-size) / 2";
              const start = `calc(${lowFrac} * 100% - ${r})`;
              const span = `calc(${highFrac - lowFrac} * 100% + var(--slider-thumb-size))`;
              const fillStyle: CSSProperties =
                orientation === "vertical"
                  ? { bottom: start, height: span }
                  : { insetInlineStart: start, width: span };
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
                    // A tick sitting exactly on a thumb's value is painted over
                    // the white knob, not the fill (ticks render above the
                    // thumbs), so `colorPalette.contrast` — tuned for the fill —
                    // can vanish (white-on-white in light mode). Flag it so the
                    // recipe can give it a knob-aware color instead. Compared in
                    // value space (exact, no pixel guesswork); the recipe's
                    // on-thumb rule overrides the on-fill one via source order.
                    const isOnThumb = state.values.some(
                      (v) => Math.abs(v - tickValue) <= 1e-9
                    );
                    const tickPositionStyle =
                      orientation === "vertical"
                        ? { bottom: pos }
                        : { insetInlineStart: pos };
                    return (
                      <SliderTickSlot
                        key={tickValue}
                        data-slot="tick"
                        data-filled={isFilled || undefined}
                        data-on-thumb={isOnThumb || undefined}
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
