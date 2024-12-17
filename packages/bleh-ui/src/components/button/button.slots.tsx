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

interface ButtonRecipeProps extends RecipeProps<"button">, UnstyledProp {}

export interface ButtonRootProps
  extends HTMLChakraProps<"button", ButtonRecipeProps> {}

const { withContext /* PropsProvider */ } = createRecipeContext({
  key: "button",
});

export const ButtonRoot = withContext<HTMLButtonElement, ButtonRootProps>(
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

/* export const ButtonPropsProvider =
  PropsProvider as React.Provider<ButtonRecipeProps>; */
