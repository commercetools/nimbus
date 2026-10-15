import { extractStyleProps } from "@/utils";
import { CodeBlockFooterSlot } from "../code-block.slots";
import type { CodeBlockFooterProps } from "../code-block.types";
import { useCodeBlockContext } from "../hooks/use-code-block-context";

/**
 * CodeBlock.Footer - Content below the code, for example a note or a link.
 *
 * @supportsStyleProps
 */
export const CodeBlockFooter = (props: CodeBlockFooterProps) => {
  useCodeBlockContext("Footer");
  const { ref, children, ...restProps } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <CodeBlockFooterSlot ref={ref} {...styleProps} {...functionalProps}>
      {children}
    </CodeBlockFooterSlot>
  );
};

CodeBlockFooter.displayName = "CodeBlock.Footer";
