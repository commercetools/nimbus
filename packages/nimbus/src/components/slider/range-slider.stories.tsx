import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, RangeSlider, Stack, Text } from "@commercetools/nimbus";
import { within, expect, userEvent, fn } from "storybook/test";

// Visual smoke-test axes. The full matrix is every combination of these, for
// both orientations — 2 × 2 × 2 × 2 = 16 cells, two thumbs each.
const SMOKE_VARIANTS = ["plain", "enclosed"] as const;
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

/**
 * The shared slot recipe means the visual variants apply to RangeSlider too:
 * `plain` (thin track) and `enclosed` (thick bar). The play function also locks
 * in the two-thumb geometry — both enclosed thumbs stay contained at the
 * extremes, and the enclosed fill cups *both* thumbs' outer edges (unlike the
 * single slider, whose lower end is the uncupped track start, a range fill is
 * bounded by two contained thumbs, so both edges must track a thumb).
 */
export const Variants: Story = {
  render: () => (
    <>
      <div data-testid="rs-plain">
        <RangeSlider
          aria-label="Plain range"
          variant="plain"
          defaultValue={[20, 60]}
        />
      </div>
      <div data-testid="rs-mid">
        <RangeSlider
          aria-label="Enclosed mid range"
          variant="enclosed"
          defaultValue={[25, 75]}
        />
      </div>
      <div data-testid="rs-full">
        <RangeSlider
          aria-label="Enclosed full range"
          variant="enclosed"
          defaultValue={[0, 100]}
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
    const geom = (id: string) => {
      const scope = `[data-testid="${id}"]`;
      const bar = canvasElement
        .querySelector(`${scope} [data-slot="root"]`)!
        .getBoundingClientRect();
      const fill = canvasElement
        .querySelector(`${scope} [data-slot="fill"]`)!
        .getBoundingClientRect();
      const thumbs = Array.from(
        canvasElement.querySelectorAll(`${scope} [data-slot="thumb"]`)
      ).map((t) => t.getBoundingClientRect());
      return { bar, fill, thumbs };
    };

    await step("each range slider renders two thumbs", async () => {
      // `[role="slider"]` (a literal-attribute CSS selector) never matches:
      // React Aria's SliderThumb renders a native <input type="range">, whose
      // "slider" role is implicit ARIA semantics, not a literal `role`
      // attribute in the DOM. Query by computed accessible role instead, as
      // the `Variants` story on `Slider` does. Three sliders → 6 thumbs.
      await expect(canvas.getAllByRole("slider")).toHaveLength(6);
    });

    await step(
      "the enclosed variant is a thick bar, thicker than plain",
      async () => {
        const enclosedH = parseFloat(getComputedStyle(track("rs-mid")).height);
        const plainH = parseFloat(getComputedStyle(track("rs-plain")).height);
        await expect(enclosedH).toBeGreaterThan(plainH);
      }
    );

    await step(
      "both enclosed thumbs stay within the bar at the extremes",
      async () => {
        // Full range: the lower thumb sits at the left end, the upper at the
        // right. React Aria centers them at the ends of the inset interactive
        // track and the visible bar reaches back over that inset, so each
        // thumb's box stays within the bar. Half-pixel tolerance for rounding.
        const { bar, thumbs } = geom("rs-full");
        await expect(thumbs).toHaveLength(2);
        for (const thumb of thumbs) {
          await expect(thumb.left).toBeGreaterThanOrEqual(bar.left - 0.5);
          await expect(thumb.right).toBeLessThanOrEqual(bar.right + 0.5);
        }
      }
    );

    await step("the enclosed fill cups both thumbs' outer edges", async () => {
      // Horizontal LTR: the fill spans from the lower thumb's left edge to the
      // upper thumb's right edge. Both bounds must track their thumb, not the
      // value point, at both a mid range and the full extremes.
      for (const id of ["rs-mid", "rs-full"]) {
        const { fill, thumbs } = geom(id);
        await expect(thumbs).toHaveLength(2);
        await expect(Math.abs(fill.left - thumbs[0].left)).toBeLessThanOrEqual(
          1.5
        );
        await expect(
          Math.abs(fill.right - thumbs[1].right)
        ).toBeLessThanOrEqual(1.5);
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
      // 2 orientations × 2 variants × 2 sizes × 2 disabled-states = 16 cells,
      // two thumbs each = 32 thumbs. A short count means some combination
      // failed to mount.
      await expect(canvas.getAllByRole("slider")).toHaveLength(32);
    });
  },
};
