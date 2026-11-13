import { CodeBlock } from "@/components/code-block/code-block";
import type { CommandSnippetProps } from "./command-snippet.types";

/**
 * # CommandSnippet
 *
 * Shows shell commands with a prompt and a copy button next to the code.
 * The prompt is not part of the copied text; output lines show no prompt.
 *
 * For layouts this pattern does not cover, compose `CodeBlock` parts
 * directly.
 *
 * @example
 * ```tsx
 * <CommandSnippet command="pnpm add @commercetools/nimbus" />
 * ```
 * @supportsStyleProps
 */
export const CommandSnippet = ({
  command,
  language = "bash",
  prompt = "$",
  outputLines,
  wrapLongLines,
  showCopyButton = true,
  onCopy,
  ...rootProps
}: CommandSnippetProps) => (
  <CodeBlock.Root code={command} language={language} {...rootProps}>
    <CodeBlock.Content
      prompt={prompt}
      outputLines={outputLines}
      wrapLongLines={wrapLongLines}
    >
      {showCopyButton && (
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger onCopy={onCopy} />
        </CodeBlock.Actions>
      )}
    </CodeBlock.Content>
  </CodeBlock.Root>
);

CommandSnippet.displayName = "CommandSnippet";
