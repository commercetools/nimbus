import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { windowSplitterSlotRecipe } from "./window-splitter.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: windowSplitterSlotRecipe,
});

// ============================================================
// Root Slot
// ============================================================

export interface WindowSplitterRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof windowSplitterSlotRecipe>
  > {}

export const WindowSplitterRootSlot = withProvider<
  HTMLDivElement,
  WindowSplitterRootSlotProps
>("div", "root");

// ============================================================
// Pane Slot
// ============================================================

export interface WindowSplitterPaneSlotProps extends HTMLChakraProps<"div"> {}

export const WindowSplitterPaneSlot = withContext<
  HTMLDivElement,
  WindowSplitterPaneSlotProps
>("div", "pane");

// ============================================================
// Separator Slot
// ============================================================

export interface WindowSplitterSeparatorSlotProps
  extends HTMLChakraProps<"div"> {}

export const WindowSplitterSeparatorSlot = withContext<
  HTMLDivElement,
  WindowSplitterSeparatorSlotProps
>("div", "separator");
