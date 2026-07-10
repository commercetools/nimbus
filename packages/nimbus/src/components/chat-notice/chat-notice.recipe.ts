import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ChatNotice component.
 *
 * A non-message interjection in a chat transcript (system notice, divider),
 * rendered centered, subdued, and avatar-less — the visual opposite of a
 * ChatMessage, which is why it is a separate component rather than a
 * ChatMessage `sender` variant. Uses the neutral surface/text tokens the
 * former `sender="system"` bubble used.
 */
export const chatNoticeRecipe = defineRecipe({
  className: "nimbus-chat-notice",

  base: {
    display: "block",
    // Center the notice in the transcript column regardless of width.
    mx: "auto",
    maxWidth: "480px",
    textAlign: "center",
    backgroundColor: "neutral.2",
    color: "neutral.11",
    border: "solid-25",
    borderColor: "neutral.6",
    borderRadius: "300",
    px: "600",
    py: "200",
    // Long, unbreakable content wraps instead of overflowing the notice.
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
});
