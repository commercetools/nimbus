import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { ActivityIndicatorRootSlotProps } from "./activity-indicator.types";

const { withContext } = createRecipeContext({ key: "nimbusActivityIndicator" });

/**
 * Root component that provides the styling context for the ActivityIndicator.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ActivityIndicatorRoot = withContext<
  HTMLSpanElement,
  ActivityIndicatorRootSlotProps
>("span");
