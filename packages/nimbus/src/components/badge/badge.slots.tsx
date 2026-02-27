import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { BadgeRootSlotProps } from "./badge.types";

const { withContext } = createRecipeContext({ key: "nimbusBadge" });

export const BadgeRoot = withContext<HTMLSpanElement, BadgeRootSlotProps>(
  "span"
);
