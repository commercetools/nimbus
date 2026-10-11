import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeSnippet, NimbusProvider } from "@commercetools/nimbus";

const renderWithProvider = (ui: React.ReactElement) =>
  render(<NimbusProvider>{ui}</NimbusProvider>);

/**
 * @docs-section named-snippet
 * @docs-title Find a snippet by its name
 * @docs-description A snippet with a `title` or an `aria-label` is a region. Use the name to find it. A snippet without a name is not a region.
 * @docs-order 1
 */
describe("CodeSnippet - Accessible name", () => {
  it("is a region named by its title", () => {
    renderWithProvider(
      <CodeSnippet title="button.tsx" language="tsx" code="const a = 1;" />
    );

    expect(
      screen.getByRole("region", { name: "button.tsx" })
    ).toBeInTheDocument();
  });

  it("is a region named by aria-label when there is no header", () => {
    renderWithProvider(
      <CodeSnippet
        aria-label="Install step"
        language="js"
        showLanguage={false}
        code="const a = 1;"
      />
    );

    expect(
      screen.getByRole("region", { name: "Install step" })
    ).toBeInTheDocument();
  });

  it("is not a region without a name", () => {
    renderWithProvider(
      <CodeSnippet language="js" showLanguage={false} code="const a = 1;" />
    );

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section copy
 * @docs-title Copy the code
 * @docs-description The copy button writes the code to the clipboard and calls `onCopy` once after a successful copy.
 * @docs-order 2
 */
describe("CodeSnippet - Copy", () => {
  it("copies the code and calls onCopy", async () => {
    const user = userEvent.setup();
    const handleCopy = vi.fn();
    const code = "const greeting = 'hello';";

    renderWithProvider(
      <CodeSnippet
        title="greeting.js"
        language="js"
        code={code}
        onCopy={handleCopy}
      />
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() => expect(handleCopy).toHaveBeenCalledTimes(1));
    expect(await navigator.clipboard.readText()).toBe(code);
  });

  it("hides the copy button with showCopyButton={false}", () => {
    renderWithProvider(
      <CodeSnippet
        title="greeting.js"
        language="js"
        code="const a = 1;"
        showCopyButton={false}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Copy code" })
    ).not.toBeInTheDocument();
  });
});

/**
 * @docs-section header-and-actions
 * @docs-title Header, download button and footer
 * @docs-description The header shows the language label. The download button appears only when `downloadFileName` is set. The footer is shown below the code.
 * @docs-order 3
 */
describe("CodeSnippet - Header, download and footer", () => {
  it("shows the language label in the header", () => {
    renderWithProvider(
      <CodeSnippet title="a.tsx" language="tsx" code="const a = 1;" />
    );

    expect(screen.getByText("tsx")).toBeInTheDocument();
  });

  it("hides the language label with showLanguage={false}", () => {
    renderWithProvider(
      <CodeSnippet
        title="a.tsx"
        language="tsx"
        showLanguage={false}
        code="const a = 1;"
      />
    );

    expect(screen.queryByText("tsx")).not.toBeInTheDocument();
  });

  it("shows a download button only with downloadFileName", () => {
    const { rerender } = renderWithProvider(
      <CodeSnippet title="a.env" language="bash" code="A=1" />
    );

    expect(
      screen.queryByRole("button", { name: "Download code" })
    ).not.toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <CodeSnippet
          title="a.env"
          language="bash"
          code="A=1"
          downloadFileName="a.env"
        />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: "Download code" })
    ).toBeInTheDocument();
  });

  it("renders the footer content", () => {
    renderWithProvider(
      <CodeSnippet
        title="a.env"
        language="bash"
        code="A=1"
        footer="Do not commit this file."
      />
    );

    expect(screen.getByText("Do not commit this file.")).toBeInTheDocument();
  });
});

/**
 * @docs-section collapsible
 * @docs-title Long code with maxLines
 * @docs-description With `maxLines`, long code starts collapsed and shows an expand button.
 * @docs-order 4
 */
describe("CodeSnippet - Collapsible", () => {
  it("shows an expand button for code longer than maxLines", () => {
    const code = Array.from({ length: 10 }, (_, i) => `line ${i + 1}`).join(
      "\n"
    );

    renderWithProvider(
      <CodeSnippet title="list.txt" language="text" code={code} maxLines={3} />
    );

    expect(
      screen.getByRole("button", { name: "Show more" })
    ).toBeInTheDocument();
  });
});
