import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichTextInput } from "./rich-text-input";
import { Box, Stack, Text, Button } from "@/components";

const meta: Meta<typeof RichTextInput> = {
  title: "Components/RichTextInput",
  component: RichTextInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ANATOMY SECTION
export const Anatomy: Story = {
  render: () => {
    return (
      <Box maxW="800px">
        <Text textStyle="lg" fontWeight="600" mb="400">
          Anatomy
        </Text>
        <RichTextInput
          defaultValue="<p>Lorem ipsum <strong>dolor sit amet</strong>, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>"
          placeholder="Start typing..."
        />
      </Box>
    );
  },
};

// COMPONENT SECTION - Multiple variations
export const Component: Story = {
  render: () => {
    const [value1, setValue1] = useState(
      "<p>Lorem ipsum <strong>dolor sit amet</strong>, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>"
    );
    const [value2, setValue2] = useState(
      "<p>Lorem ipsum <strong>dolor sit amet</strong>, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>"
    );
    const [value3, setValue3] = useState(
      "<p>Lorem ipsum <strong>dolor sit amet</strong>, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>"
    );
    const [value4, setValue4] = useState(
      "<p>Lorem ipsum <strong>dolor sit amet</strong>, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>"
    );

    return (
      <Box maxW="800px">
        <Text textStyle="lg" fontWeight="600" mb="400">
          Component
        </Text>
        <Stack direction="column" gap="600">
          <RichTextInput
            value={value1}
            onChange={setValue1}
            placeholder="Text style..."
          />
          <RichTextInput
            value={value2}
            onChange={setValue2}
            placeholder="Text style..."
          />
          <RichTextInput
            value={value3}
            onChange={setValue3}
            placeholder="Text style..."
          />
          <RichTextInput
            value={value4}
            onChange={setValue4}
            placeholder="Text style..."
          />
        </Stack>
      </Box>
    );
  },
};

// BUILDING BLOCKS SECTION
export const BuildingBlocks: Story = {
  render: () => {
    return (
      <Box maxW="800px">
        <Text textStyle="lg" fontWeight="600" mb="600">
          Building blocks
        </Text>

        <Stack direction="column" gap="800">
          {/* Richtext Toolbar */}
          <Box>
            <Text textStyle="md" fontWeight="600" mb="400">
              Richtext Toolbar
            </Text>
            <Box
              p="400"
              border="1px solid"
              borderColor="neutral.6"
              borderRadius="md"
            >
              <RichTextInput
                defaultValue="<p>Lorem ipsum <strong>dolor sit amet</strong>, consectetur adipiscing elit...</p>"
                placeholder="Text style..."
              />
            </Box>
          </Box>

          {/* Richtext Toolbar - Text style menu */}
          <Box>
            <Text textStyle="md" fontWeight="600" mb="400">
              Richtext Toolbar - Text style menu
            </Text>
            <Stack direction="row" gap="600">
              <Box>
                <Text textStyle="sm" color="neutral.11" mb="200">
                  Normal text
                </Text>
                <Text textStyle="md">Heading 1</Text>
                <Text textStyle="md">Heading 2</Text>
                <Text textStyle="md">Heading 3</Text>
                <Text textStyle="md">Heading 4</Text>
                <Text textStyle="md">Heading 5</Text>
                <Text textStyle="md">Quote</Text>
              </Box>
              <Box>
                <Text textStyle="sm" color="neutral.11" mb="200">
                  Normal text
                </Text>
                <Text as="h1" textStyle="2xl" fontWeight="700">
                  Heading 1
                </Text>
                <Text as="h2" textStyle="xl" fontWeight="600">
                  Heading 2
                </Text>
                <Text as="h3" textStyle="lg" fontWeight="500">
                  Heading 3
                </Text>
                <Text as="h4" textStyle="md" fontWeight="500">
                  Heading 4
                </Text>
                <Text as="h5" textStyle="sm" fontWeight="500">
                  Heading 5
                </Text>
                <Text
                  as="blockquote"
                  textStyle="md"
                  fontStyle="italic"
                  pl="400"
                  borderLeft="4px solid"
                  borderColor="neutral.6"
                >
                  Quote
                </Text>
              </Box>
            </Stack>
          </Box>

          {/* Richtext Toolbar - More styles menu */}
          <Box>
            <Text textStyle="md" fontWeight="600" mb="400">
              Richtext Toolbar - More styles menu
            </Text>
            <Stack direction="column" gap="200">
              <Text textStyle="md">
                <del>Strikethrough</del>
              </Text>
              <Text textStyle="md">
                Super<sup>script</sup>
              </Text>
              <Text textStyle="md">
                Sub<sub>script</sub>
              </Text>
            </Stack>
          </Box>

          {/* Richtext Toolbar - Buttons */}
          <Box>
            <Text textStyle="md" fontWeight="600" mb="400">
              Richtext Toolbar - Buttons
            </Text>
            <Stack direction="row" gap="200" flexWrap="wrap">
              <Button variant="outline">Bold</Button>
              <Button variant="outline">Italic</Button>
              <Button variant="outline">Underline</Button>
              <Button variant="outline">Strikethrough</Button>
              <Button variant="outline">Code</Button>
              <Button variant="outline">Superscript</Button>
              <Button variant="outline">Link</Button>
              <Button variant="outline">Quote</Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
  },
};

// HEIGHT SECTION
export const Height: Story = {
  render: () => {
    const [shortValue, setShortValue] = useState(
      "<p>This is some text that demonstrates a shorter rich text input.</p>"
    );

    const [longValue, setLongValue] = useState(
      `<h1>Lorem Ipsum</h1>
      <p>Lorem ipsum <strong>dolor</strong> sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <blockquote>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</blockquote>
      <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentibus voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>`
    );

    return (
      <Box maxW="800px">
        <Text textStyle="lg" fontWeight="600" mb="600">
          Height
        </Text>

        <Stack direction="column" gap="600">
          <Box>
            <Text textStyle="sm" color="neutral.11" mb="300">
              Shorter content with automatic height adjustment
            </Text>
            <RichTextInput
              value={shortValue}
              onChange={setShortValue}
              placeholder="This is some description..."
            />
          </Box>

          <Box>
            <Text textStyle="sm" color="neutral.11" mb="300">
              Longer content demonstrating scrolling behavior
            </Text>
            <RichTextInput
              value={longValue}
              onChange={setLongValue}
              placeholder="This is some description..."
            />
          </Box>
        </Stack>
      </Box>
    );
  },
};

// Additional stories for comprehensive testing
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
