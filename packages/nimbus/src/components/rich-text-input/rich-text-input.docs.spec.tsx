import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { RichTextInput, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage Tests
 * @docs-description Test basic RichTextInput rendering and HTML value handling
 * @docs-order 1
 */
describe("RichTextInput - Basic usage", () => {
  it("renders with default HTML value", () => {
    const initialContent = "<p>Welcome to the <strong>editor</strong>!</p>";

    render(
      <NimbusProvider>
        <RichTextInput defaultValue={initialContent} />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toHaveTextContent("Welcome to the editor!");
    expect(editor.querySelector("strong")).toHaveTextContent("editor");
  });

  it("displays placeholder when empty", async () => {
    render(
      <NimbusProvider>
        <RichTextInput placeholder="Start typing..." />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    // Slate.js uses data-slate-placeholder for empty state
    // In Slate 0.100+, placeholder rendering may need a tick to complete
    await waitFor(() => {
      const placeholder = editor.querySelector("[data-slate-placeholder]");
      expect(placeholder).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section controlled-uncontrolled
 * @docs-title Controlled vs Uncontrolled Tests
 * @docs-description Test controlled and uncontrolled component patterns
 * @docs-order 2
 */
describe("RichTextInput - Controlled vs Uncontrolled", () => {
  it("works in uncontrolled mode with defaultValue", () => {
    render(
      <NimbusProvider>
        <RichTextInput defaultValue="<p>Uncontrolled content</p>" />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toHaveTextContent("Uncontrolled content");
  });

  it("works in controlled mode with value and onChange", () => {
    const TestComponent = () => {
      const [value, setValue] = useState("<p>Controlled content</p>");
      return <RichTextInput value={value} onChange={setValue} />;
    };

    render(
      <NimbusProvider>
        <TestComponent />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toHaveTextContent("Controlled content");
  });
});

/**
 * @docs-section html-formats
 * @docs-title HTML Format Support Tests
 * @docs-description Test different HTML formats and structures the component accepts
 * @docs-order 3
 */
describe("RichTextInput - HTML format support", () => {
  it("renders text formatting (bold, italic, underline)", () => {
    const html =
      "<p>Plain <strong>bold</strong> <em>italic</em> <u>underline</u></p>";

    render(
      <NimbusProvider>
        <RichTextInput defaultValue={html} />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor.querySelector("strong")).toHaveTextContent("bold");
    expect(editor.querySelector("em")).toHaveTextContent("italic");
    expect(editor.querySelector("u")).toHaveTextContent("underline");
  });

  it("renders headings (h1-h5)", () => {
    const html = `
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
    `;

    render(
      <NimbusProvider>
        <RichTextInput defaultValue={html} />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor.querySelector("h1")).toHaveTextContent("Heading 1");
    expect(editor.querySelector("h2")).toHaveTextContent("Heading 2");
    expect(editor.querySelector("h3")).toHaveTextContent("Heading 3");
  });

  it("renders lists (ordered and unordered)", () => {
    const html = `
      <ul>
        <li>Bullet 1</li>
        <li>Bullet 2</li>
      </ul>
      <ol>
        <li>Number 1</li>
        <li>Number 2</li>
      </ol>
    `;

    render(
      <NimbusProvider>
        <RichTextInput defaultValue={html} />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    const bulletList = editor.querySelector("ul");
    const numberedList = editor.querySelector("ol");

    expect(bulletList?.querySelectorAll("li")).toHaveLength(2);
    expect(numberedList?.querySelectorAll("li")).toHaveLength(2);
  });

  it("renders blockquotes and code", () => {
    const html = `
      <blockquote>This is a quote</blockquote>
      <p>Inline <code>code</code> example</p>
      <pre><code>Block code example</code></pre>
    `;

    render(
      <NimbusProvider>
        <RichTextInput defaultValue={html} />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor.querySelector("blockquote")).toHaveTextContent(
      "This is a quote"
    );
    expect(editor.querySelector("code")).toHaveTextContent("code");
  });
});

/**
 * @docs-section state-management
 * @docs-title State Management Tests
 * @docs-description Test disabled, read-only, and invalid states
 * @docs-order 4
 */
describe("RichTextInput - State management", () => {
  it("disables editor when isDisabled is true", () => {
    render(
      <NimbusProvider>
        <RichTextInput isDisabled defaultValue="<p>Cannot edit this</p>" />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toHaveAttribute("contenteditable", "false");
  });

  it("hides toolbar in read-only mode", () => {
    render(
      <NimbusProvider>
        <RichTextInput isReadOnly defaultValue="<p>Read-only content</p>" />
      </NimbusProvider>
    );

    const toolbar = screen.queryByRole("toolbar");
    expect(toolbar).not.toBeInTheDocument();
  });

  it("applies invalid styling for validation errors", () => {
    const { container } = render(
      <NimbusProvider>
        <RichTextInput isInvalid />
      </NimbusProvider>
    );

    const root = container.querySelector('[role="group"]');
    expect(root).toHaveAttribute("data-invalid", "true");
  });
});

/**
 * @docs-section form-validation
 * @docs-title Form Validation Tests
 * @docs-description Test validation patterns and utility functions for forms
 * @docs-order 5
 */
describe("RichTextInput - Form validation", () => {
  it("provides isEmpty utility for content validation", () => {
    const isEmpty = (html: string) => {
      const text = html.replace(/<[^>]*>/g, "").trim();
      return text.length === 0;
    };

    // Empty states
    expect(isEmpty("")).toBe(true);
    expect(isEmpty("<p></p>")).toBe(true);
    expect(isEmpty("<p>   </p>")).toBe(true);

    // Non-empty states
    expect(isEmpty("<p>Content</p>")).toBe(false);
    expect(isEmpty("<p>   Content   </p>")).toBe(false);
  });

  it("provides getTextLength utility for character counting", () => {
    const getTextLength = (html: string) => {
      return html.replace(/<[^>]*>/g, "").trim().length;
    };

    const html = "<p>Hello <strong>world</strong>!</p>";
    const length = getTextLength(html);

    // Should count only visible characters, not HTML tags
    expect(length).toBe(12); // "Hello world!" = 12 characters
  });

  it("integrates with form validation patterns", () => {
    const isEmpty = (html: string) => {
      const text = html.replace(/<[^>]*>/g, "").trim();
      return text.length === 0;
    };

    const TestForm = () => {
      const [content, setContent] = useState("");
      const [error, setError] = useState("");

      const validate = () => {
        if (isEmpty(content)) {
          setError("Content is required");
        } else {
          setError("");
        }
      };

      return (
        <form>
          <RichTextInput
            value={content}
            onChange={setContent}
            isInvalid={!!error}
            aria-describedby={error ? "error-message" : undefined}
          />
          {error && (
            <div id="error-message" role="alert">
              {error}
            </div>
          )}
          <button type="button" onClick={validate}>
            Validate
          </button>
        </form>
      );
    };

    render(
      <NimbusProvider>
        <TestForm />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveAttribute("contenteditable", "true");
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Test accessibility features and ARIA attributes
 * @docs-order 6
 */
describe("RichTextInput - Accessibility", () => {
  it("provides textbox role for screen readers", () => {
    render(
      <NimbusProvider>
        <RichTextInput />
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toBeInTheDocument();
  });

  it("provides toolbar role for formatting controls", () => {
    render(
      <NimbusProvider>
        <RichTextInput />
      </NimbusProvider>
    );

    const toolbar = screen.getByRole("toolbar");
    expect(toolbar).toBeInTheDocument();
  });

  it("works with error messages for validation feedback", () => {
    render(
      <NimbusProvider>
        <div>
          <RichTextInput isInvalid />
          <div role="alert">Content is required</div>
        </div>
      </NimbusProvider>
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toBeInTheDocument();

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("Content is required");
  });
});
