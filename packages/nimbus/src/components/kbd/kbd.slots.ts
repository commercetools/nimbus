import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the svg element.
 */
type KbdRecipeProps = RecipeProps<"nimbusKbd"> & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type KbdRootSlotProps = HTMLChakraProps<"kbd", KbdRecipeProps>;

const { withContext } = createRecipeContext({ key: "nimbusKbd" });

/**
 * Root component that provides the styling context for the Icon component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const KbdRootSlot: SlotComponent<HTMLElement, KbdRootSlotProps> =
  withContext<HTMLElement, KbdRootSlotProps>("kbd");
