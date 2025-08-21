import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import { paginationRecipe } from "./pagination.recipe";

const { withContext, withProvider } = createSlotRecipeContext({
  recipe: paginationRecipe,
});

export { withContext, withProvider };
