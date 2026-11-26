import { Button } from "@/components/button/button";
import { useLocalizedStringFormatter } from "@/hooks";
import { CodeBlockExpandTriggerSlot } from "../code-block.slots";
import type { CodeBlockExpandTriggerProps } from "../code-block.types";
import { codeBlockMessagesStrings } from "../code-block.messages";
import { useCodeBlockContext } from "../hooks/use-code-block-context";

/**
 * CodeBlock.ExpandTrigger - A button that shows all lines of a collapsed block
 * or collapses it again. Renders only when the code has more lines than
 * `maxLines`. Focus stays on the button when it is pressed.
 *
 * @supportsStyleProps
 */
export const CodeBlockExpandTrigger = (props: CodeBlockExpandTriggerProps) => {
  const { isCollapsible, isExpanded, setExpanded, contentId } =
    useCodeBlockContext("ExpandTrigger");
  const msg = useLocalizedStringFormatter(codeBlockMessagesStrings);
  const { children, ...restProps } = props;

  if (!isCollapsible) return null;

  const label =
    typeof children === "function"
      ? children(isExpanded)
      : (children ?? msg.format(isExpanded ? "showLess" : "showMore"));

  return (
    <CodeBlockExpandTriggerSlot>
      <Button
        variant="ghost"
        size="xs"
        {...restProps}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onPress={() => setExpanded(!isExpanded)}
      >
        {label}
      </Button>
    </CodeBlockExpandTriggerSlot>
  );
};

CodeBlockExpandTrigger.displayName = "CodeBlock.ExpandTrigger";
