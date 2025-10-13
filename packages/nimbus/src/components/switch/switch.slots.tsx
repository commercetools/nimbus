import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  SwitchRootProps,
  SwitchLabelProps,
  SwitchTrackProps,
  SwitchThumbProps,
} from "./switch.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "switch",
});

export const SwitchRootSlot = withProvider<HTMLLabelElement, SwitchRootProps>(
  "label",
  "root"
);

export const SwitchLabelSlot = withContext<HTMLSpanElement, SwitchLabelProps>(
  "span",
  "label"
);

export const SwitchTrackSlot = withContext<HTMLSpanElement, SwitchTrackProps>(
  "span",
  "track"
);

export const SwitchThumbSlot = withContext<HTMLSpanElement, SwitchThumbProps>(
  "span",
  "thumb"
);
