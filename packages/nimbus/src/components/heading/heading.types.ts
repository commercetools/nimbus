import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react/styled-system";

export type HeadingRecipeProps = RecipeProps<"nimbusHeading">;
export type HeadingRootSlotProps = HTMLChakraProps<"h2", HeadingRecipeProps> & {
  ref?: React.Ref<HTMLHeadingElement>;
};
