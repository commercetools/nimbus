import { extractStyleProps } from "@/utils";
import { CodeBlockHeaderSlot } from "../code-block.slots";
import { CodeBlockActionsPlacementContext } from "../code-block.context";
import type { CodeBlockHeaderProps } from "../code-block.types";
import { useCodeBlockContext } from "../hooks/use-code-block-context";

/**
 * CodeBlock.Header - A row above the code for the title, language label and
 * actions. `CodeBlock.Actions` inside the header aligns to its end.
 *
 * @supportsStyleProps
 */
export const CodeBlockHeader = (props: CodeBlockHeaderProps) => {
  useCodeBlockContext("Header");
  const { ref, children, ...restProps } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <CodeBlockActionsPlacementContext.Provider value="header">
      <CodeBlockHeaderSlot ref={ref} {...styleProps} {...functionalProps}>
        {children}
      </CodeBlockHeaderSlot>
    </CodeBlockActionsPlacementContext.Provider>
  );
};

CodeBlockHeader.displayName = "CodeBlock.Header";
