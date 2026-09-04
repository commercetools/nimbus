import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  Box,
  Button,
  IconButton,
  IconToggleButton,
  Separator,
  Stack,
  Text,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from "@commercetools/nimbus";
import {
  Add,
  AttachFile,
  Computer,
  Contrast,
  CropFree,
  DarkMode,
  Draw,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatStrikethrough,
  FormatUnderlined,
  GridView,
  Highlight,
  Image,
  LightMode,
  Link,
  NearMe,
  PanTool,
  Redo,
  Settings,
  Star,
  Undo,
  ViewKanban,
  ViewList,
  ZoomIn,
  ZoomOut,
} from "@commercetools/nimbus-icons";

const meta: Meta<typeof ToggleButtonGroup.Root> = {
  title: "Playground/ToggleButtonGroup",
  component: ToggleButtonGroup.Root,
  tags: ["vrt"],
  parameters: {
    chromatic: { disableSnapshot: false },
    a11y: {
      config: {
        rules: [
          {
            id: "aria-allowed-attr",
            selector: '[role="group"][aria-orientation]',
            enabled: false,
          },
        ],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleButtonGroup.Root>;

const buttonVariants = ["solid", "subtle", "outline", "ghost", "link"] as const;
const toggleButtonVariants = ["outline", "ghost", "subtle"] as const;
const groupVariants = ["outline", "subtle"] as const;
const fillStyles = ["tint", "solid"] as const;

type GroupVariant = (typeof groupVariants)[number];
type FillStyle = (typeof fillStyles)[number];

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <Text fontWeight="700" fontSize="500">
    {children}
  </Text>
);

const SubHeading = ({ children }: { children: ReactNode }) => (
  <Text fontWeight="600" fontSize="400">
    {children}
  </Text>
);

const Caption = ({ children }: { children: ReactNode }) => (
  <Text color="neutral.11" fontSize="300">
    {children}
  </Text>
);

const GroupCell = ({
  variant,
  activeFillStyle,
  selectionMode,
  selectedKeys,
}: {
  variant: GroupVariant;
  activeFillStyle: FillStyle;
  selectionMode: "single" | "multiple";
  selectedKeys: string[];
}) => (
  <ToggleButtonGroup.Root
    variant={variant}
    activeFillStyle={activeFillStyle}
    selectionMode={selectionMode}
    colorPalette="primary"
    defaultSelectedKeys={selectedKeys}
    aria-label={`${variant} ${activeFillStyle} ${selectionMode}`}
  >
    <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
    <ToggleButtonGroup.Button id="center">Center</ToggleButtonGroup.Button>
    <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
  </ToggleButtonGroup.Root>
);

const GroupMatrix = ({
  selectionMode,
  selectedKeys,
}: {
  selectionMode: "single" | "multiple";
  selectedKeys: string[];
}) => (
  <Stack gap="400">
    <Stack direction="row" gap="600" alignItems="center">
      <Box width="90px" flexShrink="0" />
      {fillStyles.map((f) => (
        <Box key={f} width="240px" flexShrink="0">
          <Text fontWeight="600">{f}</Text>
        </Box>
      ))}
    </Stack>

    {groupVariants.map((v) => (
      <Stack key={v} direction="row" gap="600" alignItems="center">
        <Box width="90px" flexShrink="0">
          <Text fontWeight="600">{v}</Text>
        </Box>
        {fillStyles.map((f) => (
          <Box key={f} width="240px" flexShrink="0">
            <GroupCell
              variant={v}
              activeFillStyle={f}
              selectionMode={selectionMode}
              selectedKeys={selectedKeys}
            />
          </Box>
        ))}
      </Stack>
    ))}
  </Stack>
);

const RichTextEditorAssembly = () => (
  <Box
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    overflow="hidden"
    maxWidth="760px"
  >
    <Box borderBottomWidth="1px" borderColor="neutral.6" padding="200">
      <Toolbar aria-label="Text formatting">
        <IconButton size="xs" variant="ghost" aria-label="Undo">
          <Undo />
        </IconButton>
        <IconButton size="xs" variant="ghost" aria-label="Redo">
          <Redo />
        </IconButton>
        <Separator orientation="vertical" />
        <IconToggleButton
          size="xs"
          variant="ghost"
          colorPalette="primary"
          aria-label="Bold"
          defaultSelected
        >
          <FormatBold />
        </IconToggleButton>
        <IconToggleButton
          size="xs"
          variant="ghost"
          colorPalette="primary"
          aria-label="Italic"
        >
          <FormatItalic />
        </IconToggleButton>
        <IconToggleButton
          size="xs"
          variant="ghost"
          colorPalette="primary"
          aria-label="Underline"
        >
          <FormatUnderlined />
        </IconToggleButton>
        <IconToggleButton
          size="xs"
          variant="ghost"
          colorPalette="primary"
          aria-label="Strikethrough"
        >
          <FormatStrikethrough />
        </IconToggleButton>
        <Separator orientation="vertical" />
        <ToggleButtonGroup.Root
          size="xs"
          variant="subtle"
          colorPalette="primary"
          selectionMode="single"
          defaultSelectedKeys={["left"]}
          aria-label="Alignment"
        >
          <ToggleButtonGroup.Button id="left" aria-label="Align left">
            <FormatAlignLeft />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="center" aria-label="Align center">
            <FormatAlignCenter />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="right" aria-label="Align right">
            <FormatAlignRight />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="justify" aria-label="Justify">
            <FormatAlignJustify />
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
        <Separator orientation="vertical" />
        <ToggleButtonGroup.Root
          size="xs"
          variant="outline"
          colorPalette="primary"
          selectionMode="single"
          aria-label="Lists"
        >
          <ToggleButtonGroup.Button id="bulleted" aria-label="Bulleted list">
            <FormatListBulleted />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="numbered" aria-label="Numbered list">
            <FormatListNumbered />
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
        <Separator orientation="vertical" />
        <IconButton size="xs" variant="ghost" aria-label="Insert link">
          <Link />
        </IconButton>
        <IconButton size="xs" variant="ghost" aria-label="Insert image">
          <Image />
        </IconButton>
      </Toolbar>
    </Box>
    <Box padding="400" minHeight="120px" bg="neutral.1">
      <Text fontWeight="700" marginBottom="200">
        Release notes
      </Text>
      <Text color="neutral.11">
        Nimbus now ships a unified toggle model: a neutral resting chrome
        (outline · ghost · subtle) and a separate active fill (tint · solid).
        Select a few words and use the toolbar above to format them.
      </Text>
    </Box>
  </Box>
);

const PanelHeaderAssembly = () => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    gap="400"
    maxWidth="760px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="300"
  >
    <Stack direction="row" gap="200" alignItems="baseline">
      <Text fontWeight="700" fontSize="500">
        Products
      </Text>
      <Caption>248 items</Caption>
    </Stack>
    <Stack direction="row" gap="300" alignItems="center">
      <ToggleButtonGroup.Root
        size="xs"
        variant="outline"
        colorPalette="primary"
        selectionMode="single"
        defaultSelectedKeys={["grid"]}
        aria-label="View mode"
      >
        <ToggleButtonGroup.Button id="list" aria-label="List view">
          <ViewList />
        </ToggleButtonGroup.Button>
        <ToggleButtonGroup.Button id="grid" aria-label="Grid view">
          <GridView />
        </ToggleButtonGroup.Button>
        <ToggleButtonGroup.Button id="board" aria-label="Board view">
          <ViewKanban />
        </ToggleButtonGroup.Button>
      </ToggleButtonGroup.Root>
      <IconButton size="xs" variant="ghost" aria-label="Settings">
        <Settings />
      </IconButton>
      <Button size="xs" variant="solid" colorPalette="primary">
        <Add />
        Create
      </Button>
    </Stack>
  </Stack>
);

const FilterBarAssembly = () => (
  <Stack
    direction="row"
    gap="300"
    alignItems="center"
    flexWrap="wrap"
    maxWidth="760px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="300"
  >
    <ToggleButtonGroup.Root
      size="xs"
      variant="outline"
      colorPalette="primary"
      selectionMode="single"
      defaultSelectedKeys={["active"]}
      aria-label="Status filter"
    >
      <ToggleButtonGroup.Button id="all">All</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="active">Active</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="archived">
        Archived
      </ToggleButtonGroup.Button>
    </ToggleButtonGroup.Root>
    <ToggleButton size="xs" variant="subtle" colorPalette="primary">
      <Star />
      Favorites
    </ToggleButton>
    <ToggleButton size="xs" variant="subtle" colorPalette="primary">
      <AttachFile />
      Has files
    </ToggleButton>
    <Box flex="1" />
    <Button size="xs" variant="ghost">
      Clear
    </Button>
    <Button size="xs" variant="solid" colorPalette="primary">
      Apply
    </Button>
  </Stack>
);

const ToolPaletteAssembly = () => (
  <Toolbar orientation="vertical" variant="outline" aria-label="Canvas tools">
    <ToggleButtonGroup.Root
      selectionMode="single"
      defaultSelectedKeys={["draw"]}
      aria-label="Active tool"
    >
      <IconToggleButton
        id="select"
        variant="ghost"
        colorPalette="primary"
        aria-label="Select"
      >
        <NearMe />
      </IconToggleButton>
      <IconToggleButton
        id="pan"
        variant="ghost"
        colorPalette="primary"
        aria-label="Pan"
      >
        <PanTool />
      </IconToggleButton>
      <IconToggleButton
        id="draw"
        variant="ghost"
        colorPalette="primary"
        aria-label="Draw"
      >
        <Draw />
      </IconToggleButton>
      <IconToggleButton
        id="highlight"
        variant="ghost"
        colorPalette="primary"
        aria-label="Highlight"
      >
        <Highlight />
      </IconToggleButton>
    </ToggleButtonGroup.Root>
    <Separator />
    <IconButton variant="ghost" aria-label="Zoom in">
      <ZoomIn />
    </IconButton>
    <IconButton variant="ghost" aria-label="Zoom out">
      <ZoomOut />
    </IconButton>
    <IconButton variant="ghost" aria-label="Fit to screen">
      <CropFree />
    </IconButton>
  </Toolbar>
);

const RepeatDaysAssembly = () => (
  <Stack
    gap="200"
    maxWidth="760px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="300"
  >
    <Text fontWeight="600">Repeat on</Text>
    <ToggleButtonGroup.Root
      variant="outline"
      colorPalette="primary"
      selectionMode="multiple"
      defaultSelectedKeys={["mon", "tue", "wed", "thu", "fri"]}
      aria-label="Repeat on days"
    >
      <ToggleButtonGroup.Button id="mon">Mon</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="tue">Tue</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="wed">Wed</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="thu">Thu</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="fri">Fri</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="sat">Sat</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="sun">Sun</ToggleButtonGroup.Button>
    </ToggleButtonGroup.Root>
  </Stack>
);

const BillingPeriodAssembly = () => (
  <Stack
    direction="row"
    gap="400"
    alignItems="center"
    maxWidth="760px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="400"
  >
    <ToggleButtonGroup.Root
      variant="outline"
      colorPalette="primary"
      selectionMode="single"
      defaultSelectedKeys={["annual"]}
      aria-label="Billing period"
    >
      <ToggleButtonGroup.Button id="monthly">Monthly</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button id="annual">
        Annual · save 20%
      </ToggleButtonGroup.Button>
    </ToggleButtonGroup.Root>
    <Stack gap="0">
      <Text fontWeight="700" fontSize="600">
        $24 / mo
      </Text>
      <Caption>billed annually</Caption>
    </Stack>
  </Stack>
);

const SettingsAssembly = () => (
  <Stack
    gap="400"
    maxWidth="760px"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="300"
    padding="400"
  >
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap="400"
    >
      <Stack gap="0">
        <Text fontWeight="600">Appearance</Text>
        <Caption>Choose how Nimbus looks to you.</Caption>
      </Stack>
      <ToggleButtonGroup.Root
        variant="outline"
        colorPalette="primary"
        selectionMode="single"
        defaultSelectedKeys={["system"]}
        aria-label="Theme"
      >
        <ToggleButtonGroup.Button id="light">
          <LightMode />
          Light
        </ToggleButtonGroup.Button>
        <ToggleButtonGroup.Button id="dark">
          <DarkMode />
          Dark
        </ToggleButtonGroup.Button>
        <ToggleButtonGroup.Button id="system">
          <Computer />
          System
        </ToggleButtonGroup.Button>
      </ToggleButtonGroup.Root>
    </Stack>
    <Separator />
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap="400"
    >
      <Stack gap="0">
        <Text fontWeight="600">High contrast</Text>
        <Caption>Increase contrast for better legibility.</Caption>
      </Stack>
      <ToggleButton variant="subtle" colorPalette="primary" defaultSelected>
        <Contrast />
        Enabled
      </ToggleButton>
    </Stack>
  </Stack>
);

export const VariantExploration: Story = {
  render: () => (
    <Stack gap="1200" padding="600">
      <Stack gap="300">
        <SectionHeading>1 · Button — variants (reference)</SectionHeading>
        <Stack direction="row" gap="400" alignItems="center" flexWrap="wrap">
          {buttonVariants.map((v) => (
            <Button key={v} variant={v} colorPalette="primary">
              {v}
            </Button>
          ))}
        </Stack>
      </Stack>

      <Stack gap="400">
        <SectionHeading>
          2 · ToggleButton — variant × activeFillStyle (resting vs selected)
        </SectionHeading>

        <Stack direction="row" gap="600" alignItems="center">
          <Box width="90px" flexShrink="0" />
          <Box width="120px" flexShrink="0">
            <Text fontWeight="600">off</Text>
          </Box>
          <Box width="120px" flexShrink="0">
            <Text fontWeight="600">tint · on</Text>
          </Box>
          <Box width="120px" flexShrink="0">
            <Text fontWeight="600">solid · on</Text>
          </Box>
        </Stack>

        {toggleButtonVariants.map((v) => (
          <Stack key={v} direction="row" gap="600" alignItems="center">
            <Box width="90px" flexShrink="0">
              <Text fontWeight="600">{v}</Text>
            </Box>
            <Box width="120px" flexShrink="0">
              <ToggleButton variant={v}>{v}</ToggleButton>
            </Box>
            <Box width="120px" flexShrink="0">
              <ToggleButton variant={v} activeFillStyle="tint" defaultSelected>
                {v}
              </ToggleButton>
            </Box>
            <Box width="120px" flexShrink="0">
              <ToggleButton variant={v} activeFillStyle="solid" defaultSelected>
                {v}
              </ToggleButton>
            </Box>
          </Stack>
        ))}
      </Stack>

      <Stack gap="800">
        <SectionHeading>
          3 · ToggleButtonGroup — variant × activeFillStyle
        </SectionHeading>

        <Stack gap="400">
          <SubHeading>Single-select — Center = ON</SubHeading>
          <GroupMatrix selectionMode="single" selectedKeys={["center"]} />
        </Stack>

        <Stack gap="400">
          <SubHeading>Multi-select — Left + Center = ON</SubHeading>
          <GroupMatrix
            selectionMode="multiple"
            selectedKeys={["left", "center"]}
          />
        </Stack>
      </Stack>

      <Stack gap="800">
        <SectionHeading>
          4 · In use — Button + ToggleButton + ToggleButtonGroup
        </SectionHeading>

        <Stack gap="300">
          <SubHeading>Rich-text editor</SubHeading>
          <Caption>
            ghost standalone toggles (inline formats) · subtle single-select
            groups (alignment, lists) · plain icon buttons (history, insert)
          </Caption>
          <RichTextEditorAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Panel header</SubHeading>
          <Caption>
            outline single-select group (view switcher) · ghost icon action ·
            solid primary Button
          </Caption>
          <PanelHeaderAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Filter bar</SubHeading>
          <Caption>
            outline single-select group (status) · subtle standalone toggles ·
            ghost + solid Buttons
          </Caption>
          <FilterBarAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Canvas tool palette (vertical toolbar)</SubHeading>
          <Caption>
            vertical outline Toolbar · single-select manager around bare
            IconToggleButtons (tools) · plain icon buttons (zoom)
          </Caption>
          <ToolPaletteAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Repeat-days picker (multi-select)</SubHeading>
          <Caption>
            multi-select segmented group at md · derives the tint fill ·
            adjacent selection shows the border join
          </Caption>
          <RepeatDaysAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Billing period</SubHeading>
          <Caption>
            prominent single-select segmented group at md · derives the solid
            fill · paired with plain text
          </Caption>
          <BillingPeriodAssembly />
        </Stack>

        <Stack gap="300">
          <SubHeading>Settings panel</SubHeading>
          <Caption>
            single-select theme switcher (icon + text, solid) · standalone
            subtle toggle · both at md
          </Caption>
          <SettingsAssembly />
        </Stack>
      </Stack>
    </Stack>
  ),
};
