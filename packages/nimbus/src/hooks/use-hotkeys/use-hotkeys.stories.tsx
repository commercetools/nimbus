import type { Meta, StoryObj } from "@storybook/react-vite";
import { useHotkeys } from "@commercetools/nimbus";
import { userEvent, expect, fn } from "storybook/test";
import { useState } from "react";

const UseHotkeysDemo = ({
  combo,
  onHotkey = () => {},
}: {
  combo: string;
  onHotkey?: () => void;
}) => {
  const [ran, setRan] = useState(0);

  useHotkeys(combo, () => {
    setRan(ran + 1);
    onHotkey();
  });

  return (
    <div>
      {ran >= 1
        ? `Success, fn ran ${ran} x times`
        : `Click here + hit ${combo} to trigger hotkey`}
    </div>
  );
};

const meta: Meta<typeof UseHotkeysDemo> = {
  title: "Hooks/UseHotkeys",
  component: UseHotkeysDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["!autodocs"],
};

export default meta;
type Story = StoryObj<typeof UseHotkeysDemo>;

export const SingleKey: Story = {
  args: {
    combo: "Escape",
    onHotkey: fn(),
  },
  play: async ({ args, step }) => {
    const onHotkey = args.onHotkey;
    await step("Trigger hotkey", async () => {
      await expect(onHotkey).toHaveBeenCalledTimes(0);
      await userEvent.keyboard("{Escape}");
      await expect(onHotkey).toHaveBeenCalledTimes(1);
    });
  },
};

export const KeyCombo: Story = {
  args: {
    combo: "Ctrl+l",
    onHotkey: fn(),
  },
  play: async ({ args, step }) => {
    const onHotkey = args.onHotkey;
    await step("Trigger hotkey combination", async () => {
      await expect(onHotkey).toHaveBeenCalledTimes(0);
      await userEvent.keyboard("{Control>}l{/Control}");
      await expect(onHotkey).toHaveBeenCalledTimes(1);
    });
  },
};

export const LowercaseEscapeKey: Story = {
  args: {
    combo: "escape",
    onHotkey: fn(),
  },
  play: async ({ args, step }) => {
    const onHotkey = args.onHotkey;
    await step("Trigger lowercase escape hotkey", async () => {
      await expect(onHotkey).toHaveBeenCalledTimes(0);
      await userEvent.keyboard("{Escape}");
      await expect(onHotkey).toHaveBeenCalledTimes(1);
    });
  },
};
