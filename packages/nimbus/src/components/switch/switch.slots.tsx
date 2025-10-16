import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  SwitchRootSlotProps,
  SwitchLabelSlotProps,
  SwitchTrackSlotProps,
  SwitchThumbSlotProps,
} from "./switch.types";
import type { SlotComponent } from "@/utils/slot-types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "switch",
});

export const SwitchRootSlot: SlotComponent<
  HTMLLabelElement,
  SwitchRootSlotProps
> = withProvider<HTMLLabelElement, SwitchRootSlotProps>("label", "root");

export const SwitchLabelSlot = withContext<
  HTMLSpanElement,
  SwitchLabelSlotProps
>("span", "label");

export const SwitchTrackSlot = withContext<
  HTMLSpanElement,
  SwitchTrackSlotProps
>("span", "track");

export const SwitchThumbSlot = withContext<
  HTMLSpanElement,
  SwitchThumbSlotProps
>("span", "thumb");
