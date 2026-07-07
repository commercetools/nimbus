import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { ChatBubbleRootSlot } from "../chat-bubble.slots";
import type { ChatBubbleProps } from "../chat-bubble.types";

/**
 * ChatBubble.Root - The grid container for a single chat message.
 *
 * Establishes the styling context and lays out the avatar, bubble and optional
 * feedback row. The `sender` prop selects the layout direction (avatar leading
 * for `"agent"`, trailing for `"user"`) and the sender-specific styling.
 *
 * @supportsStyleProps
 */
export const ChatBubbleRoot = (props: ChatBubbleProps) => {
  const { ref, children, ...restProps } = props;

  const recipe = useSlotRecipe({ key: "nimbusChatBubble" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  return (
    <ChatBubbleRootSlot
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
