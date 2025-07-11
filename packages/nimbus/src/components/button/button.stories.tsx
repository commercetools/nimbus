import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Box, Stack } from "@/components";
import type { ButtonProps } from "./button.types";
import { userEvent, within, expect, fn } from "storybook/test";
import { ArrowRight as DemoIcon } from "@commercetools/nimbus-icons";
import { createRef, useState } from "react";

const meta: Meta<typeof Button> = {
  title: "components/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

const sizes: ButtonProps["size"][] = [
  //"2xl",
  //"xl",
  //"lg",
  "md",
  //"sm",
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

const tones: ButtonProps["tone"][] = [
  "primary",
  "neutral",
  "critical",
] as const;

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

    // ATTENTION: react-aria does some complicated science,
    // if there is a **KEYSTROKE** before the click (like a tab-key aiming to focus the button),
    // the first click is not counted as a valid click
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

export const Tones: Story = {
  args: {
    children: "Demo Button",
  },
  render: (args) => {
    return (
      <Stack>
        {tones.map((tone) => (
          <Stack
            key={tone as string}
            direction="row"
            gap="400"
            alignItems="center"
          >
            {variants.map((variant) => (
              <Button
                key={variant as string}
                {...args}
                variant={variant}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                tone={tone}
              />
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
        <Button mb="800" onClick={() => setDir(dir === "ltr" ? "rtl" : "ltr")}>
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
        {tones.map((tone) => (
          <Stack key={tone as string} direction="column" gap="400">
            {sizes.map((size) => (
              <Stack direction="row" key={size as string}>
                {variants.map((variant) => (
                  <Box key={variant as string}>
                    <Stack direction="column" css={{ "> *": { flex: "none" } }}>
                      <Box>
                        <Button
                          {...args}
                          variant={variant}
                          size={size}
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          tone={tone}
                        >
                          <DemoIcon />
                          {JSON.stringify(variant)} {args.children}
                          <DemoIcon />
                        </Button>
                      </Box>
                      <Box>
                        <Button
                          {...args}
                          as="a"
                          variant={variant}
                          size={size}
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          tone={tone}
                          isDisabled
                        >
                          <DemoIcon />
                          {JSON.stringify(variant)} {args.children}
                          <DemoIcon />
                        </Button>
                      </Box>
                      <Box>
                        <Button
                          {...args}
                          variant={variant}
                          size={size}
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          tone={tone}
                        >
                          <DemoIcon />
                          {JSON.stringify(variant)} {args.children}
                        </Button>
                      </Box>
                      <Box>
                        <Button
                          {...args}
                          variant={variant}
                          size={size}
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          tone={tone}
                        >
                          {JSON.stringify(variant)} {args.children}
                          <DemoIcon />
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};
