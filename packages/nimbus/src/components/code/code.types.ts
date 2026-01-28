import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react";

export type CodeRecipeProps = RecipeProps<"nimbusCode">;
export type CodeRootSlotProps = HTMLChakraProps<"code", CodeRecipeProps>;
