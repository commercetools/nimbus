import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { CodeRootSlotProps } from "./code.types";

const { withContext } = createRecipeContext({ key: "nimbusCode" });

/**
 * # Code
 *
 * renders code blocks
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/typography/code}
 *
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export const CodeRoot: React.FC<CodeRootSlotProps> = withContext<
  HTMLElement,
  CodeRootSlotProps
>("code");
