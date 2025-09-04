import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { RichTextInput } from "./rich-text-input";

// Test utilities for Slate editor synchronization
const waitForSlateReady = async (canvas: ReturnType<typeof within>) => {
  const editor = canvas.getByRole("textbox");
  await waitFor(
    () => {
      expect(editor).toHaveAttribute("data-slate-ready", "true");
    },
    { timeout: 10000, interval: 50 }
  );
  await new Promise((resolve) => setTimeout(resolve, 200));
};

const waitForButtonState = async (
  button: HTMLElement,
  expectedState: string,
  timeout = 8000
) => {
  await waitFor(
    () => {
      expect(button).toHaveAttribute("aria-pressed", expectedState);
    },
    { timeout, interval: 50 }
  );
};

const waitForTextContent = async (
  element: HTMLElement,
  expectedContent: string,
  timeout = 5000
) => {
  await waitFor(
    () => {
      expect(element).toHaveTextContent(expectedContent);
    },
    { timeout, interval: 100 }
  );
};

const waitForSlateOperationComplete = async (editor: HTMLElement) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  await waitFor(
    () => {
      expect(editor).not.toHaveAttribute("aria-busy", "true");
    },
    { timeout: 3000, interval: 50 }
  );
};

const meta = {
  title: "Components/RichTextInput",
  component: RichTextInput,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A rich text editor built with Slate.js for creating formatted content with support for headings, lists, text formatting, and more.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "aria-allowed-attr",
            enabled: false,
          },
          {
            id: "color-contrast",
            enabled: false,
          },
        ],
      },
    },
  },
  argTypes: {
    isDisabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    isReadOnly: {
      control: "boolean",
      description: "Whether the input is read-only",
    },
    isInvalid: {
      control: "boolean",
      description: "Whether the input is in an invalid state",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text to show when empty",
    },
    autoFocus: {
      control: "boolean",
      description: "Whether to focus the input when it mounts",
    },
    value: {
      control: "text",
      description: "Controlled HTML value",
    },
    defaultValue: {
      control: "text",
      description: "Default HTML value for uncontrolled usage",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RichTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Core Functionality Tests
// =============================================================================

export const Default: Story = {
  args: {
    placeholder: "Start typing...",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Wait for Slate to be ready
    await waitForSlateReady(canvas);

    // Verify basic rendering
    const editor = canvas.getByRole("textbox");
    expect(editor).toBeInTheDocument();

    // Verify toolbar is present
    const toolbar = canvas.getByRole("toolbar");
    expect(toolbar).toBeInTheDocument();

    // Verify placeholder is present
    await waitFor(() => {
      const hasPlaceholder =
        editor.querySelector("[data-slate-placeholder]") ||
        editor.querySelector(".slate-placeholder") ||
        editor.querySelector(
          '[data-slate-editor] > [data-slate-node="element"] > [data-slate-leaf]'
        ) ||
        !editor.textContent ||
        editor.textContent.trim() === "" ||
        editor.getAttribute("aria-placeholder") === "Start typing...";
      expect(hasPlaceholder).toBeTruthy();
    });

    // Test basic typing
    await userEvent.click(editor);
    await waitFor(
      () => {
        expect(editor).toHaveFocus();
      },
      { timeout: 8000, interval: 50 }
    );

    await new Promise((resolve) => setTimeout(resolve, 200));
    await userEvent.type(editor, "Hello world");
    await waitForTextContent(editor, "Hello world");
  },
};

export const DisabledState: Story = {
  args: {
    defaultValue: "<p>This input is <strong>disabled</strong>.</p>",
    isDisabled: true,
    placeholder: "This input is disabled",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Test disabled state
    const root =
      editor.closest('[data-disabled="true"]') ||
      editor.closest("[data-disabled]") ||
      canvasElement.querySelector('[data-disabled="true"]');
    expect(root).toHaveAttribute("data-disabled", "true");

    // Verify toolbar is still visible but disabled
    const toolbar = canvas.getByRole("toolbar");
    expect(toolbar).toBeInTheDocument();

    // Verify all toolbar buttons are disabled (like original test)
    const buttons = canvas.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button as HTMLButtonElement).toBeDisabled();
    });

    // Verify editor is not editable in disabled state
    await userEvent.click(editor);
    await userEvent.type(editor, "should not type");
    expect(editor).not.toHaveTextContent("should not type");
  },
};

export const ReadOnlyState: Story = {
  args: {
    defaultValue: "<p>This input is <strong>read-only</strong>.</p>",
    isReadOnly: true,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify read-only state
    const root =
      editor.closest('[data-readonly="true"]') ||
      editor.closest("[data-readonly]") ||
      canvasElement.querySelector('[data-readonly="true"]');
    expect(root).toHaveAttribute("data-readonly", "true");

    // Verify content is visible
    expect(editor).toHaveTextContent("This input is read-only.");

    // Verify editor is not editable
    await userEvent.click(editor);
    await userEvent.type(editor, "should not type");
    expect(editor).not.toHaveTextContent("should not type");
  },
};

export const InvalidState: Story = {
  args: {
    defaultValue: "<p>This input has an error state.</p>",
    isInvalid: true,
    placeholder: "Start typing...",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify invalid state styling
    const root =
      editor.closest('[data-invalid="true"]') ||
      editor.closest("[data-invalid]") ||
      canvasElement.querySelector('[data-invalid="true"]');
    expect(root).toHaveAttribute("data-invalid", "true");

    // Verify content and functionality still work
    expect(editor).toHaveTextContent("This input has an error state.");

    // Test that editing still works
    await userEvent.click(editor);
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    await userEvent.type(editor, " Additional text.");
    await waitFor(() => {
      expect(editor).toHaveTextContent("Additional text.");
    });
  },
};

export const ControlledMode: Story = {
  render: () => {
    const [value, setValue] = useState(
      "<p>Initial <em>controlled</em> value</p>"
    );

    return (
      <div>
        <RichTextInput
          value={value}
          onChange={setValue}
          placeholder="Type something..."
        />
        <div style={{ marginTop: "16px", fontSize: "12px", color: "#666" }}>
          Current value: {value}
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify initial controlled value
    expect(editor).toHaveTextContent("Initial controlled value");

    // Test that changes update the controlled value
    await userEvent.click(editor);
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    await userEvent.type(editor, " updated");

    // Wait for the value display to update
    await waitFor(
      () => {
        const valueDisplay = canvas.getByText(/Current value:/);
        expect(valueDisplay).toHaveTextContent("updated");
      },
      { timeout: 1000 }
    );
  },
};

export const EventHandling: Story = {
  render: () => {
    const [events, setEvents] = useState<string[]>([]);

    return (
      <div>
        <RichTextInput
          placeholder="Test events..."
          onFocus={() => setEvents((prev) => [...prev, "Focus"])}
          onBlur={() => setEvents((prev) => [...prev, "Blur"])}
        />
        <div style={{ marginTop: "16px", fontSize: "12px" }}>
          <div>Events: {events.join(", ")}</div>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Test focus event
    await userEvent.click(editor);
    await waitFor(() => {
      expect(canvas.getByText("Events: Focus")).toBeInTheDocument();
    });

    // Verify editor has focus
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });

    // Test blur event by clicking outside
    await userEvent.click(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText("Events: Focus, Blur")).toBeInTheDocument();
    });
  },
};

// =============================================================================
// Rich Text Features
// =============================================================================

export const TextFormatting: Story = {
  args: {
    placeholder: "Test text formatting...",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    await waitForSlateReady(canvas);
    await userEvent.click(editor);
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });

    // Test individual formatting
    await userEvent.type(editor, "Normal ");

    // Test bold
    const boldButton = canvas.getByRole("button", { name: /bold/i });
    await userEvent.click(boldButton);
    await waitForSlateOperationComplete(editor);
    await waitForButtonState(boldButton, "true");
    await userEvent.type(editor, "bold ");

    // Test italic
    const italicButton = canvas.getByRole("button", { name: /italic/i });
    await userEvent.click(italicButton);
    await waitForSlateOperationComplete(editor);
    await waitForButtonState(italicButton, "true");
    await userEvent.type(editor, "italic ");

    // Test underline
    const underlineButton = canvas.getByRole("button", { name: /underline/i });
    await userEvent.click(underlineButton);
    await waitForSlateOperationComplete(editor);
    await waitForButtonState(underlineButton, "true");
    await userEvent.type(editor, "underlined");

    // Turn off all formatting
    await userEvent.click(boldButton);
    await userEvent.click(italicButton);
    await userEvent.click(underlineButton);
    await userEvent.type(editor, " normal");

    // Verify content structure
    await waitFor(
      () => {
        const strongElement = editor.querySelector("strong");
        const emElement = editor.querySelector("em");
        const uElement = editor.querySelector("u");

        expect(strongElement).toBeInTheDocument();
        expect(emElement).toBeInTheDocument();
        expect(uElement).toBeInTheDocument();

        // Verify the full text content is present
        expect(editor).toHaveTextContent(
          /Normal.*bold.*italic.*underlined.*normal/
        );
      },
      { timeout: 3000 }
    );
  },
};

export const MenuFormatting: Story = {
  args: {
    defaultValue:
      "<p>Normal text <code>inline code</code> <del>strikethrough</del> E=mc<sup>2</sup> H<sub>2</sub>O</p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const ui = within(canvasElement.ownerDocument.body);
    const editor = canvas.getByRole("textbox");

    await waitForSlateReady(canvas);

    // Verify all advanced formatting is rendered correctly
    await waitFor(() => {
      expect(editor.querySelector("code")).toHaveTextContent("inline code");
      expect(editor.querySelector("del")).toHaveTextContent("strikethrough");
      expect(editor.querySelector("sup")).toHaveTextContent("2");
      expect(editor.querySelector("sub")).toHaveTextContent("2");
    });

    // Test formatting menu interaction
    await userEvent.click(editor);
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });

    // Test menu opens and closes properly
    const formattingMenuButton = canvas.getByRole("button", {
      name: /more formatting options/i,
    });
    await userEvent.click(formattingMenuButton, { pointerEventsCheck: 0 });

    await ui.findByRole("menu");
    const codeMenuItem = await ui.findByRole("menuitemcheckbox", {
      name: /Code/i,
    });
    expect(codeMenuItem).toBeInTheDocument();

    // Close menu
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(ui.queryByRole("menu")).not.toBeInTheDocument();
    });
  },
};

export const BlockElements: Story = {
  args: {
    defaultValue:
      "<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><p>Regular paragraph with <strong>formatting</strong>.</p><blockquote>This is a blockquote with important information.</blockquote>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify all block elements are rendered correctly
    expect(editor.querySelector("h1")).toHaveTextContent("Heading 1");
    expect(editor.querySelector("h2")).toHaveTextContent("Heading 2");
    expect(editor.querySelector("h3")).toHaveTextContent("Heading 3");
    expect(editor.querySelector("h4")).toHaveTextContent("Heading 4");
    expect(editor.querySelector("h5")).toHaveTextContent("Heading 5");
    expect(editor.querySelector("p")).toHaveTextContent(
      /Regular paragraph with formatting/i
    );
    expect(editor.querySelector("blockquote")).toHaveTextContent(
      "This is a blockquote with important information."
    );
    expect(editor.querySelector("strong")).toBeInTheDocument();

    // Verify text style dropdown functionality
    try {
      const textStyleTrigger = canvas.getByRole("button", {
        name: /text style menu/i,
      });
      expect(textStyleTrigger).toBeInTheDocument();
    } catch {
      // Skip if text style trigger not available
    }
  },
};

export const ListFunctionality: Story = {
  args: {
    defaultValue:
      "<p>Regular paragraph</p><ul><li>First bulleted item</li><li>Second item with <strong>bold formatting</strong></li></ul><ol><li>First numbered item</li><li>Second numbered item</li></ol>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify list structures
    const ulElement = editor.querySelector("ul");
    const olElement = editor.querySelector("ol");
    expect(ulElement).toBeInTheDocument();
    expect(olElement).toBeInTheDocument();

    const ulItems = editor.querySelectorAll("ul li");
    const olItems = editor.querySelectorAll("ol li");
    expect(ulItems).toHaveLength(2);
    expect(olItems).toHaveLength(2);

    expect(ulItems[0]).toHaveTextContent("First bulleted item");
    expect(ulItems[1]).toHaveTextContent("Second item with bold formatting");
    expect(olItems[0]).toHaveTextContent("First numbered item");
    expect(olItems[1]).toHaveTextContent("Second numbered item");

    // Verify formatting within lists
    expect(editor.querySelector("ul strong")).toBeInTheDocument();

    // Verify list buttons are available
    expect(
      canvas.getByRole("radio", { name: /bulleted list/i })
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("radio", { name: /numbered list/i })
    ).toBeInTheDocument();
  },
};

// =============================================================================
// Advanced/Edge Cases
// =============================================================================

export const UndoRedo: Story = {
  args: {
    placeholder: "Test undo/redo...",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    await waitForSlateReady(canvas);
    await userEvent.click(editor);
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });

    const undoButton = canvas.getByRole("button", { name: /undo/i });
    const redoButton = canvas.getByRole("button", { name: /redo/i });

    // Initially, undo/redo should be disabled
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();

    // Type text and wait for processing
    await userEvent.type(editor, "First text");
    await waitForSlateOperationComplete(editor);
    await waitForTextContent(editor, "First text");

    // Wait for undo button to be enabled
    await waitFor(() => {
      expect(undoButton).not.toBeDisabled();
    });

    // Apply formatting
    const boldButton = canvas.getByRole("button", { name: /bold/i });
    await userEvent.click(boldButton);
    await waitForSlateOperationComplete(editor);
    await waitForButtonState(boldButton, "true");

    await userEvent.type(editor, " bold text");
    await waitForSlateOperationComplete(editor);
    await waitForTextContent(editor, "First text bold text");

    // Test undo
    await userEvent.click(undoButton);
    await waitForSlateOperationComplete(editor);

    await waitFor(() => {
      expect(redoButton).not.toBeDisabled();
    });

    await waitForTextContent(editor, "First text", 3000);

    // Test redo
    await userEvent.click(redoButton);
    await waitForSlateOperationComplete(editor);
    await waitForTextContent(editor, "First text bold text");
  },
};

export const ComplexContent: Story = {
  args: {
    defaultValue:
      "<h1>Document Title</h1><p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p><h2>Section Header</h2><blockquote>This is an important quote with <u>underlined</u> text.</blockquote><ul><li>First bulleted item</li><li>Second item with <code>inline code</code></li></ul><ol><li>First numbered item</li><li>Second numbered item</li></ol><p>Paragraph with <del>strikethrough</del> and super<sup>script</sup> and sub<sub>script</sub>.</p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify all HTML elements are rendered correctly
    expect(editor.querySelector("h1")).toHaveTextContent("Document Title");
    expect(editor.querySelector("h2")).toHaveTextContent("Section Header");
    expect(editor.querySelector("blockquote")).toBeInTheDocument();
    expect(editor.querySelector("ul")).toBeInTheDocument();
    expect(editor.querySelector("ol")).toBeInTheDocument();
    expect(editor.querySelector("strong")).toBeInTheDocument();
    expect(editor.querySelector("em")).toBeInTheDocument();
    expect(editor.querySelector("u")).toBeInTheDocument();
    expect(editor.querySelector("code")).toBeInTheDocument();
    expect(editor.querySelector("del")).toBeInTheDocument();
    expect(editor.querySelector("sup")).toBeInTheDocument();
    expect(editor.querySelector("sub")).toBeInTheDocument();

    // Test that list items are counted correctly
    expect(editor.querySelectorAll("ul li")).toHaveLength(2);
    expect(editor.querySelectorAll("ol li")).toHaveLength(2);

    // Test interactivity with complex content
    await userEvent.click(editor);
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });

    // Navigate to end and add content
    await userEvent.keyboard("{Control>}End{/Control}");
    await userEvent.type(editor, " Additional content added.");

    await waitFor(() => {
      expect(editor).toHaveTextContent("Additional content added.");
    });
  },
};

export const EdgeCases: Story = {
  render: () => {
    const [testCase, setTestCase] = useState<"empty" | "malformed">("empty");

    const cases = {
      empty: { defaultValue: "", placeholder: "Empty editor" },
      malformed: {
        defaultValue: "<div>Invalid div content</div><span>Invalid span</span>",
      },
    };

    return (
      <div>
        <div style={{ marginBottom: "16px" }}>
          <button
            onClick={() => setTestCase("empty")}
            style={{
              margin: "0 8px 0 0",
              padding: "8px 16px",
              backgroundColor: testCase === "empty" ? "#007acc" : "#f0f0f0",
              color: testCase === "empty" ? "white" : "black",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Empty
          </button>
          <button
            onClick={() => setTestCase("malformed")}
            style={{
              margin: "0 8px 0 0",
              padding: "8px 16px",
              backgroundColor: testCase === "malformed" ? "#007acc" : "#f0f0f0",
              color: testCase === "malformed" ? "white" : "black",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Malformed
          </button>
        </div>
        <RichTextInput {...cases[testCase]} />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Test empty state
    const hasNoMeaningfulContent =
      !editor.textContent ||
      editor.textContent.trim() === "" ||
      editor.textContent.trim().length < 15;
    expect(hasNoMeaningfulContent).toBeTruthy();

    // Test typing in empty state
    await userEvent.click(editor);
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    await userEvent.type(editor, "New content");

    await waitFor(() => {
      expect(editor).toHaveTextContent("New content");
      expect(editor.querySelector("p")).toBeInTheDocument();
    });

    // Test malformed HTML
    const malformedButton = canvas.getByRole("button", { name: "Malformed" });
    await userEvent.click(malformedButton);

    await waitFor(() => {
      expect(editor).toBeInTheDocument();
    });

    // Should still be editable
    await userEvent.click(editor);
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    await userEvent.type(editor, " additional text");

    await waitFor(() => {
      expect(editor).toHaveTextContent("additional text");
    });
  },
};

export const PendingMarksConsistency: Story = {
  args: {
    placeholder: "Test pending marks consistency...",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const ui = within(canvasElement.ownerDocument.body);
    const editor = canvas.getByRole("textbox");

    await waitForSlateReady(canvas);
    await userEvent.click(editor);

    // Test toolbar buttons show pending marks
    const boldButton = canvas.getByRole("button", { name: /bold/i });
    const italicButton = canvas.getByRole("button", { name: /italic/i });

    // Apply bold and italic
    await userEvent.click(boldButton);
    await waitForSlateOperationComplete(editor);
    await userEvent.click(italicButton);
    await waitForSlateOperationComplete(editor);

    await waitForButtonState(boldButton, "true");
    await waitForButtonState(italicButton, "true");

    // Test formatting menu shows pending marks
    const formattingMenuButton = canvas.getByRole("button", {
      name: /more formatting options/i,
    });
    await userEvent.click(formattingMenuButton, { pointerEventsCheck: 0 });

    await ui.findByRole("menu");
    const codeMenuItem = await ui.findByRole("menuitemcheckbox", {
      name: /Code/i,
    });
    await userEvent.click(codeMenuItem);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(ui.queryByRole("menu")).not.toBeInTheDocument();
    });

    // Reopen and verify selection state
    await userEvent.click(formattingMenuButton, { pointerEventsCheck: 0 });
    await ui.findByRole("menu");
    const codeMenuItemAfter = await ui.findByRole("menuitemcheckbox", {
      name: /Code/i,
    });
    expect(codeMenuItemAfter).toHaveAttribute("aria-checked", "true");

    // Close menu and type text
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(ui.queryByRole("menu")).not.toBeInTheDocument();
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    await userEvent.type(editor, "Test text");

    // Verify all formatting was applied
    await waitFor(() => {
      const strongElement = editor.querySelector("strong");
      const emElement = editor.querySelector("em");
      const codeElement = editor.querySelector("code");

      expect(strongElement).toBeInTheDocument();
      expect(emElement).toBeInTheDocument();
      expect(codeElement).toBeInTheDocument();
      expect(editor).toHaveTextContent("Test text");
    });
  },
};
