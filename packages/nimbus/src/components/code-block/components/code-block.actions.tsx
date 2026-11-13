import { useContext } from "react";
import { extractStyleProps } from "@/utils";
import { CodeBlockActionsSlot } from "../code-block.slots";
import { CodeBlockActionsPlacementContext } from "../code-block.context";
import type { CodeBlockActionsProps } from "../code-block.types";
import { useCodeBlockContext } from "../hooks/use-code-block-context";

/**
 * CodeBlock.Actions - Groups triggers such as `CopyTrigger` and
 * `DownloadTrigger`. Inside `CodeBlock.Header` it aligns to the end of the
 * header; inside `CodeBlock.Content` it floats in the top-end corner, next to
 * the code.
 *
 * @supportsStyleProps
 */
export const CodeBlockActions = (props: CodeBlockActionsProps) => {
  useCodeBlockContext("Actions");
  const placement = useContext(CodeBlockActionsPlacementContext);
  const { ref, children, ...restProps } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <CodeBlockActionsSlot
      ref={ref}
      data-placement={placement}
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </CodeBlockActionsSlot>
  );
};

CodeBlockActions.displayName = "CodeBlock.Actions";
