import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// SLOT PROPS
// ============================================================

export type ChatMessageListRootSlotProps = HTMLChakraProps<"div", UnstyledProp>;

export type ChatMessageListViewportSlotProps = HTMLChakraProps<"div">;

export type ChatMessageListItemSlotProps = HTMLChakraProps<"div">;

export type ChatMessageListScrollToBottomSlotProps = HTMLChakraProps<"div">;

export type ChatMessageListEmptySlotProps = HTMLChakraProps<"div">;

// ============================================================
// IMPERATIVE HANDLE
// ============================================================

/**
 * The imperative handle exposed on `ChatMessageList.Root`'s `ref`. Lets a
 * consumer drive the transcript's scroll programmatically — e.g. after
 * prepending history, or to jump to the newest message from a keyboard shortcut.
 */
export type ChatMessageListHandle = {
  /**
   * Scroll to the newest item and re-engage stick-to-bottom. Honors
   * `prefers-reduced-motion` (a `"smooth"` request degrades to an instant jump
   * when the user asks for reduced motion).
   * @param behavior - scroll behavior; defaults to `"auto"` (instant).
   */
  scrollToBottom: (behavior?: ScrollBehavior) => void;
};

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the `ChatMessageList.Root` component — the scrollable transcript.
 *
 * `Root` wraps the Nimbus `ScrollArea`, owns autoscroll / stick-to-bottom, and
 * is the single persistent `role="log"` `aria-live="polite"` region for the
 * conversation. It renders `ChatMessageList.Item`s as `children`, or the
 * `emptyState` when there are none.
 */
export type ChatMessageListRootProps =
  OmitInternalProps<ChatMessageListRootSlotProps> & {
    /** The `ChatMessageList.Item` children that make up the transcript. */
    children?: React.ReactNode;
    /**
     * Keep the viewport pinned to the newest item while the user is at the
     * bottom (including while a reply streams and grows), releasing the pin
     * when the user scrolls up to read history. Set to `false` to disable
     * automatic scrolling entirely and drive it yourself via the ref handle.
     * @default true
     */
    autoScroll?: boolean;
    /**
     * Content rendered when the list has no `Item` children — an onboarding
     * prompt, suggested questions, or a simple "No messages yet" line.
     */
    emptyState?: React.ReactNode;
    /**
     * The accessible name of the transcript's live region. Defaults to a
     * localized "Conversation" when neither `aria-label` nor `aria-labelledby`
     * is provided, so the `role="log"` region is always named.
     */
    "aria-label"?: string;
    /** Reference an external element as the live region's accessible name. */
    "aria-labelledby"?: string;
    /** Imperative handle for programmatic scroll control. */
    ref?: React.Ref<ChatMessageListHandle>;
    [key: `data-${string}`]: unknown;
  };

/**
 * Props for the `ChatMessageList.Item` component — one list member.
 *
 * `Item` is the list-membership socket: it owns inter-item placement and the
 * entry presentation of a newly appended member, and is content-agnostic — it
 * holds a `ChatMessage` or any other content without reaching into
 * it. It deliberately does not assert `role="listitem"`, which would conflict
 * with the `log` container's live-region semantics.
 */
export type ChatMessageListItemProps =
  OmitInternalProps<ChatMessageListItemSlotProps> & {
    /** Exactly one transcript member (a `ChatMessage` or any other content). */
    children?: React.ReactNode;
    /** Ref forwarding to the item element. */
    ref?: React.Ref<HTMLDivElement>;
    [key: `data-${string}`]: unknown;
  };
