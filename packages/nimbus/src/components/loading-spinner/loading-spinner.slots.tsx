import { createRecipeContext } from "@chakra-ui/react";
import type { LoadingSpinnerRootProps } from "./loading-spinner.types";

const { withContext } = createRecipeContext({ key: "loadingSpinner" });

/**
 * Root component that provides the styling context for the LoadingSpinner component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const LoadingSpinnerRoot = withContext<
  HTMLDivElement,
  LoadingSpinnerRootProps
>("div");
