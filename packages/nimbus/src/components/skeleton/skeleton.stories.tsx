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
 *
 * Query strategy note: Skeleton is decorative and `aria-hidden` by design, so
 * it exposes no accessible role. `getByRole` is therefore not an option and
 * every play function below queries by `data-testid` intentionally (per the
 * query-preference order in docs/file-type-guidelines/stories.md, testid is the
 * correct fallback for non-interactive, role-less elements).
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
 * Verifies the rendered element type, aria-hidden default, data-testid
 * forwarding, and that width/height size tokens resolve to concrete dimensions.
 */
export const Base: Story = {
  args: {
    "data-testid": "skeleton-test",
    width: "4800", // sizes.4800 → 192px
    height: "1000", // sizes.1000 → 40px
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

    await step("Resolves width/height size tokens to pixels", async () => {
      const styles = getComputedStyle(skeleton);
      await expect(styles.width).toBe("192px");
      await expect(styles.height).toBe("40px");
    });
  },
};

/**
 * SizedPlaceholder — a differently sized placeholder, confirming arbitrary
 * size tokens flow through to the rendered box.
 */
export const SizedPlaceholder: Story = {
  args: {
    "data-testid": "skeleton-sized",
    width: "7200", // sizes.7200 → 288px
    height: "2000", // sizes.2000 → 80px
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-sized");

    await step("Applies the requested dimensions", async () => {
      const styles = getComputedStyle(skeleton);
      await expect(styles.width).toBe("288px");
      await expect(styles.height).toBe("80px");
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
    width: "4800",
    height: "1000",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-rect");

    await step("Applies the rectangle (radii.100 = 4px) radius", async () => {
      await expect(getComputedStyle(skeleton).borderRadius).toBe("4px");
    });

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
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
    width: "1600", // sizes.1600 → 64px
    height: "1600",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-circle");

    await step("Applies a 1:1 aspect ratio", async () => {
      await expect(getComputedStyle(skeleton).aspectRatio).toBe("1 / 1");
    });

    await step(
      "Applies a fully-rounded (radii.full = 900px) radius",
      async () => {
        await expect(getComputedStyle(skeleton).borderRadius).toBe("900px");
      }
    );

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });
  },
};

/**
 * AnimationPulse — default pulse animation applied when no animation prop provided.
 */
export const AnimationPulse: Story = {
  args: {
    "data-testid": "skeleton-pulse",
    width: "4800",
    height: "1000",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-pulse");

    await step("Applies the pulse keyframe animation by default", async () => {
      await expect(getComputedStyle(skeleton).animationName).toBe("pulse");
    });

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
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
    width: "4800",
    height: "1000",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-no-anim");

    await step("Applies no animation", async () => {
      await expect(getComputedStyle(skeleton).animationName).toBe("none");
    });

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
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
    width: "4800",
    height: "1000",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId("skeleton-wave");

    await step(
      "Drives the shimmer via the ::after pseudo-element",
      async () => {
        const after = getComputedStyle(skeleton, "::after");
        await expect(after.animationName).toBe("skeleton-wave");
      }
    );

    await step("Is hidden from assistive technology", async () => {
      await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });
  },
};

/**
 * ReducedMotion — documents the `prefers-reduced-motion` behavior.
 *
 * Reduced-motion is enforced purely in CSS via the recipe's `_motionReduce`
 * condition (`@media (prefers-reduced-motion: reduce)`), which disables both the
 * pulse/wave animation and the `::after` shimmer. Like other Nimbus components
 * with motion (see toast.stories.tsx), this is not programmatically asserted in
 * a play function: a JS `matchMedia` mock cannot influence a real CSS media
 * query. Verify by enabling "Reduce motion" in your OS — the skeletons below
 * become static.
 */
export const ReducedMotion: Story = {
  render: () => (
    <Stack direction="row" gap="400" alignItems="center">
      <Skeleton width="4800" height="1000" animation="pulse" />
      <Skeleton width="4800" height="1000" animation="wave" />
    </Stack>
  ),
};

/**
 * SkeletonTextDefault — default multi-line text skeleton renders 3 lines.
 */
export const SkeletonTextDefault: Story = {
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
 * SkeletonTextStory — multi-line text skeleton with a configurable line count.
 */
export const SkeletonTextStory: Story = {
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
 * SkeletonTextLastLine — verifies the last line of SkeletonText is narrower
 * than the preceding full-width lines, mimicking a real paragraph ending.
 */
export const SkeletonTextLastLine: Story = {
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
 * SkeletonTextStyleMatch — the `textStyle` prop makes the placeholder's bar
 * height and line pitch mirror real text of that style. Here `body` (16/26) and
 * `3xl` (30/36) are compared: bar height ≈ font-size and line pitch ≈
 * line-height for each, so the skeleton occupies the same vertical rhythm as the
 * text it stands in for.
 */
export const SkeletonTextStyleMatch: Story = {
  render: () => (
    <Stack gap="600">
      <SkeletonText data-testid="st-body" textStyle="body" width="7200" />
      <SkeletonText data-testid="st-heading" textStyle="3xl" width="7200" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const measure = (testId: string) => {
      const root = canvas.getByTestId(testId);
      const kids = Array.from(root.children) as HTMLElement[];
      const first = kids[0].getBoundingClientRect();
      const second = kids[1].getBoundingClientRect();
      return {
        barHeight: Math.round(first.height),
        pitch: Math.round(second.top - first.top),
      };
    };

    await step(
      "body: bar ≈ 16px, pitch ≈ 26px (body line-height)",
      async () => {
        const { barHeight, pitch } = measure("st-body");
        await expect(barHeight).toBe(16);
        await expect(pitch).toBe(26);
      }
    );

    await step("3xl: bar ≈ 30px, pitch ≈ 36px (3xl line-height)", async () => {
      const { barHeight, pitch } = measure("st-heading");
      await expect(barHeight).toBe(30);
      await expect(pitch).toBe(36);
    });
  },
};

/**
 * SkeletonCircleStory — circular placeholder sized by a single size prop.
 */
export const SkeletonCircleStory: Story = {
  render: () => (
    <SkeletonCircle data-testid="skeleton-circle-comp" size="2000" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const circle = canvas.getByTestId("skeleton-circle-comp");

    await step("Renders as a 1:1 circular placeholder", async () => {
      await expect(getComputedStyle(circle).aspectRatio).toBe("1 / 1");
    });

    await step("Is hidden from assistive technology", async () => {
      await expect(circle).toHaveAttribute("aria-hidden", "true");
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
        width="4800"
        height="1000"
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

const shapes: NonNullable<Story["args"]>["shape"][] = ["rectangle", "circle"];
const animations: NonNullable<Story["args"]>["animation"][] = [
  "pulse",
  "wave",
  "none",
];

/**
 * SmokeTest — comprehensive matrix of every shape × animation combination plus
 * the SkeletonText and SkeletonCircle members. Asserts the full family renders
 * and stays decorative. MUST remain the last story.
 */
export const SmokeTest: Story = {
  render: () => (
    <Stack gap="600">
      {shapes.map((shape) => (
        <Stack key={shape} direction="row" gap="400" alignItems="center">
          {animations.map((animation) => (
            <Skeleton
              key={`${shape}-${animation}`}
              data-testid={`smoke-${shape}-${animation}`}
              width={shape === "circle" ? "1600" : "4800"}
              height={shape === "circle" ? "1600" : "1000"}
              shape={shape}
              animation={animation}
            />
          ))}
        </Stack>
      ))}
      <SkeletonText data-testid="smoke-text" lines={3} width="7200" />
      <SkeletonCircle data-testid="smoke-circle" size="2000" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Every shape × animation combination renders", async () => {
      for (const shape of shapes) {
        for (const animation of animations) {
          const el = canvas.getByTestId(`smoke-${shape}-${animation}`);
          await expect(el).toBeInTheDocument();
          await expect(el).toHaveAttribute("aria-hidden", "true");
        }
      }
    });

    await step("SkeletonText renders its default 3 lines", async () => {
      const text = canvas.getByTestId("smoke-text");
      await expect(text.children).toHaveLength(3);
    });

    await step("SkeletonCircle renders decoratively", async () => {
      const circle = canvas.getByTestId("smoke-circle");
      await expect(circle).toHaveAttribute("aria-hidden", "true");
      await expect(getComputedStyle(circle).aspectRatio).toBe("1 / 1");
    });
  },
};
