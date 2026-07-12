import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField, Slider } from "@commercetools/nimbus";
import { within, expect, userEvent, fn } from "storybook/test";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

/** Uncontrolled single-value slider. No visible label or output; value shows in a tooltip. */
export const Base: Story = {
  args: {
    "aria-label": "Volume",
    defaultValue: 30,
    minValue: 0,
    maxValue: 100,
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const thumb = canvas.getByRole("slider");

    await step(
      "renders the initial value and no visible label/output",
      async () => {
        // React Aria's SliderThumb renders a native <input type="range">;
        // its accessible value comes from the `value` DOM property (implicit
        // ARIA mapping), not an explicit `aria-valuenow` attribute.
        await expect(thumb).toHaveValue("30");
        await expect(canvas.queryByText("Volume")).not.toBeInTheDocument();
      }
    );

    await step("shows a value tooltip on hover", async () => {
      await userEvent.hover(thumb);
      const tip = await body.findByRole("tooltip");
      await expect(tip).toHaveTextContent("30");
      await userEvent.unhover(thumb);
    });

    await step(
      "increments with ArrowRight and the focused tooltip updates",
      async () => {
        await userEvent.tab();
        await expect(thumb).toHaveFocus();
        const tip = await body.findByRole("tooltip");
        await userEvent.keyboard("{ArrowRight}");
        await expect(thumb).toHaveValue("31");
        await expect(tip).toHaveTextContent("31");
        // `SliderBase` accepts `number | number[]` internally so the same
        // implementation can serve RangeSlider too — the `props as
        // SliderBaseProps` cast in `slider.tsx` erases the compiler's check
        // that a plain `Slider`'s `onChange` only ever receives a bare
        // `number` (never an array). Assert the real runtime shape.
        await expect(args.onChange).toHaveBeenCalledWith(31);
      }
    );

    await step("jumps to max with End", async () => {
      await userEvent.keyboard("{End}");
      await expect(thumb).toHaveValue("100");
    });

    await step("jumps to min with Home", async () => {
      await userEvent.keyboard("{Home}");
      await expect(thumb).toHaveValue("0");
    });

    await step(
      "PageUp increases by React Aria's larger page step",
      async () => {
        // React Aria's default page step is
        // max(round((maxValue - minValue) / 10, step), step) — with
        // minValue=0, maxValue=100, step=1 (the default), that's 10, a
        // bigger jump than the single `step` used by ArrowRight/ArrowLeft.
        await userEvent.keyboard("{PageUp}");
        await expect(thumb).toHaveValue("10");
      }
    );

    await step("PageDown decreases by the same page step", async () => {
      await userEvent.keyboard("{PageDown}");
      await expect(thumb).toHaveValue("0");
    });
  },
};

/** Vertical orientation. */
export const Vertical: Story = {
  args: {
    "aria-label": "Zoom",
    defaultValue: 40,
    minValue: 0,
    maxValue: 100,
    orientation: "vertical",
    onChange: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole("slider");
    const root = canvasElement.querySelector('[data-slot="root"]');

    await step("root and thumb are marked vertical", async () => {
      // React Aria's Slider group sets `data-orientation` on the root div;
      // SliderThumb's underlying <input type="range"> gets a literal
      // `aria-orientation` attribute (unlike `aria-valuenow`, which is never
      // set — see the Base story comment above).
      await expect(root).toHaveAttribute("data-orientation", "vertical");
      await expect(thumb).toHaveAttribute("aria-orientation", "vertical");
    });

    await step("ArrowUp increases value", async () => {
      thumb.focus();
      await userEvent.keyboard("{ArrowUp}");
      await expect(thumb).toHaveValue("41");
    });
  },
};

/**
 * Vertical orientation with tick marks. Regression guard for
 * orientation-aware tick positioning: before the fix, every tick anchored
 * with the recipe's static horizontal `top: 50%` and the inline `left: X%`
 * physical offset, so on a vertical track they rendered stacked at the same
 * height instead of distributed along the track.
 */
export const VerticalWithTicks: Story = {
  args: {
    "aria-label": "Level",
    defaultValue: 50,
    minValue: 0,
    maxValue: 100,
    step: 25,
    orientation: "vertical",
    showTicks: true,
  },
  play: async ({ canvasElement, step }) => {
    await step(
      "renders one tick per step, distributed along the vertical track",
      async () => {
        const ticks = Array.from(
          canvasElement.querySelectorAll<HTMLElement>('[data-slot="tick"]')
        );
        // 0, 25, 50, 75, 100 -> 5 ticks
        await expect(ticks).toHaveLength(5);

        // Each tick's resolved `bottom` offset must be distinct — if they
        // were still stacked at a shared cross-axis anchor (the pre-fix
        // `top: 50%` bug), every offset would collapse to the same value.
        const bottomOffsets = ticks.map(
          (tick) => getComputedStyle(tick).bottom
        );
        await expect(new Set(bottomOffsets).size).toBe(ticks.length);
      }
    );
  },
};

/** Small and medium sizes render side by side. */
export const Sizes: Story = {
  render: () => (
    <>
      <Slider aria-label="Small" size="sm" defaultValue={30} data-testid="sm" />
      <Slider
        aria-label="Medium"
        size="md"
        defaultValue={30}
        data-testid="md"
      />
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("both sizes render a slider thumb", async () => {
      await expect(canvas.getAllByRole("slider")).toHaveLength(2);
    });
  },
};

/** Slider with visible tick marks every 25 units (0, 25, 50, 75, 100). */
export const WithTicks: Story = {
  args: {
    "aria-label": "Rating",
    defaultValue: 50,
    minValue: 0,
    maxValue: 100,
    step: 25,
    showTicks: true,
  },
  play: async ({ canvasElement, step }) => {
    await step("renders one tick per step from min to max", async () => {
      const ticks = canvasElement.querySelectorAll('[data-slot="tick"]');
      // 0, 25, 50, 75, 100 -> 5 ticks
      await expect(ticks).toHaveLength(5);
    });
  },
};

/** Disabled slider does not respond to keyboard input. */
export const Disabled: Story = {
  args: {
    "aria-label": "Volume",
    defaultValue: 30,
    minValue: 0,
    maxValue: 100,
    isDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole("slider");
    const root = canvasElement.querySelector('[data-slot="root"]');

    await step("marks the root disabled", async () => {
      await expect(root).toHaveAttribute("data-disabled", "true");
    });

    await step("does not move on keyboard input", async () => {
      thumb.focus();
      await userEvent.keyboard("{ArrowRight}");
      // React Aria's SliderThumb renders a native <input type="range">; its
      // accessible value comes from the `value` DOM property (implicit ARIA
      // mapping), not an explicit `aria-valuenow` attribute.
      await expect(thumb).toHaveValue("30");
    });
  },
};

/**
 * `formatOptions` formats the value shown in the thumb's tooltip without
 * changing the underlying numeric value.
 */
export const FormattedValue: Story = {
  args: {
    "aria-label": "Discount",
    defaultValue: 0.2,
    minValue: 0,
    maxValue: 1,
    step: 0.01,
    formatOptions: { style: "percent" },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const thumb = canvas.getByRole("slider");

    await step(
      "shows the formatted value in the tooltip, proving formatOptions reaches getThumbValueLabel",
      async () => {
        // The raw numeric value stays untouched...
        await expect(thumb).toHaveValue("0.2");

        // ...but the tooltip (fed by `state.getThumbValueLabel`, see
        // slider-base.tsx) shows the formatted percentage instead.
        await userEvent.hover(thumb);
        const tip = await body.findByRole("tooltip");
        await expect(tip).toHaveTextContent("%");
        await userEvent.unhover(thumb);
      }
    );
  },
};

/**
 * Slider composed inside FormField. FormField.Input clones its
 * React-Aria-named `inputProps` (id/aria-labelledby/aria-describedby/
 * isInvalid/isDisabled/...) onto the Slider, associating the FormField
 * label + description and surfacing the invalid state.
 */
export const WithFormField: Story = {
  render: () => (
    <FormField.Root isInvalid>
      <FormField.Label>Opacity</FormField.Label>
      <FormField.Input>
        <Slider defaultValue={50} minValue={0} maxValue={100} />
      </FormField.Input>
      <FormField.Description>Adjust layer opacity</FormField.Description>
      <FormField.Error>Value is out of range</FormField.Error>
    </FormField.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole("slider");
    const root = canvasElement.querySelector('[data-slot="root"]');

    await step("associates the FormField label", async () => {
      // React Aria's slider group is labelled by the FormField label.
      const group = canvasElement.querySelector('[role="group"]') ?? root;
      await expect(group).toHaveAttribute("aria-labelledby");
      // The thumb itself must resolve to a real name. aria-labelledby is
      // not transitive per WAI-ARIA — the thumb's default `aria-labelledby`
      // (the group's own id) alone would resolve to nothing here, since the
      // group is named indirectly via the FormField <label>, not a literal
      // aria-label. React Aria always prepends the group's own id to the
      // thumb's aria-labelledby, and the group's content-based fallback name
      // picks up the thumb's live value (an embedded-control accname rule,
      // the same behavior as `<label>Age <input value="5"></label>` naming
      // itself "Age 5") — so match by substring rather than exact string.
      await expect(thumb).toHaveAccessibleName(/Opacity/);
    });

    await step("reflects the invalid state", async () => {
      await expect(root).toHaveAttribute("data-invalid", "true");
    });

    await step("remains operable", async () => {
      thumb.focus();
      await userEvent.keyboard("{ArrowRight}");
      // React Aria's SliderThumb renders a native <input type="range">; its
      // accessible value comes from the `value` DOM property (implicit ARIA
      // mapping), not an explicit `aria-valuenow` attribute.
      await expect(thumb).toHaveValue("51");
    });
  },
};
