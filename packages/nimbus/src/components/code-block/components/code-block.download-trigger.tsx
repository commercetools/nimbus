import { Download } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components/icon-button/icon-button";
import { useLocalizedStringFormatter } from "@/hooks";
import { CodeBlockTriggerSlot } from "../code-block.slots";
import type { CodeBlockDownloadTriggerProps } from "../code-block.types";
import { codeBlockMessagesStrings } from "../code-block.messages";
import { useCodeBlockContext } from "../hooks/use-code-block-context";
import { downloadText } from "../utils/download-text";

/**
 * CodeBlock.DownloadTrigger - An icon button that downloads the code (or
 * `text`) as a file named `fileName`. Browser APIs are used only on press, so
 * server rendering is safe.
 *
 * @supportsStyleProps
 */
export const CodeBlockDownloadTrigger = (
  props: CodeBlockDownloadTriggerProps
) => {
  const { code } = useCodeBlockContext("DownloadTrigger");
  const msg = useLocalizedStringFormatter(codeBlockMessagesStrings);
  const {
    fileName,
    mimeType = "text/plain;charset=utf-8",
    text,
    onDownload,
    "aria-label": ariaLabel,
    ...restProps
  } = props;

  return (
    <CodeBlockTriggerSlot>
      <IconButton
        variant="ghost"
        size="xs"
        {...restProps}
        aria-label={ariaLabel ?? msg.format("downloadCode")}
        onPress={() => {
          downloadText(text ?? code, fileName, mimeType);
          onDownload?.();
        }}
      >
        <Download />
      </IconButton>
    </CodeBlockTriggerSlot>
  );
};

CodeBlockDownloadTrigger.displayName = "CodeBlock.DownloadTrigger";
