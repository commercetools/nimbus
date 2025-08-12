import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RichTextInput } from "./rich-text-input";

const meta: Meta<typeof RichTextInput> = {
  title: "Components/Inputs/RichTextInput",
  component: RichTextInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Start typing...",
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue:
      '<p>This is some <strong>bold</strong> and <em>italic</em> text with a <a href="https://example.com">link</a>.</p>',
    placeholder: "Start typing...",
  },
};

export const Controlled = () => {
  const [value, setValue] = useState(
    "<p>This is controlled text. Try editing it!</p>"
  );

  return (
    <div style={{ width: "600px" }}>
      <RichTextInput
        value={value}
        onChange={setValue}
        placeholder="Start typing..."
      />
      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <strong>Current HTML value:</strong>
        <pre
          style={{ fontSize: "12px", marginTop: "8px", whiteSpace: "pre-wrap" }}
        >
          {value}
        </pre>
      </div>
    </div>
  );
};

export const ReadOnly: Story = {
  args: {
    defaultValue:
      "<h1>Read Only Content</h1><p>This rich text input is <strong>read-only</strong>. You can see the content but cannot edit it.</p><blockquote>This is a blockquote that demonstrates the read-only state.</blockquote>",
    isReadOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "<p>This rich text input is <strong>disabled</strong>.</p>",
    isDisabled: true,
    placeholder: "This input is disabled",
  },
};

export const WithError: Story = {
  args: {
    defaultValue: "<p>This input has an error state.</p>",
    hasError: true,
    placeholder: "Start typing...",
  },
};

export const WithWarning: Story = {
  args: {
    defaultValue: "<p>This input has a warning state.</p>",
    hasWarning: true,
    placeholder: "Start typing...",
  },
};

export const SmallSize: Story = {
  args: {
    defaultValue: "<p>This is a <strong>small</strong> rich text input.</p>",
    size: "sm",
    placeholder: "Small input...",
  },
};

export const LargeSize: Story = {
  args: {
    defaultValue:
      "<p>This is a <strong>large</strong> rich text input with more space.</p>",
    size: "lg",
    placeholder: "Large input...",
  },
};

export const FilledVariant: Story = {
  args: {
    defaultValue:
      "<p>This rich text input uses the <strong>filled</strong> variant.</p>",
    variant: "filled",
    placeholder: "Filled input...",
  },
};

export const FormattingShowcase = () => {
  const [value, setValue] = useState(
    `
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <p>This paragraph demonstrates various formatting options:</p>
    <p><strong>Bold text</strong>, <em>italic text</em>, <u>underlined text</u>, <del>strikethrough text</del>, and <code>inline code</code>.</p>
    <p>Advanced formatting: <sup>superscript</sup> and <sub>subscript</sub> text.</p>
    <blockquote>
      This is a blockquote. It's useful for highlighting important information or quotes.
    </blockquote>
    <p>Lists are also supported:</p>
    <ul>
      <li>Bulleted list item 1</li>
      <li>Bulleted list item 2</li>
    </ul>
    <ol>
      <li>Numbered list item 1</li>
      <li>Numbered list item 2</li>
    </ol>
    <p>And of course, <a href="https://example.com">links</a> work too!</p>
  `.trim()
  );

  return (
    <div style={{ width: "700px" }}>
      <RichTextInput
        value={value}
        onChange={setValue}
        placeholder="Try out all the formatting options..."
      />
    </div>
  );
};

export const KeyboardShortcuts = () => {
  return (
    <div style={{ width: "600px" }}>
      <RichTextInput placeholder="Try these keyboard shortcuts: Cmd/Ctrl+B (Bold), Cmd/Ctrl+I (Italic), Cmd/Ctrl+U (Underline), Cmd/Ctrl+` (Code), Shift+Enter (Line break)" />
      <div style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
        <strong>Keyboard Shortcuts:</strong>
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>
            <code>Cmd/Ctrl + B</code> - Bold
          </li>
          <li>
            <code>Cmd/Ctrl + I</code> - Italic
          </li>
          <li>
            <code>Cmd/Ctrl + U</code> - Underline
          </li>
          <li>
            <code>Cmd/Ctrl + `</code> - Code
          </li>
          <li>
            <code>Shift + Enter</code> - Soft line break
          </li>
        </ul>
      </div>
    </div>
  );
};
