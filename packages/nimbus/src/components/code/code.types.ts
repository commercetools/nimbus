import type React from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
} from "@chakra-ui/react/styled-system";

export type CodeRecipeProps = RecipeProps<"nimbusCode">;
export type CodeRootSlotProps = HTMLChakraProps<"code", CodeRecipeProps>;

export type CodeProps = CodeRootSlotProps & {
  ref?: React.Ref<HTMLElement>;
};
