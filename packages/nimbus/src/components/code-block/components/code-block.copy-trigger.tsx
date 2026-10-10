import { useEffect, useRef, useState } from "react";
import { Check, ContentCopy } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components/icon-button/icon-button";
import { useCopyToClipboard, useLocalizedStringFormatter } from "@/hooks";
import { CodeBlockTriggerSlot } from "../code-block.slots";
import type { CodeBlockCopyTriggerProps } from "../code-block.types";
import { codeBlockMessagesStrings } from "../code-block.messages";
import { useCodeBlockContext } from "../hooks/use-code-block-context";

/**
 * CodeBlock.CopyTrigger - An icon button that copies the code (or `text`) to
 * the clipboard. It shows a "copied" icon and announces the result in the
 * live region of `CodeBlock.Root`. Works anywhere inside `CodeBlock.Root`.
 *
 * @supportsStyleProps
 */
export const CodeBlockCopyTrigger = (props: CodeBlockCopyTriggerProps) => {
  const { code, announce } = useCodeBlockContext("CopyTrigger");
  const msg = useLocalizedStringFormatter(codeBlockMessagesStrings);
  const {
    text,
    onCopy,
    onCopyError,
    timeout = 2000,
    "aria-label": ariaLabel,
    ...restProps
  } = props;

  // react-use returns [state, copyFn]. A new state object is set on every
  // copy call; `error` is set when the clipboard write threw. When the
  // browser can only offer a manual-copy prompt, that is not an error.
  const [copyState, copyToClipboard] = useCopyToClipboard();
  // The last copy state we already reacted to, so each copy call is handled
  // exactly once even when the effect re-runs for other reasons.
  const handledCopyStateRef = useRef(copyState);
  const [isCopied, setIsCopied] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(false);

  useEffect(() => {
    if (copyState === handledCopyStateRef.current) return;
    handledCopyStateRef.current = copyState;

    const isSuccess = copyState.error === undefined;
    setIsCopied(isSuccess);
    setHasFeedback(true);
    announce(msg.format(isSuccess ? "copied" : "copyFailed"));
    if (isSuccess) {
      onCopy?.();
    } else {
      onCopyError?.(copyState.error);
    }
  }, [copyState, announce, msg, onCopy, onCopyError]);

  // Reset the icon and clear the live region after `timeout`
  useEffect(() => {
    if (!hasFeedback) return;
    const id = setTimeout(() => {
      setIsCopied(false);
      setHasFeedback(false);
      announce("");
    }, timeout);
    return () => clearTimeout(id);
  }, [hasFeedback, timeout, announce, copyState]);

  return (
    <CodeBlockTriggerSlot>
      <IconButton
        variant="ghost"
        size="xs"
        {...restProps}
        aria-label={ariaLabel ?? msg.format("copyCode")}
        // Copies the string, not the DOM text, so line numbers, prompts and
        // markers are never included.
        onPress={() => copyToClipboard(text ?? code)}
      >
        {isCopied ? <Check /> : <ContentCopy />}
      </IconButton>
    </CodeBlockTriggerSlot>
  );
};

CodeBlockCopyTrigger.displayName = "CodeBlock.CopyTrigger";
