import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { AvatarRootSlotProps } from "./avatar.types";

const { withContext } = createRecipeContext({ key: "nimbusAvatar" });

export const AvatarRoot = withContext<HTMLElement, AvatarRootSlotProps>(
  "figure"
);
