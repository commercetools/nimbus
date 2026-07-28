import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  SliderRootSlotProps,
  SliderTrackSlotProps,
  SliderFillSlotProps,
  SliderThumbSlotProps,
  SliderTickSlotProps,
  SliderTickLabelSlotProps,
} from "./slider.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusSlider",
});

/** Root — provides the recipe context; grafts React Aria <Slider> via asChild. */
export const SliderRootSlot = withProvider<HTMLDivElement, SliderRootSlotProps>(
  "div",
  "root"
);

export const SliderTrackSlot = withContext<
  HTMLDivElement,
  SliderTrackSlotProps
>("div", "track");

export const SliderFillSlot = withContext<HTMLDivElement, SliderFillSlotProps>(
  "div",
  "fill"
);

export const SliderThumbSlot = withContext<
  HTMLDivElement,
  SliderThumbSlotProps
>("div", "thumb");

export const SliderTickSlot = withContext<HTMLDivElement, SliderTickSlotProps>(
  "div",
  "tick"
);

export const SliderTickLabelSlot = withContext<
  HTMLDivElement,
  SliderTickLabelSlotProps
>("div", "tickLabel");
