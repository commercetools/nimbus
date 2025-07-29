import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { IconToggleButton } from "../icon-toggle-button";
import { ToggleButtonGroup } from "../toggle-button-group";
import { Icon } from "../icon";
import { Menu } from "../menu";
import { Box, Text } from "@/components";
import { Toolbar } from "./toolbar.tsx";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Home,
  Search,
  Settings,
  Person,
  Add,
  FolderOpen,
  Save,
  Print,
  Menu as MenuIcon,
  Minimize,
  Close,
  Undo,
  Redo,
  FormatListBulleted,
  FormatListNumbered,
  FormatIndentIncrease,
  FormatIndentDecrease,
  Link,
  Image,
  FormatStrikethrough,
  FormatClear,
  KeyboardArrowDown,
  Logout,
  Boy,
} from "@commercetools/nimbus-icons";
import { useState } from "react";

const meta: Meta<typeof Toolbar.Root> = {
  title: "Components / Toolbar",
  component: Toolbar.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: ["horizontal", "vertical"],
      description: "The orientation of the toolbar",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toolbar.Root>;

export const Default: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args: any) => (
    <Toolbar.Root {...args}>
      <Button size="xs" variant="ghost">
        Action 1
      </Button>
      <Button size="xs" variant="ghost">
        Action 2
      </Button>
      <Button size="xs" variant="ghost">
        Action 3
      </Button>
    </Toolbar.Root>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args: any) => (
    <Toolbar.Root {...args}>
      <IconButton size="xs" variant="ghost" aria-label="Home">
        <Icon as={Home} />
      </IconButton>
      <Toolbar.Separator />
      <IconButton size="xs" variant="ghost" aria-label="Search">
        <Icon as={Search} />
      </IconButton>
      <IconButton size="xs" variant="ghost" aria-label="Settings">
        <Icon as={Settings} />
      </IconButton>
      <IconButton size="xs" variant="ghost" aria-label="Profile">
        <Icon as={Person} />
      </IconButton>
      <Toolbar.Separator />
      <IconButton size="xs" variant="ghost" aria-label="Home">
        <Icon as={Logout} />
      </IconButton>
    </Toolbar.Root>
  ),
};

export const WithGroups: Story = {
  args: {},
  render: (args: any) => (
    <Box>
      {["horizontal", "vertical"].map((o) => (
        <Box key={o} mb="600">
          <Toolbar.Root orientation={o} {...args}>
            <Toolbar.Group>
              <IconButton size="xs" variant="ghost" aria-label="New">
                <Icon as={Add} />
              </IconButton>
              <IconButton size="xs" variant="ghost" aria-label="Open">
                <Icon as={FolderOpen} />
              </IconButton>
            </Toolbar.Group>
            <Toolbar.Separator orientation="horizontal" />
            <Toolbar.Group>
              <IconButton size="xs" variant="ghost" aria-label="Save">
                <Icon as={Save} />
              </IconButton>
              <IconButton size="xs" variant="ghost" aria-label="Print">
                <Icon as={Print} />
              </IconButton>
            </Toolbar.Group>
          </Toolbar.Root>
        </Box>
      ))}
    </Box>
  ),
};

export const RichTextEditor: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args: any) => {
    const [textStyle, setTextStyle] = useState("h1");
    const textStyles = [
      {
        id: "h1",
        label: "Heading 1",
        props: {
          textStyle: "2xl",
          fontWeight: "700",
        },
      },
      {
        id: "h2",
        label: "Heading 2",
        props: {
          textStyle: "xl",
          fontWeight: "600",
        },
      },
      {
        id: "h3",
        label: "Heading 3",
        props: {
          textStyle: "lg",
          fontWeight: "500",
        },
      },
      {
        id: "h4",
        label: "Heading 4",
        props: {
          textStyle: "md",
          fontWeight: "500",
        },
      },
      {
        id: "p",
        label: "Paragraph",
        props: {
          textStyle: "md",
          color: "neutral.11",
        },
      },
    ];

    const selectedTextStyle = textStyles.find((v) => v.id === textStyle) || {};
    const selectedTextStyleProps = selectedTextStyle.props || {};
    const selectedTextStyleLabel = selectedTextStyle.label || "";

    const sizes = ["xs", "md"] as const;

    return (
      <Box>
        {sizes.map((size) => (
          <Box mb="600" key={size}>
            <Text textStyle="xl" mb="300">
              {size}
            </Text>
            <Toolbar.Root size={size} {...args}>
              {/* Font Style & Size */}
              <Menu.Root onAction={(v) => setTextStyle(v)}>
                <Menu.Trigger
                  borderRadius="200"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="neutral.6"
                  width="160px"
                >
                  <Box display="flex" alignItems="center" gap="200" px="200">
                    <Box
                      display="flex"
                      alignItems="center"
                      gap="200"
                      flexGrow="1"
                    >
                      <Text my="auto" {...selectedTextStyleProps}>
                        {selectedTextStyleLabel}
                      </Text>
                    </Box>
                    <Icon>
                      <KeyboardArrowDown />
                    </Icon>
                  </Box>
                </Menu.Trigger>
                <Menu.Content>
                  {textStyles.map((v) => (
                    <Menu.Item key={v.id} id={v.id}>
                      <Text {...v.props}>{v.label}</Text>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Root>
              <Toolbar.Separator />

              {/* Text Formatting Toggles */}
              <Toolbar.Group>
                <IconToggleButton size={size} variant="ghost" aria-label="Bold">
                  <Icon as={FormatBold} />
                </IconToggleButton>
                <IconToggleButton
                  size={size}
                  variant="ghost"
                  aria-label="Italic"
                >
                  <Icon as={FormatItalic} />
                </IconToggleButton>
                <IconToggleButton
                  size={size}
                  variant="ghost"
                  aria-label="Underline"
                >
                  <Icon as={FormatUnderlined} />
                </IconToggleButton>
                <IconToggleButton
                  size={size}
                  variant="ghost"
                  aria-label="Strikethrough"
                >
                  <Icon as={FormatStrikethrough} />
                </IconToggleButton>
              </Toolbar.Group>
              <Toolbar.Separator />

              {/* Text Alignment Toggle Group */}
              <Toolbar.Group>
                <ToggleButtonGroup.Root
                  size={size}
                  selectionMode="single"
                  defaultSelectedKeys={["left"]}
                  aria-label="Text alignment"
                >
                  <IconToggleButton
                    id="left"
                    size={size}
                    variant="ghost"
                    aria-label="Align Left"
                  >
                    <Icon as={FormatAlignLeft} />
                  </IconToggleButton>
                  <IconToggleButton
                    id="center"
                    size={size}
                    variant="ghost"
                    aria-label="Align Center"
                  >
                    <Icon as={FormatAlignCenter} />
                  </IconToggleButton>
                  <IconToggleButton
                    id="right"
                    size={size}
                    variant="ghost"
                    aria-label="Align Right"
                  >
                    <Icon as={FormatAlignRight} />
                  </IconToggleButton>
                </ToggleButtonGroup.Root>
              </Toolbar.Group>
              <Toolbar.Separator />

              {/* Lists & Indentation */}
              <ToggleButtonGroup.Root
                selectionMode="single"
                defaultSelectedKeys={[]}
                size={size}
              >
                <IconToggleButton
                  id="bulleted-list"
                  size={size}
                  variant="ghost"
                  aria-label="Bulleted List"
                >
                  <Icon as={FormatListBulleted} />
                </IconToggleButton>
                <IconToggleButton
                  id="numbered-list"
                  size={size}
                  variant="ghost"
                  aria-label="Numbered List"
                >
                  <Icon as={FormatListNumbered} />
                </IconToggleButton>
              </ToggleButtonGroup.Root>
              <Toolbar.Separator />

              <Toolbar.Group>
                <IconButton
                  size="xs"
                  variant="ghost"
                  aria-label="Undo"
                  isDisabled
                >
                  <Icon as={Undo} />
                </IconButton>
                <IconButton size="xs" variant="ghost" aria-label="Redo">
                  <Icon as={Redo} />
                </IconButton>
              </Toolbar.Group>
            </Toolbar.Root>
          </Box>
        ))}
      </Box>
    );
  },
};
