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
        await expect(args.onChange).toHaveBeenCalled();
      }
    );

    await step("jumps to max with End", async () => {
      await userEvent.keyboard("{End}");
      await expect(thumb).toHaveValue("100");
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
