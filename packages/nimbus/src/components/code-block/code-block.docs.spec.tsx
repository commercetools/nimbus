import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { CodeBlock, NimbusProvider } from "@commercetools/nimbus";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderWithProvider = (ui: React.ReactElement) =>
  render(<NimbusProvider>{ui}</NimbusProvider>);

// ---------------------------------------------------------------------------
// Consumer integration examples
// ---------------------------------------------------------------------------

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage
 * @docs-description
 *   Render a CodeBlock with a code string and language identifier.
 *   Copy this pattern to display syntax-highlighted code in your application.
 * @docs-order 1
 */
describe("CodeBlock - Basic usage", () => {
  it("renders a named code region that a consumer can query", () => {
    renderWithProvider(
      <CodeBlock.Root
        code={`const greeting = (name) => \`Hello, \${name}!\`;`}
        language="js"
        aria-label="Greeting example"
      >
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    // Consumers can locate the code region by its accessible name.
    expect(
      screen.getByRole("region", { name: "Greeting example" })
    ).toBeInTheDocument();
  });

  it("renders code content that a consumer can read as text", () => {
    const code = `export const add = (a: number, b: number) => a + b;`;

    renderWithProvider(
      <CodeBlock.Root code={code} language="tsx" aria-label="Add function">
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    // Consumers can assert the code text is present in the document.
    const region = screen.getByRole("region", { name: "Add function" });
    expect(region.textContent).toContain("add");
    expect(region.textContent).toContain("number");
  });
});

/**
 * @docs-section on-copy-callback
 * @docs-title Tracking Copies with onCopy
 * @docs-description
 *   Use the `onCopy` callback to react to clipboard writes — for example, to
 *   show a toast notification, log an analytics event, or update application
 *   state. The callback fires once per successful clipboard write.
 * @docs-order 2
 */
describe("CodeBlock - onCopy callback integration", () => {
  it("calls a consumer-provided handler when code is copied", async () => {
    const user = userEvent.setup();
    const handleCopy = vi.fn();

    renderWithProvider(
      <CodeBlock.Root code="npm install @commercetools/nimbus" language="bash">
        <CodeBlock.Content>
          <CodeBlock.Actions>
            <CodeBlock.CopyTrigger onCopy={handleCopy} />
          </CodeBlock.Actions>
        </CodeBlock.Content>
      </CodeBlock.Root>
    );

    await user.click(screen.getByRole("button", { name: /copy code/i }));

    // The consumer handler fires once per copy activation.
    // waitFor handles the async useEffect that gates onCopy on success.
    await waitFor(() => expect(handleCopy).toHaveBeenCalledTimes(1));
  });

  it("allows a consumer to track how many times code has been copied", async () => {
    const user = userEvent.setup();

    const TrackingExample = () => {
      const [count, setCount] = useState(0);

      return (
        <NimbusProvider>
          <CodeBlock.Root code="const x = 1;" language="js">
            <CodeBlock.Content>
              <CodeBlock.Actions>
                <CodeBlock.CopyTrigger
                  onCopy={() => setCount((prev) => prev + 1)}
                />
              </CodeBlock.Actions>
            </CodeBlock.Content>
          </CodeBlock.Root>
          <output data-testid="copy-count">{count}</output>
        </NimbusProvider>
      );
    };

    render(<TrackingExample />);

    expect(screen.getByTestId("copy-count").textContent).toBe("0");

    await user.click(screen.getByRole("button", { name: /copy code/i }));
    await waitFor(() =>
      expect(screen.getByTestId("copy-count").textContent).toBe("1")
    );
  });
});

/**
 * @docs-section display-options
 * @docs-title Choosing What to Show
 * @docs-description
 *   Render only the parts you need — for example, leave out the header in
 *   compact layouts — and wire `showLineNumbers` on `CodeBlock.Content` to
 *   application state.
 * @docs-order 3
 */
describe("CodeBlock - Display option toggling", () => {
  it("renders without a copy button when no CopyTrigger is rendered", () => {
    renderWithProvider(
      <CodeBlock.Root code="const x = 1;" language="js">
        <CodeBlock.Header>
          <CodeBlock.LanguageLabel />
        </CodeBlock.Header>
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    // Consumers embedding CodeBlock in read-only contexts can confirm
    // the copy button is absent.
    expect(
      screen.queryByRole("button", { name: /copy code/i })
    ).not.toBeInTheDocument();
  });

  it("renders without a header when no Header is rendered", () => {
    renderWithProvider(
      <CodeBlock.Root code="const x = 1;" language="js">
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    // No header and no actions means no copy button or language label —
    // useful for embedding code without chrome.
    expect(
      screen.queryByRole("button", { name: /copy code/i })
    ).not.toBeInTheDocument();
  });

  it("consumer can toggle line numbers based on user preference", async () => {
    const user = userEvent.setup();

    const PreferenceExample = () => {
      const [showNumbers, setShowNumbers] = useState(false);

      return (
        <NimbusProvider>
          <button onClick={() => setShowNumbers((prev) => !prev)}>
            Toggle line numbers
          </button>
          <CodeBlock.Root
            code={`const a = 1;\nconst b = 2;\nconst c = 3;`}
            language="js"
            aria-label="Preference example"
          >
            <CodeBlock.Content showLineNumbers={showNumbers} />
          </CodeBlock.Root>
        </NimbusProvider>
      );
    };

    render(<PreferenceExample />);

    // Initially no line numbers
    expect(
      document.querySelector(".nimbus-code-block__lineNumber")
    ).not.toBeInTheDocument();

    // After toggling, line numbers appear
    await user.click(
      screen.getByRole("button", { name: /toggle line numbers/i })
    );
    expect(
      document.querySelector(".nimbus-code-block__lineNumber")
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section excerpt-line-numbers
 * @docs-title Displaying an Excerpt at Real Line Numbers
 * @docs-description
 *   When you show only a slice of a larger file, use `startLineNumber` so the
 *   gutter reflects the excerpt's real position in the source instead of
 *   restarting at 1. Pass the contiguous excerpt as `code` and the line number
 *   of its first line as `startLineNumber`.
 * @docs-order 5
 */
describe("CodeBlock - Excerpt with real line numbers", () => {
  it("numbers a five-line excerpt at its real source line numbers", () => {
    const excerpt = [
      "function greet(name) {",
      '  const message = "Hello, " + name;',
      "  console.log(message);",
      "  return message;",
      "}",
    ].join("\n");

    renderWithProvider(
      <CodeBlock.Root code={excerpt} language="js" aria-label="Excerpt example">
        <CodeBlock.Content showLineNumbers startLineNumber={42} />
      </CodeBlock.Root>
    );

    // The gutter starts at the offset and increments per line.
    const gutter = Array.from(
      document.querySelectorAll(".nimbus-code-block__lineNumber")
    ).map((el) => el.textContent);
    expect(gutter).toEqual(["42", "43", "44", "45", "46"]);
  });
});

/**
 * @docs-section highlight-lines
 * @docs-title Highlighting Lines of Interest
 * @docs-description
 *   Pass `highlightedLines` to draw attention to specific lines — for example,
 *   the line a search result landed on. The numbers refer to the displayed line
 *   numbers, so they honor a `startLineNumber` offset.
 * @docs-order 6
 */
describe("CodeBlock - Highlighting lines", () => {
  it("highlights the line matching the displayed line number", () => {
    const excerpt = [
      "function greet(name) {",
      '  const message = "Hello, " + name;',
      "  console.log(message);",
      "  return message;",
      "}",
    ].join("\n");

    renderWithProvider(
      <CodeBlock.Root
        code={excerpt}
        language="js"
        aria-label="Highlight example"
      >
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
        ?.textContent
    ).toBe("43");
  });
});

/**
 * @docs-section size-variants
 * @docs-title Using Size Variants
 * @docs-description
 *   Choose between `"sm"` (compact) and `"md"` (default) sizes to match the
 *   density of the surrounding layout. Both sizes render the same code — only
 *   typography and padding scale.
 * @docs-order 4
 */
describe("CodeBlock - Size variants", () => {
  it("renders at sm size without errors", () => {
    renderWithProvider(
      <CodeBlock.Root
        code="const x = 1;"
        language="js"
        size="sm"
        aria-label="Compact example"
      >
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    expect(
      screen.getByRole("region", { name: "Compact example" })
    ).toBeInTheDocument();
  });

  it("renders at md size (default) without errors", () => {
    renderWithProvider(
      <CodeBlock.Root
        code="const x = 1;"
        language="js"
        size="md"
        aria-label="Default size example"
      >
        <CodeBlock.Content />
      </CodeBlock.Root>
    );

    expect(
      screen.getByRole("region", { name: "Default size example" })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section multiple-snippets
 * @docs-title Rendering Multiple Snippets
 * @docs-description
 *   A common pattern is to render several CodeBlocks on a documentation page,
 *   each with a distinct accessible label. This ensures screen reader users
 *   can distinguish between them.
 * @docs-order 7
 */
describe("CodeBlock - Multiple snippets on one page", () => {
  it("renders multiple labelled code regions that can each be queried independently", () => {
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
          code={`import { Button } from '@commercetools/nimbus';`}
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
