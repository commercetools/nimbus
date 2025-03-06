import type { RecipeVariantProps } from "@chakra-ui/react";
import type { TextInputRootProps } from "./text-input.slots";
import { textInputRecipe } from "./text-input.recipe";
import type { TextFieldProps } from "react-aria-components";

type FunctionalTextInputProps = TextInputRootProps &
  RecipeVariantProps<typeof textInputRecipe>;

// Helper type to merge props and resolve conflicts
export type TextInputProps = Omit<FunctionalTextInputProps, "autoComplete"> &
  TextFieldProps;
