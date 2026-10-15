import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMemo, useState } from "react";
import java from "refractor/java";
import {
  CodeBlock,
  CodeHighlighterProvider,
  NimbusProvider,
  createPrismHighlighter,
  defaultCodeLanguages,
  type CodeHighlighter,
} from "@commercetools/nimbus";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderWithProvider = (ui: React.ReactElement) =>
  render(<NimbusProvider>{ui}</NimbusProvider>);

const exampleCode = [
  "function greet(name) {",
  '  const message = "Hello, " + name;',
  "  console.log(message);",
  "  return message;",
  "}",
].join("\n");

// ---------------------------------------------------------------------------
// Consumer integration examples
// ---------------------------------------------------------------------------

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage
 * @docs-description
 *   Render a code block from `CodeBlock.Root` and `CodeBlock.Content`. Name
 *   the block with `aria-label` or `CodeBlock.Title` to make it a region that
 *   your tests can query by role and name.
 * @docs-order 1
 */
describe("CodeBlock - Basic usage", () => {
  it("renders a named code region that a consumer can query", () => {
    renderWithProvider(
      <CodeBlock.Root
        code="const greeting = (name) => `Hello, ${name}!`;"
        language="js"
        aria-label="Greeting example"
      >
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    expect(
      screen.getByRole("region", { name: "Greeting example" })
    ).toBeInTheDocument();
  });

  it("renders the code as text that a consumer can read", () => {
    const code = "export const add = (a: number, b: number) => a + b;";

    renderWithProvider(
      <CodeBlock.Root code={code} language="tsx" aria-label="Add function">
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    const region = screen.getByRole("region", { name: "Add function" });
    expect(region.querySelector("code")).toHaveTextContent(code);
  });
});

/**
 * @docs-section title-and-header
 * @docs-title Title and Header
 * @docs-description
 *   `CodeBlock.Title` shows a visible title, for example a file name, and
 *   names the region. `aria-label` on `CodeBlock.Root` wins over the title.
 *   The language label is decorative and hidden from assistive technology.
 * @docs-order 2
 */
describe("CodeBlock - Title and header", () => {
  it("names the region with the title", async () => {
    renderWithProvider(
      <CodeBlock.Root code="export const a = 1;" language="ts">
        <CodeBlock.Header>
          <CodeBlock.Title>button.tsx</CodeBlock.Title>
          <CodeBlock.LanguageLabel />
        </CodeBlock.Header>
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    // The title is detected after mount.
    expect(
      await screen.findByRole("region", { name: "button.tsx" })
    ).toBeInTheDocument();
  });

  it("uses aria-label instead of the title when both are set", async () => {
    renderWithProvider(
      <CodeBlock.Root code="a: 1" language="yaml" aria-label="Settings">
        <CodeBlock.Header>
          <CodeBlock.Title>config.yaml</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    expect(
      await screen.findByRole("region", { name: "Settings" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "config.yaml" })
    ).not.toBeInTheDocument();
  });

  it("renders several blocks with distinct names", () => {
    renderWithProvider(
      <div>
        <CodeBlock.Root
          code="npm install @commercetools/nimbus"
          language="bash"
          aria-label="Installation command"
        >
          <CodeBlock.Content />
        </CodeBlock.Root>
        <CodeBlock.Root
          code="import { Button } from '@commercetools/nimbus';"
          language="tsx"
          aria-label="Import example"
        >
          <CodeBlock.Content />
        </CodeBlock.Root>
      </div>
    );

    expect(
      screen.getByRole("region", { name: "Installation command" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Import example" })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section copy-without-header
 * @docs-title Copy Button Without a Header
 * @docs-description
 *   Place `CodeBlock.Actions` inside `CodeBlock.Content` to show the copy
 *   button in the top corner of the code, with no header. Use `onCopy` to
 *   react to a successful copy and `onCopyError` to react to a failure.
 * @docs-order 3
 */
describe("CodeBlock - Copy without a header", () => {
  it("copies the full code and calls onCopy once", async () => {
    const user = userEvent.setup();
    const handleCopy = vi.fn();
    const code = "npm install @commercetools/nimbus";

    renderWithProvider(
      <CodeBlock.Root code={code} language="bash" aria-label="Install">
        <CodeBlock.Content>
          <CodeBlock.Actions>
            <CodeBlock.CopyTrigger onCopy={handleCopy} />
          </CodeBlock.Actions>
        </CodeBlock.Content>
      </CodeBlock.Root>
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() => expect(handleCopy).toHaveBeenCalledTimes(1));
    expect(await navigator.clipboard.readText()).toBe(code);
  });

  it("announces the result in a polite live region", async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <CodeBlock.Root code="const x = 1;" language="js" aria-label="Example">
        <CodeBlock.Content>
          <CodeBlock.Actions>
            <CodeBlock.CopyTrigger />
          </CodeBlock.Actions>
        </CodeBlock.Content>
      </CodeBlock.Root>
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });

  it("copies the text prop instead of the code", async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <CodeBlock.Root code="API_KEY=***" language="bash" aria-label="Key">
        <CodeBlock.Content>
          <CodeBlock.Actions>
            <CodeBlock.CopyTrigger text="API_KEY=real-value" />
          </CodeBlock.Actions>
        </CodeBlock.Content>
      </CodeBlock.Root>
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(async () =>
      expect(await navigator.clipboard.readText()).toBe("API_KEY=real-value")
    );
  });

  it("tracks how many times the code was copied", async () => {
    const user = userEvent.setup();

    const TrackingExample = () => {
      const [count, setCount] = useState(0);

      return (
        <NimbusProvider>
          <CodeBlock.Root code="const x = 1;" language="js" aria-label="Count">
            <CodeBlock.Content>
              <CodeBlock.Actions>
                <CodeBlock.CopyTrigger
                  onCopy={() => setCount((previous) => previous + 1)}
                />
              </CodeBlock.Actions>
            </CodeBlock.Content>
          </CodeBlock.Root>
          <output data-testid="copy-count">{count}</output>
        </NimbusProvider>
      );
    };

    render(<TrackingExample />);

    expect(screen.getByTestId("copy-count")).toHaveTextContent("0");

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() =>
      expect(screen.getByTestId("copy-count")).toHaveTextContent("1")
    );
  });
});

/**
 * @docs-section line-numbers-and-marks
 * @docs-title Line Numbers and Marked Lines
 * @docs-description
 *   Use `showLineNumbers` and `startLineNumber` to number the lines. Use
 *   `highlightedLines`, `addedLines` and `removedLines` to mark lines. The
 *   line numbers in these props are the displayed numbers, so they follow
 *   `startLineNumber`. Line numbers and markers are never part of the code
 *   text.
 * @docs-order 4
 */
describe("CodeBlock - Line numbers and marked lines", () => {
  it("numbers an excerpt at its real line numbers", () => {
    renderWithProvider(
      <CodeBlock.Root code={exampleCode} language="js" aria-label="Excerpt">
        <CodeBlock.Content showLineNumbers startLineNumber={42} />
      </CodeBlock.Root>
    );

    const numbers = Array.from(
      document.querySelectorAll(".nimbus-code-block__lineNumber")
    ).map((element) => element.textContent);
    expect(numbers).toEqual(["42", "43", "44", "45", "46"]);
  });

  it("highlights the line that matches the displayed line number", () => {
    renderWithProvider(
      <CodeBlock.Root code={exampleCode} language="js" aria-label="Highlight">
        <CodeBlock.Content
          showLineNumbers
          startLineNumber={42}
          highlightedLines={[43]}
        />
      </CodeBlock.Root>
    );

    const highlighted = document.querySelectorAll(
      ".nimbus-code-block__line[data-mark='highlighted']"
    );
    expect(highlighted).toHaveLength(1);
    expect(
      highlighted[0].querySelector(".nimbus-code-block__lineNumber")
    ).toHaveTextContent("43");
  });
});

/**
 * @docs-section command-prompt
 * @docs-title Commands With a Prompt
 * @docs-description
 *   Use `prompt` to show a shell prompt before each line, and `outputLines`
 *   for lines that show output. The prompt is hidden from assistive
 *   technology and is not part of the copied text.
 * @docs-order 5
 */
describe("CodeBlock - Command prompt", () => {
  it("shows the prompt on command lines only and copies without it", async () => {
    const user = userEvent.setup();
    const code = "npm install\nadded 42 packages";

    renderWithProvider(
      <CodeBlock.Root code={code} language="bash" aria-label="Command">
        <CodeBlock.Content prompt="$" outputLines={[2]}>
          <CodeBlock.Actions>
            <CodeBlock.CopyTrigger />
          </CodeBlock.Actions>
        </CodeBlock.Content>
      </CodeBlock.Root>
    );

    expect(
      document.querySelectorAll(".nimbus-code-block__prompt")
    ).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Copy code" }));
    await waitFor(async () =>
      expect(await navigator.clipboard.readText()).toBe(code)
    );
  });
});

/**
 * @docs-section collapse-with-expand-trigger
 * @docs-title Collapsing Long Code
 * @docs-description
 *   Set `maxLines` on `CodeBlock.Root` and render `CodeBlock.ExpandTrigger`
 *   to show only the first lines of long code. Copy and download always use
 *   the full code. Use `isExpanded` with `onExpandedChange` to control the
 *   state.
 * @docs-order 6
 */
describe("CodeBlock - Collapse with ExpandTrigger", () => {
  const longCode = Array.from(
    { length: 12 },
    (_, index) => `const value${index + 1} = ${index + 1};`
  ).join("\n");

  const renderLongBlock = () =>
    renderWithProvider(
      <CodeBlock.Root
        code={longCode}
        language="js"
        maxLines={3}
        aria-label="Long"
      >
        <CodeBlock.Content>
          <CodeBlock.Actions>
            <CodeBlock.CopyTrigger />
          </CodeBlock.Actions>
        </CodeBlock.Content>
        <CodeBlock.ExpandTrigger />
      </CodeBlock.Root>
    );

  it("renders only the first lines until the user expands the block", async () => {
    const user = userEvent.setup();
    renderLongBlock();

    const code = () => document.querySelector("code") as HTMLElement;
    expect(code().querySelectorAll(".nimbus-code-block__line")).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Show more" }));

    expect(code().querySelectorAll(".nimbus-code-block__line")).toHaveLength(
      12
    );
    expect(
      screen.getByRole("button", { name: "Show less" })
    ).toBeInTheDocument();
  });

  it("copies the full code while the block is collapsed", async () => {
    const user = userEvent.setup();
    renderLongBlock();

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(async () =>
      expect(await navigator.clipboard.readText()).toBe(longCode)
    );
  });

  it("reports state changes when the block is controlled", async () => {
    const user = userEvent.setup();
    const handleExpandedChange = vi.fn();

    renderWithProvider(
      <CodeBlock.Root
        code={longCode}
        language="js"
        maxLines={3}
        isExpanded={false}
        onExpandedChange={handleExpandedChange}
      >
        <CodeBlock.Content />
        <CodeBlock.ExpandTrigger />
      </CodeBlock.Root>
    );

    await user.click(screen.getByRole("button", { name: "Show more" }));

    expect(handleExpandedChange).toHaveBeenCalledWith(true);
  });
});

/**
 * @docs-section download
 * @docs-title Downloading Code
 * @docs-description
 *   `CodeBlock.DownloadTrigger` downloads the code as a file. Set `fileName`,
 *   and optionally `mimeType` and `text`. Use `onDownload` to react when a
 *   download starts.
 * @docs-order 7
 */
describe("CodeBlock - Download", () => {
  // jsdom does not implement object URLs; keep the originals to restore them.
  const { createObjectURL, revokeObjectURL } = URL;

  afterEach(() => {
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;
    vi.restoreAllMocks();
  });

  it("starts a download with the file name and the code", async () => {
    const user = userEvent.setup();
    const handleDownload = vi.fn();
    const createObjectURLMock = vi.fn<(blob: Blob) => string>(
      () => "blob:mock"
    );
    const downloadedNames: string[] = [];

    // jsdom does not implement object URLs or file navigation.
    URL.createObjectURL = createObjectURLMock;
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      downloadedNames.push(this.download);
    });

    renderWithProvider(
      <CodeBlock.Root code={"name: nimbus\nversion: 1"} language="yaml">
        <CodeBlock.Header>
          <CodeBlock.Title>config.yaml</CodeBlock.Title>
          <CodeBlock.Actions>
            <CodeBlock.DownloadTrigger
              fileName="config.yaml"
              onDownload={handleDownload}
            />
          </CodeBlock.Actions>
        </CodeBlock.Header>
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    await user.click(screen.getByRole("button", { name: "Download code" }));

    expect(handleDownload).toHaveBeenCalledTimes(1);
    expect(downloadedNames).toEqual(["config.yaml"]);
    const blob = createObjectURLMock.mock.calls[0][0];
    expect(blob.type).toBe("text/plain;charset=utf-8");
  });
});

/**
 * @docs-section additional-languages
 * @docs-title Adding Languages With createPrismHighlighter
 * @docs-description
 *   The default highlighter supports the languages in `defaultCodeLanguages`.
 *   Create your own highlighter once, with `additionalLanguages` and
 *   `aliases`, and give it to your code blocks with `CodeHighlighterProvider`.
 *   Your app needs `refractor` as a dependency to import extra grammars.
 * @docs-order 8
 */
describe("CodeBlock - Additional languages", () => {
  // Create highlighters once, outside of render.
  const highlighter = createPrismHighlighter({
    additionalLanguages: [java],
    aliases: { jsonc: "json" },
  });

  const javaCode = 'public class Hello { String name = "nimbus"; }';

  it("lists the default languages", () => {
    expect(defaultCodeLanguages).toContain("tsx");
    expect(defaultCodeLanguages).toContain("bash");
    expect(defaultCodeLanguages).not.toContain("java");
  });

  it("resolves added languages and aliases on the new highlighter only", () => {
    expect(highlighter.resolveLanguage("java")).toBe("java");
    expect(highlighter.resolveLanguage("jsonc")).toBe("json");
    expect(highlighter.resolveLanguage("sh")).toBe("bash");
    expect(createPrismHighlighter().resolveLanguage("java")).toBeUndefined();
  });

  it("highlights the added language inside a provider", () => {
    renderWithProvider(
      <CodeHighlighterProvider highlighter={highlighter}>
        <CodeBlock.Root code={javaCode} language="java" aria-label="Java">
          <CodeBlock.Content />
        </CodeBlock.Root>
      </CodeHighlighterProvider>
    );

    expect(document.querySelector(".token.keyword")).toBeInTheDocument();
  });

  it("shows plain text for a language that is not supported", () => {
    renderWithProvider(
      <CodeBlock.Root code={javaCode} language="java" aria-label="Plain">
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    expect(document.querySelector(".token")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Plain" })).toHaveTextContent(
      javaCode
    );
  });

  it("creates the highlighter once with useMemo", () => {
    const Example = () => {
      const memoized = useMemo(
        () => createPrismHighlighter({ additionalLanguages: [java] }),
        []
      );
      return (
        <CodeHighlighterProvider highlighter={memoized}>
          <CodeBlock.Root code={javaCode} language="java" aria-label="Memo">
            <CodeBlock.Content />
          </CodeBlock.Root>
        </CodeHighlighterProvider>
      );
    };

    renderWithProvider(<Example />);

    expect(document.querySelector(".token.keyword")).toBeInTheDocument();
  });
});

/**
 * @docs-section custom-highlighter
 * @docs-title Using a Custom Highlighter
 * @docs-description
 *   Implement the `CodeHighlighter` type to use another engine. `highlight`
 *   may return a Promise. The code shows as plain text until the Promise
 *   resolves.
 * @docs-order 9
 */
describe("CodeBlock - Custom highlighter", () => {
  const asyncHighlighter: CodeHighlighter = {
    resolveLanguage: (language) => language,
    highlight: async (code) =>
      code
        .split("\n")
        .map((line) =>
          line === "" ? [] : [{ content: line, types: ["custom"] }]
        ),
  };

  it("shows plain text first and tokens after the Promise resolves", async () => {
    renderWithProvider(
      <CodeHighlighterProvider highlighter={asyncHighlighter}>
        <CodeBlock.Root code="a = 1" language="any" aria-label="Async">
          <CodeBlock.Content />
        </CodeBlock.Root>
      </CodeHighlighterProvider>
    );

    expect(screen.getByRole("region", { name: "Async" })).toHaveTextContent(
      "a = 1"
    );
    await waitFor(() =>
      expect(document.querySelector(".token.custom")).toBeInTheDocument()
    );
  });
});
