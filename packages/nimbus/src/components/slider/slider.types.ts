import type { Ref } from "react";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { SliderProps as RaSliderProps } from "react-aria-components";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================
type SliderRecipeProps = SlotRecipeProps<"nimbusSlider">;

// ============================================================
// SLOT PROPS
// ============================================================
export type SliderRootSlotProps = HTMLChakraProps<"div", SliderRecipeProps>;
export type SliderTrackSlotProps = HTMLChakraProps<"div">;
export type SliderFillSlotProps = HTMLChakraProps<"div">;
export type SliderThumbSlotProps = HTMLChakraProps<"div">;
export type SliderTickSlotProps = HTMLChakraProps<"div">;
export type SliderTickLabelSlotProps = HTMLChakraProps<"div">;

// ============================================================
// SHARED PROPS
// ============================================================
/** React Aria props we specialize per-component or handle ourselves. */
type ExcludedRaSliderProps =
  | "value"
  | "defaultValue"
  | "onChange"
  | "onChangeEnd"
  | "children"
  | "style"
  | "className";

type SliderCommonProps = {
  /** aria-labels for each thumb, indexed by thumb position. */
  thumbLabels?: string[];
  /** Render tick marks along the track. */
  showTicks?: boolean;
  /**
   * Interval between ticks; defaults to `step` when `showTicks` is set. A tick
   * is always placed at `maxValue`, so when `tickStep` does not divide the
   * range evenly the final interval before `maxValue` is shorter than
   * `tickStep`.
   */
  tickStep?: number;
  /**
   * Marks the slider as invalid for styling purposes (surfaced as
   * `data-invalid` on the root element). React Aria's `Slider` has no
   * native validation state, so this is a Nimbus-only prop that is
   * intentionally never forwarded to the underlying `RaSlider` — it
   * exists so `FormField.Input` can clone its React-Aria-named
   * `isInvalid` prop onto the control (see `form-field.root.tsx`).
   */
  isInvalid?: boolean;
  /** Forwarded to the root element. */
  ref?: Ref<HTMLDivElement>;
};

// React's generic `HTMLAttributes<T>` declares `defaultValue` (typed for
// string-ish form controls) on every element, `<div>` included. Left
// un-excluded, that generic field intersects with the number/tuple
// `defaultValue` below and produces an unsatisfiable type for the range
// tuple (it only survives for the single-number Slider by accidental union
// overlap) — exclude it here so each component's own declaration wins.
type SliderSharedProps = OmitInternalProps<
  SliderRootSlotProps,
  "onChange" | "defaultValue"
> &
  Omit<RaSliderProps, ExcludedRaSliderProps> &
  SliderCommonProps;

// ============================================================
// PUBLIC PROPS
// ============================================================
export type SliderProps = SliderSharedProps & {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
};

export type RangeSliderProps = SliderSharedProps & {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
};

// ============================================================
// INTERNAL PROPS (shared implementation accepts the union)
// ============================================================
export type SliderBaseProps = SliderSharedProps & {
  value?: number | number[];
  defaultValue?: number | number[];
  onChange?: (value: number | number[]) => void;
  onChangeEnd?: (value: number | number[]) => void;
};
