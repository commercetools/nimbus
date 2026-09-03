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
  Image,
  Link,
  Redo,
  Settings,
  Star,
  Undo,
  ViewKanban,
  ViewList,
} from "@commercetools/nimbus-icons";

/**
 * ToggleButtonGroup — Playground.
 *
 * A permanent gallery of realistic, in-context usages of Button, ToggleButton,
 * and ToggleButtonGroup working together. It serves two ends:
 *
 *   1. Show how these components are actually put to use — read top to bottom:
 *      Button (the variant vocabulary) → ToggleButton (resting chrome × active
 *      fill) → ToggleButtonGroup → the three composed into real assemblies
 *      (rich-text editor, panel header, filter bar).
 *   2. Act as an integration proving-ground for Chromatic: it is snapshotted, so
 *      a change to any underlying component (or the Toolbar) that has an
 *      unintended visual side-effect here surfaces as a snapshot diff.
 *
 * Style axes exercised on the toggles:
 *   - `variant`         → resting chrome, always neutral. Standalone
 *     ToggleButton: outline | ghost | subtle. The group omits `ghost`
 *     (outline | subtle) — it needs a resting affordance to bind the set.
 *   - `activeFillStyle` → active-state fill: tint (light wash) | solid (full).
 *     In a group it defaults from `selectionMode` (single → solid, multiple →
 *     tint) and is overridable.
 *
 * `colorPalette` applies to the ACTIVE state only; resting is always neutral.
 */
const meta: Meta<typeof ToggleButtonGroup.Root> = {
  title: "Playground/ToggleButtonGroup",
  component: ToggleButtonGroup.Root,
  // Snapshotted on purpose: this playground is an integration proving-ground for
  // Chromatic — it catches unintended visual side-effects across the components
  // it composes (Button, ToggleButton, ToggleButtonGroup, Toolbar).
  tags: ["vrt"],
  parameters: {
    chromatic: { disableSnapshot: false },
    a11y: {
      config: {
        // React Aria demotes a ToggleButtonGroup nested in a Toolbar from
        // role="toolbar" to role="group" but leaves aria-orientation on it,
        // which axe flags (aria-orientation isn't allowed on a plain group).
        // Known RA limitation — same suppression the Toolbar's RichTextEditor
        // story uses.
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
// Standalone ToggleButton keeps `ghost`; the group omits it (a group needs a
// resting affordance to bind the set), so the group matrix iterates the
// narrower set.
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

// variant × activeFillStyle grid for one selection mode. Both matrices set
// activeFillStyle explicitly, so the columns show the full cross product
// regardless of the selectionMode-derived default (which the "defaults" block
// below illustrates).
const GroupMatrix = ({
  selectionMode,
  selectedKeys,
}: {
  selectionMode: "single" | "multiple";
  selectedKeys: string[];
}) => (
  <Stack gap="400">
    {/* column headers */}
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

// ============================================================================
// In-use assemblies — Button + ToggleButton + ToggleButtonGroup together.
// ============================================================================

/**
 * Rich-text editor. Independent inline formats (Bold/Italic/…) are standalone
 * `ghost` IconToggleButtons — each toggles on its own, and `ghost` is the right
 * bare-toolbar chrome. Mutually-exclusive clusters (alignment, lists) are
 * single-select ToggleButtonGroups (`subtle`, since a group needs a resting
 * affordance). History and insert actions are plain IconButtons. Everything
 * lives in a `Toolbar`, which gives roving arrow-key focus across the row.
 */
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

/**
 * A panel header: a single-select `outline` ToggleButtonGroup as the view-mode
 * switcher, a ghost icon action, and a solid primary Button as the main action.
 */
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

/**
 * A filter bar: a single-select `outline` status group, a couple of independent
 * standalone `subtle` ToggleButtons, and plain Buttons for the actions.
 */
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

export const VariantExploration: Story = {
  render: () => (
    <Stack gap="1200" padding="600">
      {/* 1 — Button (reference, primary palette) ---------------------- */}
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

      {/* 2 — ToggleButton (standalone) -------------------------------- */}
      <Stack gap="400">
        <SectionHeading>
          2 · ToggleButton — variant × activeFillStyle (resting vs selected)
        </SectionHeading>

        {/* column headers */}
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

      {/* 3 — ToggleButtonGroup ---------------------------------------- */}
      <Stack gap="800">
        <SectionHeading>
          3 · ToggleButtonGroup — variant × activeFillStyle
        </SectionHeading>

        {/* 3a — single-select matrix */}
        <Stack gap="400">
          <SubHeading>Single-select — Center = ON</SubHeading>
          <GroupMatrix selectionMode="single" selectedKeys={["center"]} />
        </Stack>

        {/* 3b — multi-select matrix (adjacent selection shows the border join) */}
        <Stack gap="400">
          <SubHeading>Multi-select — Left + Center = ON</SubHeading>
          <GroupMatrix
            selectionMode="multiple"
            selectedKeys={["left", "center"]}
          />
        </Stack>
      </Stack>

      {/* 4 — In use: assemblies --------------------------------------- */}
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
      </Stack>
    </Stack>
  ),
};
