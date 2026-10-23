import { useContext } from "react";
import {
  CodeBlockContext,
  type CodeBlockContextValue,
} from "../code-block.context";

/**
 * Returns the context of the nearest `CodeBlock.Root`. Throws an error that
 * names the part when there is none.
 */
export const useCodeBlockContext = (
  partName: string
): CodeBlockContextValue => {
  const context = useContext(CodeBlockContext);
  if (!context) {
    throw new Error(`CodeBlock.${partName} must be used inside CodeBlock.Root`);
  }
  return context;
};
