import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { CodeRootSlotProps } from "./code.types";

const { withContext } = createRecipeContext({ key: "nimbusCode" });

export const CodeRoot = withContext<HTMLElement, CodeRootSlotProps>("code");
