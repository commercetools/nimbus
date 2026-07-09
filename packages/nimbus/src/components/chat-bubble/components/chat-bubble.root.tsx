import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { ChatBubbleRootSlot } from "../chat-bubble.slots";
import type { ChatBubbleProps } from "../chat-bubble.types";

/**
 * ChatBubble.Root - The grid container for a single chat message.
 *
 * Establishes the styling context and lays out the avatar, bubble and optional
 * footer row. The `sender` prop selects the layout direction (avatar leading
 * for `"agent"`/`"tool"`, trailing for `"user"`, centered for `"system"`) and
 * the sender-specific styling; `tone="error"` tints the bubble for a failed
 * generation.
 *
 * Renders a semantic `<article>` by default (a feed item, per the ARIA APG) so
 * a message is a discrete node in the accessibility tree. This is a *default*,
 * not a mandate: override the element with `as` (e.g. `as="li"` inside a list)
 * and name the message for assistive tech with `aria-label`/`aria-labelledby`.
 * The surrounding feed / live region is the consumer's to compose — see the
 * accessibility docs.
 *
 * @supportsStyleProps
 */
export const ChatBubbleRoot = (props: ChatBubbleProps) => {
  const { ref, children, isStreaming, ...restProps } = props;

  const recipe = useSlotRecipe({ key: "nimbusChatBubble" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  return (
    <ChatBubbleRootSlot
      // The slot renders `<article>` by default (see chat-bubble.slots.tsx);
      // `functionalProps` is spread last so a consumer-supplied `as` / `role` /
      // `aria-*` always wins.
      aria-busy={isStreaming || undefined}
      ref={ref}
      {...recipeProps}
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </ChatBubbleRootSlot>
  );
};

ChatBubbleRoot.displayName = "ChatBubble.Root";
