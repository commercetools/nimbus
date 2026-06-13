import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type { SkeletonRootSlotProps } from "./skeleton.types";

const { withContext } = createRecipeContext({ key: "nimbusSkeleton" });

/**
 * Root component that provides the styling context for the Skeleton component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const SkeletonRoot: SlotComponent<
  HTMLDivElement,
  SkeletonRootSlotProps
> = withContext<HTMLDivElement, SkeletonRootSlotProps>("div");
