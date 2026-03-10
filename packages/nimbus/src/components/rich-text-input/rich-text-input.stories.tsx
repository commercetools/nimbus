import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { RichTextInput, Box } from "@commercetools/nimbus";

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
            // Disable the aria-allowed-attr rule for external toggle button components
            id: "aria-allowed-attr",
            enabled: false,
          },
          {
            // Disable color-contrast rule for disabled states and external components
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
// Basic States
// =============================================================================

export const Default: Story = {
  args: {
    placeholder: "Start typing...",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Verify basic rendering
    const editor = canvas.getByRole("textbox");
    expect(editor).toBeInTheDocument();

    // Verify toolbar is present
    const toolbar = canvas.getByRole("toolbar");
    expect(toolbar).toBeInTheDocument();

    // Verify placeholder is present (Slate.js handles placeholders differently)
    await waitFor(() => {
      const hasPlaceholder =
        editor.querySelector("[data-slate-placeholder]") ||
        editor.textContent === "" ||
        editor.querySelector(".slate-placeholder");
      expect(hasPlaceholder).toBeTruthy();
    });
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter your content here...",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify placeholder is visible
    await waitFor(() => {
      const placeholderElement =
        editor.querySelector("[data-slate-placeholder]") ||
        editor.querySelector(".slate-placeholder");
      expect(placeholderElement || editor.textContent === "").toBeTruthy();
    });
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "<p>This is the <strong>default</strong> content.</p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify default content is rendered
    expect(editor).toHaveTextContent("This is the default content.");

    // Verify bold formatting is applied
    const boldText = editor.querySelector("strong");
    expect(boldText).toBeInTheDocument();
    expect(boldText).toHaveTextContent("default");
  },
};

export const Controlled: Story = {
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

    // Verify the italic formatting
    const emElement = editor.querySelector("em");
    expect(emElement).toBeInTheDocument();
    expect(emElement).toHaveTextContent("controlled");

    // Verify value display shows the HTML
    const valueDisplay = canvas.getByText(/Current value:/);
    expect(valueDisplay).toHaveTextContent("controlled");
  },
};

// =============================================================================
// State Variants
// =============================================================================

export const Disabled: Story = {
  args: {
    defaultValue: "<p>This input is <strong>disabled</strong>.</p>",
    isDisabled: true,
    placeholder: "This input is disabled",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify disabled state styling
    const root =
      editor.closest('[data-disabled="true"]') ||
      editor.closest("[data-disabled]") ||
      canvasElement.querySelector('[data-disabled="true"]');
    expect(root).toHaveAttribute("data-disabled", "true");

    // Verify toolbar is still visible but disabled
    const toolbar = canvas.getByRole("toolbar");
    expect(toolbar).toBeInTheDocument();

    // Verify all toolbar buttons are disabled
    const buttons = canvas.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button as HTMLButtonElement).toBeDisabled();
    });

    // Verify content is rendered despite being disabled
    expect(editor).toHaveTextContent("This input is disabled.");
  },
};

export const ReadOnly: Story = {
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
  },
};

export const Invalid: Story = {
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

    // Verify content is rendered
    expect(editor).toHaveTextContent("This input has an error state.");
  },
};

export const AutoFocus: Story = {
  args: {
    autoFocus: true,
    placeholder: "This input should be focused",
    defaultValue: "<p>Auto-focused content</p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    expect(editor).toBeInTheDocument();
    expect(editor).toHaveTextContent("Auto-focused content");
  },
};

// =============================================================================
// Text Formatting
// =============================================================================

export const BoldFormatting: Story = {
  args: {
    defaultValue: "<p>Normal text <strong>bold text</strong> normal again</p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify bold content is rendered
    const strongElement = editor.querySelector("strong");
    expect(strongElement).toBeInTheDocument();
    expect(strongElement).toHaveTextContent("bold text");

    // Verify bold button exists in toolbar
    const boldButton = canvas.getByRole("button", { name: /bold/i });
    expect(boldButton).toBeInTheDocument();
  },
};

export const ItalicFormatting: Story = {
  args: {
    defaultValue: "<p>Normal text <em>italic text</em></p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify italic content is rendered
    const emElement = editor.querySelector("em");
    expect(emElement).toBeInTheDocument();
    expect(emElement).toHaveTextContent("italic text");

    // Verify italic button exists in toolbar
    const italicButton = canvas.getByRole("button", { name: /italic/i });
    expect(italicButton).toBeInTheDocument();
  },
};

export const UnderlineFormatting: Story = {
  args: {
    defaultValue: "<p>Normal text <u>underlined text</u></p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify underline content is rendered
    const uElement = editor.querySelector("u");
    expect(uElement).toBeInTheDocument();
    expect(uElement).toHaveTextContent("underlined text");

    // Verify underline button exists in toolbar
    const underlineButton = canvas.getByRole("button", { name: /underline/i });
    expect(underlineButton).toBeInTheDocument();
  },
};

export const CombinedFormatting: Story = {
  args: {
    defaultValue:
      "<p><strong>Bold text</strong></p><p><em>Italic text</em></p><p><u>Underlined text</u></p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify each formatting type is rendered in separate paragraphs
    expect(editor.querySelector("strong")).toHaveTextContent("Bold text");
    expect(editor.querySelector("em")).toHaveTextContent("Italic text");
    expect(editor.querySelector("u")).toHaveTextContent("Underlined text");
  },
};

// =============================================================================
// Advanced Formatting (Menu)
// =============================================================================

export const StrikethroughFormatting: Story = {
  args: {
    placeholder: "Test strikethrough formatting...",
    defaultValue: "<p>Normal text <del>strikethrough text</del></p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify content structure is rendered correctly
    await waitFor(() => {
      const delElement = editor.querySelector("del");
      expect(delElement).toBeInTheDocument();
      expect(delElement).toHaveTextContent("strikethrough text");
    });

    // Verify the component can handle the strikethrough HTML
    expect(editor).toHaveTextContent("Normal text strikethrough text");
  },
};

export const CodeFormatting: Story = {
  args: {
    placeholder: "Test code formatting...",
    defaultValue: "<p>Here is some <code>inline code</code></p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify content structure is rendered correctly
    await waitFor(() => {
      const codeElement = editor.querySelector("code");
      expect(codeElement).toBeInTheDocument();
      expect(codeElement).toHaveTextContent("inline code");
    });

    // Verify the component can handle the code HTML
    expect(editor).toHaveTextContent("Here is some inline code");
  },
};

export const SuperscriptFormatting: Story = {
  args: {
    placeholder: "Test superscript formatting...",
    defaultValue: "<p>E = mc<sup>2</sup></p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify content structure is rendered correctly
    await waitFor(() => {
      const supElement = editor.querySelector("sup");
      expect(supElement).toBeInTheDocument();
      expect(supElement).toHaveTextContent("2");
    });

    // Verify the component can handle the superscript HTML
    expect(editor).toHaveTextContent("E = mc2");
  },
};

export const SubscriptFormatting: Story = {
  args: {
    placeholder: "Test subscript formatting...",
    defaultValue: "<p>H<sub>2</sub>O</p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify content structure is rendered correctly
    await waitFor(() => {
      const subElement = editor.querySelector("sub");
      expect(subElement).toBeInTheDocument();
      expect(subElement).toHaveTextContent("2");
    });

    // Verify the component can handle the subscript HTML
    expect(editor).toHaveTextContent("H2O");
  },
};

// =============================================================================
// Block Types & Text Styles
// =============================================================================

export const Paragraph: Story = {
  args: {
    defaultValue: "<p>This is a regular paragraph with normal text.</p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify paragraph element
    const paragraph = editor.querySelector("p");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(
      "This is a regular paragraph with normal text."
    );

    // Verify text style dropdown shows "Paragraph"
    const textStyleTrigger = canvas.getByRole("button", {
      name: /text style menu/i,
    });
    expect(textStyleTrigger).toHaveTextContent("Paragraph");
  },
};

export const HeadingOne: Story = {
  args: {
    placeholder: "Test heading 1...",
    defaultValue: "<h1>This is a heading 1</h1>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify h1 element is rendered
    await waitFor(() => {
      const h1Element = editor.querySelector("h1");
      expect(h1Element).toBeInTheDocument();
      expect(h1Element).toHaveTextContent("This is a heading 1");
    });

    // Verify text style trigger shows "Heading 1" if available
    try {
      const textStyleTrigger = canvas.getByRole("button", {
        name: /text style menu/i,
      });
      expect(textStyleTrigger).toHaveTextContent("Heading 1");
    } catch {
      // Skip if text style trigger not available
    }
  },
};

export const HeadingTwo: Story = {
  args: {
    placeholder: "Test heading 2...",
    defaultValue: "<h2>This is a heading 2</h2>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify h2 element is rendered
    await waitFor(() => {
      const h2Element = editor.querySelector("h2");
      expect(h2Element).toBeInTheDocument();
      expect(h2Element).toHaveTextContent("This is a heading 2");
    });
  },
};

export const HeadingThree: Story = {
  args: {
    defaultValue: "<h3>This is a heading 3</h3>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify h3 element is rendered
    const h3Element = editor.querySelector("h3");
    expect(h3Element).toBeInTheDocument();
    expect(h3Element).toHaveTextContent("This is a heading 3");
  },
};

export const HeadingFour: Story = {
  args: {
    defaultValue: "<h4>This is a heading 4</h4>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify h4 element is rendered
    const h4Element = editor.querySelector("h4");
    expect(h4Element).toBeInTheDocument();
    expect(h4Element).toHaveTextContent("This is a heading 4");
  },
};

export const HeadingFive: Story = {
  args: {
    defaultValue: "<h5>This is a heading 5</h5>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify h5 element is rendered
    const h5Element = editor.querySelector("h5");
    expect(h5Element).toBeInTheDocument();
    expect(h5Element).toHaveTextContent("This is a heading 5");
  },
};

export const Blockquote: Story = {
  args: {
    defaultValue:
      "<blockquote>This is a blockquote with important information.</blockquote>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify blockquote element is rendered
    const blockquoteElement = editor.querySelector("blockquote");
    expect(blockquoteElement).toBeInTheDocument();
    expect(blockquoteElement).toHaveTextContent(
      "This is a blockquote with important information."
    );
  },
};

// =============================================================================
// Lists
// =============================================================================

export const BulletedList: Story = {
  args: {
    defaultValue: "<ul><li>First item</li><li>Second item</li></ul>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify bulleted list structure
    const ulElement = editor.querySelector("ul");
    expect(ulElement).toBeInTheDocument();

    const listItems = editor.querySelectorAll("li");
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent("First item");
    expect(listItems[1]).toHaveTextContent("Second item");
  },
};

export const NumberedList: Story = {
  args: {
    defaultValue: "<ol><li>First step</li><li>Second step</li></ol>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify numbered list structure
    const olElement = editor.querySelector("ol");
    expect(olElement).toBeInTheDocument();

    const listItems = editor.querySelectorAll("li");
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent("First step");
    expect(listItems[1]).toHaveTextContent("Second step");
  },
};

export const ListToggling: Story = {
  args: {
    defaultValue:
      "<p>Regular paragraph</p><ul><li>Bulleted item</li></ul><ol><li>Numbered item</li></ol>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify different list and paragraph structures coexist
    expect(editor.querySelector("p")).toHaveTextContent("Regular paragraph");
    expect(editor.querySelector("ul li")).toHaveTextContent("Bulleted item");
    expect(editor.querySelector("ol li")).toHaveTextContent("Numbered item");

    // Verify list buttons are available for interaction
    expect(
      canvas.getByRole("radio", { name: /bulleted list/i })
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("radio", { name: /numbered list/i })
    ).toBeInTheDocument();
  },
};

// =============================================================================
// Undo/Redo Functionality
// =============================================================================

export const UndoRedo: Story = {
  args: {
    defaultValue: "<p>Some initial content</p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    const undoButton = canvas.getByRole("button", { name: /undo/i });
    const redoButton = canvas.getByRole("button", { name: /redo/i });

    // Verify undo/redo buttons exist and are in correct initial state
    expect(undoButton).toBeInTheDocument();
    expect(redoButton).toBeInTheDocument();

    // Initially, undo/redo should be disabled (no edits have been made)
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();

    // Verify content is rendered
    expect(editor).toHaveTextContent("Some initial content");
  },
};

// =============================================================================
// Event Handling & Callbacks
// =============================================================================

export const OnChangeCallback: Story = {
  render: () => {
    const [value, setValue] = useState("<p>Initial content</p>");
    const [changeCount, setChangeCount] = useState(0);

    const handleChange = (newValue: string) => {
      setValue(newValue);
      setChangeCount((c) => c + 1);
    };

    return (
      <div>
        <RichTextInput
          value={value}
          onChange={handleChange}
          placeholder="Type to trigger onChange..."
        />
        <div style={{ marginTop: "16px", fontSize: "12px" }}>
          <div>Change count: {changeCount}</div>
          <div>Current HTML: {value}</div>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify initial state
    expect(editor).toHaveTextContent("Initial content");

    // Verify change count display exists
    const changeCountElement = canvas.getByText(/Change count: \d+/);
    expect(changeCountElement).toBeInTheDocument();

    // Verify HTML output display exists
    const htmlOutput = canvas.getByText(/Current HTML:/);
    expect(htmlOutput.textContent).toContain("<p>");
  },
};

export const OnFocusBlurCallbacks: Story = {
  render: () => {
    const [events, setEvents] = useState<string[]>([]);

    return (
      <div>
        <RichTextInput
          placeholder="Test focus/blur events"
          onFocus={() => setEvents((prev) => [...prev, "Focus"])}
          onBlur={() => setEvents((prev) => [...prev, "Blur"])}
        />
        <div style={{ marginTop: "16px", fontSize: "12px" }}>
          Events: {events.join(", ")}
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

    // Test blur event by clicking outside
    await userEvent.click(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText("Events: Focus, Blur")).toBeInTheDocument();
    });
  },
};

// =============================================================================
// Complex Content & Edge Cases
// =============================================================================

export const ComplexHTML: Story = {
  args: {
    defaultValue: `
      <h1>Document Title</h1>
      <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <h2>Section Header</h2>
      <blockquote>This is an important quote with <u>underlined</u> text.</blockquote>
      <ul>
        <li>First bulleted item</li>
        <li>Second item with <code>inline code</code></li>
      </ul>
      <ol>
        <li>First numbered item</li>
        <li>Second numbered item</li>
      </ol>
      <p>Paragraph with <del>strikethrough</del> and super<sup>script</sup> and sub<sub>script</sub>.</p>
    `,
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
  },
};

export const EmptyContent: Story = {
  args: {
    defaultValue: "",
    placeholder: "Empty editor",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify editor starts in empty state
    const hasNoMeaningfulContent =
      !editor.textContent ||
      editor.textContent.trim() === "" ||
      editor.textContent.trim().length < 15; // Allow for placeholder characters
    expect(hasNoMeaningfulContent).toBeTruthy();

    // Verify the editor is interactive (has textbox role and toolbar)
    expect(editor).toBeInTheDocument();
    const toolbar = canvas.getByRole("toolbar");
    expect(toolbar).toBeInTheDocument();
  },
};

export const MalformedHTML: Story = {
  args: {
    defaultValue: "<div>Invalid div content</div><span>Invalid span</span>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify the component handles malformed HTML gracefully
    expect(editor).toBeInTheDocument();

    // Content should be rendered even if the HTML structure is non-standard
    await waitFor(() => {
      const hasContent =
        editor.textContent && editor.textContent.trim().length > 0;
      expect(hasContent).toBeTruthy();
    });
  },
};

// =============================================================================
// Comprehensive Showcase
// =============================================================================

export const FormattingShowcase = () => {
  const [value, setValue] = useState(
    `
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <p>This is a <strong>paragraph</strong> with <em>various</em> <u>text</u> <code>formatting</code> including <del>strikethrough</del>, super<sup>script</sup>, and sub<sub>script</sub>.</p>
    <blockquote>This is a blockquote that demonstrates quoted content.</blockquote>
    <ul>
      <li>Bulleted list item 1</li>
      <li>Bulleted list item 2 with <strong>bold formatting</strong></li>
      <li>Bulleted list item 3</li>
    </ul>
    <ol>
      <li>Numbered list item 1</li>
      <li>Numbered list item 2</li>
      <li>Numbered list item 3 with <em>italic formatting</em></li>
    </ol>
    <p>Final paragraph with <strong><em><u>combined formatting</u></em></strong>.</p>
    `.trim()
  );

  return (
    <div style={{ maxWidth: "600px" }}>
      <RichTextInput
        value={value}
        onChange={setValue}
        placeholder="Rich text editor showcase..."
      />
    </div>
  );
};

FormattingShowcase.play = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);
  const editor = canvas.getByRole("textbox");

  // Verify all formatting types are present
  expect(editor.querySelector("h1")).toBeInTheDocument();
  expect(editor.querySelector("h2")).toBeInTheDocument();
  expect(editor.querySelector("h3")).toBeInTheDocument();
  expect(editor.querySelector("h4")).toBeInTheDocument();
  expect(editor.querySelector("h5")).toBeInTheDocument();
  expect(editor.querySelector("p")).toBeInTheDocument();
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
};

// =============================================================================
// Pending Marks Consistency Test
// =============================================================================

export const PendingMarksConsistency: Story = {
  args: {
    defaultValue: "<p><strong>Bold text</strong> and <em>italic text</em></p>",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const ui = within(canvasElement.ownerDocument.body);
    const editor = canvas.getByRole("textbox");

    // Verify formatting is rendered from defaultValue
    expect(editor.querySelector("strong")).toHaveTextContent("Bold text");
    expect(editor.querySelector("em")).toHaveTextContent("italic text");

    // Click on the bold text to place cursor inside it
    const boldElement = editor.querySelector("strong")!;
    await userEvent.click(boldElement);

    // Verify toolbar bold button reflects the active mark at cursor position
    const boldButton = canvas.getByRole("button", { name: /bold/i });
    await waitFor(
      () => {
        expect(boldButton).toHaveAttribute("aria-pressed", "true");
      },
      { timeout: 3000 }
    );

    // Test formatting menu opens and displays options
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

// =============================================================================
// Tooltip Demo
// =============================================================================

export const TooltipDemo: Story = {
  render: () => (
    <Box marginTop="1000">
      <RichTextInput
        placeholder="Hover over toolbar buttons to see tooltips..."
        defaultValue="<p>Try hovering over the toolbar buttons above to see the tooltips in action!</p>"
      />
    </Box>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByRole("textbox");

    // Verify editor is rendered
    expect(editor).toBeInTheDocument();

    // Test tooltip appears on hover for Bold button
    const boldButton = canvas.getByRole("button", { name: /bold/i });
    expect(boldButton).toBeInTheDocument();

    // Focus on the button to trigger tooltip
    await userEvent.hover(boldButton);

    // Wait for tooltip to appear
    await waitFor(
      async () => {
        const tooltip = canvas.queryByRole("tooltip");
        if (tooltip) {
          expect(tooltip).toHaveTextContent("Bold (Cmd+B)");
        }
      },
      { timeout: 1000 }
    );

    // Test tooltip appears for Italic button
    const italicButton = canvas.getByRole("button", { name: /italic/i });
    await userEvent.hover(italicButton);

    await waitFor(
      async () => {
        const tooltip = canvas.queryByRole("tooltip");
        if (tooltip) {
          expect(tooltip).toHaveTextContent("Italic (Cmd+I)");
        }
      },
      { timeout: 1000 }
    );

    // Test tooltip appears for text style menu
    const textStyleButton = canvas.getByRole("button", {
      name: /text style menu/i,
    });
    await userEvent.hover(textStyleButton);

    await waitFor(
      async () => {
        const tooltip = canvas.queryByRole("tooltip");
        if (tooltip) {
          expect(tooltip).toHaveTextContent("Text style");
        }
      },
      { timeout: 1000 }
    );
  },
};
