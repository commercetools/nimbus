import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, RangeSlider, Stack, Text } from "@commercetools/nimbus";
import { within, expect, userEvent, fn } from "storybook/test";

// Visual smoke-test axes. The full matrix is every combination of these, for
// both orientations — 2 × 4 × 2 × 2 = 32 cells, two thumbs each.
const SMOKE_VARIANTS = ["solid", "outline", "minimal", "enclosed"] as const;
const SMOKE_SIZES = ["sm", "md"] as const;
const SMOKE_DISABLED = [false, true] as const;
const SMOKE_ORIENTATIONS = ["horizontal", "vertical"] as const;

// Set once on an ancestor; vertical slider roots read this custom property for
// their length (`var(--slider-vertical-length, 200px)` in slider.recipe.ts),
// and it cascades to every vertical cell. Horizontal sliders ignore it.
const smokeVerticalLength = {
  "--slider-vertical-length": "140px",
} as CSSProperties;

const meta: Meta<typeof RangeSlider> = {
  title: "Components/RangeSlider",
  component: RangeSlider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

/** Uncontrolled two-thumb range slider. */
export const Base: Story = {
  args: {
    "aria-label": "Price range",
    defaultValue: [20, 60],
    minValue: 0,
    maxValue: 100,
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const thumbs = canvas.getAllByRole("slider");

    await step("renders two thumbs with the initial values", async () => {
      // React Aria's SliderThumb renders a native <input type="range">; its
      // accessible value comes from the `value` DOM property (implicit ARIA
      // mapping), not an explicit `aria-valuenow` attribute.
      await expect(thumbs).toHaveLength(2);
      await expect(thumbs[0]).toHaveValue("20");
      await expect(thumbs[1]).toHaveValue("60");
    });

    await step(
      "labels each thumb with localized defaults (no thumbLabels arg given)",
      async () => {
        await expect(thumbs[0]).toHaveAttribute("aria-label", "Minimum");
        await expect(thumbs[1]).toHaveAttribute("aria-label", "Maximum");
      }
    );

    await step("emits an array on change", async () => {
      thumbs[0].focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect(args.onChange).toHaveBeenCalledWith([21, 60]);
    });

    await step("lower thumb cannot cross the upper thumb", async () => {
      thumbs[0].focus();
      await userEvent.keyboard("{End}");
      // clamped at the upper thumb's value, never above it; read the live
      // `.value` DOM property (not an attribute — see the "toHaveValue" note
      // above).
      const lower = Number((thumbs[0] as HTMLInputElement).value);
      const upper = Number((thumbs[1] as HTMLInputElement).value);
      await expect(lower).toBeLessThanOrEqual(upper);
    });
  },
};

/** shared slot recipe means the visual variant applies to RangeSlider too. */
export const Variants: Story = {
  render: () => (
    <>
      <div data-testid="rs-outline">
        <RangeSlider
          aria-label="Outline range"
          variant="outline"
          defaultValue={[20, 60]}
        />
      </div>
      <div data-testid="rs-enclosed">
        <RangeSlider
          aria-label="Enclosed range"
          variant="enclosed"
          defaultValue={[30, 70]}
        />
      </div>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const track = (id: string) =>
      canvasElement.querySelector(
        `[data-testid="${id}"] [data-slot="track"]`
      ) as HTMLElement;

    await step("each range slider still renders two thumbs", async () => {
      // `[role="slider"]` (a literal-attribute CSS selector) never matches:
      // React Aria's SliderThumb renders a native <input type="range">, whose
      // "slider" role is implicit ARIA semantics, not a literal `role`
      // attribute in the DOM. Query by computed accessible role instead, as
      // the `Variants` story on `Slider` does.
      await expect(canvas.getAllByRole("slider")).toHaveLength(4);
    });

    await step(
      "outline variant applies to RangeSlider (transparent track)",
      async () => {
        await expect(
          getComputedStyle(track("rs-outline")).backgroundColor
        ).toBe("rgba(0, 0, 0, 0)");
      }
    );

    await step(
      "enclosed variant applies to RangeSlider (thick bar)",
      async () => {
        const enclosedH = parseFloat(
          getComputedStyle(track("rs-enclosed")).height
        );
        const outlineH = parseFloat(
          getComputedStyle(track("rs-outline")).height
        );
        await expect(enclosedH).toBeGreaterThan(outlineH);
      }
    );
  },
};

/**
 * Both `enclosed` thumbs stay inside the bar at the extremes. With the range
 * spanning the full track, the lower thumb sits at the left end and the upper
 * thumb at the right end; the per-value margin correction (shared recipe +
 * slider-base) must keep each thumb's box within the track's box.
 */
export const EnclosedThumbContainment: Story = {
  render: () => (
    <div data-testid="rs">
      <RangeSlider
        aria-label="Full range"
        variant="enclosed"
        defaultValue={[0, 100]}
      />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const track = canvasElement
      .querySelector('[data-testid="rs"] [data-slot="track"]')!
      .getBoundingClientRect();
    const thumbs = Array.from(
      canvasElement.querySelectorAll('[data-testid="rs"] [data-slot="thumb"]')
    ).map((el) => el.getBoundingClientRect());

    await step("both thumbs stay within the track", async () => {
      await expect(thumbs).toHaveLength(2);
      // Half-pixel tolerance for sub-pixel rounding; pre-fix overhang is a
      // whole thumb radius.
      for (const thumb of thumbs) {
        await expect(thumb.left).toBeGreaterThanOrEqual(track.left - 0.5);
        await expect(thumb.right).toBeLessThanOrEqual(track.right + 0.5);
      }
    });
  },
};

/**
 * Visual smoke test: every combination of orientation × variant × size ×
 * disabled-state rendered in one grid, so the whole visual surface can be
 * eyeballed at once and any combination that fails to mount is caught. The
 * play function only asserts that all 32 cells rendered (two thumbs each).
 */
export const SmokeTest: Story = {
  render: () => (
    // Custom property set on a plain ancestor so it cascades to every vertical
    // slider root below (CSS custom properties inherit).
    <div style={smokeVerticalLength}>
      <Stack direction="column" gap="800">
        {SMOKE_ORIENTATIONS.map((orientation) => (
          <Stack key={orientation} direction="column" gap="500">
            <Text fontWeight="700" textTransform="capitalize">
              {orientation}
            </Text>
            {SMOKE_VARIANTS.map((variant) => (
              <Stack key={variant} direction="column" gap="200">
                <Text fontWeight="600" color="neutral.11">
                  {variant}
                </Text>
                <Grid
                  templateColumns={
                    orientation === "vertical"
                      ? "repeat(4, max-content)"
                      : "repeat(2, minmax(0, 1fr))"
                  }
                  gap="600"
                  alignItems="start"
                >
                  {SMOKE_SIZES.flatMap((size) =>
                    SMOKE_DISABLED.map((isDisabled) => {
                      const label = `${size} · ${
                        isDisabled ? "disabled" : "enabled"
                      }`;
                      return (
                        <Stack key={label} direction="column" gap="100">
                          <Text fontSize="300" color="neutral.11">
                            {label}
                          </Text>
                          <RangeSlider
                            aria-label={`${orientation} ${variant} ${label}`}
                            variant={variant}
                            size={size}
                            orientation={orientation}
                            isDisabled={isDisabled}
                            defaultValue={[30, 70]}
                            showTicks
                            tickStep={25}
                          />
                        </Stack>
                      );
                    })
                  )}
                </Grid>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("every combination in the matrix renders", async () => {
      // 2 orientations × 4 variants × 2 sizes × 2 disabled-states = 32 cells,
      // two thumbs each = 64 thumbs. A short count means some combination
      // failed to mount.
      await expect(canvas.getAllByRole("slider")).toHaveLength(64);
    });
  },
};
