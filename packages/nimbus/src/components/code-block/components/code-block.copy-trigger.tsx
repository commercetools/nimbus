import { useCallback, useEffect, useRef, useState } from "react";
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

  const [isCopied, setIsCopied] = useState(false);
  // Increases with every copy result, so the reset timer restarts.
  const [resultCount, setResultCount] = useState(0);

  const reportResult = useCallback(
    (error?: Error) => {
      const isSuccess = error === undefined;
      setIsCopied(isSuccess);
      setResultCount((count) => count + 1);
      announce(msg.format(isSuccess ? "copied" : "copyFailed"));
      if (isSuccess) {
        onCopy?.();
      } else {
        onCopyError?.(error);
      }
    },
    [announce, msg, onCopy, onCopyError]
  );

  // Fallback when the Clipboard API is missing or blocked: react-use copies
  // with execCommand("copy") and sets a new state object on every call.
  // `noUserInteraction` is false when the browser could only offer a
  // manual-copy prompt, which counts as a failure.
  const [fallbackState, copyWithFallback] = useCopyToClipboard();
  // The last fallback state we already reacted to, so each call is reported
  // exactly once even when the effect re-runs for other reasons.
  const handledFallbackStateRef = useRef(fallbackState);

  useEffect(() => {
    if (fallbackState === handledFallbackStateRef.current) return;
    handledFallbackStateRef.current = fallbackState;
    reportResult(
      fallbackState.error ??
        (fallbackState.noUserInteraction
          ? undefined
          : new Error("The browser did not allow copying to the clipboard"))
    );
  }, [fallbackState, reportResult]);

  // Reset the icon and clear the live region after `timeout`
  useEffect(() => {
    if (resultCount === 0) return;
    const id = setTimeout(() => {
      setIsCopied(false);
      announce("");
    }, timeout);
    return () => clearTimeout(id);
  }, [resultCount, timeout, announce]);

  // Copies the string, not the DOM text, so line numbers, prompts and
  // markers are never included. Browser APIs are used only on press.
  const handlePress = async () => {
    const value = text ?? code;
    if (navigator.clipboard?.writeText !== undefined) {
      try {
        await navigator.clipboard.writeText(value);
        reportResult();
        return;
      } catch {
        // Blocked, for example by a permission policy in an iframe.
      }
    }
    copyWithFallback(value);
  };

  return (
    <CodeBlockTriggerSlot>
      <IconButton
        variant="ghost"
        size="xs"
        {...restProps}
        aria-label={ariaLabel ?? msg.format("copyCode")}
        onPress={handlePress}
      >
        {isCopied ? <Check /> : <ContentCopy />}
      </IconButton>
    </CodeBlockTriggerSlot>
  );
};

CodeBlockCopyTrigger.displayName = "CodeBlock.CopyTrigger";
