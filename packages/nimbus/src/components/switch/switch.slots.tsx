/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import { switchSlotRecipe } from "./switch.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "switch",
});

export interface SwitchRootProps
  extends HTMLChakraProps<
    "label",
    RecipeVariantProps<typeof switchSlotRecipe>
  > {}
export const SwitchRootSlot = withProvider<HTMLLabelElement, SwitchRootProps>(
  "label",
  "root"
);

interface SwitchLabelProps extends HTMLChakraProps<"span"> {}
export const SwitchLabelSlot = withContext<HTMLSpanElement, SwitchLabelProps>(
  "span",
  "label"
);

interface SwitchTrackProps extends HTMLChakraProps<"span"> {}
export const SwitchTrackSlot = withContext<HTMLSpanElement, SwitchTrackProps>(
  "span",
  "track"
);

interface SwitchThumbProps extends HTMLChakraProps<"span"> {}
export const SwitchThumbSlot = withContext<HTMLSpanElement, SwitchThumbProps>(
  "span",
  "thumb"
);
