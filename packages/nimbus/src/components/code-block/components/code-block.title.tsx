import { useLayoutEffect } from "@react-aria/utils";
import { extractStyleProps } from "@/utils";
import { CodeBlockTitleSlot } from "../code-block.slots";
import type { CodeBlockTitleProps } from "../code-block.types";
import { useCodeBlockContext } from "../hooks/use-code-block-context";

/**
 * CodeBlock.Title - The visible title of the block, for example a file name.
 * It names the code region unless `aria-label` is set on `CodeBlock.Root`.
 *
 * @supportsStyleProps
 */
export const CodeBlockTitle = (props: CodeBlockTitleProps) => {
  const { titleId, registerTitle } = useCodeBlockContext("Title");
  const { ref, children, ...restProps } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  useLayoutEffect(registerTitle, [registerTitle]);

  return (
    <CodeBlockTitleSlot
      ref={ref}
      {...styleProps}
      {...functionalProps}
      id={titleId}
    >
      {children}
    </CodeBlockTitleSlot>
  );
};

CodeBlockTitle.displayName = "CodeBlock.Title";
