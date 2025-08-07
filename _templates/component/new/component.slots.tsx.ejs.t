---
to: packages/nimbus/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.slots.tsx
---
import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react/styled-system";

import { <%= h.changeCase.camel(name) %>Recipe } from "./<%= h.changeCase.paramCase(name) %>.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the <%= element %> element.
 */
interface <%= h.changeCase.pascal(name) %>RecipeProps extends RecipeProps<"<%= element %>">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface <%= h.changeCase.pascal(name) %>RootProps
  extends HTMLChakraProps<"<%= element %>", <%= h.changeCase.pascal(name) %>RecipeProps> {}

const { withContext } = createRecipeContext({ recipe: <%= h.changeCase.camel(name) %>Recipe });

/**
 * Root component that provides the styling context for the <%= h.changeCase.pascal(name) %> component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const <%= h.changeCase.pascal(name) %>Root = withContext<<%= elementType %>, <%= h.changeCase.pascal(name) %>RootProps>(
  "<%= element %>"
);
