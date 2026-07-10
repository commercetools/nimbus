import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// SLOT PROPS
// ============================================================

export type ChatNoticeRootSlotProps = HTMLChakraProps<"div", UnstyledProp>;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the ChatNotice component.
 *
 * A peer of {@link ChatMessage} — a non-message interjection (system notice,
 * divider) that fills a transcript slot alongside messages. Content is provided
 * as `children`.
 */
export type ChatNoticeProps = OmitInternalProps<ChatNoticeRootSlotProps> & {
  /** The notice content (e.g. "Conversation history was cleared"). */
  children?: React.ReactNode;
  /** Ref forwarding to the root element. */
  ref?: React.Ref<HTMLDivElement>;
  /** Data attributes for testing or custom metadata. */
  [key: `data-${string}`]: unknown;
};
