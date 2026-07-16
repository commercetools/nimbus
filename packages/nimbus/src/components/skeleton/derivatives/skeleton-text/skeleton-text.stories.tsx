import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonText, Stack } from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 *
 * Query strategy note: SkeletonText is decorative and `aria-hidden` by design,
 * so it exposes no accessible role. Every play function below queries by
 * `data-testid` intentionally (per the query-preference order in
 * docs/file-type-guidelines/stories.md, testid is the correct fallback for
 * non-interactive, role-less elements).
 */
const meta: Meta<typeof SkeletonText> = {
  title: "Components/SkeletonText",
  component: SkeletonText,
};

export default meta;

type Story = StoryObj<typeof SkeletonText>;

/**
 * Default — a multi-line text skeleton renders 3 lines by default.
 */
export const Default: Story = {
  render: () => (
    <SkeletonText data-testid="skeleton-text-default" width="7200" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("skeleton-text-default");

    await step("Renders the default number of lines (3)", async () => {
      await expect(container.children).toHaveLength(3);
    });

    await step(
      "Root container is hidden from assistive technology",
      async () => {
        await expect(container).toHaveAttribute("aria-hidden", "true");
      }
    );
  },
};

/**
 * LineCount — multi-line text skeleton with a configurable line count.
 */
export const LineCount: Story = {
  render: () => (
    <SkeletonText data-testid="skeleton-text-root" lines={4} width="7200" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("skeleton-text-root");

    await step("Renders the requested number of child lines", async () => {
      await expect(container.children).toHaveLength(4);
    });

    await step(
      "Root container is hidden from assistive technology",
      async () => {
        await expect(container).toHaveAttribute("aria-hidden", "true");
      }
    );
  },
};

/**
 * LastLine — verifies the last line of SkeletonText is narrower than the
 * preceding full-width lines, mimicking a real paragraph ending.
 */
export const LastLine: Story = {
  render: () => (
    <SkeletonText
      data-testid="skeleton-text-narrow"
      lines={3}
      lastLineWidth="40%"
      width="7200"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("skeleton-text-narrow");

    await step("Renders the correct number of child lines", async () => {
      await expect(container.children).toHaveLength(3);
    });

    await step("Renders the last line narrower than the others", async () => {
      const first = container.children[0] as HTMLElement;
      const last = container.children[
        container.children.length - 1
      ] as HTMLElement;
      await expect(last.offsetWidth).toBeLessThan(first.offsetWidth);
    });
  },
};

/**
 * StyleMatch — the `textStyle` prop makes the placeholder's bar height and line
 * pitch mirror real text of that style: bar height is `0.75em` (≈ the font's
 * cap-height) and bar + gap sum to one line-height, so the skeleton occupies the
 * same vertical rhythm as the text it stands in for. Compared here at `body` and
 * `3xl`. The exact geometry is left to Chromatic to snapshot rather than asserted
 * in a play function.
 */
export const StyleMatch: Story = {
  render: () => (
    <Stack gap="600">
      <SkeletonText textStyle="body" width="7200" />
      <SkeletonText textStyle="3xl" width="7200" />
    </Stack>
  ),
};
