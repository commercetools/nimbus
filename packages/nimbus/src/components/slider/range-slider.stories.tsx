import type { Meta, StoryObj } from "@storybook/react-vite";
import { RangeSlider } from "@commercetools/nimbus";
import { within, expect, userEvent, fn } from "storybook/test";

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
