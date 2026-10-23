import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor } from "storybook/test";
import {
  captureCopiedText,
  getLines,
} from "@/components/code-block/utils/code-block.test-utils";
import { CommandSnippet } from "./command-snippet";

// VRT: `Base` snapshots the arrangement this pattern fixes. Output lines are
// covered by `Components/CodeBlock` `SmokeTest` (command block).
const meta: Meta<typeof CommandSnippet> = {
  title: "patterns/code/CommandSnippet",
  component: CommandSnippet,
};

export default meta;

type Story = StoryObj<typeof CommandSnippet>;

let clipboard: ReturnType<typeof captureCopiedText>;

const getPrompts = (line: HTMLElement) =>
  line.querySelector(".nimbus-code-block__prompt");

/**
 * A one-line command with a `$` prompt and a copy button, and no header.
 */
export const Base: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    command: "pnpm add @commercetools/nimbus",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The command has a prompt and a copy button", async () => {
      await expect(
        canvasElement.querySelector(".nimbus-code-block__header")
      ).toBeNull();
      const [line] = getLines(canvasElement);
      await expect(getPrompts(line)).toHaveTextContent("$");
      await expect(
        canvas.getByRole("button", { name: "Copy code" })
      ).toBeInTheDocument();
    });

    await step("The copy button does not cover the command", async () => {
      const pre = canvasElement.querySelector("pre")!;
      const button = canvas.getByRole("button", { name: "Copy code" });
      await expect(button.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        pre.getBoundingClientRect().right - 0.5
      );
    });

    await step("Without aria-label the snippet is not a region", async () => {
      await expect(canvas.queryByRole("region")).toBeNull();
    });
  },
};

/**
 * `prompt=""` shows no prompt.
 */
export const NoPrompt: Story = {
  args: {
    command: "pnpm add @commercetools/nimbus",
    prompt: "",
  },
  play: async ({ canvasElement, step }) => {
    await step("No prompt is rendered", async () => {
      await expect(
        canvasElement.querySelector(".nimbus-code-block__prompt")
      ).toBeNull();
    });
  },
};

/**
 * Output lines show no prompt, and copying excludes all prompts.
 */
export const OutputLines: Story = {
  args: {
    command: "npm whoami\nalice",
    outputLines: [2],
  },
  beforeEach: () => {
    clipboard = captureCopiedText();
    return clipboard.restore;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Line 1 has a prompt and line 2 has none", async () => {
      const [first, second] = getLines(canvasElement);
      await expect(getPrompts(first)).toHaveTextContent("$");
      await expect(getPrompts(second)).toBeNull();
    });

    await step("Copy puts the command without prompts", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));
      await waitFor(() =>
        expect(clipboard.copied).toEqual(["npm whoami\nalice"])
      );
    });
  },
};

/**
 * `aria-label` makes the snippet a named region.
 */
export const Named: Story = {
  args: {
    command: "pnpm add @commercetools/nimbus",
    "aria-label": "Install Nimbus",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The snippet is a region named by aria-label", async () => {
      await expect(
        canvas.getByRole("region", { name: "Install Nimbus" })
      ).toBeInTheDocument();
    });
  },
};
