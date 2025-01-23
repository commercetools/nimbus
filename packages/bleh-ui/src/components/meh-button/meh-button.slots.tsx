"use client";

import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
  defaultSystem,
} from "@chakra-ui/react";
import shouldForwardProp from "@emotion/is-prop-valid";

const { isValidProperty } = defaultSystem;

import { mehButtonRecipe } from "./meh-button.recipe";

interface MehButtonRecipeProps extends RecipeProps<"button">, UnstyledProp {}

export interface MehButtonRootProps
  extends HTMLChakraProps<"button", MehButtonRecipeProps> {}

const { withContext } = createRecipeContext({ recipe: mehButtonRecipe });

export const MehButtonRoot = withContext<HTMLButtonElement, MehButtonRootProps>(
  "button",
  {
    defaultProps: {
      type: "button",
    },
    /** make sure the `onPress` properties won't end up as attribute on the rendered DOM element */
    shouldForwardProp(prop, variantKeys) {
      const chakraSfp = !variantKeys?.includes(prop) && !isValidProperty(prop);
      return shouldForwardProp(prop) && chakraSfp && !prop.includes("onPress");
    },
  }
);
