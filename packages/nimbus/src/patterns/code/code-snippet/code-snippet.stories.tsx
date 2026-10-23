import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { Link } from "@/components/link/link";
import {
  captureCopiedText,
  captureDownloads,
  getLines,
  getMarkedLinePositions,
} from "@/components/code-block/utils/code-block.test-utils";
import { CodeSnippet } from "./code-snippet";

// VRT: `Base` and `SmokeTest` snapshot the arrangement this pattern fixes.
// Actions beside the code are covered by `Components/CodeBlock` `SmokeTest`
// (command block); the collapsed state by its `Collapsed` story.
const meta: Meta<typeof CodeSnippet> = {
  title: "patterns/code/CodeSnippet",
  component: CodeSnippet,
};

export default meta;

type Story = StoryObj<typeof CodeSnippet>;

const tsxSample = `import { Button } from "@commercetools/nimbus";

export const App = () => (
  <Button variant="primary">Save</Button>
);`;

const fortyLines = Array.from(
  { length: 40 },
  (_, index) => `const line${index + 1} = ${index + 1};`
).join("\n");

let clipboard: ReturnType<typeof captureCopiedText>;
let downloads: ReturnType<typeof captureDownloads>;
const onCopy = fn();

/**
 * The default snippet: header with language label and copy button.
 */
export const Base: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    code: tsxSample,
    language: "tsx",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The header shows the language and a copy button", async () => {
      const header = canvasElement.querySelector(".nimbus-code-block__header");
      await expect(header).toBeInTheDocument();
      await expect(
        header?.querySelector(".nimbus-code-block__languageLabel")
      ).toHaveTextContent("tsx");
      await expect(
        canvas.getByRole("button", { name: "Copy code" })
      ).toBeInTheDocument();
      await expect(canvasElement.querySelector(".token")).toBeInTheDocument();
    });
  },
};

/**
 * Every part this pattern arranges in one frame: title, language label,
 * download and copy in the header, highlighted lines, the expand button and
 * the footer.
 */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    title: "lines.js",
    code: fortyLines,
    language: "js",
    downloadFileName: "lines.js",
    showLineNumbers: true,
    highlightedLines: [2],
    maxLines: 4,
    footer: "Generated file",
  },
};

/**
 * Copy puts the code on the clipboard and calls `onCopy`.
 */
export const CopyCode: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
  },
  beforeEach: () => {
    onCopy.mockClear();
    clipboard = captureCopiedText();
    return clipboard.restore;
  },
  render: (args) => <CodeSnippet {...args} onCopy={onCopy} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Copy puts the code on the clipboard", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));
      await waitFor(() => expect(onCopy).toHaveBeenCalledTimes(1));
      await expect(clipboard.copied).toEqual([tsxSample]);
    });
  },
};

/**
 * Line options are forwarded to `CodeBlock.Content`.
 */
export const LineOptions: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
    showLineNumbers: true,
    startLineNumber: 42,
    highlightedLines: [43],
  },
  play: async ({ canvasElement, step }) => {
    await step("Numbers start at 42 and line 43 is highlighted", async () => {
      const numbers = Array.from(
        canvasElement.querySelectorAll(".nimbus-code-block__lineNumber")
      ).map((element) => element.textContent);
      await expect(numbers[0]).toBe("42");
      await expect(
        getMarkedLinePositions(canvasElement, "highlighted")
      ).toEqual([2]);
    });
  },
};

/**
 * A title names the snippet, which makes it a region.
 */
export const TitleAndLanguage: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
    title: "button.tsx",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The header shows the title and the language", async () => {
      await expect(
        canvasElement.querySelector(".nimbus-code-block__title")
      ).toHaveTextContent("button.tsx");
      await expect(
        canvasElement.querySelector(".nimbus-code-block__languageLabel")
      ).toHaveTextContent("tsx");
    });

    await step("The region is named by the title", async () => {
      await expect(
        canvas.getByRole("region", { name: "button.tsx" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * Without title and language label there is no header; the copy button sits
 * next to the code.
 */
export const NoHeader: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
    showLanguage: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("No header; the copy button is beside the code", async () => {
      await expect(
        canvasElement.querySelector(".nimbus-code-block__header")
      ).toBeNull();
      const actions = canvasElement.querySelector(
        ".nimbus-code-block__actions"
      );
      await expect(actions).toHaveAttribute("data-placement", "content");
      await expect(
        canvas.getByRole("button", { name: "Copy code" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * Without copy and download there is no actions container.
 */
export const NoActions: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
    showCopyButton: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("No buttons and no actions container", async () => {
      await expect(canvas.queryByRole("button")).toBeNull();
      await expect(
        canvasElement.querySelector(".nimbus-code-block__actions")
      ).toBeNull();
    });
  },
};

/**
 * `downloadFileName` adds a download button.
 */
export const Download: Story = {
  args: {
    code: "API_URL=https://api.example.com",
    language: "bash",
    downloadFileName: "client.env",
  },
  beforeEach: () => {
    downloads = captureDownloads();
    return downloads.restore;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Download saves the code as client.env", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Download code" })
      );
      const [download] = downloads.downloads;
      await expect(download.fileName).toBe("client.env");
      await expect(await download.blob.text()).toBe(
        "API_URL=https://api.example.com"
      );
    });
  },
};

/**
 * An empty `title` or `footer` (`null`, `false`, `""`) renders no part, so
 * the snippet does not become a region without a name.
 */
export const EmptyTitleAndFooter: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
    title: "",
    footer: null,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("No title, no footer and no region", async () => {
      await expect(
        canvasElement.querySelector(".nimbus-code-block__title")
      ).toBeNull();
      await expect(
        canvasElement.querySelector(".nimbus-code-block__footer")
      ).toBeNull();
      await expect(canvas.queryByRole("region")).toBeNull();
    });
  },
};

/**
 * `footer` renders content below the code.
 */
export const Footer: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
    footer: <Link href="https://github.com">View on GitHub</Link>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The link is rendered below the code", async () => {
      const link = canvas.getByRole("link", { name: "View on GitHub" });
      const footer = canvasElement.querySelector(".nimbus-code-block__footer");
      await expect(footer).toContainElement(link);
      const pre = canvasElement.querySelector("pre")!;
      await expect(footer!.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        pre.getBoundingClientRect().bottom
      );
    });
  },
};

/**
 * With `maxLines`, a long snippet starts collapsed.
 */
export const Collapsible: Story = {
  args: {
    code: fortyLines,
    language: "js",
    maxLines: 12,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("12 lines and a Show more button", async () => {
      await expect(getLines(canvasElement)).toHaveLength(12);
      await expect(
        canvas.getByRole("button", { name: "Show more" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * `defaultExpanded` starts a long snippet expanded.
 */
export const DefaultExpanded: Story = {
  args: {
    code: fortyLines,
    language: "js",
    maxLines: 12,
    defaultExpanded: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All 40 lines and a Show less button", async () => {
      await expect(getLines(canvasElement)).toHaveLength(40);
      await expect(
        canvas.getByRole("button", { name: "Show less" })
      ).toBeInTheDocument();
    });
  },
};
