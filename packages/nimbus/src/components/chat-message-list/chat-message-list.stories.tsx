import { useState, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChatMessageList,
  ChatMessage,
  Text,
  Button,
  Stack,
  Box,
  type ChatMessageListHandle,
} from "@commercetools/nimbus";
import { AutoAwesome } from "@commercetools/nimbus-icons";
import { within, expect, waitFor, userEvent } from "storybook/test";

const SAMPLE =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Ut et massa mi. " +
  "Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla.";

/** The scroll viewport is the element that actually scrolls (ScrollArea's). */
const getViewport = (root: HTMLElement) =>
  root.querySelector('[data-part="viewport"]') as HTMLElement;

const distanceFromBottom = (el: HTMLElement) =>
  el.scrollHeight - el.scrollTop - el.clientHeight;

const meta: Meta<typeof ChatMessageList.Root> = {
  title: "Components/Chat/ChatMessageList",
  component: ChatMessageList.Root,
};

export default meta;

type Story = StoryObj<typeof ChatMessageList.Root>;

/**
 * Mixed transcript
 * A `ChatMessageList` arranges `Item`s that hold user and agent
 * `ChatMessage`s — and any other content — into a scrollable, live transcript.
 * The list is content-agnostic: an `Item` can hold a `ChatMessage` or, as the
 * last item shows, a consumer-rendered notice (a plain centered box). The
 * members do not know they are inside a list.
 */
export const MixedTranscript: Story = {
  render: () => (
    <ChatMessageList.Root
      aria-label="Conversation with the agent"
      height="360px"
      data-testid="list"
    >
      <ChatMessageList.Item>
        <ChatMessage.Root sender="user" aria-label="Message from Ada">
          <ChatMessage.Avatar firstName="Ada" lastName="Lovelace" />
          <ChatMessage.Body>
            <Text>Can you summarise last week's orders?</Text>
          </ChatMessage.Body>
        </ChatMessage.Root>
      </ChatMessageList.Item>

      <ChatMessageList.Item>
        <ChatMessage.Root sender="agent" aria-label="Message from the agent">
          <ChatMessage.Avatar>
            <AutoAwesome />
          </ChatMessage.Avatar>
          <ChatMessage.Body>
            <Text>Revenue is up 12% week-over-week.</Text>
          </ChatMessage.Body>
        </ChatMessage.Root>
      </ChatMessageList.Item>

      <ChatMessageList.Item>
        {/* No dedicated notice component — a consumer renders their own
            centered, subdued content inside an Item. */}
        <Box mx="auto" textAlign="center" color="neutral.11" textStyle="sm">
          Conversation history was cleared.
        </Box>
      </ChatMessageList.Item>
    </ChatMessageList.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders every member as a vertical sequence", async () => {
      await expect(
        canvas.getByText("Can you summarise last week's orders?")
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Revenue is up 12% week-over-week.")
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Conversation history was cleared.")
      ).toBeInTheDocument();
    });

    await step("Exposes a named log live region", async () => {
      const log = canvas.getByRole("log");
      await expect(log).toHaveAttribute("aria-live", "polite");
      await expect(log).toHaveAccessibleName("Conversation with the agent");
    });
  },
};

/** A wrapper that appends messages on demand, for the autoscroll stories. */
const AppendableList = ({ autoScroll = true }: { autoScroll?: boolean }) => {
  const [count, setCount] = useState(4);
  return (
    <Stack gap="400" alignItems="start">
      <Button data-testid="send" onPress={() => setCount((c) => c + 1)}>
        Send message
      </Button>
      <ChatMessageList.Root
        aria-label="Conversation"
        autoScroll={autoScroll}
        height="240px"
        width="480px"
        data-testid="list"
      >
        {Array.from({ length: count }).map((_, i) => (
          <ChatMessageList.Item key={i}>
            <ChatMessage.Root sender={i % 2 === 0 ? "user" : "agent"}>
              <ChatMessage.Avatar />
              <ChatMessage.Body>
                <Text>
                  Message {i + 1}. {SAMPLE}
                </Text>
              </ChatMessage.Body>
            </ChatMessage.Root>
          </ChatMessageList.Item>
        ))}
      </ChatMessageList.Root>
    </Stack>
  );
};

/**
 * Autoscroll pins to newest
 * While the user is at the bottom, appending a message keeps the newest content
 * in view and no "jump to latest" control is shown.
 */
export const Autoscroll: Story = {
  render: () => <AppendableList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Starts pinned to the newest message", async () => {
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
    });

    await step("Stays pinned when a message is appended", async () => {
      await userEvent.click(canvas.getByTestId("send"));
      await userEvent.click(canvas.getByTestId("send"));
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      // Pinned ⇒ no jump-to-latest control.
      await expect(
        canvas.queryByRole("button", { name: "Scroll to latest message" })
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Scroll up releases the pin
 * Scrolling up to read history releases the stick-to-bottom pin and reveals a
 * "jump to latest" control; activating it re-engages the pin.
 */
export const ReleaseOnScrollUp: Story = {
  render: () => <AppendableList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Pinned initially: no jump-to-latest control", async () => {
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      await expect(
        canvas.queryByRole("button", { name: "Scroll to latest message" })
      ).not.toBeInTheDocument();
    });

    await step("Scrolling up reveals the jump-to-latest control", async () => {
      viewport.scrollTop = 0;
      viewport.dispatchEvent(new Event("scroll"));
      await waitFor(() =>
        expect(
          canvas.getByRole("button", { name: "Scroll to latest message" })
        ).toBeInTheDocument()
      );
    });

    await step("Activating it re-engages stick-to-bottom", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Scroll to latest message" })
      );
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      await waitFor(() =>
        expect(
          canvas.queryByRole("button", { name: "Scroll to latest message" })
        ).not.toBeInTheDocument()
      );
    });
  },
};

/** A list driven through its imperative handle, for the redundant-scroll test. */
const ImperativeList = () => {
  const ref = useRef<ChatMessageListHandle>(null);
  return (
    <Stack gap="400" alignItems="start">
      <Button
        data-testid="scroll-to-bottom"
        onPress={() => ref.current?.scrollToBottom()}
      >
        Scroll to bottom
      </Button>
      <ChatMessageList.Root
        ref={ref}
        aria-label="Conversation"
        height="240px"
        width="480px"
        data-testid="list"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ChatMessageList.Item key={i}>
            <ChatMessage.Root sender={i % 2 === 0 ? "user" : "agent"}>
              <ChatMessage.Avatar />
              <ChatMessage.Body>
                <Text>
                  Message {i + 1}. {SAMPLE}
                </Text>
              </ChatMessage.Body>
            </ChatMessage.Root>
          </ChatMessageList.Item>
        ))}
      </ChatMessageList.Root>
    </Stack>
  );
};

/**
 * Redundant scrollToBottom() while pinned does not wedge the pin
 * Calling `scrollToBottom()` while already at the bottom is a no-op scroll that
 * fires no `scroll` event. A subsequent user scroll-up must still release the
 * pin and reveal the jump-to-latest control — the programmatic-scroll guard
 * must be seeded with the real distance, not `Infinity` (which no later
 * distance could exceed, wedging `isPinned` at `true`). Regression test for a
 * consumer that calls `scrollToBottom()` defensively on every append.
 */
export const RedundantScrollToBottomStillReleases: Story = {
  render: () => <ImperativeList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Starts pinned to the newest message", async () => {
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
    });

    await step("scrollToBottom() while at the bottom is a no-op", async () => {
      await userEvent.click(canvas.getByTestId("scroll-to-bottom"));
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      // Still pinned ⇒ no jump-to-latest control yet.
      await expect(
        canvas.queryByRole("button", { name: "Scroll to latest message" })
      ).not.toBeInTheDocument();
    });

    await step("A later scroll-up still releases the pin", async () => {
      viewport.scrollTop = 0;
      viewport.dispatchEvent(new Event("scroll"));
      await waitFor(() =>
        expect(
          canvas.getByRole("button", { name: "Scroll to latest message" })
        ).toBeInTheDocument()
      );
    });
  },
};

/** A wrapper that grows the last message's text, simulating a streamed reply. */
const StreamingList = () => {
  const [len, setLen] = useState(1);
  const streamed = Array.from({ length: len })
    .map((_, i) => `Streamed sentence ${i + 1}. ${SAMPLE}`)
    .join(" ");
  return (
    <Stack gap="400" alignItems="start">
      <Button data-testid="grow" onPress={() => setLen((l) => l + 1)}>
        Stream more
      </Button>
      <ChatMessageList.Root
        aria-label="Conversation"
        height="240px"
        width="480px"
        data-testid="list"
      >
        <ChatMessageList.Item>
          <ChatMessage.Root sender="user">
            <ChatMessage.Avatar />
            <ChatMessage.Body>
              <Text>Tell me a long story.</Text>
            </ChatMessage.Body>
          </ChatMessage.Root>
        </ChatMessageList.Item>
        <ChatMessageList.Item>
          <ChatMessage.Root sender="agent" isStreaming>
            <ChatMessage.Avatar />
            <ChatMessage.Body>
              <Text>{streamed}</Text>
            </ChatMessage.Body>
          </ChatMessage.Root>
        </ChatMessageList.Item>
      </ChatMessageList.Root>
    </Stack>
  );
};

/**
 * Autoscroll during streaming
 * As the last message grows (a streamed reply), a pinned view keeps following
 * the newest content.
 */
export const StreamingGrow: Story = {
  render: () => <StreamingList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Follows the growing message while pinned", async () => {
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      await userEvent.click(canvas.getByTestId("grow"));
      await userEvent.click(canvas.getByTestId("grow"));
      await userEvent.click(canvas.getByTestId("grow"));
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
    });
  },
};

/**
 * Empty state
 * With no items, the list renders its consumer-supplied `emptyState`.
 */
export const EmptyState: Story = {
  render: () => (
    <ChatMessageList.Root
      aria-label="Conversation"
      height="240px"
      width="480px"
      data-testid="list"
      emptyState={
        <Text data-testid="empty">
          No messages yet — ask the agent anything to get started.
        </Text>
      }
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the empty-state content", async () => {
      await expect(canvas.getByTestId("empty")).toBeInTheDocument();
    });
  },
};

/**
 * A list that starts empty and, on demand, mounts filler items plus a last item
 * whose height is grown via an inline-`style` change (an attribute mutation the
 * `MutationObserver` does not watch — only the content `ResizeObserver` catches
 * it). This isolates the empty→first-item observer-attachment path.
 */
const EmptyThenResizeList = () => {
  const [started, setStarted] = useState(false);
  const [tall, setTall] = useState(false);
  return (
    <Stack gap="400" alignItems="start">
      <Button data-testid="start" onPress={() => setStarted(true)}>
        Start conversation
      </Button>
      <Button data-testid="grow" onPress={() => setTall(true)}>
        Grow last item
      </Button>
      <ChatMessageList.Root
        aria-label="Conversation"
        height="200px"
        width="480px"
        data-testid="list"
        emptyState={<Text data-testid="empty">No messages yet.</Text>}
      >
        {started &&
          Array.from({ length: 4 }).map((_, i) => (
            <ChatMessageList.Item key={i}>
              <ChatMessage.Root sender="user">
                <ChatMessage.Avatar />
                <ChatMessage.Body>
                  <Text>
                    Message {i + 1}. {SAMPLE}
                  </Text>
                </ChatMessage.Body>
              </ChatMessage.Root>
            </ChatMessageList.Item>
          ))}
        {started && (
          <ChatMessageList.Item>
            {/* Raw div grown via inline style: a `style` attribute mutation,
                which the MutationObserver (childList/characterData) ignores —
                so only the content ResizeObserver can keep the view pinned. */}
            <div data-testid="grower" style={{ height: tall ? 400 : 40 }} />
          </ChatMessageList.Item>
        )}
      </ChatMessageList.Root>
    </Stack>
  );
};

/**
 * Empty start then growth
 * A transcript that opens empty must still follow content that grows after the
 * first items mount — the stick-to-bottom observer has to bind when the content
 * flow appears, not only at mount. Growth here is a style-only resize, so the
 * ResizeObserver on the content flow is the only thing that can catch it.
 */
export const EmptyStartFollowsGrowth: Story = {
  render: () => <EmptyThenResizeList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Starts on the empty state", async () => {
      await expect(canvas.getByTestId("empty")).toBeInTheDocument();
    });

    await step("Pins once the first items mount", async () => {
      await userEvent.click(canvas.getByTestId("start"));
      const viewport = getViewport(canvas.getByTestId("list"));
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
    });

    await step("Follows a style-only growth of the last item", async () => {
      const viewport = getViewport(canvas.getByTestId("list"));
      await userEvent.click(canvas.getByTestId("grow"));
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
    });
  },
};

/**
 * Keyboard: activating jump keeps focus in the transcript
 * Activating the jump-to-latest control unmounts it (the pin re-engages). Focus
 * must move to the scroll viewport, not fall to `<body>`, and the control must
 * not flicker back while the smooth scroll settles.
 */
export const KeyboardJumpKeepsFocus: Story = {
  render: () => <AppendableList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Scroll up to reveal the jump control", async () => {
      viewport.scrollTop = 0;
      viewport.dispatchEvent(new Event("scroll"));
      await waitFor(() =>
        expect(
          canvas.getByRole("button", { name: "Scroll to latest message" })
        ).toBeInTheDocument()
      );
    });

    await step("Keyboard-activate it", async () => {
      const btn = canvas.getByRole("button", {
        name: "Scroll to latest message",
      });
      btn.focus();
      await userEvent.keyboard("{Enter}");
    });

    await step("Focus lands on the viewport, not <body>", async () => {
      await waitFor(() => expect(viewport).toHaveFocus());
      await expect(document.body).not.toHaveFocus();
    });

    await step("Control does not flicker back after settling", async () => {
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      await expect(
        canvas.queryByRole("button", { name: "Scroll to latest message" })
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Reduced motion downgrades the jump animation
 * With `prefers-reduced-motion: reduce`, activating jump-to-latest scrolls
 * instantly (`behavior: "auto"`) instead of smoothly.
 */
export const ReducedMotionJump: Story = {
  render: () => <AppendableList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    // Force reduced-motion and capture the scroll behavior the hook chooses.
    const originalMatchMedia = window.matchMedia;
    const originalScrollTo = viewport.scrollTo.bind(viewport);
    const behaviors: (ScrollBehavior | undefined)[] = [];
    window.matchMedia = ((query: string) =>
      ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList) as typeof window.matchMedia;
    viewport.scrollTo = ((arg: ScrollToOptions) => {
      behaviors.push(typeof arg === "object" ? arg.behavior : undefined);
      return originalScrollTo(arg as ScrollToOptions);
    }) as typeof viewport.scrollTo;

    try {
      await step("Reveal the jump control", async () => {
        viewport.scrollTop = 0;
        viewport.dispatchEvent(new Event("scroll"));
        await waitFor(() =>
          expect(
            canvas.getByRole("button", { name: "Scroll to latest message" })
          ).toBeInTheDocument()
        );
      });

      await step("Jump scrolls instantly under reduced motion", async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Scroll to latest message" })
        );
        await waitFor(() => expect(behaviors.length).toBeGreaterThan(0));
        await expect(behaviors.every((b) => b === "auto")).toBe(true);
      });
    } finally {
      window.matchMedia = originalMatchMedia;
      viewport.scrollTo = originalScrollTo;
    }
  },
};

/**
 * Manual scroll (autoScroll disabled)
 * With `autoScroll={false}` the list never auto-pins and never shows the
 * jump-to-latest control — scroll position is entirely the consumer's.
 */
export const ManualScroll: Story = {
  render: () => <AppendableList autoScroll={false} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Does not pin on mount", async () => {
      // Nothing auto-scrolled it to the bottom.
      await expect(distanceFromBottom(viewport)).toBeGreaterThan(33);
    });

    await step("Appending does not auto-scroll, no jump control", async () => {
      await userEvent.click(canvas.getByTestId("send"));
      await userEvent.click(canvas.getByTestId("send"));
      await expect(distanceFromBottom(viewport)).toBeGreaterThan(33);
      await expect(
        canvas.queryByRole("button", { name: "Scroll to latest message" })
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Near-bottom stays pinned
 * A user scrolled slightly up (within the ~32px threshold) still counts as
 * pinned: no jump control appears and appended content keeps following.
 */
export const NearBottomStaysPinned: Story = {
  render: () => <AppendableList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Start pinned", async () => {
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
    });

    await step("A small scroll-up (<32px) keeps the pin engaged", async () => {
      viewport.scrollTop = viewport.scrollHeight - viewport.clientHeight - 15;
      viewport.dispatchEvent(new Event("scroll"));
      // Within threshold ⇒ still pinned ⇒ no jump control.
      await expect(
        canvas.queryByRole("button", { name: "Scroll to latest message" })
      ).not.toBeInTheDocument();
    });

    await step("Still follows appended content", async () => {
      await userEvent.click(canvas.getByTestId("send"));
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
    });
  },
};
