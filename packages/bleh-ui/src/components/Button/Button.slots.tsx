"use client";

import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

interface ButtonRecipeProps extends RecipeProps<"button">, UnstyledProp {}

export interface ButtonRootProps
  extends HTMLChakraProps<"button", ButtonRecipeProps> {}

const { withContext /* PropsProvider */ } = createRecipeContext({
  key: "button",
});

export const ButtonRoot = withContext<HTMLButtonElement, ButtonRootProps>(
  "button",
  {
    defaultProps: { type: "button" },
  }
);

/* export const ButtonPropsProvider =
  PropsProvider as React.Provider<ButtonRecipeProps>; */
