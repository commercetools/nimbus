import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { captureCopiedText } from "@/components/code-block/utils/code-block.test-utils";
import { JsonSnippet } from "./json-snippet";

const meta: Meta<typeof JsonSnippet> = {
  title: "patterns/code/JsonSnippet",
  component: JsonSnippet,
};

export default meta;

type Story = StoryObj<typeof JsonSnippet>;

const getCode = (container: HTMLElement) =>
  container.querySelector(".nimbus-code-block__code");

let clipboard: ReturnType<typeof captureCopiedText>;

/**
 * Any value is shown as highlighted JSON.
 */
export const Base: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    value: { name: "x", count: 2, tags: ["a", "b"], active: true },
  },
  play: async ({ canvasElement, step }) => {
    await step("The language label is json", async () => {
      await expect(
        canvasElement.querySelector(".nimbus-code-block__languageLabel")
      ).toHaveTextContent("json");
    });

    await step("Keys, strings and numbers are highlighted", async () => {
      const code = getCode(canvasElement)!;
      await expect(code.querySelector(".token.property")).toHaveTextContent(
        '"name"'
      );
      await expect(code.querySelector(".token.string")).toHaveTextContent(
        '"x"'
      );
      await expect(code.querySelector(".token.number")).toHaveTextContent("2");
    });
  },
};

/**
 * `indent` sets the spaces per level.
 */
export const Indentation: Story = {
  args: {
    value: { a: 1 },
    indent: 4,
  },
  play: async ({ canvasElement, step }) => {
    await step("Lines are indented with 4 spaces", async () => {
      const lines = canvasElement.querySelectorAll(
        ".nimbus-code-block__lineContent"
      );
      await expect(lines).toHaveLength(3);
      await expect(lines[1].textContent).toBe('    "a": 1');
    });
  },
};

const circular: Record<string, unknown> = { name: "root" };
circular.self = circular;

/**
 * Values that `JSON.stringify` cannot handle render without errors.
 */
export const SafeFormatting: Story = {
  render: () => (
    <>
      <JsonSnippet value={circular} aria-label="Circular" />
      <JsonSnippet value={{ id: 12345678901234567890n }} aria-label="BigInt" />
      <JsonSnippet value={undefined} aria-label="Undefined" />
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const code = (name: string) =>
      getCode(canvas.getByRole("region", { name }));

    await step("A circular reference is shown as [Circular]", async () => {
      await expect(code("Circular")).toHaveTextContent('"self": "[Circular]"');
    });

    await step("A BigInt is shown as its decimal string", async () => {
      await expect(code("BigInt")).toHaveTextContent(
        '"id": "12345678901234567890"'
      );
    });

    await step("undefined is shown as the text undefined", async () => {
      await expect(code("Undefined")).toHaveTextContent("undefined");
    });
  },
};

/**
 * Copy uses the formatted text.
 */
export const CopyFormattedJson: Story = {
  args: {
    value: { a: 1 },
  },
  beforeEach: () => {
    clipboard = captureCopiedText();
    return clipboard.restore;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The clipboard receives the formatted JSON", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));
      await waitFor(() => expect(clipboard.copied).toEqual(['{\n  "a": 1\n}']));
    });
  },
};
