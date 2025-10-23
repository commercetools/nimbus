import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  ProgressBarRootSlotProps,
  ProgressBarTrackSlotProps,
  ProgressBarFillSlotProps,
  ProgressBarLabelSlotProps,
  ProgressBarValueSlotProps,
} from "./progress-bar.types.tsx";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "progressBar",
});

// ProgressBar Root - Main container
export const ProgressBarRootSlot = withProvider<
  HTMLDivElement,
  ProgressBarRootSlotProps
>("div", "root");

// ProgressBar Track - Background bar
export const ProgressBarTrackSlot = withContext<
  HTMLDivElement,
  ProgressBarTrackSlotProps
>("div", "track");

// ProgressBar Fill - Progress indicator
export const ProgressBarFillSlot = withContext<
  HTMLDivElement,
  ProgressBarFillSlotProps
>("div", "fill");

// ProgressBar Label - Label text
export const ProgressBarLabelSlot = withContext<
  HTMLSpanElement,
  ProgressBarLabelSlotProps
>("span", "label");

// ProgressBar Value - Value text
export const ProgressBarValueSlot = withContext<
  HTMLSpanElement,
  ProgressBarValueSlotProps
>("span", "value");
