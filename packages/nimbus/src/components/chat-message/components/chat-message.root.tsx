import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { ChatMessageRootSlot } from "../chat-message.slots";
import { ChatMessageContext } from "../chat-message.context";
import type { ChatMessageSender } from "../chat-message.context";
import type { ChatMessageProps } from "../chat-message.types";

/**
 * ChatMessage.Root - The grid container for a single chat message.
 *
 * Establishes the styling context and lays out the avatar, body and optional
 * meta row. The `sender` prop selects the layout direction (avatar leading for
 * `"agent"`, trailing for `"user"`) and the sender-specific styling;
 * `tone="error"` tints the body for a failed generation.
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
export const ChatMessageRoot = (props: ChatMessageProps) => {
  const { ref, children, isStreaming, ...restProps } = props;

  const recipe = useSlotRecipe({ key: "nimbusChatMessage" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  // Publish the resolved `sender` to the parts so they can derive
  // `sender`-dependent defaults that CSS can't (e.g. the avatar's `variant`).
  // Read from `props` (it still flows to the slot via `restProps`); anything but
  // an explicit "user" resolves to the recipe's default of "agent".
  const sender: ChatMessageSender = props.sender === "user" ? "user" : "agent";

  return (
    <ChatMessageRootSlot
      // The slot renders `<article>` by default (see chat-message.slots.tsx);
      // `functionalProps` is spread last so a consumer-supplied `as` / `role` /
      // `aria-*` always wins.
      aria-busy={isStreaming || undefined}
      ref={ref}
      {...recipeProps}
      {...styleProps}
      {...functionalProps}
    >
      <ChatMessageContext.Provider value={{ sender }}>
        {children}
      </ChatMessageContext.Provider>
    </ChatMessageRootSlot>
  );
};

ChatMessageRoot.displayName = "ChatMessage.Root";
