import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleButton } from "./toggle-button";
import { Box, Stack, Text } from "@/components";
import { userEvent, within, expect, fn } from "storybook/test";
import { ThumbUp, Star, Bookmark } from "@commercetools/nimbus-icons";
import { useState, createRef } from "react";

const meta: Meta<typeof ToggleButton> = {
  title: "components/Buttons/ToggleButton",
  component: ToggleButton,
};

export default meta;

type Story = StoryObj<typeof ToggleButton>;

const sizes = ["md", "xs", "2xs"] as const;

const variants = ["outline", "ghost"] as const;

const tones = ["primary", "neutral", "critical", "info"] as const;

export const Base: Story = {
  args: {
    children: "Toggle Me",
    onChange: fn(),
    /** @ts-expect-error - data-testid is not part of the component props but needed for testing */
    "data-testid": "test",
    "aria-label": "test-toggle-button",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");
    const onChange = args.onChange;

    await step("Uses a <button> element by default", async () => {
      await expect(button.tagName).toBe("BUTTON");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(button).toHaveAttribute("data-testid", "test");
      await expect(button).toHaveAttribute("aria-label", "test-toggle-button");
    });

    await step("Starts unselected", async () => {
      await expect(button).not.toHaveAttribute("data-selected", "true");
    });

    await step("Can be toggled by clicking", async () => {
      await userEvent.click(button);
      await expect(onChange).toHaveBeenCalledTimes(1);
      await expect(onChange).toHaveBeenCalledWith(true);
      await expect(button).toHaveAttribute("data-selected", "true");
    });

    await step("Can be toggled back", async () => {
      await userEvent.click(button);
      await expect(onChange).toHaveBeenCalledTimes(2);
      await expect(onChange).toHaveBeenCalledWith(false);
      await expect(button).not.toHaveAttribute("data-selected", "true");
      button.blur();
    });

    await step("Is focusable with <tab> key", async () => {
      await expect(button).not.toHaveFocus();
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step("Can be toggled with enter", async () => {
      await userEvent.keyboard("{enter}");
      await expect(onChange).toHaveBeenCalledTimes(3);
      await expect(onChange).toHaveBeenCalledWith(true);
    });

    await step("Can be toggled with space-bar", async () => {
      await expect(button).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(4);
      await expect(onChange).toHaveBeenCalledWith(false);
    });
  },
};

export const Controlled: Story = {
  render: () => {
    const [isSelected, setIsSelected] = useState(false);

    return (
      <Stack direction="column" align="start" gap="400">
        <ToggleButton isSelected={isSelected} onChange={setIsSelected}>
          Controlled Toggle (selected: {isSelected.toString()})
        </ToggleButton>
        <Box>
          <button onClick={() => setIsSelected(!isSelected)}>
            Toggle externally
          </button>
        </Box>
      </Stack>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => {
    return (
      <ToggleButton defaultSelected={true}>
        Uncontrolled Toggle (starts selected)
      </ToggleButton>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    return (
      <Stack gap="400" align="start">
        <ToggleButton>
          <ThumbUp />
          Like
        </ToggleButton>
        <ToggleButton>
          <Star />
          Favorite
        </ToggleButton>
        <ToggleButton>
          <Bookmark />
          Save
        </ToggleButton>
      </Stack>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="400" align="start">
        {sizes.map((size) => (
          <ToggleButton size={size}>Toggle</ToggleButton>
        ))}
      </Stack>
    );
  },
};

export const Variants: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="400">
        <Stack gap="400" align="center" direction="row">
          <Text width="128px">Default</Text>
          <Text width="128px">Selected</Text>
          <Text width="128px">Disabled</Text>
        </Stack>
        {variants.map((variant) => (
          <Stack key={variant} gap="400" align="center" direction="row">
            <ToggleButton width="128px" variant={variant}>
              {variant}
            </ToggleButton>
            <ToggleButton width="128px" variant={variant} isSelected>
              selected
            </ToggleButton>
            <ToggleButton width="128px" variant={variant} isDisabled>
              disabled
            </ToggleButton>
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const Tones: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="400">
        {tones.map((tone) => (
          <Stack key={tone} gap="400" align="center">
            <Box width="100px">{tone as string}:</Box>
            {variants.map((variant) => (
              <Stack key={variant} gap="400" align="center" direction="row">
                <ToggleButton tone={tone} width="128px" variant={variant}>
                  {variant}
                </ToggleButton>
                <ToggleButton
                  tone={tone}
                  width="128px"
                  variant={variant}
                  isSelected
                >
                  selected
                </ToggleButton>
                <ToggleButton
                  tone={tone}
                  width="128px"
                  variant={variant}
                  isDisabled
                >
                  disabled
                </ToggleButton>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Toggle",
    isDisabled: true,
    onChange: fn(),
    /** @ts-expect-error - data-testid is not part of the component props but needed for testing */
    "data-testid": "test",
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");
    const onChange = args.onChange;

    await step("Is disabled", async () => {
      await expect(button).toBeDisabled();
      await expect(button).toHaveAttribute("data-disabled", "true");
    });

    await step("Cannot be clicked when disabled", async () => {
      await userEvent.click(button);
      await expect(onChange).not.toHaveBeenCalled();
    });

    await step("Cannot receive focus when disabled", async () => {
      await userEvent.tab();
      await expect(button).not.toHaveFocus();
    });
  },
};

const toggleButtonRef = createRef<HTMLButtonElement>();
export const WithRef: Story = {
  args: {
    children: "Demo ToggleButton",
  },
  render: (args) => {
    return (
      <ToggleButton ref={toggleButtonRef} {...args}>
        {args.children}
      </ToggleButton>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await step("Does accept ref's", async () => {
      await expect(toggleButtonRef.current).toBe(button);
    });
  },
};
