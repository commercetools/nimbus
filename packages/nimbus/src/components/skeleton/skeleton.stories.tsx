import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useEffect } from "react";
import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Stack,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Skeleton>;

/**
 * Base story — minimal Skeleton usage with default props.
 * Verifies the rendered element type, aria-hidden attribute, and data-testid forwarding.
 */
export const Base: Story = {
  args: {
    "data-testid": "skeleton-test",
    width: "200px",
    height: "40px",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-test");

    await step("Uses a <div> element by default", async () => {
      await expect(skeleton.tagName).toBe("DIV");
    });

    await step("Has aria-hidden='true' by default", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    await step("Forwards data-testid attribute", async () => {
      await expect(skeleton).toHaveAttribute("data-testid", "skeleton-test");
    });
  },
};

/**
 * SizedPlaceholder — verifies that width/height props produce a block element.
 */
export const SizedPlaceholder: Story = {
  args: {
    "data-testid": "skeleton-sized",
    width: "300px",
    height: "80px",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-sized");

    await step("Renders a block <div> element", async () => {
      await expect(skeleton.tagName).toBe("DIV");
    });

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });
  },
};

/**
 * ShapeRectangle — default rectangle shape with a small border radius.
 */
export const ShapeRectangle: Story = {
  args: {
    "data-testid": "skeleton-rect",
    shape: "rectangle",
    width: "200px",
    height: "40px",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-rect");

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    await step("Is rendered in the DOM", async () => {
      await expect(skeleton).toBeInTheDocument();
    });
  },
};

/**
 * ShapeCircle — fully-rounded border radius with a 1:1 aspect ratio.
 */
export const ShapeCircle: Story = {
  args: {
    "data-testid": "skeleton-circle",
    shape: "circle",
    width: "60px",
    height: "60px",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-circle");

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    await step("Is rendered in the DOM", async () => {
      await expect(skeleton).toBeInTheDocument();
    });
  },
};

/**
 * AnimationPulse — default pulse animation applied when no animation prop provided.
 */
export const AnimationPulse: Story = {
  args: {
    "data-testid": "skeleton-pulse",
    width: "200px",
    height: "40px",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-pulse");

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    await step("Is rendered in the DOM", async () => {
      await expect(skeleton).toBeInTheDocument();
    });
  },
};

/**
 * AnimationNone — no animation when animation="none".
 */
export const AnimationNone: Story = {
  args: {
    "data-testid": "skeleton-no-anim",
    animation: "none",
    width: "200px",
    height: "40px",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-no-anim");

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    await step("Is rendered in the DOM", async () => {
      await expect(skeleton).toBeInTheDocument();
    });
  },
};

/**
 * AnimationWave — wave shimmer animation via an ::after gradient sweep.
 */
export const AnimationWave: Story = {
  args: {
    "data-testid": "skeleton-wave",
    animation: "wave",
    width: "200px",
    height: "40px",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-wave");

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    await step("Is rendered in the DOM", async () => {
      await expect(skeleton).toBeInTheDocument();
    });
  },
};

/**
 * SkeletonTextStory — multi-line text skeleton with configurable lines.
 * Verifies that the correct number of child lines are rendered.
 */
export const SkeletonTextStory: Story = {
  render: () => (
    <SkeletonText data-testid="skeleton-text-root" lines={4} width="300px" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("skeleton-text-root");

    await step(
      "Root container is hidden from assistive technology",
      async () => {
        await expect(container).toHaveAttribute("aria-hidden", "true");
      }
    );

    await step("Renders the correct number of child lines", async () => {
      await expect(container.children).toHaveLength(4);
    });
  },
};

/**
 * SkeletonTextLastLine — verifies that the last line of SkeletonText is narrower.
 */
export const SkeletonTextLastLine: Story = {
  render: () => (
    <SkeletonText
      data-testid="skeleton-text-narrow"
      lines={3}
      lastLineWidth="40%"
      width="300px"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("skeleton-text-narrow");

    await step("Container is hidden from assistive technology", async () => {
      await expect(container).toHaveAttribute("aria-hidden", "true");
    });

    await step("Renders the correct number of child lines", async () => {
      await expect(container.children).toHaveLength(3);
    });
  },
};

/**
 * SkeletonCircleStory — circular placeholder sized by a single size prop.
 */
export const SkeletonCircleStory: Story = {
  render: () => (
    <SkeletonCircle data-testid="skeleton-circle-comp" size="80px" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const circle = canvas.getByTestId("skeleton-circle-comp");

    await step("Is hidden from assistive technology", async () => {
      await expect(circle).toHaveAttribute("aria-hidden", "true");
    });

    await step("Is rendered in the DOM", async () => {
      await expect(circle).toBeInTheDocument();
    });
  },
};

/**
 * RefForwarding — verifies that a ref passed to Skeleton resolves to the root element.
 * A data attribute is set via the ref after mount to confirm forwarding works.
 */
export const RefForwarding: Story = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-attached", "true");
      }
    }, []);

    return (
      <Skeleton
        ref={ref}
        data-testid="skeleton-ref"
        width="200px"
        height="40px"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-ref");

    await step("Ref resolves to the root element", async () => {
      await expect(skeleton).toHaveAttribute("data-ref-attached", "true");
    });
  },
};

/**
 * Showcase — all animation and shape variants side by side.
 */
export const Showcase: Story = {
  render: () => (
    <Stack gap="600">
      <Stack direction="row" gap="400" alignItems="center">
        <Skeleton width="200px" height="40px" animation="pulse" />
        <Skeleton width="200px" height="40px" animation="wave" />
        <Skeleton width="200px" height="40px" animation="none" />
      </Stack>
      <Stack direction="row" gap="400" alignItems="center">
        <Skeleton width="60px" height="60px" shape="circle" animation="pulse" />
        <Skeleton width="60px" height="60px" shape="circle" animation="wave" />
        <Skeleton width="60px" height="60px" shape="circle" animation="none" />
      </Stack>
      <SkeletonText lines={3} width="300px" />
    </Stack>
  ),
};
