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
