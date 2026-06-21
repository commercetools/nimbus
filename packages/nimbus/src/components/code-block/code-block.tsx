import { useState, useCallback, useEffect, useRef } from "react";
import { Highlight, Prism } from "prism-react-renderer";
import { ContentCopy, Check } from "@commercetools/nimbus-icons";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { IconButton, VisuallyHidden } from "@/components";
import { extractStyleProps, noop } from "@/utils";
import { useLocalizedStringFormatter, useCopyToClipboard } from "@/hooks";
import { codeBlockSlotRecipe } from "./code-block.recipe";
import {
  CodeBlockRootSlot,
  CodeBlockHeaderSlot,
  CodeBlockLanguageLabelSlot,
  CodeBlockCopyButtonSlot,
  CodeBlockPreSlot,
  CodeBlockCodeSlot,
  CodeBlockLineSlot,
  CodeBlockLineNumberSlot,
} from "./code-block.slots";
import type { CodeBlockProps } from "./code-block.types";
import { codeBlockMessagesStrings } from "./code-block.messages";
import { CODE_BLOCK_PRISM_THEME } from "./code-block.constants";

/**
 * CodeBlock
 * ============================================================
 * A read-only, syntax-highlighted, accessible block-level code renderer.
 * Use this to display multi-line source code with optional line numbers,
 * a copy-to-clipboard button, and a language label. Light/dark theming is
 * handled entirely by CSS custom properties declared in the recipe — component
 * logic never reads or branches on color values.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/code-block}
 *
 * @example
 * ```tsx
 * <CodeBlock code={`const x = 1;`} language="tsx" showLineNumbers />
 * ```
 *
 * @supportsStyleProps
 */
export const CodeBlock = (props: CodeBlockProps) => {
  const {
    code,
    language = "plaintext",
    showLineNumbers = false,
    startLineNumber = 1,
    highlightedLines = [],
    showHeader = true,
    showCopyButton = true,
    onCopy = noop,
    "aria-label": ariaLabelProp,
    ref,
    ...restProps
  } = props;

  const msg = useLocalizedStringFormatter(codeBlockMessagesStrings);
  const resolvedAriaLabel = ariaLabelProp ?? msg.format("regionLabel");

  // Copy-to-clipboard: react-use returns [state, copyFn].
  // state.value is set on success; state.error is set on failure.
  const [copyState, copyToClipboard] = useCopyToClipboard();

  // Ref to track the last copy-state we've already reacted to, preventing
  // double-fires when the effect re-runs for unrelated reasons.
  const handledCopyStateRef = useRef(copyState);

  // Transient "copied" state — drives icon swap and live-region message
  const [isCopied, setIsCopied] = useState(false);

  // React to a successful clipboard write: gate setIsCopied and onCopy on
  // state.value being set with no error. Compare object identity (not value)
  // so we react once per copy call, not every re-render.
  useEffect(() => {
    if (copyState === handledCopyStateRef.current) return;
    handledCopyStateRef.current = copyState;

    if (copyState.value !== undefined && copyState.error === undefined) {
      setIsCopied(true);
      onCopy();
    }
  }, [copyState, onCopy]);

  // Reset the copied state after 2 seconds so the live region clears
  useEffect(() => {
    if (!isCopied) return;
    const id = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(id);
  }, [isCopied]);

  // Copy the code prop (not DOM text, so line numbers are never included)
  const handleCopy = useCallback(() => {
    copyToClipboard(code);
  }, [code, copyToClipboard]);

  // Split recipe variants from remaining props
  const recipe = useSlotRecipe({ recipe: codeBlockSlotRecipe });
  const [recipeProps, recipeLessProps] = recipe.splitVariantProps(restProps);

  // Separate Chakra style props from functional/aria props
  const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

  return (
    <CodeBlockRootSlot
      role="region"
      aria-label={resolvedAriaLabel}
      {...recipeProps}
      {...styleProps}
      {...functionalProps}
      ref={ref}
    >
      {showHeader && (
        <CodeBlockHeaderSlot>
          {/* aria-hidden: decorative label, region name already carries the accessible name */}
          <CodeBlockLanguageLabelSlot aria-hidden="true">
            {language}
          </CodeBlockLanguageLabelSlot>

          {showCopyButton && (
            <CodeBlockCopyButtonSlot>
              <IconButton
                aria-label={msg.format("copyCode")}
                variant="ghost"
                size="xs"
                onPress={handleCopy}
              >
                {isCopied ? <Check /> : <ContentCopy />}
              </IconButton>
            </CodeBlockCopyButtonSlot>
          )}
        </CodeBlockHeaderSlot>
      )}

      {/* tabIndex={0} is unconditional (v1): ensures keyboard-scrollable per WCAG 2.1.1 */}
      <CodeBlockPreSlot tabIndex={0}>
        <CodeBlockCodeSlot>
          <Highlight
            prism={Prism}
            theme={CODE_BLOCK_PRISM_THEME}
            code={code}
            language={language}
          >
            {({ tokens, getLineProps, getTokenProps }) =>
              tokens.map((line, lineIndex) => {
                const lineProps = getLineProps({ line });
                // Highlighting is keyed to the displayed line number (the same
                // numbering as the gutter), so a startLineNumber offset applies
                // and highlighting works whether or not numbers are shown.
                const lineNumber = lineIndex + startLineNumber;
                const isHighlighted = highlightedLines.includes(lineNumber);
                return (
                  <CodeBlockLineSlot
                    key={lineIndex}
                    // className/style from getLineProps drive Prism-generated classes
                    className={lineProps.className}
                    style={lineProps.style}
                    // Decorative highlight band; absent (not `false`) when off
                    data-highlighted={isHighlighted || undefined}
                  >
                    {showLineNumbers && (
                      <CodeBlockLineNumberSlot>
                        {lineNumber}
                      </CodeBlockLineNumberSlot>
                    )}
                    {line.map((token, tokenIndex) => {
                      const tokenProps = getTokenProps({ token });
                      return (
                        <span
                          key={tokenIndex}
                          className={tokenProps.className}
                          style={tokenProps.style}
                        >
                          {tokenProps.children}
                        </span>
                      );
                    })}
                  </CodeBlockLineSlot>
                );
              })
            }
          </Highlight>
        </CodeBlockCodeSlot>
      </CodeBlockPreSlot>

      {/*
       * Always-mounted aria-live region (empty until copy succeeds).
       * Polite so it waits for the current speech to finish.
       * aria-atomic ensures the full message is announced, not just changed text.
       * The message clears after ~2s (tied to isCopied reset) so it doesn't linger.
       */}
      <VisuallyHidden>
        <span aria-live="polite" aria-atomic="true">
          {isCopied ? msg.format("copied") : ""}
        </span>
      </VisuallyHidden>
    </CodeBlockRootSlot>
  );
};

CodeBlock.displayName = "CodeBlock";
