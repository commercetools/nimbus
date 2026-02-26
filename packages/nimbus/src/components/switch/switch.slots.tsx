import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  SwitchRootSlotProps,
  SwitchLabelSlotProps,
  SwitchTrackSlotProps,
  SwitchThumbSlotProps,
} from "./switch.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusSwitch",
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
