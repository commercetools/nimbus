import { createRecipeContext } from "@chakra-ui/react";
import type { BadgeRootSlotProps } from "./badge.types";

const { withContext } = createRecipeContext({ key: "nimbusBadge" });

export const BadgeRoot = withContext<HTMLSpanElement, BadgeRootSlotProps>(
  "span"
);
