import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonCircle, Stack } from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 *
 * Query strategy note: SkeletonCircle is decorative and `aria-hidden` by
 * design, so it exposes no accessible role. Every play function below queries by
 * `data-testid` intentionally (per the query-preference order in
 * docs/file-type-guidelines/stories.md, testid is the correct fallback for
 * non-interactive, role-less elements).
 */
const meta: Meta<typeof SkeletonCircle> = {
  title: "Components/SkeletonCircle",
  component: SkeletonCircle,
};

export default meta;

type Story = StoryObj<typeof SkeletonCircle>;

/**
 * Sizes — the circular placeholder sizes via the avatar-aligned `size` prop
 * (2xs/xs/md), a custom `boxSize`, or defaults to a 1em circle when neither is
 * set.
 */
export const Sizes: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="row" gap="400" alignItems="center">
      <SkeletonCircle data-testid="circle-default" />
      <SkeletonCircle data-testid="circle-md" size="md" />
      <SkeletonCircle data-testid="circle-custom" boxSize="2000" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const near = async (actual: number, expected: number) =>
      expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1);

    await step("All render as decorative 1:1 circles", async () => {
      for (const id of ["circle-default", "circle-md", "circle-custom"]) {
        const el = canvas.getByTestId(id);
        await expect(el).toHaveAttribute("aria-hidden", "true");
        await expect(getComputedStyle(el).aspectRatio).toBe("1 / 1");
      }
    });

    await step("Default size is 1em (≈16px in body context)", async () => {
      await near(canvas.getByTestId("circle-default").offsetWidth, 16);
    });

    await step("size='md' matches the Avatar md dimension (40px)", async () => {
      await near(canvas.getByTestId("circle-md").offsetWidth, 40);
    });

    await step("boxSize applies a custom dimension (80px)", async () => {
      await near(canvas.getByTestId("circle-custom").offsetWidth, 80);
    });
  },
};
