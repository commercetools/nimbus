import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { HeadingRootSlotProps } from "./heading.types";

const { withContext } = createRecipeContext({ key: "nimbusHeading" });

export const HeadingRoot: React.FC<HeadingRootSlotProps> = withContext<
  HTMLHeadingElement,
  HeadingRootSlotProps
>("h2");
