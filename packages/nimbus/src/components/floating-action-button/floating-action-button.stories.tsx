import type { Meta, StoryObj } from "@storybook/react-vite";
import { FloatingActionButton, Stack } from "@commercetools/nimbus";
import { Add as AddIcon } from "@commercetools/nimbus-icons";
import { expect, fn, within, userEvent } from "storybook/test";
import { SEMANTIC_COLOR_PALETTES } from "@/constants/color-palettes";

const meta: Meta<typeof FloatingActionButton> = {
  title: "Components/Buttons/FloatingActionButton",
  component: FloatingActionButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof FloatingActionButton>;

export const Base: Story = {
  args: {
    children: <AddIcon />,
    onPress: fn(),
    "aria-label": "Add item",
    "data-testid": "test",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");

    await step("Uses a <button> element by default", async () => {
      await expect(button.tagName).toBe("BUTTON");
    });

    await step("Forwards aria-label attribute", async () => {
      await expect(button).toHaveAttribute("aria-label", "Add item");
    });

    await step("Is clickable", async () => {
      await userEvent.click(button);
      await expect(args.onPress).toHaveBeenCalledTimes(1);
      button.blur();
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step("Can be triggered with Enter", async () => {
      await userEvent.keyboard("{enter}");
      await expect(args.onPress).toHaveBeenCalledTimes(2);
    });

    await step("Can be triggered with Space", async () => {
      await expect(button).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(args.onPress).toHaveBeenCalledTimes(3);
    });
  },
};

export const Disabled: Story = {
  args: {
    children: <AddIcon />,
    isDisabled: true,
    onPress: fn(),
    "aria-label": "Add item (disabled)",
    "data-testid": "test",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");

    await step("Cannot be clicked", async () => {
      await userEvent.click(button);
      await expect(args.onPress).toHaveBeenCalledTimes(0);
    });

    await step("Cannot be focused", async () => {
      await userEvent.tab();
      await expect(button).not.toHaveFocus();
    });

    await step("Sets disabled attribute", async () => {
      await expect(button).toBeDisabled();
    });
  },
};

export const ColorPalettes: Story = {
  render: () => (
    <Stack direction="row" gap="400" alignItems="center" flexWrap="wrap">
      {SEMANTIC_COLOR_PALETTES.map((colorPalette) => (
        <FloatingActionButton
          key={colorPalette as string}
          colorPalette={colorPalette}
          aria-label={`${colorPalette} action`}
        >
          <AddIcon />
        </FloatingActionButton>
      ))}
    </Stack>
  ),
};

export const SmokeTest: Story = {
  args: {
    children: <AddIcon />,
    onPress: fn(),
    "aria-label": "Test action",
    "data-testid": "smoke-test",
  },
  render: (args) => (
    <Stack direction="row" gap="400" alignItems="center" flexWrap="wrap">
      <FloatingActionButton {...args} />
      <FloatingActionButton {...args} isDisabled />
      {SEMANTIC_COLOR_PALETTES.map((colorPalette) => (
        <FloatingActionButton
          key={colorPalette as string}
          {...args}
          colorPalette={colorPalette}
        />
      ))}
    </Stack>
  ),
};
