import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { LinkRootSlotProps } from "./link.types";

const { withContext } = createRecipeContext({ key: "nimbusLink" });

/**
 * Root component that provides the styling context for the Link component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const LinkRoot = withContext<HTMLAnchorElement, LinkRootSlotProps>("a");
