import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  CardContentProps,
  CardHeaderProps,
  CardRootProps,
} from "./card.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "card",
});

/**
 * Root component that provides the styling context for the Card component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const CardRoot = withProvider<HTMLDivElement, CardRootProps>(
  "div",
  "root"
);

export const CardHeader = withContext<HTMLDivElement, CardHeaderProps>(
  "div",
  "header"
);
export const CardContent = withContext<HTMLDivElement, CardContentProps>(
  "div",
  "content"
);
