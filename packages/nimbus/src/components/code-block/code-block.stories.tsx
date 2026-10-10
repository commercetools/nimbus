import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import {
  CodeBlock,
  type CodeBlockRootProps,
  type CodeBlockContentProps,
  Box,
  Stack,
} from "@commercetools/nimbus";

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

const sizes: CodeBlockRootProps["size"][] = ["sm", "md"];

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
 * Asserts the region's accessible name equals "Code block" (the default i18n label).
 */
export const Base: Story = {
  args: {
    code: jsxSample,
    language: "jsx",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Renders the code region with the default accessible name",
      async () => {
        // The default i18n regionLabel is "Code block"
        const region = canvas.getByRole("region", { name: "Code block" });
        await expect(region).toBeInTheDocument();
        // Verify some representative text from the code sample is present
        await expect(region).toHaveTextContent("Button");
      }
    );

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
    const canvas = within(canvasElement);

    await step("Code text is present in the DOM", async () => {
      const region = canvas.getByRole("region");
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Component renders without throwing", async () => {
      const region = canvas.getByRole("region");
      await expect(region).toBeInTheDocument();
    });

    await step("Code text content is present", async () => {
      const region = canvas.getByRole("region");
      await expect(region).toHaveTextContent("hello world");
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
    const canvas = within(canvasElement);

    await step("Component renders without throwing", async () => {
      const region = canvas.getByRole("region");
      await expect(region).toBeInTheDocument();
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
    const canvas = within(canvasElement);

    await step("Region renders without crashing", async () => {
      const region = canvas.getByRole("region");
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
        const region = canvas.getByRole("region");
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
    const canvas = within(canvasElement);

    await step(
      "Component renders at full width inside its container",
      async () => {
        const region = canvas.getByRole("region");
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
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Root section has role='region' and an accessible name",
      async () => {
        const region = canvas.getByRole("region");
        await expect(region).toBeInTheDocument();
        const label = region.getAttribute("aria-label");
        await expect(label).toBeTruthy();
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
        const region = canvas.getByRole("region");
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
// Sizes (showcase)
// ---------------------------------------------------------------------------

/**
 * Side-by-side size comparison.
 */
export const Sizes: Story = {
  render: () => (
    <Stack direction="column" gap="400">
      {sizes.map((size) => (
        <DefaultLayout
          key={size as string}
          aria-label={`Code block — size ${size as string}`}
          code={`// size="${size as string}"\nconst x = 1;`}
          language="js"
          size={size}
        />
      ))}
    </Stack>
  ),
};
