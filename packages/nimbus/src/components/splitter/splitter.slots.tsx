import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import type { splitterSlotRecipe } from "./splitter.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusSplitter",
});

// ============================================================
// Root Slot
// ============================================================

export type SplitterRootSlotProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof splitterSlotRecipe>
>;

export const SplitterRootSlot = withProvider<
  HTMLDivElement,
  SplitterRootSlotProps
>("div", "root");

// ============================================================
// Pane Slot
// ============================================================

export type SplitterPaneSlotProps = HTMLChakraProps<"div">;

export const SplitterPaneSlot = withContext<
  HTMLDivElement,
  SplitterPaneSlotProps
>("div", "pane");

// ============================================================
// Separator Slot
// ============================================================

export type SplitterSeparatorSlotProps = HTMLChakraProps<"div">;

export const SplitterSeparatorSlot = withContext<
  HTMLDivElement,
  SplitterSeparatorSlotProps
>("div", "separator");
