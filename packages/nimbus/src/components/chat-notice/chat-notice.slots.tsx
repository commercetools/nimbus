import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { ChatNoticeRootSlotProps } from "./chat-notice.types";

const { withContext } = createRecipeContext({ key: "nimbusChatNotice" });

/**
 * Root slot for ChatNotice — a single styled element driven by the
 * `nimbusChatNotice` recipe.
 */
export const ChatNoticeRoot = withContext<
  HTMLDivElement,
  ChatNoticeRootSlotProps
>("div");
