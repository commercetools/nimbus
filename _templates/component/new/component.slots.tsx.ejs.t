---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.slots.tsx
---
import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { <%= h.changeCase.camel(name) %>Recipe } from "./<%= h.changeCase.paramCase(name) %>.recipe";

interface <%= h.changeCase.pascal(name) %>RecipeProps extends RecipeProps<"<%= element %>">, UnstyledProp {}

export interface <%= h.changeCase.pascal(name) %>RootProps
  extends HTMLChakraProps<"<%= element %>", <%= h.changeCase.pascal(name) %>RecipeProps> {}

const { withContext } = createRecipeContext({ recipe: <%= h.changeCase.camel(name) %>Recipe });

export const <%= h.changeCase.pascal(name) %>Root = withContext<<%= elementType %>, <%= h.changeCase.pascal(name) %>RootProps>(
  "<%= element %>"
);
