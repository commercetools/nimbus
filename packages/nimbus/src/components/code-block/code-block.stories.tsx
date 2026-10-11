import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn, spyOn, waitFor } from "storybook/test";
import { LocalizedStringDictionary } from "@internationalized/string";
import {
  CodeBlock,
  type CodeBlockRootProps,
  type CodeBlockContentProps,
  Box,
  NimbusI18nProvider,
  Stack,
} from "@commercetools/nimbus";
import { codeBlockMessagesStrings } from "./code-block.messages";
import {
  captureCopiedText,
  captureDownloads,
} from "./utils/code-block.test-utils";

// ---------------------------------------------------------------------------
// Sample code snippets used across stories
// ---------------------------------------------------------------------------

const jsxSample = `import { Button } from "@commercetools/nimbus";

export const App = () => (
  <Button variant="primary" size="md">
    Click me
  </Button>
);`;

const tsxSample = `const greeting = (name: string): string => {
  return \`Hello, \${name}!\`;
};`;

/**
 * A very long line used to test horizontal overflow containment.
 * The line is intentionally longer than any typical viewport width.
 */
const longLineSample = `const extremelyLongVariableName = someFunction(argumentOne, argumentTwo, argumentThree, argumentFour, argumentFive, argumentSix, argumentSeven, argumentEight, argumentNine, argumentTen);`;

const thirtyLineSample = Array.from(
  { length: 30 },
  (_, index) => `const line${index + 1} = ${index + 1};`
).join("\n");

const sizes: CodeBlockRootProps["size"][] = ["sm", "md"];

let consoleError: ReturnType<typeof spyOn>;
let clipboard: ReturnType<typeof captureCopiedText>;

/**
 * Replaces the clipboard with a fake for stories that copy, so they never
 * depend on the test browser's clipboard permissions.
 */
const withCapturedClipboard = () => {
  clipboard = captureCopiedText();
  return clipboard.restore;
};

/**
 * Returns the root `section` of the first block; unnamed blocks have no
 * role to query by.
 */
const getRoot = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(".nimbus-code-block__root")!;

/**
 * Reads a message from the compiled dictionary, so locale assertions match
 * whatever translation the dictionary holds.
 */
const getMessage = (key: string, locale: string): string => {
  const dictionary = new LocalizedStringDictionary(codeBlockMessagesStrings);
  const message = dictionary.getStringForLocale(key, locale);
  return typeof message === "string" ? message : (message?.({}) ?? "");
};

/**
 * Story args: the props of `CodeBlock.Root`, the line options of
 * `CodeBlock.Content`, and `onCopy` of `CodeBlock.CopyTrigger`.
 */
type CodeBlockStoryArgs = CodeBlockRootProps &
  Pick<
    CodeBlockContentProps,
    "showLineNumbers" | "startLineNumber" | "highlightedLines"
  > & {
    onCopy?: () => void;
  };

/**
 * The layout most stories use: a header with the language label and a copy
 * button, then the content.
 */
const DefaultLayout = ({
  showLineNumbers,
  startLineNumber,
  highlightedLines,
  onCopy,
  ...rootProps
}: CodeBlockStoryArgs) => (
  <CodeBlock.Root {...rootProps}>
    <CodeBlock.Header>
      <CodeBlock.LanguageLabel />
      <CodeBlock.Actions>
        <CodeBlock.CopyTrigger onCopy={onCopy} />
      </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content
      showLineNumbers={showLineNumbers}
      startLineNumber={startLineNumber}
      highlightedLines={highlightedLines}
    />
  </CodeBlock.Root>
);

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 * - render: `DefaultLayout`; stories with another layout override it
 */
const meta: Meta<CodeBlockStoryArgs> = {
  title: "Components/CodeBlock",
  component: CodeBlock.Root,
  tags: ["autodocs"],
  args: {
    onCopy: fn(),
  },
  argTypes: {
    code: {
      control: { type: "text" },
      description: "The source code string to display.",
    },
    language: {
      control: { type: "text" },
      description: "Language id or alias for syntax highlighting.",
    },
    showLineNumbers: {
      control: { type: "boolean" },
      description: "Whether to show per-line number gutter (Content).",
    },
    startLineNumber: {
      control: { type: "number" },
      description:
        "Number assigned to the first line of the gutter (default 1). Use to display an excerpt at its real source line numbers.",
    },
    highlightedLines: {
      control: { type: "object" },
      description:
        "Displayed line numbers and [start, end] ranges to highlight (e.g. [4, 5]). Honors the startLineNumber offset and works without the gutter.",
    },
    size: {
      control: { type: "radio" },
      options: sizes,
      description: "Typography and padding scaling.",
    },
    "aria-label": {
      control: { type: "text" },
      description: "Accessible label overriding the default region name.",
    },
    onCopy: {
      description: "Callback fired once per successful clipboard write.",
    },
  },
  render: (args) => <DefaultLayout {...args} />,
};

export default meta;
type Story = StoryObj<CodeBlockStoryArgs>;

// ---------------------------------------------------------------------------
// Base
// ---------------------------------------------------------------------------

/**
 * Base story — default props, JSX code sample, header + copy button visible.
 * Without `aria-label` or `Title` the block is a plain section, not a
 * landmark.
 */
export const Base: Story = {
  args: {
    code: jsxSample,
    language: "jsx",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Without a name, the block is not a landmark", async () => {
      await expect(canvas.queryByRole("region")).toBeNull();
      const root = getRoot(canvasElement);
      await expect(root.tagName).toBe("SECTION");
      await expect(root).not.toHaveAttribute("role");
      await expect(root).not.toHaveAttribute("aria-label");
      // Verify some representative text from the code sample is present
      await expect(root).toHaveTextContent("Button");
    });

    await step("Language label is aria-hidden", async () => {
      // aria-hidden elements are not reachable via accessible queries;
      // use querySelector to verify the attribute directly.
      const languageLabel = canvasElement.querySelector(
        ".nimbus-code-block__languageLabel"
      );
      await expect(languageLabel).toBeInTheDocument();
      await expect(languageLabel).toHaveAttribute("aria-hidden", "true");
    });
  },
};

// ---------------------------------------------------------------------------
// SupportedLanguage
// ---------------------------------------------------------------------------

/**
 * Demonstrates that code content is preserved for a known language (tsx).
 */
export const SupportedLanguage: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
  },
  play: async ({ canvasElement, step }) => {
    await step("Code text is present in the DOM", async () => {
      const region = getRoot(canvasElement);
      await expect(region).toHaveTextContent("greeting");
    });

    await step("Language label displays 'tsx'", async () => {
      const languageLabel = canvasElement.querySelector(
        ".nimbus-code-block__languageLabel"
      );
      await expect(languageLabel).toBeInTheDocument();
      await expect(languageLabel).toHaveTextContent("tsx");
    });
  },
};

// ---------------------------------------------------------------------------
// UnknownLanguageFallback
// ---------------------------------------------------------------------------

/**
 * An unknown/unsupported language falls back gracefully as plain text —
 * no crash, code still rendered.
 */
export const UnknownLanguageFallback: Story = {
  args: {
    code: "hello world",
    language: "brainfuck",
  },
  beforeEach: () => {
    consoleError = spyOn(console, "error");
    return () => consoleError.mockRestore();
  },
  play: async ({ canvasElement, step }) => {
    await step("Component renders without throwing", async () => {
      const region = getRoot(canvasElement);
      await expect(region).toBeInTheDocument();
    });

    await step("Code text content is present", async () => {
      const region = getRoot(canvasElement);
      await expect(region).toHaveTextContent("hello world");
    });

    await step("The code is plain text and no error is logged", async () => {
      await expect(canvasElement.querySelector(".token")).toBeNull();
      await expect(consoleError).not.toHaveBeenCalled();
    });
  },
};

// ---------------------------------------------------------------------------
// EmptyCode
// ---------------------------------------------------------------------------

/**
 * Empty string as code — should render gracefully without errors.
 */
export const EmptyCode: Story = {
  args: {
    code: "",
    language: "plaintext",
  },
  play: async ({ canvasElement, step }) => {
    await step("Component renders without throwing", async () => {
      const region = getRoot(canvasElement);
      await expect(region).toBeInTheDocument();
    });

    await step("The pre is rendered and empty", async () => {
      await expect(canvasElement.querySelector("pre")).toBeInTheDocument();
      await expect(
        canvasElement.querySelector(".nimbus-code-block__code")
      ).toHaveTextContent("");
    });
  },
};

// ---------------------------------------------------------------------------
// LineNumbers
// ---------------------------------------------------------------------------

/**
 * Shows the per-line number gutter (`showLineNumbers`).
 */
export const LineNumbers: Story = {
  args: {
    code: jsxSample,
    language: "jsx",
    showLineNumbers: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Line numbers are visible", async () => {
      // Line number elements carry the lineNumber slot class
      const lineNumbers = canvasElement.querySelectorAll(
        ".nimbus-code-block__lineNumber"
      );
      await expect(lineNumbers.length).toBeGreaterThan(0);
      // First line number should read "1"
      await expect(lineNumbers[0]).toHaveTextContent("1");
    });

    await step(
      "Copy button is accessible (copy uses code prop, not DOM text)",
      async () => {
        // The copy button must still be present and reachable
        const copyButton = canvas.getByRole("button", { name: /copy code/i });
        await expect(copyButton).toBeInTheDocument();
      }
    );
  },
};

// ---------------------------------------------------------------------------
// LineNumbersWithOffset
// ---------------------------------------------------------------------------

// A contiguous five-line excerpt with no digit characters, so any digits that
// appear in the rendered output must come from the line-number gutter.
const excerptSample = `function greet(name) {
  const message = "Hello, " + name;
  console.log(message);
  return message;
}`;

/**
 * Displays a contiguous excerpt of a file at its real source line numbers via
 * `startLineNumber`. A five-line excerpt starting at line 42 is numbered 42–46.
 */
export const LineNumbersWithOffset: Story = {
  beforeEach: withCapturedClipboard,
  args: {
    code: excerptSample,
    language: "js",
    showLineNumbers: true,
    startLineNumber: 42,
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Gutter starts at the offset and increments", async () => {
      const lineNumbers = canvasElement.querySelectorAll(
        ".nimbus-code-block__lineNumber"
      );
      await expect(lineNumbers.length).toBe(5);
      const rendered = Array.from(lineNumbers).map((el) => el.textContent);
      await expect(rendered).toEqual(["42", "43", "44", "45", "46"]);
    });

    await step(
      "Copy is unaffected by the offset (copy uses the code prop)",
      async () => {
        // The excerpt has no digits, so the gutter numbers are decorative
        // additions only — the copy path reads the `code` prop, never DOM text,
        // so the offset can never leak line numbers into the clipboard.
        const copyButton = canvas.getByRole("button", { name: /copy code/i });
        await userEvent.click(copyButton);
        await waitFor(() => {
          expect(args.onCopy).toHaveBeenCalledTimes(1);
        });
      }
    );
  },
};

// ---------------------------------------------------------------------------
// LineNumbersOffsetIgnoredWhenHidden
// ---------------------------------------------------------------------------

/**
 * `startLineNumber` is orthogonal to visibility: it has no effect when
 * `showLineNumbers` is `false`.
 */
export const LineNumbersOffsetIgnoredWhenHidden: Story = {
  args: {
    code: excerptSample,
    language: "js",
    showLineNumbers: false,
    startLineNumber: 42,
  },
  play: async ({ canvasElement, step }) => {
    await step("No gutter is rendered despite the offset", async () => {
      const lineNumbers = canvasElement.querySelectorAll(
        ".nimbus-code-block__lineNumber"
      );
      await expect(lineNumbers.length).toBe(0);
    });
  },
};

// ---------------------------------------------------------------------------
// HighlightedLines
// ---------------------------------------------------------------------------

/**
 * Highlights specific lines with a background band via `highlightedLines`. The
 * numbers refer to the displayed line numbers shown in the gutter.
 */
export const HighlightedLines: Story = {
  args: {
    code: jsxSample,
    language: "jsx",
    showLineNumbers: true,
    highlightedLines: [4, 5],
  },
  play: async ({ canvasElement, step }) => {
    await step(
      "Exactly the specified lines are marked as highlighted",
      async () => {
        const highlighted = canvasElement.querySelectorAll(
          ".nimbus-code-block__line[data-mark='highlighted']"
        );
        await expect(highlighted.length).toBe(2);
        // The highlighted lines are the ones whose gutter reads 4 and 5.
        const gutterValues = Array.from(highlighted).map(
          (line) =>
            line.querySelector(".nimbus-code-block__lineNumber")?.textContent
        );
        await expect(gutterValues).toEqual(["4", "5"]);
      }
    );
  },
};

// ---------------------------------------------------------------------------
// HighlightedExcerpt
// ---------------------------------------------------------------------------

/**
 * Highlighting is keyed to the displayed line numbers, so a `startLineNumber`
 * offset applies: `highlightedLines={[43]}` highlights the line labeled 43.
 */
export const HighlightedExcerpt: Story = {
  args: {
    code: excerptSample,
    language: "js",
    showLineNumbers: true,
    startLineNumber: 42,
    highlightedLines: [43],
  },
  play: async ({ canvasElement, step }) => {
    await step("The offset line number is the one highlighted", async () => {
      const highlighted = canvasElement.querySelectorAll(
        ".nimbus-code-block__line[data-mark='highlighted']"
      );
      await expect(highlighted.length).toBe(1);
      await expect(
        highlighted[0].querySelector(".nimbus-code-block__lineNumber")
      ).toHaveTextContent("43");
    });
  },
};

// ---------------------------------------------------------------------------
// HighlightWithoutLineNumbers
// ---------------------------------------------------------------------------

/**
 * Highlighting works independently of the gutter — lines can be highlighted
 * with `showLineNumbers` off.
 */
export const HighlightWithoutLineNumbers: Story = {
  args: {
    code: jsxSample,
    language: "jsx",
    showLineNumbers: false,
    highlightedLines: [1],
  },
  play: async ({ canvasElement, step }) => {
    await step("Line is highlighted even with no gutter", async () => {
      const gutter = canvasElement.querySelectorAll(
        ".nimbus-code-block__lineNumber"
      );
      await expect(gutter.length).toBe(0);
      const highlighted = canvasElement.querySelectorAll(
        ".nimbus-code-block__line[data-mark='highlighted']"
      );
      await expect(highlighted.length).toBe(1);
    });
  },
};

// ---------------------------------------------------------------------------
// NoHeader
// ---------------------------------------------------------------------------

/**
 * Without `CodeBlock.Header` there is no language label and no copy button.
 */
export const NoHeader: Story = {
  args: {
    code: jsxSample,
    language: "jsx",
  },
  render: ({ code, language }) => (
    <CodeBlock.Root code={code} language={language}>
      <CodeBlock.Content />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("No language label is rendered", async () => {
      const languageLabel = canvasElement.querySelector(
        ".nimbus-code-block__languageLabel"
      );
      await expect(languageLabel).not.toBeInTheDocument();
    });

    await step("No copy button is rendered", async () => {
      const copyButton = canvas.queryByRole("button", { name: /copy code/i });
      await expect(copyButton).not.toBeInTheDocument();
    });
  },
};

// ---------------------------------------------------------------------------
// NoCopyButton
// ---------------------------------------------------------------------------

/**
 * A header with only `CodeBlock.LanguageLabel`: the language label is visible
 * and there is no copy button.
 */
export const NoCopyButton: Story = {
  args: {
    code: jsxSample,
    language: "jsx",
  },
  render: ({ code, language }) => (
    <CodeBlock.Root code={code} language={language}>
      <CodeBlock.Header>
        <CodeBlock.LanguageLabel />
      </CodeBlock.Header>
      <CodeBlock.Content />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Language label is still visible", async () => {
      const languageLabel = canvasElement.querySelector(
        ".nimbus-code-block__languageLabel"
      );
      await expect(languageLabel).toBeInTheDocument();
      await expect(languageLabel).toHaveTextContent("jsx");
    });

    await step("Copy button is NOT present", async () => {
      const copyButton = canvas.queryByRole("button", { name: /copy code/i });
      await expect(copyButton).not.toBeInTheDocument();
    });
  },
};

// ---------------------------------------------------------------------------
// CopyBehavior
// ---------------------------------------------------------------------------

/**
 * Tests copy activation: button press fires `onCopy` once (on success) and the
 * aria-live region announces "Copied".
 */
export const CopyBehavior: Story = {
  beforeEach: withCapturedClipboard,
  args: {
    code: jsxSample,
    language: "jsx",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Copy button is present and accessible", async () => {
      const copyButton = canvas.getByRole("button", { name: /copy code/i });
      await expect(copyButton).toBeInTheDocument();
    });

    await step(
      "Clicking the copy button fires onCopy exactly once",
      async () => {
        const copyButton = canvas.getByRole("button", { name: /copy code/i });
        await userEvent.click(copyButton);
        await waitFor(() => {
          expect(args.onCopy).toHaveBeenCalledTimes(1);
        });
      }
    );

    await step("Live region announces 'Copied' after copy", async () => {
      // The aria-live span is always mounted; check its text content after copy
      await waitFor(() => {
        const liveRegion = canvasElement.querySelector("[aria-live='polite']");
        expect(liveRegion).toBeInTheDocument();
        expect(liveRegion?.textContent).toBe("Copied");
      });
    });
  },
};

// ---------------------------------------------------------------------------
// SizeSmall
// ---------------------------------------------------------------------------

/**
 * Renders with `size="sm"` — smaller typography and reduced padding.
 * Asserts that the sm pre has a smaller font size than the md pre.
 */
export const SizeSmall: Story = {
  render: () => (
    <Stack direction="column" gap="400">
      <DefaultLayout
        aria-label="Code block — size sm"
        code={jsxSample}
        language="jsx"
        size="sm"
        data-testid="size-sm"
      />
      <DefaultLayout
        aria-label="Code block — size md"
        code={jsxSample}
        language="jsx"
        size="md"
        data-testid="size-md"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    await step("sm pre has a smaller font size than md pre", async () => {
      const smPre = canvasElement
        .querySelector("[data-testid='size-sm']")
        ?.querySelector("pre");
      const mdPre = canvasElement
        .querySelector("[data-testid='size-md']")
        ?.querySelector("pre");

      await expect(smPre).toBeInTheDocument();
      await expect(mdPre).toBeInTheDocument();

      const smFontSize = parseFloat(window.getComputedStyle(smPre!).fontSize);
      const mdFontSize = parseFloat(window.getComputedStyle(mdPre!).fontSize);

      await expect(smFontSize).toBeLessThan(mdFontSize);
    });

    await step(
      "sm copy button is smaller than the md copy button",
      async () => {
        const smButton = canvasElement
          .querySelector("[data-testid='size-sm']")
          ?.querySelector("button");
        const mdButton = canvasElement
          .querySelector("[data-testid='size-md']")
          ?.querySelector("button");

        await expect(smButton).toBeInTheDocument();
        await expect(mdButton).toBeInTheDocument();

        const smHeight = smButton!.getBoundingClientRect().height;
        const mdHeight = mdButton!.getBoundingClientRect().height;

        await expect(smHeight).toBeLessThan(mdHeight);
      }
    );
  },
};

// ---------------------------------------------------------------------------
// SizeMedium
// ---------------------------------------------------------------------------

/**
 * Renders with `size="md"` (explicit — matches the default).
 * Asserts that the md pre has a larger font size than the sm pre.
 */
export const SizeMedium: Story = {
  render: () => (
    <Stack direction="column" gap="400">
      <DefaultLayout
        aria-label="Code block — size sm"
        code={jsxSample}
        language="jsx"
        size="sm"
        data-testid="size-sm"
      />
      <DefaultLayout
        aria-label="Code block — size md"
        code={jsxSample}
        language="jsx"
        size="md"
        data-testid="size-md"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    await step("md pre has a larger font size than sm pre", async () => {
      const smPre = canvasElement
        .querySelector("[data-testid='size-sm']")
        ?.querySelector("pre");
      const mdPre = canvasElement
        .querySelector("[data-testid='size-md']")
        ?.querySelector("pre");

      await expect(smPre).toBeInTheDocument();
      await expect(mdPre).toBeInTheDocument();

      const smFontSize = parseFloat(window.getComputedStyle(smPre!).fontSize);
      const mdFontSize = parseFloat(window.getComputedStyle(mdPre!).fontSize);

      await expect(mdFontSize).toBeGreaterThan(smFontSize);
    });
  },
};

// ---------------------------------------------------------------------------
// WithAriaLabel
// ---------------------------------------------------------------------------

/**
 * A custom `aria-label` overrides the default i18n region label.
 */
export const WithAriaLabel: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
    "aria-label": "TypeScript function example",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Region has the custom aria-label", async () => {
      const region = canvas.getByRole("region", {
        name: "TypeScript function example",
      });
      await expect(region).toBeInTheDocument();
      await expect(region).toHaveAttribute(
        "aria-label",
        "TypeScript function example"
      );
    });
  },
};

// ---------------------------------------------------------------------------
// HorizontalOverflow
// ---------------------------------------------------------------------------

/**
 * Tier-2 scenario: a very long line inside a fixed-width container.
 * Asserts that `<pre>` scrolls horizontally and the region does not break layout.
 * Spec §"Constrained width and horizontal overflow" → "Long line scrolls horizontally,
 * no silent overflow".
 */
export const HorizontalOverflow: Story = {
  render: () => (
    <Box width="400px">
      <DefaultLayout
        code={longLineSample}
        language="js"
        aria-label="Long line overflow example"
      />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Region is present inside the constrained container",
      async () => {
        const region = canvas.getByRole("region", {
          name: "Long line overflow example",
        });
        await expect(region).toBeInTheDocument();
      }
    );

    await step(
      "pre scroll container overflows horizontally (scrollWidth > clientWidth)",
      async () => {
        const pre = canvasElement.querySelector("pre");
        await expect(pre).toBeInTheDocument();
        // scrollWidth > clientWidth means content exceeds the visible area,
        // i.e. the long line causes horizontal scrolling as intended.
        await expect(pre!.scrollWidth).toBeGreaterThan(pre!.clientWidth);
      }
    );

    await step(
      "Region does not exceed the container width (no layout-breaking overflow)",
      async () => {
        const container = canvasElement.querySelector(
          "[aria-label='Long line overflow example']"
        ) as HTMLElement | null;
        await expect(container).toBeInTheDocument();
        // The component's offsetWidth should not exceed the 400px container.
        // We allow a small tolerance for borders/padding.
        await expect(container!.offsetWidth).toBeLessThanOrEqual(402);
      }
    );
  },
};

// ---------------------------------------------------------------------------
// UntrustedCode
// ---------------------------------------------------------------------------

/**
 * Spec §"Untrusted code is not executed or injected as markup".
 * Renders HTML/script-like text; asserts it is displayed as plain text nodes,
 * NOT parsed into live DOM elements.
 */
export const UntrustedCode: Story = {
  args: {
    code: '<img src=x onerror="alert(1)">\n<script>alert("xss")</script>',
    language: "html",
  },
  play: async ({ canvasElement, step }) => {
    await step("Region renders without crashing", async () => {
      const region = getRoot(canvasElement);
      await expect(region).toBeInTheDocument();
    });

    await step(
      "No <img> element is injected inside the code region",
      async () => {
        // Scope to the <code> element — the rendered code content area.
        // If the code were dangerouslySetInnerHTML'd, an img element would appear.
        // With React text nodes it must not exist inside the code area.
        const codeEl = canvasElement.querySelector("code");
        await expect(codeEl).toBeInTheDocument();
        const img = codeEl!.querySelector("img");
        await expect(img).toBeNull();
      }
    );

    await step(
      "No <script> element is injected inside the code region",
      async () => {
        // Scope to the <code> element to avoid finding Storybook's own scripts.
        const codeEl = canvasElement.querySelector("code");
        await expect(codeEl).toBeInTheDocument();
        const script = codeEl!.querySelector("script");
        await expect(script).toBeNull();
      }
    );

    await step(
      "The literal tag text is present as text content in the region",
      async () => {
        const region = getRoot(canvasElement);
        await expect(region).toHaveTextContent("onerror");
        await expect(region).toHaveTextContent("alert");
      }
    );
  },
};

// ---------------------------------------------------------------------------
// WidthFull
// ---------------------------------------------------------------------------

/**
 * Demonstrates the `width` style prop passthrough — the block stretches to
 * fill its container.
 */
export const WidthFull: Story = {
  args: {
    code: jsxSample,
    language: "jsx",
    width: "full",
  },
  render: (args) => (
    <Box width="600px">
      <DefaultLayout {...args} />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    await step(
      "Component renders at full width inside its container",
      async () => {
        const region = getRoot(canvasElement);
        await expect(region).toBeInTheDocument();
      }
    );
  },
};

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

/**
 * Comprehensive accessibility check: region landmark, aria-hidden on label,
 * tabIndex on pre, no aria-label on the code element, and no internal prop
 * leakage to the DOM.
 */
export const Accessibility: Story = {
  args: {
    code: jsxSample,
    language: "jsx",
    "aria-label": "Accessible example",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "A named root section has role='region' and that name",
      async () => {
        const region = canvas.getByRole("region", {
          name: "Accessible example",
        });
        await expect(region.tagName).toBe("SECTION");
      }
    );

    await step("Language label has aria-hidden='true'", async () => {
      const languageLabel = canvasElement.querySelector(
        ".nimbus-code-block__languageLabel"
      );
      await expect(languageLabel).toBeInTheDocument();
      await expect(languageLabel).toHaveAttribute("aria-hidden", "true");
    });

    await step(
      "<pre> element has tabIndex=0 for keyboard-scrollable content",
      async () => {
        const pre = canvasElement.querySelector("pre");
        await expect(pre).toBeInTheDocument();
        await expect(pre).toHaveAttribute("tabindex", "0");
      }
    );

    await step("<code> element has no aria-label", async () => {
      const code = canvasElement.querySelector("code");
      await expect(code).toBeInTheDocument();
      await expect(code).not.toHaveAttribute("aria-label");
    });

    await step(
      "No internal props are leaked onto the rendered DOM elements",
      async () => {
        const region = getRoot(canvasElement);
        const pre = canvasElement.querySelector("pre");
        const code = canvasElement.querySelector("code");

        // Internal/React-managed props that must NOT appear as DOM attributes
        const internalProps = [
          "code",
          "language",
          "highlighter",
          "maxLines",
          "isExpanded",
          "onExpandedChange",
          "showLineNumbers",
          "highlightedLines",
          "onCopy",
          "data-rac",
        ];

        for (const prop of internalProps) {
          await expect(region).not.toHaveAttribute(prop);
          if (pre) await expect(pre).not.toHaveAttribute(prop);
          if (code) await expect(code).not.toHaveAttribute(prop);
        }
      }
    );
  },
};

// ---------------------------------------------------------------------------
// Visual stories (Chromatic)
// ---------------------------------------------------------------------------

const smokeSample = `import { Button } from "@commercetools/nimbus";

export const App = () => (
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
);
// The end`;

/**
 * Every painted surface of one block: header with title, language label and
 * two triggers; line numbers; highlighted, added and removed lines; a word
 * highlight; a footer.
 */
const FullBlock = ({
  size,
  "aria-label": ariaLabel,
}: Pick<CodeBlockRootProps, "size" | "aria-label">) => (
  <CodeBlock.Root
    code={smokeSample}
    language="tsx"
    size={size}
    aria-label={ariaLabel}
  >
    <CodeBlock.Header>
      <CodeBlock.Title>app.tsx</CodeBlock.Title>
      <CodeBlock.LanguageLabel />
      <CodeBlock.Actions>
        <CodeBlock.DownloadTrigger fileName="app.tsx" />
        <CodeBlock.CopyTrigger />
      </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content
      showLineNumbers
      highlightedLines={[3]}
      addedLines={[4]}
      removedLines={[5]}
      highlightedWords={["variant"]}
    />
    <CodeBlock.Footer>Requires Nimbus 3 or later.</CodeBlock.Footer>
  </CodeBlock.Root>
);

/**
 * A block without header: prompt, output line and actions inside the content.
 */
const CommandBlock = ({
  size,
  "aria-label": ariaLabel,
}: Pick<CodeBlockRootProps, "size" | "aria-label">) => (
  <CodeBlock.Root
    code={"npm whoami\nalice"}
    language="bash"
    size={size}
    aria-label={ariaLabel}
  >
    <CodeBlock.Content prompt="$" outputLines={[2]}>
      <CodeBlock.Actions>
        <CodeBlock.CopyTrigger />
      </CodeBlock.Actions>
    </CodeBlock.Content>
  </CodeBlock.Root>
);

/**
 * Visual matrix. Axes: `size` (sm, md) × layout (full header + footer with
 * marked lines and word highlight; header-less command with prompt and
 * actions inside the content). `size` changes every slot, so it interacts
 * with both layouts.
 */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="600" width="640px">
      {sizes.map((size) => (
        <Stack key={size as string} direction="column" gap="400">
          <FullBlock size={size} aria-label={`Full block ${size as string}`} />
          <CommandBlock
            size={size}
            aria-label={`Command block ${size as string}`}
          />
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * The same block in light and dark mode. Only the resolved colors change;
 * the DOM structure is the same.
 */
export const DarkMode: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400" width="640px">
      <FullBlock aria-label="Light block" />
      <Box className="dark" bg="bg" p="400">
        <FullBlock aria-label="Dark block" />
      </Box>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const light = canvas.getByRole("region", { name: "Light block" });
    const dark = canvas.getByRole("region", { name: "Dark block" });

    await step("Token and surface colors differ", async () => {
      const color = (root: HTMLElement, selector: string) =>
        getComputedStyle(root.querySelector(selector)!).color;
      await expect(color(dark, ".token.keyword")).not.toBe(
        color(light, ".token.keyword")
      );
      await expect(getComputedStyle(dark).backgroundColor).not.toBe(
        getComputedStyle(light).backgroundColor
      );
    });

    await step("The DOM structure is the same", async () => {
      // Generated ids differ per block; compare the markup without them.
      const markup = (root: HTMLElement) =>
        root.innerHTML.replace(
          /(id|aria-labelledby|aria-controls)="[^"]*"/g,
          ""
        );
      await expect(markup(dark)).toBe(markup(light));
    });
  },
};

/**
 * A collapsed block: the first lines and the "Show more" button.
 */
export const Collapsed: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <CodeBlock.Root code={smokeSample} language="tsx" maxLines={4}>
      <CodeBlock.Content showLineNumbers />
      <CodeBlock.ExpandTrigger />
    </CodeBlock.Root>
  ),
};

/**
 * A long line wraps instead of scrolling; the band covers all rows.
 */
export const WrapLongLines: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Box width="400px">
      <CodeBlock.Root code={longLineSample} language="js">
        <CodeBlock.Content
          showLineNumbers
          wrapLongLines
          highlightedLines={[1]}
        />
      </CodeBlock.Root>
    </Box>
  ),
};

/**
 * The focus ring of the scrollable code area. The play ends with the code
 * area focused, which is the frame Chromatic captures.
 */
export const FocusedCodeArea: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <CodeBlock.Root code={jsxSample} language="jsx">
      <CodeBlock.Content />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Tab focuses the code area with a visible ring", async () => {
      await userEvent.tab();
      const pre = canvasElement.querySelector("pre")!;
      await expect(pre).toHaveFocus();
      await expect(getComputedStyle(pre).outlineStyle).not.toBe("none");
    });
  },
};

// ---------------------------------------------------------------------------
// Semantics and theming
// ---------------------------------------------------------------------------

/**
 * Tokens carry classes only; colors come from the recipe, never from inline
 * styles.
 */
export const NoInlineTokenStyles: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
  },
  play: async ({ canvasElement, step }) => {
    await step("No token element has a style attribute", async () => {
      const tokens = canvasElement.querySelectorAll(".token");
      await expect(tokens.length).toBeGreaterThan(0);
      await expect(
        canvasElement.querySelectorAll(".token[style]")
      ).toHaveLength(0);
    });
  },
};

/**
 * `CodeBlock.Title` names the region through `aria-labelledby`.
 */
export const RegionNameFromTitle: Story = {
  render: () => (
    <CodeBlock.Root code={tsxSample} language="tsx">
      <CodeBlock.Header>
        <CodeBlock.Title>button.tsx</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The region is named by the title", async () => {
      const region = canvas.getByRole("region", { name: "button.tsx" });
      await expect(region).not.toHaveAttribute("aria-label");
    });
  },
};

/**
 * Several blocks without a name are not landmarks, so they do not create
 * landmarks with the same name (axe `landmark-unique`).
 */
export const UnnamedBlocksAreNotLandmarks: Story = {
  render: () => (
    <Stack gap="400">
      <CodeBlock.Root code="npm install" language="bash">
        <CodeBlock.Content />
      </CodeBlock.Root>
      <CodeBlock.Root code="npm test" language="bash">
        <CodeBlock.Content />
      </CodeBlock.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Neither block is a region", async () => {
      await expect(
        canvasElement.querySelectorAll(".nimbus-code-block__root")
      ).toHaveLength(2);
      await expect(canvas.queryAllByRole("region")).toHaveLength(0);
    });
  },
};

/**
 * `aria-label` on Root wins over `CodeBlock.Title`.
 */
export const AriaLabelWinsOverTitle: Story = {
  render: () => (
    <CodeBlock.Root code={tsxSample} language="tsx" aria-label="Example">
      <CodeBlock.Header>
        <CodeBlock.Title>button.tsx</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The region is named by aria-label", async () => {
      const region = canvas.getByRole("region", { name: "Example" });
      await expect(region).not.toHaveAttribute("aria-labelledby");
    });
  },
};

/**
 * All names come from the messages of the active locale.
 */
export const LocaleGerman: Story = {
  render: () => (
    <NimbusI18nProvider locale="de">
      <CodeBlock.Root code={thirtyLineSample} language="js" maxLines={3}>
        <CodeBlock.Header>
          <CodeBlock.Actions>
            <CodeBlock.DownloadTrigger fileName="lines.js" />
            <CodeBlock.CopyTrigger />
          </CodeBlock.Actions>
        </CodeBlock.Header>
        <CodeBlock.Content highlightedLines={[1]} />
        <CodeBlock.ExpandTrigger />
      </CodeBlock.Root>
    </NimbusI18nProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Trigger names use the de messages", async () => {
      for (const key of ["copyCode", "downloadCode", "showMore"]) {
        await expect(
          canvas.getByRole("button", { name: getMessage(key, "de") })
        ).toBeInTheDocument();
      }
      await expect(
        canvasElement.querySelector("[data-line-announcement]")
      ).toHaveTextContent(getMessage("highlightedLinesStart", "de"));
    });
  },
};

/**
 * Props that configure parts never appear as attributes in the DOM.
 */
export const NoPropLeakage: Story = {
  render: () => (
    <CodeBlock.Root
      code={thirtyLineSample}
      language="js"
      maxLines={3}
      defaultExpanded={false}
      onExpandedChange={() => {}}
      data-testid="leak-root"
    >
      <CodeBlock.Header>
        <CodeBlock.Title>lines.js</CodeBlock.Title>
        <CodeBlock.LanguageLabel />
        <CodeBlock.Actions>
          <CodeBlock.DownloadTrigger
            fileName="lines.js"
            mimeType="text/javascript"
            onDownload={() => {}}
          />
          <CodeBlock.CopyTrigger
            text="copy me"
            timeout={1000}
            onCopy={() => {}}
            onCopyError={() => {}}
          />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content
        showLineNumbers
        startLineNumber={3}
        highlightedLines={[3]}
        addedLines={[4]}
        removedLines={[5]}
        highlightedWords={["line"]}
        prompt=">"
        outputLines={[4]}
        wrapLongLines
      />
      <CodeBlock.ExpandTrigger />
      <CodeBlock.Footer>Footer</CodeBlock.Footer>
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const internalProps = [
      "code",
      "language",
      "highlighter",
      "maxlines",
      "isexpanded",
      "defaultexpanded",
      "onexpandedchange",
      "text",
      "timeout",
      "oncopy",
      "oncopyerror",
      "filename",
      "mimetype",
      "ondownload",
      "showlinenumbers",
      "startlinenumber",
      "highlightedlines",
      "addedlines",
      "removedlines",
      "highlightedwords",
      "prompt",
      "outputlines",
      "wraplonglines",
    ];

    await step("No element carries an internal prop", async () => {
      const root = canvasElement.querySelector("[data-testid='leak-root']")!;
      const elements = [root, ...Array.from(root.querySelectorAll("*"))];
      const leaked = elements.flatMap((element) =>
        element
          .getAttributeNames()
          .filter((name) => internalProps.includes(name))
          .map((name) => `${element.tagName.toLowerCase()}[${name}]`)
      );
      await expect(leaked).toEqual([]);
    });
  },
};

/**
 * `CodeBlock` is a namespace of parts with `Root` first.
 */
export const CompoundStructure: Story = {
  args: {
    code: tsxSample,
    language: "tsx",
  },
  play: async ({ step }) => {
    await step("The namespace lists the parts, Root first", async () => {
      await expect(Object.keys(CodeBlock)).toEqual([
        "Root",
        "Header",
        "Title",
        "LanguageLabel",
        "Actions",
        "CopyTrigger",
        "DownloadTrigger",
        "Content",
        "ExpandTrigger",
        "Footer",
      ]);
    });
  },
};

// ---------------------------------------------------------------------------
// Keyboard and layout
// ---------------------------------------------------------------------------

let downloads: ReturnType<typeof captureDownloads>;
const keyboardOnCopy = fn();
const keyboardOnDownload = fn();

/**
 * A block with every focusable part, in DOM order: download, copy, code
 * area, expand.
 */
const KeyboardBlock = () => (
  <CodeBlock.Root code={thirtyLineSample} language="js" maxLines={3}>
    <CodeBlock.Header>
      <CodeBlock.Title>lines.js</CodeBlock.Title>
      <CodeBlock.Actions>
        <CodeBlock.DownloadTrigger
          fileName="lines.js"
          onDownload={keyboardOnDownload}
        />
        <CodeBlock.CopyTrigger onCopy={keyboardOnCopy} />
      </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content showLineNumbers />
    <CodeBlock.ExpandTrigger />
    <CodeBlock.Footer>Footer</CodeBlock.Footer>
  </CodeBlock.Root>
);

/**
 * Tab follows DOM order, and only the code area has a `tabIndex`.
 */
export const KeyboardFocusOrder: Story = {
  render: () => <KeyboardBlock />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Tab moves through the parts in DOM order", async () => {
      await userEvent.tab();
      await expect(
        canvas.getByRole("button", { name: "Download code" })
      ).toHaveFocus();
      await userEvent.tab();
      await expect(
        canvas.getByRole("button", { name: "Copy code" })
      ).toHaveFocus();
      await userEvent.tab();
      await expect(canvasElement.querySelector("pre")).toHaveFocus();
      await userEvent.tab();
      await expect(
        canvas.getByRole("button", { name: "Show more" })
      ).toHaveFocus();
    });

    await step("No non-interactive part has a tabIndex", async () => {
      const region = getRoot(canvasElement);
      const withTabIndex = Array.from(
        region.querySelectorAll("[tabindex]")
      ).filter((element) => element.tagName !== "BUTTON");
      await expect(withTabIndex).toEqual([canvasElement.querySelector("pre")]);
    });
  },
};

/**
 * Enter and Space activate every trigger.
 */
export const KeyboardActivation: Story = {
  beforeEach: () => {
    keyboardOnCopy.mockClear();
    keyboardOnDownload.mockClear();
    clipboard = captureCopiedText();
    downloads = captureDownloads();
    return () => {
      clipboard.restore();
      downloads.restore();
    };
  },
  render: () => <KeyboardBlock />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Download with Enter and Space", async () => {
      canvas.getByRole("button", { name: "Download code" }).focus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      await expect(keyboardOnDownload).toHaveBeenCalledTimes(2);
      await expect(downloads.downloads).toHaveLength(2);
    });

    await step("Copy with Enter and Space", async () => {
      canvas.getByRole("button", { name: "Copy code" }).focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(keyboardOnCopy).toHaveBeenCalledTimes(1));
      await userEvent.keyboard(" ");
      await waitFor(() => expect(keyboardOnCopy).toHaveBeenCalledTimes(2));
      await expect(clipboard.copied).toEqual([
        thirtyLineSample,
        thirtyLineSample,
      ]);
    });

    await step("Expand with Enter and collapse with Space", async () => {
      const expand = canvas.getByRole("button", { name: "Show more" });
      expand.focus();
      await userEvent.keyboard("{Enter}");
      await expect(expand).toHaveAttribute("aria-expanded", "true");
      await userEvent.keyboard(" ");
      await expect(expand).toHaveAttribute("aria-expanded", "false");
    });
  },
};

/**
 * Keyboard focus is visible on triggers and on the code area.
 */
export const VisibleFocus: Story = {
  render: () => <KeyboardBlock />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const hasRing = (element: Element) =>
      getComputedStyle(element).outlineStyle !== "none";

    await step("The focused trigger shows a focus ring", async () => {
      await userEvent.tab();
      const download = canvas.getByRole("button", { name: "Download code" });
      await expect(download).toHaveFocus();
      await expect(hasRing(download)).toBe(true);
    });

    await step("The focused code area shows a focus ring", async () => {
      await userEvent.tab();
      await userEvent.tab();
      const pre = canvasElement.querySelector("pre")!;
      await expect(pre).toHaveFocus();
      await expect(hasRing(pre)).toBe(true);
    });
  },
};

/**
 * Actions inside `CodeBlock.Content` sit next to the scroll area, so they do
 * not cover the code, also when it overflows.
 */
export const FloatingActionsBesideCode: Story = {
  render: () => (
    <Box width="400px">
      <CodeBlock.Root code={longLineSample} language="js">
        <CodeBlock.Content>
          <CodeBlock.Actions>
            <CodeBlock.CopyTrigger />
          </CodeBlock.Actions>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The copy button is outside the code area", async () => {
      const pre = canvasElement.querySelector("pre")!;
      const button = canvas.getByRole("button", { name: "Copy code" });
      const preBox = pre.getBoundingClientRect();
      const buttonBox = button.getBoundingClientRect();
      await expect(pre.scrollWidth).toBeGreaterThan(pre.clientWidth);
      await expect(buttonBox.left).toBeGreaterThanOrEqual(preBox.right - 0.5);
      await expect(buttonBox.top).toBeLessThan(preBox.top + preBox.height / 2);
    });
  },
};
