import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";
import { Group as RaGroup } from "react-aria-components";
import { groupRecipe } from "./group.recipe";

const { withContext } = createRecipeContext({
  recipe: groupRecipe,
});

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface GroupRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GroupSlotProps
  extends HTMLChakraProps<"div", GroupRecipeProps> {}

/**
 * Slot component that provides the styling context for the Group component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const GroupSlot = withContext<typeof RaGroup, GroupSlotProps>(RaGroup);
