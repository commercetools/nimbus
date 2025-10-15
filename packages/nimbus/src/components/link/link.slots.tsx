import { createRecipeContext } from "@chakra-ui/react";
import type { LinkRootSlotProps } from "./link.types";

const { withContext } = createRecipeContext({ key: "link" });

/**
 * Root component that provides the styling context for the Link component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const LinkRoot = withContext<HTMLAnchorElement, LinkRootSlotProps>("a");
