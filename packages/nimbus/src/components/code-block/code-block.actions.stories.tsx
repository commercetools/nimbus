import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect, userEvent, waitFor, fn } from "storybook/test";
import { CodeBlock, Box, Button, Stack } from "@commercetools/nimbus";
import {
  captureCopiedText,
  captureDownloads,
  getLines,
} from "./utils/code-block.test-utils";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 *
 * Stories in this file cover the triggers (copy, download, expand) and
 * streamed code updates.
 */
const meta: Meta<typeof CodeBlock.Root> = {
  title: "Components/CodeBlock",
  component: CodeBlock.Root,
};

export default meta;
type Story = StoryObj<typeof meta>;

const sample = `const greeting = "Hello";\nconsole.log(greeting);`;

const thirtyLines = Array.from(
  { length: 30 },
  (_, index) => `const line${index + 1} = ${index + 1};`
).join("\n");

const longLine = `const extremelyLongVariableName = someFunction(argumentOne, argumentTwo, argumentThree, argumentFour, argumentFive, argumentSix);`;

const getLiveRegion = (container: HTMLElement) =>
  container.querySelector<HTMLElement>("[aria-live='polite']");

let clipboard: ReturnType<typeof captureCopiedText>;
let downloads: ReturnType<typeof captureDownloads>;

const withCapturedClipboard = () => {
  clipboard = captureCopiedText();
  return clipboard.restore;
};

const withCapturedDownloads = () => {
  downloads = captureDownloads();
  return downloads.restore;
};

const onCopy = fn();
const onDownload = fn();
const onExpandedChange = fn();

// ---------------------------------------------------------------------------
// CopySuccess
// ---------------------------------------------------------------------------

/**
 * A successful copy puts the code on the clipboard, calls `onCopy` once,
 * swaps the icon and announces "Copied".
 */
export const CopySuccess: Story = {
  beforeEach: () => {
    onCopy.mockClear();
    return withCapturedClipboard();
  },
  render: () => (
    <CodeBlock.Root code={sample} language="js">
      <CodeBlock.Header>
        <CodeBlock.LanguageLabel />
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger onCopy={onCopy} />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Copy code" });
    const idleIcon = button.innerHTML;

    await step("Copy puts the code on the clipboard once", async () => {
      await userEvent.click(button);
      await waitFor(() => expect(onCopy).toHaveBeenCalledTimes(1));
      await expect(clipboard.copied).toEqual([sample]);
    });

    await step("The icon swaps and the live region says Copied", async () => {
      await expect(button.innerHTML).not.toBe(idleIcon);
      await expect(getLiveRegion(canvasElement)).toHaveTextContent("Copied");
    });

    await step("A second copy is announced again", async () => {
      const firstMessage = getLiveRegion(canvasElement)?.firstElementChild;
      await userEvent.click(button);
      await waitFor(() => expect(onCopy).toHaveBeenCalledTimes(2));
      const secondMessage = getLiveRegion(canvasElement)?.firstElementChild;
      await expect(secondMessage).toHaveTextContent("Copied");
      await expect(secondMessage).not.toBe(firstMessage);
    });
  },
};

// ---------------------------------------------------------------------------
// CustomCopyText
// ---------------------------------------------------------------------------

/**
 * `text` on the trigger copies a different string than the one shown.
 */
export const CustomCopyText: Story = {
  beforeEach: withCapturedClipboard,
  render: () => (
    <CodeBlock.Root code="API_KEY=***">
      <CodeBlock.Content>
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger
            text="API_KEY=real-secret"
            aria-label="Copy API key"
          />
        </CodeBlock.Actions>
      </CodeBlock.Content>
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The trigger copies its text prop", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Copy API key" })
      );
      await waitFor(() =>
        expect(clipboard.copied).toEqual(["API_KEY=real-secret"])
      );
    });
  },
};

// ---------------------------------------------------------------------------
// CopyFallback
// ---------------------------------------------------------------------------

/**
 * When the Clipboard API rejects (for example a permission policy in an
 * iframe), the trigger falls back to `execCommand("copy")`.
 */
export const CopyFallback: Story = {
  beforeEach: () => {
    onCopy.mockClear();
    clipboard = captureCopiedText({ clipboardApi: "reject" });
    return clipboard.restore;
  },
  render: () => (
    <CodeBlock.Root code={sample} language="js">
      <CodeBlock.Content>
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger onCopy={onCopy} />
        </CodeBlock.Actions>
      </CodeBlock.Content>
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The fallback copies the code", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));
      await waitFor(() => expect(onCopy).toHaveBeenCalledTimes(1));
      await expect(clipboard.copied).toEqual([sample]);
      await expect(getLiveRegion(canvasElement)).toHaveTextContent("Copied");
    });
  },
};

// ---------------------------------------------------------------------------
// CopyFailure
// ---------------------------------------------------------------------------

const onCopyError = fn();

/**
 * When both the Clipboard API and the fallback fail, the trigger announces
 * "Copy failed" and calls `onCopyError`, not `onCopy`.
 */
export const CopyFailure: Story = {
  beforeEach: () => {
    onCopy.mockClear();
    onCopyError.mockClear();
    clipboard = captureCopiedText({
      clipboardApi: "reject",
      execCommand: "fail",
    });
    return clipboard.restore;
  },
  render: () => (
    <CodeBlock.Root code={sample} language="js">
      <CodeBlock.Content>
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger onCopy={onCopy} onCopyError={onCopyError} />
        </CodeBlock.Actions>
      </CodeBlock.Content>
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Copy code" });
    const idleIcon = button.innerHTML;

    await step("The failure is reported once", async () => {
      await userEvent.click(button);
      await waitFor(() => expect(onCopyError).toHaveBeenCalledTimes(1));
      await expect(onCopyError.mock.calls[0][0]).toBeInstanceOf(Error);
      await expect(onCopy).not.toHaveBeenCalled();
      await expect(clipboard.copied).toEqual([]);
    });

    await step("The live region says Copy failed", async () => {
      await expect(getLiveRegion(canvasElement)).toHaveTextContent(
        "Copy failed"
      );
      await expect(button.innerHTML).toBe(idleIcon);
    });
  },
};

// ---------------------------------------------------------------------------
// CopyResetsAfterTimeout
// ---------------------------------------------------------------------------

/**
 * The copied state and the announcement reset after `timeout` milliseconds.
 */
export const CopyResetsAfterTimeout: Story = {
  beforeEach: withCapturedClipboard,
  render: () => (
    <CodeBlock.Root code={sample} language="js">
      <CodeBlock.Content>
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger timeout={500} />
        </CodeBlock.Actions>
      </CodeBlock.Content>
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Copy code" });
    const idleIcon = button.innerHTML;

    await step("Copying shows the copied state", async () => {
      await userEvent.click(button);
      await waitFor(() => expect(button.innerHTML).not.toBe(idleIcon));
    });

    await step("After 500ms the icon and live region reset", async () => {
      await waitFor(() => expect(button.innerHTML).toBe(idleIcon), {
        timeout: 1500,
      });
      await expect(getLiveRegion(canvasElement)).toHaveTextContent("");
    });
  },
};

// ---------------------------------------------------------------------------
// DownloadCode
// ---------------------------------------------------------------------------

/**
 * `DownloadTrigger` downloads the code as a file; browser download APIs are
 * used only when the button is pressed.
 */
export const DownloadCode: Story = {
  beforeEach: () => {
    onDownload.mockClear();
    return withCapturedDownloads();
  },
  render: () => (
    <CodeBlock.Root code={"name: nimbus\nversion: 1"} language="yaml">
      <CodeBlock.Header>
        <CodeBlock.Title>config.yaml</CodeBlock.Title>
        <CodeBlock.Actions>
          <CodeBlock.DownloadTrigger
            fileName="config.yaml"
            onDownload={onDownload}
          />
          <CodeBlock.DownloadTrigger
            fileName="config.json"
            mimeType="application/json"
            text='{"name":"nimbus","version":1}'
            aria-label="Download as JSON"
          />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Rendering does not create object URLs", async () => {
      await expect(downloads.createObjectURL).not.toHaveBeenCalled();
    });

    await step("Download starts with the file name and code", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Download code" })
      );
      await expect(onDownload).toHaveBeenCalledTimes(1);
      await expect(downloads.downloads).toHaveLength(1);
      const [download] = downloads.downloads;
      await expect(download.fileName).toBe("config.yaml");
      await expect(download.blob.type).toBe("text/plain;charset=utf-8");
      await expect(await download.blob.text()).toBe("name: nimbus\nversion: 1");
    });

    await step("text and mimeType change the downloaded file", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Download as JSON" })
      );
      const download = downloads.downloads[1];
      await expect(download.fileName).toBe("config.json");
      await expect(download.blob.type).toBe("application/json");
      await expect(await download.blob.text()).toBe(
        '{"name":"nimbus","version":1}'
      );
    });
  },
};

// ---------------------------------------------------------------------------
// ExpandCollapse
// ---------------------------------------------------------------------------

/**
 * With `maxLines`, a longer block renders only its first lines and an
 * `ExpandTrigger` that shows or hides the rest.
 */
export const ExpandCollapse: Story = {
  beforeEach: () => {
    onExpandedChange.mockClear();
  },
  render: () => (
    <CodeBlock.Root
      code={thirtyLines}
      language="js"
      maxLines={10}
      onExpandedChange={onExpandedChange}
    >
      <CodeBlock.Content showLineNumbers />
      <CodeBlock.ExpandTrigger />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const pre = canvasElement.querySelector("pre")!;

    await step("Collapsed: 10 lines and a Show more button", async () => {
      await expect(getLines(canvasElement)).toHaveLength(10);
      const button = canvas.getByRole("button", { name: "Show more" });
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await expect(button).toHaveAttribute("aria-controls", pre.id);
    });

    await step("Expanding shows all lines and keeps focus", async () => {
      const button = canvas.getByRole("button", { name: "Show more" });
      await userEvent.click(button);
      await expect(getLines(canvasElement)).toHaveLength(30);
      await expect(button).toHaveAccessibleName("Show less");
      await expect(button).toHaveAttribute("aria-expanded", "true");
      await expect(button).toHaveFocus();
      await expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    await step("Collapsing renders the first 10 lines again", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Show less" }));
      await expect(getLines(canvasElement)).toHaveLength(10);
      await expect(onExpandedChange).toHaveBeenLastCalledWith(false);
    });
  },
};

// ---------------------------------------------------------------------------
// NotCollapsible
// ---------------------------------------------------------------------------

/**
 * When the code has no more lines than `maxLines`, no expand button renders.
 */
export const NotCollapsible: Story = {
  render: () => (
    <CodeBlock.Root code={sample} language="js" maxLines={10}>
      <CodeBlock.Content />
      <CodeBlock.ExpandTrigger />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("No expand button is rendered", async () => {
      await expect(getLines(canvasElement)).toHaveLength(2);
      await expect(canvas.queryByRole("button")).toBeNull();
    });
  },
};

// ---------------------------------------------------------------------------
// ControlledExpand
// ---------------------------------------------------------------------------

const ControlledExpandExample = () => {
  const [isExpanded, setExpanded] = useState(true);
  return (
    <Stack gap="400" alignItems="flex-start">
      <output data-testid="expanded-state">{String(isExpanded)}</output>
      <CodeBlock.Root
        code={thirtyLines}
        language="js"
        maxLines={10}
        isExpanded={isExpanded}
        onExpandedChange={setExpanded}
      >
        <CodeBlock.Content />
        <CodeBlock.ExpandTrigger />
      </CodeBlock.Root>
    </Stack>
  );
};

/**
 * `isExpanded` with `onExpandedChange` controls the expanded state.
 */
export const ControlledExpand: Story = {
  render: () => <ControlledExpandExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The controlled value expands the block", async () => {
      await expect(getLines(canvasElement)).toHaveLength(30);
    });

    await step("The trigger reports the change to the owner", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Show less" }));
      await expect(canvas.getByTestId("expanded-state")).toHaveTextContent(
        "false"
      );
      await expect(getLines(canvasElement)).toHaveLength(10);
    });
  },
};

// ---------------------------------------------------------------------------
// CopyWhileCollapsed
// ---------------------------------------------------------------------------

/**
 * Copy always uses the full code, also while collapsed.
 */
export const CopyWhileCollapsed: Story = {
  beforeEach: withCapturedClipboard,
  render: () => (
    <CodeBlock.Root code={thirtyLines} language="js" maxLines={10}>
      <CodeBlock.Content>
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger />
        </CodeBlock.Actions>
      </CodeBlock.Content>
      <CodeBlock.ExpandTrigger />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The clipboard receives all 30 lines", async () => {
      await expect(getLines(canvasElement)).toHaveLength(10);
      await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));
      await waitFor(() => expect(clipboard.copied).toEqual([thirtyLines]));
    });
  },
};

// ---------------------------------------------------------------------------
// TriggerHitArea
// ---------------------------------------------------------------------------

/**
 * In the compact `sm` size the triggers are smaller than 44px, but their
 * pointer target still covers 44×44px.
 */
export const TriggerHitArea: Story = {
  render: () => (
    <CodeBlock.Root code={thirtyLines} language="js" size="sm" maxLines={3}>
      <CodeBlock.Header>
        <CodeBlock.LanguageLabel />
        <CodeBlock.Actions>
          <CodeBlock.DownloadTrigger fileName="lines.js" />
          <CodeBlock.CopyTrigger />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content />
      <CodeBlock.ExpandTrigger />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const offsets = [-21, 0, 21];

    for (const name of ["Download code", "Copy code", "Show more"]) {
      await step(
        `${name}: presses within 44×44px reach the button`,
        async () => {
          const button = canvas.getByRole("button", { name });
          const box = button.getBoundingClientRect();
          const centerX = box.left + box.width / 2;
          const centerY = box.top + box.height / 2;
          await expect(box.height).toBeLessThan(44);
          for (const dx of box.width < 44 ? offsets : [0]) {
            for (const dy of offsets) {
              const target = document.elementFromPoint(
                centerX + dx,
                centerY + dy
              );
              await expect(button.contains(target)).toBe(true);
            }
          }
        }
      );
    }
  },
};

// ---------------------------------------------------------------------------
// Streaming
// ---------------------------------------------------------------------------

const StreamingExample = ({ withCopy }: { withCopy?: boolean }) => {
  const [code, setCode] = useState(`${longLine}\nconst a = 1;`);
  return (
    <Stack gap="400" alignItems="flex-start">
      <Button
        onPress={() =>
          setCode((previous) => `${previous}\nconst next = "streamed";`)
        }
      >
        Append line
      </Button>
      <Box width="400px">
        <CodeBlock.Root code={code} language="js">
          <CodeBlock.Content>
            {withCopy && (
              <CodeBlock.Actions>
                <CodeBlock.CopyTrigger timeout={5000} />
              </CodeBlock.Actions>
            )}
          </CodeBlock.Content>
        </CodeBlock.Root>
      </Box>
    </Stack>
  );
};

/**
 * Growing code reuses the scroll area, so its scroll position stays.
 */
export const StreamingKeepsScroll: Story = {
  render: () => <StreamingExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const pre = canvasElement.querySelector("pre")!;

    await step("Scroll the code horizontally", async () => {
      await waitFor(() =>
        expect(pre.scrollWidth).toBeGreaterThan(pre.clientWidth)
      );
      pre.scrollLeft = 120;
      await expect(pre.scrollLeft).toBe(120);
    });

    await step("A new line keeps the element and scroll position", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Append line" })
      );
      await expect(getLines(canvasElement)).toHaveLength(3);
      await expect(canvasElement.querySelector("pre")).toBe(pre);
      await expect(pre.scrollLeft).toBe(120);
    });
  },
};

/**
 * The copy trigger is not remounted by code updates and keeps its state.
 */
export const StreamingKeepsCopyState: Story = {
  beforeEach: withCapturedClipboard,
  render: () => <StreamingExample withCopy />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const copyButton = canvas.getByRole("button", { name: "Copy code" });
    const idleIcon = copyButton.innerHTML;

    await step("Copy shows the copied state", async () => {
      await userEvent.click(copyButton);
      await waitFor(() => expect(copyButton.innerHTML).not.toBe(idleIcon));
    });

    await step("A code update keeps the same button and state", async () => {
      const copiedIcon = copyButton.innerHTML;
      await userEvent.click(
        canvas.getByRole("button", { name: "Append line" })
      );
      await expect(getLines(canvasElement)).toHaveLength(3);
      await expect(canvas.getByRole("button", { name: "Copy code" })).toBe(
        copyButton
      );
      await expect(copyButton.innerHTML).toBe(copiedIcon);
      await expect(getLiveRegion(canvasElement)).toHaveTextContent("Copied");
    });
  },
};

/**
 * Incomplete code, for example while it streams in, renders without errors.
 */
export const UnterminatedCode: Story = {
  render: () => (
    <Stack gap="400">
      <CodeBlock.Root
        code={'const a = "open string'}
        language="tsx"
        aria-label="Open string"
      >
        <CodeBlock.Content />
      </CodeBlock.Root>
      <CodeBlock.Root
        code={"/* open comment\nconst b = 1;"}
        language="js"
        aria-label="Open comment"
      >
        <CodeBlock.Content />
      </CodeBlock.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Both blocks render their full text", async () => {
      const codes = canvasElement.querySelectorAll(".nimbus-code-block__code");
      await expect(codes[0]).toHaveTextContent('const a = "open string');
      await expect(codes[1]).toHaveTextContent("/* open comment");
      await expect(codes[1]).toHaveTextContent("const b = 1;");
    });
  },
};
