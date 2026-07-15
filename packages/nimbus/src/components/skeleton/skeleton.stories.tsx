import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useEffect } from "react";
import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Stack,
  Box,
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

    await step("Applies a small rounded corner (not circular)", async () => {
      // Assert the visual intent (a small positive radius), not the exact token
      // pixel value, so a token tweak doesn't break the test.
      const radius = parseFloat(getComputedStyle(skeleton).borderRadius);
      await expect(radius).toBeGreaterThan(0);
      await expect(radius).toBeLessThan(40); // small relative to the 40px box
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

    await step("Applies a fully-rounded radius (≥ half its size)", async () => {
      // A radius ≥ half the box makes it visually circular, regardless of the
      // exact `radii.full` token value.
      const radius = parseFloat(getComputedStyle(skeleton).borderRadius);
      await expect(radius).toBeGreaterThanOrEqual(32); // half of the 64px box
    });

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
 * pulse/wave animation and the `::after` shimmer. A JS `matchMedia` mock cannot
 * influence a real CSS media query, so rather than fake it, the play function
 * asserts the compiled stylesheet actually ships the rule — guarding the
 * recipe's `_motionReduce` block from being dropped. Verify the visual behavior
 * by enabling "Reduce motion" in your OS — the skeletons below become static.
 */
export const ReducedMotion: Story = {
  render: () => (
    <Stack direction="row" gap="400" alignItems="center">
      <Skeleton
        data-testid="rm-pulse"
        width="4800"
        height="1000"
        animation="pulse"
      />
      <Skeleton width="4800" height="1000" animation="wave" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Animates by default (baseline)", async () => {
      const el = canvas.getByTestId("rm-pulse");
      await expect(getComputedStyle(el).animationName).toBe("pulse");
    });

    await step(
      "Ships a prefers-reduced-motion rule for the skeleton's compiled class",
      async () => {
        // The recipe compiles to a hashed atomic class (e.g. "css-abc123")
        // alongside the semantic "nimbus-skeleton" class; the `_motionReduce`
        // block targets the hashed one. Anchor the assertion to this element's
        // actual class so removing `_motionReduce` fails the test.
        const el = canvas.getByTestId("rm-pulse");
        const hashed = Array.from(el.classList).find((c) =>
          c.startsWith("css-")
        );
        await expect(hashed).toBeTruthy();

        const hasReducedMotionRule = Array.from(document.styleSheets).some(
          (sheet) => {
            let rules: CSSRule[];
            try {
              rules = Array.from(sheet.cssRules);
            } catch {
              return false; // cross-origin sheet — skip
            }
            // A rule's cssText includes its nested @media blocks, so this
            // matches whether the block is emitted flat or nested.
            return rules.some(
              (rule) =>
                rule.cssText.includes("prefers-reduced-motion") &&
                rule.cssText.includes(`.${hashed}`)
            );
          }
        );
        await expect(hasReducedMotionRule).toBe(true);
      }
    );
  },
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

    // Allow ±1px tolerance — layout geometry can round differently across
    // browsers/zoom; the intent is "matches the text style", not exact pixels.
    const near = async (actual: number, expected: number) =>
      expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1);

    await step(
      "body: bar ≈ 16px, pitch ≈ 26px (body line-height)",
      async () => {
        const { barHeight, pitch } = measure("st-body");
        await near(barHeight, 16);
        await near(pitch, 26);
      }
    );

    await step("3xl: bar ≈ 30px, pitch ≈ 36px (3xl line-height)", async () => {
      const { barHeight, pitch } = measure("st-heading");
      await near(barHeight, 30);
      await near(pitch, 36);
    });
  },
};

/**
 * SkeletonCircleStory — the circular placeholder sizes via the avatar-aligned
 * `size` prop (2xs/xs/md), a custom `boxSize`, or defaults to a 1em circle when
 * neither is set.
 */
export const SkeletonCircleStory: Story = {
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

/**
 * LoadingLayoutShowcase — TEMPORARY story for the PR screenshot. A realistic
 * "content card, still loading" assembled from the whole family: a SkeletonCircle
 * avatar, textStyle-matched SkeletonText for the name/heading, a media block, a
 * body paragraph, a stat row, and two action buttons. Every element uses
 * `animation="none"` so the layout is frozen for a clean still screenshot. Pure
 * visual (no play function) — safe to delete after the screenshot is captured.
 */
export const LoadingLayoutShowcase: Story = {
  name: "Loading Layout (PR showcase)",
  render: () => (
    <Box
      width="440px"
      borderWidth="1px"
      borderColor="neutral.6"
      borderRadius="300"
      padding="600"
    >
      <Stack gap="600">
        {/* Header: avatar + name / subtitle */}
        <Stack direction="row" gap="400" alignItems="center">
          <SkeletonCircle size="md" animation="none" />
          <Stack gap="200" flexGrow="1">
            <SkeletonText
              textStyle="lg"
              lines={1}
              width="60%"
              animation="none"
            />
            <SkeletonText
              textStyle="sm"
              lines={1}
              width="40%"
              animation="none"
            />
          </Stack>
        </Stack>

        {/* Hero media */}
        <Skeleton width="100%" height="4800" animation="none" />

        {/* Body copy */}
        <SkeletonText lines={4} animation="none" />

        {/* Stat row */}
        <Stack direction="row" gap="400">
          <Stack gap="200" flexGrow="1">
            <SkeletonText
              textStyle="2xl"
              lines={1}
              width="50%"
              animation="none"
            />
            <SkeletonText
              textStyle="xs"
              lines={1}
              width="80%"
              animation="none"
            />
          </Stack>
          <Stack gap="200" flexGrow="1">
            <SkeletonText
              textStyle="2xl"
              lines={1}
              width="50%"
              animation="none"
            />
            <SkeletonText
              textStyle="xs"
              lines={1}
              width="80%"
              animation="none"
            />
          </Stack>
        </Stack>

        {/* Action buttons */}
        <Stack direction="row" gap="300">
          <Skeleton width="4400" height="1000" animation="none" />
          <Skeleton width="4400" height="1000" animation="none" />
        </Stack>
      </Stack>
    </Box>
  ),
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
      <SkeletonCircle data-testid="smoke-circle" size="md" />
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
