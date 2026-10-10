import { extractStyleProps } from "@/utils";
import { CodeBlockLanguageLabelSlot } from "../code-block.slots";
import type { CodeBlockLanguageLabelProps } from "../code-block.types";
import { useCodeBlockContext } from "../hooks/use-code-block-context";

/**
 * CodeBlock.LanguageLabel - A decorative label that shows the language. It is
 * hidden from assistive technology.
 *
 * @supportsStyleProps
 */
export const CodeBlockLanguageLabel = (props: CodeBlockLanguageLabelProps) => {
  const { language } = useCodeBlockContext("LanguageLabel");
  const { ref, children, ...restProps } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <CodeBlockLanguageLabelSlot
      ref={ref}
      {...styleProps}
      {...functionalProps}
      aria-hidden="true"
    >
      {children ?? language}
    </CodeBlockLanguageLabelSlot>
  );
};

CodeBlockLanguageLabel.displayName = "CodeBlock.LanguageLabel";
