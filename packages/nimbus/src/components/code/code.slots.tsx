import { createRecipeContext } from "@chakra-ui/react";
import type { CodeRootSlotProps } from "./code.types";

const { withContext } = createRecipeContext({ key: "nimbusCode" });

export const CodeRoot: React.FC<CodeRootSlotProps> = withContext<
  HTMLElement,
  CodeRootSlotProps
>("code");
