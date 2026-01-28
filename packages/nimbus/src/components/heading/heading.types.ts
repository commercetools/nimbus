import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react";

export type HeadingRecipeProps = RecipeProps<"nimbusHeading">;
export type HeadingRootSlotProps = HTMLChakraProps<"h2", HeadingRecipeProps> & {
  ref?: React.Ref<HTMLHeadingElement>;
};
