import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect, userEvent, waitFor } from "storybook/test";
import { CodeBlock, Box } from "@commercetools/nimbus";
import {
  captureCopiedText,
  getLines,
  getMarkedLinePositions,
} from "./utils/code-block.test-utils";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 *
 * Stories in this file cover the line model of `CodeBlock.Content`:
 * normalization, numbers, selections, diff markers, announcements, word
 * highlights, prompts and wrapping.
 */
const meta: Meta<typeof CodeBlock.Content> = {
  title: "Components/CodeBlock",
  component: CodeBlock.Content,
};

export default meta;
type Story = StoryObj<typeof meta>;

const longLine = `const extremelyLongVariableName = someFunction(argumentOne, argumentTwo, argumentThree, argumentFour, argumentFive, argumentSix);`;

const eightLines = Array.from(
  { length: 8 },
  (_, index) => `const line${index + 1} = ${index + 1};`
).join("\n");

let clipboard: ReturnType<typeof captureCopiedText>;

/**
 * Records copied text for the stories that copy; see `captureCopiedText`.
 */
const withCapturedClipboard = () => {
  clipboard = captureCopiedText();
  return clipboard.restore;
};

// ---------------------------------------------------------------------------
// TrailingNewline
// ---------------------------------------------------------------------------

/**
 * One trailing line break does not render an extra empty line.
 */
export const TrailingNewline: Story = {
  render: () => (
    <CodeBlock.Root code={"a\nb\n"}>
      <CodeBlock.Content showLineNumbers />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Exactly two lines and two numbers are rendered", async () => {
      await expect(getLines(canvasElement)).toHaveLength(2);
      const numbers = Array.from(
        canvasElement.querySelectorAll(".nimbus-code-block__lineNumber")
      ).map((element) => element.textContent);
      await expect(numbers).toEqual(["1", "2"]);
    });
  },
};

// ---------------------------------------------------------------------------
// CrlfCopiedAsGiven
// ---------------------------------------------------------------------------

/**
 * CRLF line breaks are split for display, but copy uses the original string.
 */
export const CrlfCopiedAsGiven: Story = {
  beforeEach: withCapturedClipboard,
  render: () => (
    <CodeBlock.Root code={"a\r\nb\n"}>
      <CodeBlock.Content>
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger />
        </CodeBlock.Actions>
      </CodeBlock.Content>
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Two lines are rendered", async () => {
      await expect(getLines(canvasElement)).toHaveLength(2);
    });

    await step("The clipboard receives the original string", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));
      await waitFor(() => expect(clipboard.copied).toEqual(["a\r\nb\n"]));
    });
  },
};

// ---------------------------------------------------------------------------
// AlignedGutter
// ---------------------------------------------------------------------------

/**
 * The gutter is as wide as the widest number, so code on lines 9 and 10
 * starts at the same horizontal position.
 */
export const AlignedGutter: Story = {
  render: () => (
    <CodeBlock.Root
      code={Array.from({ length: 11 }, (_, i) => `// line ${i + 1}`).join("\n")}
      language="js"
    >
      <CodeBlock.Content showLineNumbers />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Code on lines 9 and 10 starts at the same x", async () => {
      const contents = canvasElement.querySelectorAll(
        ".nimbus-code-block__lineContent"
      );
      const left9 = contents[8].getBoundingClientRect().left;
      const left10 = contents[9].getBoundingClientRect().left;
      await expect(Math.abs(left9 - left10)).toBeLessThan(0.5);
    });
  },
};

// ---------------------------------------------------------------------------
// DecorationNotSelectable
// ---------------------------------------------------------------------------

/**
 * Line numbers, prompts, diff markers and announcement texts use
 * `user-select: none`, so a manual selection copies only code.
 */
export const DecorationNotSelectable: Story = {
  render: () => (
    <CodeBlock.Root code={"npm whoami\nalice"} language="bash">
      <CodeBlock.Content
        showLineNumbers
        prompt="$"
        addedLines={[1]}
        highlightedLines={[2]}
      />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const selectors = [
      ".nimbus-code-block__lineNumber",
      ".nimbus-code-block__prompt",
      ".nimbus-code-block__marker",
      "[data-line-announcement]",
    ];

    for (const selector of selectors) {
      await step(`${selector} has user-select: none`, async () => {
        const element = canvasElement.querySelector(selector);
        await expect(element).toBeInTheDocument();
        await expect(getComputedStyle(element!).userSelect).toBe("none");
      });
    }
  },
};

// ---------------------------------------------------------------------------
// LineRanges
// ---------------------------------------------------------------------------

/**
 * Selections accept line numbers and inclusive `[start, end]` ranges.
 */
export const LineRanges: Story = {
  render: () => (
    <CodeBlock.Root code={eightLines} language="js">
      <CodeBlock.Content showLineNumbers highlightedLines={[2, [5, 7]]} />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Exactly lines 2, 5, 6 and 7 are highlighted", async () => {
      await expect(
        getMarkedLinePositions(canvasElement, "highlighted")
      ).toEqual([2, 5, 6, 7]);
    });

    await step("No diff marker column without diff lines", async () => {
      await expect(
        canvasElement.querySelector(".nimbus-code-block__marker")
      ).toBeNull();
    });
  },
};

// ---------------------------------------------------------------------------
// InvalidSelections
// ---------------------------------------------------------------------------

/**
 * Entries that are not integers, and reversed ranges, are ignored.
 */
export const InvalidSelections: Story = {
  render: () => (
    <CodeBlock.Root code={eightLines} language="js">
      <CodeBlock.Content highlightedLines={[1.5, [6, 4]]} />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    await step("No line is highlighted", async () => {
      await expect(getLines(canvasElement)).toHaveLength(8);
      await expect(
        getMarkedLinePositions(canvasElement, "highlighted")
      ).toEqual([]);
    });
  },
};

// ---------------------------------------------------------------------------
// DiffMarkers
// ---------------------------------------------------------------------------

/**
 * Added and removed lines get a background and a `+` / `−` marker.
 */
export const DiffMarkers: Story = {
  render: () => (
    <CodeBlock.Root code={eightLines} language="js">
      <CodeBlock.Content showLineNumbers addedLines={[3]} removedLines={[4]} />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Line 3 is added and line 4 is removed", async () => {
      await expect(getMarkedLinePositions(canvasElement, "added")).toEqual([3]);
      await expect(getMarkedLinePositions(canvasElement, "removed")).toEqual([
        4,
      ]);
    });

    await step("Markers show + and − and are aria-hidden", async () => {
      const markers = Array.from(
        canvasElement.querySelectorAll(".nimbus-code-block__marker")
      );
      await expect(markers).toHaveLength(8);
      await expect(markers[2]).toHaveTextContent("+");
      await expect(markers[3]).toHaveTextContent("−");
      for (const marker of markers) {
        await expect(marker).toHaveAttribute("aria-hidden", "true");
      }
    });
  },
};

// ---------------------------------------------------------------------------
// AnnouncementPerRun
// ---------------------------------------------------------------------------

/**
 * Each run of marked lines gets one visually hidden start and end text, and
 * these texts are not copied.
 */
export const AnnouncementPerRun: Story = {
  beforeEach: withCapturedClipboard,
  render: () => (
    <CodeBlock.Root code={eightLines} language="js">
      <CodeBlock.Content highlightedLines={[[2, 4], 7]}>
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger />
        </CodeBlock.Actions>
      </CodeBlock.Content>
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Two start texts and two end texts", async () => {
      const lines = getLines(canvasElement);
      const texts = (line: HTMLElement) =>
        Array.from(line.querySelectorAll("[data-line-announcement]")).map(
          (element) => element.textContent
        );
      await expect(
        canvasElement.querySelectorAll("[data-line-announcement]")
      ).toHaveLength(4);
      await expect(texts(lines[1])).toEqual(["Highlighted lines start"]);
      await expect(texts(lines[3])).toEqual(["Highlighted lines end"]);
      await expect(texts(lines[6])).toEqual([
        "Highlighted lines start",
        "Highlighted lines end",
      ]);
    });

    await step("Copying excludes the announcement texts", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));
      await waitFor(() => expect(clipboard.copied).toEqual([eightLines]));
    });
  },
};

// ---------------------------------------------------------------------------
// WordHighlight
// ---------------------------------------------------------------------------

/**
 * `highlightedWords` marks every exact occurrence with a `mark`, also when a
 * match spans several tokens.
 */
export const WordHighlight: Story = {
  render: () => (
    <CodeBlock.Root
      code={`<Button variant="primary" />\nconst value = a.b;`}
      language="tsx"
    >
      <CodeBlock.Content highlightedWords={["variant", "a.b"]} />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Each match is one mark element", async () => {
      const marks = Array.from(canvasElement.querySelectorAll("code mark"));
      await expect(marks.map((mark) => mark.textContent)).toEqual([
        "variant",
        "a.b",
      ]);
    });

    await step("Syntax tokens are kept inside a match", async () => {
      const crossTokenMark = canvasElement.querySelectorAll("code mark")[1];
      await expect(
        crossTokenMark.querySelector(".token.punctuation")
      ).toHaveTextContent(".");
    });
  },
};

// ---------------------------------------------------------------------------
// PromptAndOutputLines
// ---------------------------------------------------------------------------

/**
 * A prompt is shown before every line except output lines, and is not copied.
 */
export const PromptAndOutputLines: Story = {
  beforeEach: withCapturedClipboard,
  render: () => (
    <CodeBlock.Root code={"npm whoami\nalice"} language="bash">
      <CodeBlock.Content prompt="$" outputLines={[2]}>
        <CodeBlock.Actions>
          <CodeBlock.CopyTrigger />
        </CodeBlock.Actions>
      </CodeBlock.Content>
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Line 1 shows the prompt and line 2 does not", async () => {
      const [first, second] = getLines(canvasElement);
      const prompt = first.querySelector(".nimbus-code-block__prompt");
      await expect(prompt).toHaveTextContent("$");
      await expect(prompt).toHaveAttribute("aria-hidden", "true");
      await expect(
        second.querySelector(".nimbus-code-block__prompt")
      ).toBeNull();
    });

    await step("Copying excludes the prompt", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));
      await waitFor(() =>
        expect(clipboard.copied).toEqual(["npm whoami\nalice"])
      );
    });
  },
};

// ---------------------------------------------------------------------------
// WrapLongLinesBehavior
// ---------------------------------------------------------------------------

/**
 * With `wrapLongLines`, a long line wraps inside a 400px container; its line
 * number appears once, on the first row.
 */
export const WrapLongLinesBehavior: Story = {
  render: () => (
    <Box width="400px">
      <CodeBlock.Root code={longLine} language="js">
        <CodeBlock.Content
          showLineNumbers
          wrapLongLines
          highlightedLines={[1]}
        />
      </CodeBlock.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const pre = canvasElement.querySelector("pre")!;
    const [line] = getLines(canvasElement);
    const numbers = canvasElement.querySelectorAll(
      ".nimbus-code-block__lineNumber"
    );

    await step("The pre does not overflow horizontally", async () => {
      await expect(pre.scrollWidth).toBeLessThanOrEqual(pre.clientWidth);
    });

    await step("The line takes more than one visual row", async () => {
      const rowHeight = parseFloat(getComputedStyle(pre).lineHeight);
      await expect(line.getBoundingClientRect().height).toBeGreaterThan(
        rowHeight * 1.5
      );
    });

    await step("The line number appears once, on the first row", async () => {
      await expect(numbers).toHaveLength(1);
      const numberTop = numbers[0].getBoundingClientRect().top;
      await expect(
        Math.abs(numberTop - line.getBoundingClientRect().top)
      ).toBeLessThan(1);
    });
  },
};

// ---------------------------------------------------------------------------
// HighlightBandCoversScroll
// ---------------------------------------------------------------------------

/**
 * The highlight band of a long line spans the full scrollable width, so it
 * continues behind horizontally scrolled text.
 */
export const HighlightBandCoversScroll: Story = {
  render: () => (
    <Box width="400px">
      <CodeBlock.Root code={`${longLine}\nshort`} language="js">
        <CodeBlock.Content highlightedLines={[1, 2]} />
      </CodeBlock.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Both bands are as wide as the scroll area", async () => {
      const pre = canvasElement.querySelector("pre")!;
      await expect(pre.scrollWidth).toBeGreaterThan(pre.clientWidth);
      for (const line of getLines(canvasElement)) {
        await expect(Math.abs(line.offsetWidth - pre.scrollWidth)).toBeLessThan(
          1
        );
      }
    });
  },
};
