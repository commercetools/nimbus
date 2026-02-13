import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Button, type ButtonProps, Stack } from "@commercetools/nimbus";
import { userEvent, within, expect, fn } from "storybook/test";
import { ArrowRight as DemoIcon } from "@commercetools/nimbus-icons";
import { createRef, useState } from "react";
import { SEMANTIC_COLOR_PALETTES } from "@/constants/color-palettes";

const meta: Meta<typeof Button> = {
  title: "Components/Buttons/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

const sizes: ButtonProps["size"][] = [
  //"2xl",
  //"xl",
  //"lg",
  "md",
  "sm",
  "xs",
  "2xs",
];

const variants: ButtonProps["variant"][] = [
  "solid",
  "subtle",
  "outline",
  "ghost",
  "link",
];

export const Base: Story = {
  args: {
    children: "Button",
    onPress: fn(),

    ["data-testid"]: "test",
    ["aria-label"]: "test-button",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");
    const onPress = args.onPress;

    await step("Uses a <button> element by default", async () => {
      await expect(button.tagName).toBe("BUTTON");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(button).toHaveAttribute("data-testid", "test");
      await expect(button).toHaveAttribute("aria-label", "test-button");
    });

    await step("Is clickable", async () => {
      button.click();
      await expect(onPress).toHaveBeenCalledTimes(1);
      button.blur();
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step("Can be triggered with enter", async () => {
      await userEvent.keyboard("{enter}");
      await expect(onPress).toHaveBeenCalledTimes(2);
    });

    await step("Can be triggered with space-bar", async () => {
      await expect(button).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(onPress).toHaveBeenCalledTimes(3);
    });
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    isDisabled: true,
    onPress: fn(),

    ["data-testid"]: "test",
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");

    await step("Can not be clicked", async () => {
      await userEvent.click(button);
      await userEvent.click(button);
      await expect(args.onPress).toHaveBeenCalledTimes(0);
    });

    await step("Can not be focused", async () => {
      await userEvent.tab();
      await expect(button).not.toHaveFocus();
    });

    await step("Sets disabled attribute on native <button>", async () => {
      await expect(button).toBeDisabled();
    });
  },
};

export const DisabledAsLink: Story = {
  args: {
    children: "Disabled Link Button",
    isDisabled: true,
    as: "a",
    ["data-testid"]: "test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");

    await step(
      "Sets aria-disabled (not disabled) and role='button' on non-native elements",
      async () => {
        await expect(button).toHaveAttribute("aria-disabled", "true");
        await expect(button).toHaveAttribute("role", "button");
        await expect(button).not.toHaveAttribute("disabled");
      }
    );
  },
};

export const AsLink: Story = {
  args: {
    children: "Link disguised as Button",
    as: "a",
    href: "/",
    ["data-testid"]: "test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByTestId("test");

    await step("Uses an <a> element", async () => {
      await expect(link.tagName).toBe("A");
    });
  },
};

export const WithAsChild: Story = {
  args: {
    children: (
      <a>
        <DemoIcon /> I look like a button but am using an a-tag
      </a>
    ),
    asChild: true,

    ["data-testid"]: "test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByTestId("test");

    await step("Uses an <a> element", async () => {
      await expect(link.tagName).toBe("A");
    });
  },
};

export const Sizes: Story = {
  args: {
    children: "Demo Button",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Button key={size as string} {...args} size={size} />
        ))}
      </Stack>
    );
  },
};

export const Variants: Story = {
  args: {
    children: "Demo Button",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {variants.map((size) => (
          <Button key={size as string} {...args} variant={size} />
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Possible Color Palettes
 */
export const ColorPalettes: Story = {
  render: () => {
    return (
      <Stack>
        {SEMANTIC_COLOR_PALETTES.map((colorPalette) => (
          <Stack
            key={colorPalette as string}
            direction="row"
            gap="400"
            alignItems="center"
          >
            {variants.map((variant) => (
              <Button
                minW="4000"
                key={variant as string}
                variant={variant}
                colorPalette={colorPalette}
              >{`${colorPalette} - ${variant}`}</Button>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};

const buttonRef = createRef<HTMLButtonElement>();

export const WithRef: Story = {
  args: {
    children: "Demo Button",
  },
  render: (args) => {
    return (
      <Button ref={buttonRef} {...args}>
        {args.children}
      </Button>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await step("Does accept ref's", async () => {
      await expect(buttonRef.current).toBe(button);
    });
  },
};

const Spacer = () => <Box flexGrow="1" />;
export const ComplexIconLayouts: Story = {
  args: {
    children: "Demo Button",
  },
  render: (args) => {
    const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
    return (
      <>
        <Button mb="800" onPress={() => setDir(dir === "ltr" ? "rtl" : "ltr")}>
          Change direction
        </Button>
        <Stack
          direction="column"
          gap="400"
          width="1/3"
          style={{ direction: dir }}
        >
          <Button {...args}>
            <DemoIcon />
            {args.children}
          </Button>
          <Button {...args}>
            Demo
            <DemoIcon />
            Button
          </Button>
          <Button {...args}>
            <Spacer />
            <DemoIcon />
            {args.children}
          </Button>
          <Button {...args}>
            <DemoIcon />
            {args.children}
            <Spacer />
          </Button>
          <Button {...args}>
            <DemoIcon />
            <Spacer />
            {args.children}
          </Button>
          <Button {...args}>
            {args.children}
            <Spacer />
            <DemoIcon />
          </Button>
        </Stack>
      </>
    );
  },
};

export const SmokeTest: Story = {
  args: {
    children: "Button",
    onPress: fn(),
    ["data-testid"]: "test",
    ["aria-label"]: "test-button",
  },
  render: (args) => {
    return (
      <Stack gap="1200">
        {SEMANTIC_COLOR_PALETTES.map((colorPalette) => (
          <Stack key={colorPalette as string} direction="column" gap="400">
            {sizes.map((size) => (
              <Stack direction="row" key={size as string}>
                {variants.map((variant) => (
                  <Stack
                    key={variant as string}
                    direction="column"
                    align="flex-start"
                  >
                    <Button
                      {...args}
                      variant={variant}
                      size={size}
                      colorPalette={colorPalette}
                    >
                      <DemoIcon />
                      {JSON.stringify(variant)} {args.children}
                      <DemoIcon />
                    </Button>
                    <Button
                      {...args}
                      as="a"
                      variant={variant}
                      size={size}
                      colorPalette={colorPalette}
                      isDisabled
                    >
                      <DemoIcon />
                      {JSON.stringify(variant)} {args.children}
                      <DemoIcon />
                    </Button>
                    <Button
                      {...args}
                      variant={variant}
                      size={size}
                      colorPalette={colorPalette}
                    >
                      <DemoIcon />
                      {JSON.stringify(variant)} {args.children}
                    </Button>
                    <Button
                      {...args}
                      variant={variant}
                      size={size}
                      colorPalette={colorPalette}
                    >
                      {JSON.stringify(variant)} {args.children}
                      <DemoIcon />
                    </Button>
                  </Stack>
                ))}
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};

/**
 * Verifies that each event handler fires exactly once per interaction,
 * guarding against the double-firing bug where mergeProps could combine
 * both the original and React Aria-processed handlers.
 */
export const EventHandlersFireOnce: Story = {
  args: {
    onClick: fn(),
    onPress: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onKeyDown: fn(),
    children: "Click Me",
    ["data-testid"]: "event-test",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("event-test");

    await step("onClick fires exactly once per click", async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step("onPress fires exactly once per click", async () => {
      await expect(args.onPress).toHaveBeenCalledTimes(1);
    });

    await step("onFocus fires exactly once after click", async () => {
      await expect(args.onFocus).toHaveBeenCalledTimes(1);
    });

    await step("onBlur fires exactly once after blur", async () => {
      await userEvent.tab(); // move focus away
      await expect(args.onBlur).toHaveBeenCalledTimes(1);
    });

    await step(
      "A second click increments all counts to exactly 2",
      async () => {
        await userEvent.click(button);
        await expect(args.onClick).toHaveBeenCalledTimes(2);
        await expect(args.onPress).toHaveBeenCalledTimes(2);
      }
    );

    await step("onKeyDown fires exactly once per keypress", async () => {
      // onKeyDown accumulated calls from earlier interactions (tab, etc.)
      const countBefore = (args.onKeyDown as ReturnType<typeof fn>).mock.calls
        .length;
      button.focus();
      await userEvent.keyboard("{Enter}");
      await expect(args.onKeyDown).toHaveBeenCalledTimes(countBefore + 1);
    });
  },
};

/**
 * Demonstrates Button consuming context from React Aria's ButtonContext.
 * This validates the useContextProps integration.
 */
export const WithinReactAriaContext: Story = {
  render: () => {
    return (
      <Button.Context.Provider value={{ isDisabled: true }}>
        <Button>Disabled by Context</Button>
      </Button.Context.Provider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Button consumes disabled prop from ButtonContext", async () => {
      const button = canvas.getByRole("button");

      // Native <button> gets the `disabled` attribute from useButton (not aria-disabled)
      await expect(button).toBeDisabled();
    });
  },
};

/**
 * Demonstrates Button consuming context from React Aria's ButtonContext.
 * This validates the useContextProps integration.
 */
export const OverrideContextWithLocalProps: Story = {
  render: () => {
    return (
      <Button.Context.Provider value={{ isDisabled: true }}>
        <Button isDisabled={false}>Not Disabled (Override)</Button>
      </Button.Context.Provider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Button local props override context disabled prop",
      async () => {
        const button = canvas.getByRole("button");

        // Verify Button's local isDisabled={false} overrides context isDisabled={true}
        await expect(button).not.toHaveAttribute("aria-disabled");
      }
    );
  },
};

/**
 * Verifies that React Aria event handler props passed via ButtonContext
 * are not forwarded to the DOM element (which would cause React warnings).
 */
export const DOMPropFiltering: Story = {
  render: () => {
    return (
      <Button.Context.Provider
        value={{
          onFocusChange: () => {},
          onHoverStart: () => {},
          onPressChange: () => {},
        }}
      >
        <Button data-testid="test">Test</Button>
      </Button.Context.Provider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Does not forward React Aria event props to DOM", async () => {
      const button = canvas.getByTestId("test");
      // These React Aria callback props should be consumed by hooks,
      // not forwarded as DOM attributes
      await expect(button).not.toHaveAttribute("onFocusChange");
      await expect(button).not.toHaveAttribute("onHoverStart");
      await expect(button).not.toHaveAttribute("onPressChange");
    });
  },
};
