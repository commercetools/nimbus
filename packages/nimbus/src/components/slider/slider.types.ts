import type { ReactNode, Ref } from "react";
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
export type SliderLabelSlotProps = HTMLChakraProps<"span">;
export type SliderOutputSlotProps = HTMLChakraProps<"div">;
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
  /** Visible label rendered in the label grid area (standalone use). */
  label?: ReactNode;
  /** aria-labels for each thumb, indexed by thumb position. */
  thumbLabels?: string[];
  /** Render tick marks along the track. */
  showTicks?: boolean;
  /** Interval between ticks; defaults to `step` when `showTicks` is set. */
  tickStep?: number;
  /** Forwarded to the root element. */
  ref?: Ref<HTMLDivElement>;
};

type SliderSharedProps = OmitInternalProps<SliderRootSlotProps, "onChange"> &
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
