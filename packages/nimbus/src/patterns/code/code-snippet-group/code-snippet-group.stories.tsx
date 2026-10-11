import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import {
  captureCopiedText,
  captureDownloads,
} from "@/components/code-block/utils/code-block.test-utils";
import { CodeSnippetGroup } from "./code-snippet-group";
import type { CodeSnippetGroupItem } from "./code-snippet-group.types";

const meta: Meta<typeof CodeSnippetGroup> = {
  title: "patterns/code/CodeSnippetGroup",
  component: CodeSnippetGroup,
};

export default meta;

type Story = StoryObj<typeof CodeSnippetGroup>;

const items: CodeSnippetGroupItem[] = [
  {
    key: "curl",
    label: "cURL",
    code: "curl https://api.example.com/products",
    language: "bash",
  },
  {
    key: "js",
    label: "JavaScript",
    code: 'await fetch("https://api.example.com/products");',
    language: "js",
  },
  {
    key: "java",
    label: "Java",
    code: 'client.get("https://api.example.com/products");',
    language: "java",
    fileName: "Products.java",
  },
];

const getCode = (container: HTMLElement) =>
  container.querySelector(".nimbus-code-block__code");

const getLanguageLabel = (container: HTMLElement) =>
  container.querySelector(".nimbus-code-block__languageLabel");

let clipboard: ReturnType<typeof captureCopiedText>;
let downloads: ReturnType<typeof captureDownloads>;
const onSelectionChange = fn();
const onCopy = fn();

/**
 * Tabs switch between examples; the first one is shown first.
 */
export const Tabs: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    items,
    title: "List products",
  },
  beforeEach: () => {
    onSelectionChange.mockClear();
  },
  render: (args) => (
    <CodeSnippetGroup {...args} onSelectionChange={onSelectionChange} />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The first item is shown by default", async () => {
      await expect(getCode(canvasElement)).toHaveTextContent(items[0].code);
      await expect(getLanguageLabel(canvasElement)).toHaveTextContent("bash");
    });

    await step("The tab list is labelled", async () => {
      await expect(
        canvas.getByRole("tablist", { name: "Code example" })
      ).toBeInTheDocument();
    });

    await step("The right arrow key selects the next tab", async () => {
      canvas.getByRole("tab", { name: "cURL" }).focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect(
        canvas.getByRole("tab", { name: "JavaScript" })
      ).toHaveFocus();
      await expect(getCode(canvasElement)).toHaveTextContent(items[1].code);
      await expect(getLanguageLabel(canvasElement)).toHaveTextContent("js");
      await expect(onSelectionChange).toHaveBeenLastCalledWith("js");
    });

    await step("The code is inside the selected tab panel", async () => {
      const panel = canvas.getByRole("tabpanel");
      await expect(panel).toContainElement(canvasElement.querySelector("pre"));
    });
  },
};

/**
 * A select switches between examples.
 */
export const Select: Story = {
  args: {
    items,
    switcher: "select",
    "aria-label": "List products",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step("The select has the default accessible name", async () => {
      await expect(
        canvas.getByRole("button", { name: /Code example/ })
      ).toBeInTheDocument();
    });

    await step("Choosing Java shows the Java item", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: /Code example/ })
      );
      await userEvent.click(await body.findByRole("option", { name: "Java" }));
      await waitFor(() =>
        expect(getCode(canvasElement)).toHaveTextContent(items[2].code)
      );
      await expect(getLanguageLabel(canvasElement)).toHaveTextContent("java");
    });
  },
};

/**
 * One item shows no switcher.
 */
export const SingleItem: Story = {
  args: {
    items: [items[1]],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("No tab list or select, and the item is shown", async () => {
      await expect(canvas.queryByRole("tablist")).toBeNull();
      await expect(
        canvas.queryByRole("button", { name: /Code example/ })
      ).toBeNull();
      await expect(getCode(canvasElement)).toHaveTextContent(items[1].code);
    });
  },
};

/**
 * Copy and download act on the shown example.
 */
export const ActionsFollowSelection: Story = {
  args: {
    items,
    defaultSelectedKey: "js",
  },
  beforeEach: () => {
    onCopy.mockClear();
    clipboard = captureCopiedText();
    downloads = captureDownloads();
    return () => {
      clipboard.restore();
      downloads.restore();
    };
  },
  render: (args) => <CodeSnippetGroup {...args} onCopy={onCopy} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Copy copies the selected item and reports its key",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Copy code" })
        );
        await waitFor(() => expect(onCopy).toHaveBeenCalledWith("js"));
        await expect(clipboard.copied).toEqual([items[1].code]);
      }
    );

    await step("No download button for an item without fileName", async () => {
      await expect(
        canvas.queryByRole("button", { name: "Download code" })
      ).toBeNull();
    });

    await step("An item with fileName can be downloaded", async () => {
      await userEvent.click(canvas.getByRole("tab", { name: "Java" }));
      await userEvent.click(
        canvas.getByRole("button", { name: "Download code" })
      );
      const [download] = downloads.downloads;
      await expect(download.fileName).toBe("Products.java");
      await expect(await download.blob.text()).toBe(items[2].code);
    });
  },
};

const ControlledExample = () => {
  const [requested, setRequested] = useState<string>();
  return (
    <>
      <output data-testid="requested">{requested ?? ""}</output>
      <CodeSnippetGroup
        items={items}
        selectedKey="java"
        onSelectionChange={setRequested}
      />
    </>
  );
};

/**
 * With `selectedKey`, the shown item changes only when the owner updates it.
 */
export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Selecting another tab reports the key only", async () => {
      await userEvent.click(canvas.getByRole("tab", { name: "cURL" }));
      await expect(canvas.getByTestId("requested")).toHaveTextContent("curl");
      await expect(getCode(canvasElement)).toHaveTextContent(items[2].code);
    });
  },
};
