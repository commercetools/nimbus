import { useEffect, useMemo, useRef, useState } from "react";
import type { FC, ReactNode, SVGProps } from "react";
import {
  Box,
  Button,
  Stack,
  Flex,
  Text,
  Badge,
  IconButton,
  Dialog,
  Tabs,
  ToggleButtonGroup,
  useCopyToClipboard,
  toast,
} from "@commercetools/nimbus";
import {
  ContentCopy,
  HideSource,
  CropSquare,
  PanoramaFishEye,
} from "@commercetools/nimbus-icons";
import * as icons from "@commercetools/nimbus-icons";
import type { IconMeta } from "@commercetools/nimbus-icons/meta";
// Same highlighter + theme the docs use for fenced code (base-tags/code.tsx),
// so the dialog's snippets match every other code block in the app.
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { slugifyCategory, titleCase, type IconEntry } from "./use-icon-data";
import { useIconRouteState } from "./use-icon-route-state";
import {
  SURFACE_PAD,
  SURFACE_STYLE,
  type Surface,
} from "./icon-display-controls";
import { buildSimilarityIndex, computeSimilarIcons } from "./similar-icons";

/** A raw icon component from `@commercetools/nimbus-icons` (an SVG). */
type Glyph = FC<SVGProps<SVGSVGElement>>;

/** Pixel sizes shown across the compact size row — a representative spread. */
const SIZES = [16, 24, 32, 48];

/** How many tags to show before the reference rail's "+N more" toggle. */
const TAG_CAP = 12;

/** How many similar icons to surface in the bottom row. */
const SIMILAR_LIMIT = 12;

/** The size-row surface toggle options (mirrors the sidebar's Surface control). */
const SURFACE_OPTIONS: { id: Surface; label: string; Icon: Glyph }[] = [
  { id: "none", label: "No surface", Icon: HideSource },
  { id: "square", label: "Square surface", Icon: CropSquare },
  { id: "circle", label: "Circle surface", Icon: PanoramaFishEye },
];

/**
 * A small uppercase section label — the connective tissue of the reference
 * layout. Quiet enough not to compete with the content, consistent enough to
 * tie the two columns together.
 */
const SectionLabel = ({ children }: { children: ReactNode }) => (
  <Text
    textStyle="xs"
    fontWeight="700"
    color="neutral.11"
    css={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
  >
    {children}
  </Text>
);

/**
 * A multi-line, copyable, syntax-highlighted code block. Uses the same
 * react-syntax-highlighter + `oneDark` theme the docs render fenced code with,
 * so it always reads as a dark code panel regardless of the page theme. Long
 * lines scroll horizontally inside the block; the copy button floats top-right
 * (recolored light for the dark panel) and the code reserves right padding so
 * its first line clears the button.
 */
const CodeBlock = ({
  code,
  label,
  onCopy,
}: {
  code: string;
  label: string;
  onCopy: () => void;
}) => (
  <Box position="relative" borderRadius="200" overflow="hidden">
    <SyntaxHighlighter
      language="tsx"
      style={oneDark}
      customStyle={{
        margin: 0,
        padding: "12px",
        paddingRight: "40px",
        fontSize: "12px",
        lineHeight: "1.7",
      }}
    >
      {code}
    </SyntaxHighlighter>
    <IconButton
      aria-label={`Copy ${label}`}
      size="xs"
      variant="ghost"
      onClick={onCopy}
      position="absolute"
      top="100"
      right="100"
      css={{
        color: "rgba(255, 255, 255, 0.85)",
        _hover: { color: "#fff", background: "rgba(255, 255, 255, 0.14)" },
      }}
    >
      <ContentCopy />
    </IconButton>
  </Box>
);

/** Inline monospace token used in the behavior notes. */
const Code = ({ children }: { children: ReactNode }) => (
  <Text as="code" fontFamily="mono" color="neutral.12">
    {children}
  </Text>
);

/**
 * The icon centered on its 24×24 keyline grid — the design-spec "anatomy" view.
 * Material icons author against a 24-unit canvas with ~2 units of edge padding
 * (the "live area"), shown here as the dashed keyline. `size` must stay a
 * multiple of 24 (one px cell per unit) so the grid lines land on exact cells.
 */
const KeylineGrid = ({
  Component,
  size = 192,
}: {
  Component: Glyph;
  size?: number;
}) => {
  const UNITS = 24; // icons are authored on a 24×24 canvas
  const SIZE = size; // an exact multiple of 24 so cells align
  const UNIT = SIZE / UNITS; // px per grid cell
  const PAD = UNIT * 2; // 2 units of edge padding (the live area)

  return (
    <Box
      position="relative"
      boxSize={`${SIZE}px`}
      maxWidth="full"
      // An outline (not a border) frames the box without shrinking the painted
      // area, so the grid stays an exact 24×24 of cells with no partial edges.
      outlineWidth="1px"
      outlineStyle="solid"
      outlineColor="neutral.6"
      flexShrink="0"
      // Inline style for the gradient grid lines — translucent grays that read
      // in both light and dark themes. Major lines (every 4 units) are darker
      // and listed first so they paint over the 1-unit minor lines.
      style={{
        backgroundImage: [
          "linear-gradient(to right, rgba(127,127,127,0.34) 1px, transparent 1px)",
          "linear-gradient(to bottom, rgba(127,127,127,0.34) 1px, transparent 1px)",
          "linear-gradient(to right, rgba(127,127,127,0.16) 1px, transparent 1px)",
          "linear-gradient(to bottom, rgba(127,127,127,0.16) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: [
          `${UNIT * 4}px ${UNIT * 4}px`,
          `${UNIT * 4}px ${UNIT * 4}px`,
          `${UNIT}px ${UNIT}px`,
          `${UNIT}px ${UNIT}px`,
        ].join(", "),
      }}
    >
      {/* Live-area keyline (2 units in from each edge) */}
      <Box
        position="absolute"
        top={`${PAD}px`}
        left={`${PAD}px`}
        right={`${PAD}px`}
        bottom={`${PAD}px`}
        border="solid-25"
        borderStyle="dashed"
        borderColor="primary.8"
      />
      {/* The icon fills the whole grid, so its 24-unit viewBox maps 1:1 to the
          24×24 cells and its geometry lines up with the grid. */}
      <Box position="absolute" inset="0" color="neutral.12">
        <Component width={SIZE} height={SIZE} />
      </Box>
    </Box>
  );
};

/**
 * One tile in the "Similar icons" row — a small, self-contained button (unlike
 * the grid's `IconTile`, which is welded to a react-aria `GridList`). Clicking it
 * opens that icon's detail in the same dialog via `onOpen` (a history push, so
 * Back retraces the trail). The full export name shows below the glyph and in a
 * native `title` for hover.
 */
const SimilarTile = ({
  name,
  onOpen,
}: {
  name: string;
  onOpen: (name: string) => void;
}) => {
  const Component = icons[name as keyof typeof icons] as Glyph | undefined;
  if (!Component) return null;
  return (
    <Button
      unstyled
      onPress={() => onOpen(name)}
      title={name}
      flexShrink="0"
      width="80px"
      p="200"
      borderRadius="300"
      cursor="pointer"
      color="neutral.12"
      outline="none"
      _hover={{ bg: "neutral.3" }}
      css={{ "&[data-focus-visible]": { layerStyle: "focusRing" } }}
    >
      <Stack gap="150" align="center" minW="0" width="full">
        <Flex align="center" justify="center" boxSize="32px">
          <Component width={32} height={32} />
        </Flex>
        <Text
          textStyle="xs"
          color="neutral.10"
          width="full"
          maxWidth="full"
          textAlign="center"
          truncate
        >
          {name}
        </Text>
      </Stack>
    </Button>
  );
};

/**
 * Shows an icon's detail in a controlled Dialog, laid out as a two-pane hub: a
 * primary column (hero preview + copyable usage) beside a calm reference rail
 * (anatomy keyline grid, a compact size row, and the tag list), with a
 * full-width "Similar icons" row below that turns the dialog into a browsing
 * loop. Open state comes from the `/icons/:name` route (`useIconRouteState`);
 * rendered once at the icons shell level, so there's only ever one instance.
 */
export const IconDetailDialog = ({
  entries,
  metadata,
}: {
  entries: IconEntry[];
  metadata: Record<string, IconMeta> | null;
}) => {
  // The open icon comes from the `/icons/:name` segment; aliased to `name` since
  // the rest of the component reads it as `name`. `closeIcon` returns to the
  // filtered grid; `goToCategory` swaps the dialog for a category filter;
  // `openIcon` (used by the similar row) pushes another icon onto the trail.
  const {
    iconName: name,
    closeIcon,
    goToCategory,
    openIcon,
  } = useIconRouteState();
  const [, copyToClipboard] = useCopyToClipboard();

  // Surface previewed behind the compact size row — a local preview affordance,
  // independent of the grid's persisted (URL-backed) surface preference.
  const [sizeSurface, setSizeSurface] = useState<Surface>("none");
  // Tags are demoted to a capped, expandable list in the reference rail.
  const [showAllTags, setShowAllTags] = useState(false);

  // Tag-similarity index over the whole corpus. It depends only on `entries`, so
  // it builds once (when the lazy metadata chunk resolves) and is reused for
  // every selected icon — the dialog stays mounted across selections. See
  // similar-icons.ts for the scoring.
  const similarityIndex = useMemo(
    () => buildSimilarityIndex(entries),
    [entries]
  );
  const similar = useMemo(
    () =>
      name ? computeSimilarIcons(name, similarityIndex, SIMILAR_LIMIT) : [],
    [name, similarityIndex]
  );

  // Scroll the dialog body back to its top and collapse the tag list whenever
  // the icon changes (e.g. after clicking through the similar row), so each new
  // icon opens on its hero rather than parked at the previous scroll position.
  const topRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setShowAllTags(false);
    if (name) topRef.current?.scrollIntoView({ block: "start" });
  }, [name]);

  const Component = name
    ? (icons[name as keyof typeof icons] as Glyph | undefined)
    : undefined;
  const meta = name ? metadata?.[name] : undefined;
  const categories = meta?.categories ?? [];
  const tags = meta?.tags ?? [];
  const shownTags = showAllTags ? tags : tags.slice(0, TAG_CAP);
  const importStatement = name
    ? `import { ${name} } from '@commercetools/nimbus-icons';`
    : "";
  const componentSnippet = name
    ? `import { IconButton } from '@commercetools/nimbus';\n${importStatement}\n\n<IconButton aria-label="${name}">\n  <${name} />\n</IconButton>`
    : "";
  const inputSnippet = name
    ? `import { TextInput } from '@commercetools/nimbus';\n${importStatement}\n\n<TextInput\n  leadingElement={<${name} />}\n/>`
    : "";
  const standaloneSnippet = name
    ? `import { Icon } from '@commercetools/nimbus';\n${importStatement}\n\n<Icon as={${name}} size="md" color="primary.11" />`
    : "";
  const menuSnippet = name
    ? `import { Menu, Icon, Text } from '@commercetools/nimbus';\n${importStatement}\n\n<Menu.Item>\n  <Icon slot="icon"><${name} /></Icon>\n  <Text slot="label">Label</Text>\n</Menu.Item>`
    : "";

  // Where a consumer actually puts an icon, ordered by how common the pattern
  // is in the codebase. Each tab carries the imports that snippet needs.
  const usageTabs = [
    {
      id: "component",
      label: "In a component",
      code: componentSnippet,
      caption: (
        <>
          <Code>Button</Code>, <Code>IconButton</Code> and <Code>Badge</Code>{" "}
          set its size and color — pass the raw icon as a child.
        </>
      ),
    },
    {
      id: "input",
      label: "In an input",
      code: inputSnippet,
      caption: (
        <>
          A <Code>leadingElement</Code> or <Code>trailingElement</Code> on any
          input sizes and colors it for you — no <Code>Icon</Code> wrapper
          needed.
        </>
      ),
    },
    {
      id: "standalone",
      label: "Standalone",
      code: standaloneSnippet,
      caption: (
        <>
          Wrap it in <Code>Icon</Code> to set its <Code>size</Code> (2xs–xl) and{" "}
          <Code>color</Code> yourself.
        </>
      ),
    },
    {
      id: "menu",
      label: "In a menu",
      code: menuSnippet,
      caption: (
        <>
          Menu items place it in a named slot — the <Code>Icon</Code> wrapper
          carries <Code>slot="icon"</Code>.
        </>
      ),
    },
  ];

  const copy = (text: string, description: string) => {
    copyToClipboard(text);
    toast.success({ title: "Copied to clipboard", description });
  };

  return (
    <Dialog.Root
      isOpen={name != null}
      scrollBehavior="inside"
      onOpenChange={(open) => {
        if (!open) closeIcon();
      }}
    >
      <Dialog.Content width="3xl" maxWidth="95vw">
        <Dialog.Header>
          <Flex align="center" gap="300" wrap="wrap" flex="1" minW="0">
            <Dialog.Title>{name}</Dialog.Title>
            {categories.length > 0 && (
              <Flex gap="100" wrap="wrap">
                {categories.map((c) => (
                  <Button
                    unstyled
                    key={c}
                    cursor="pointer"
                    onPress={() => goToCategory(slugifyCategory(c))}
                  >
                    <Badge size="xs">{titleCase(c)}</Badge>
                  </Button>
                ))}
              </Flex>
            )}
          </Flex>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          {name && Component ? (
            <Box ref={topRef}>
              <Stack gap="800" pb="400">
                {/* Two-pane hub: primary column (hero + usage) beside a calm
                    reference rail. On a narrow dialog the rail drops below. */}
                <Box
                  display="grid"
                  gap="600"
                  alignItems="start"
                  gridTemplateColumns={{
                    base: "1fr",
                    md: "minmax(0, 1.4fr) minmax(0, 1fr)",
                  }}
                >
                  {/* LEFT — the hero preview leads, usage sits beneath it. The
                      hero is above the height-changing usage tabs, so switching
                      tabs never makes it jump. */}
                  <Stack gap="600" minW="0">
                    <Flex
                      align="center"
                      justify="center"
                      h="200px"
                      bg="neutral.2"
                      borderRadius="400"
                      color="neutral.12"
                      css={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(127,127,127,0.16) 1px, transparent 1.5px)",
                        backgroundSize: "16px 16px",
                      }}
                    >
                      <Component width={96} height={96} />
                    </Flex>

                    <Stack gap="200" minW="0">
                      <SectionLabel>Usage</SectionLabel>
                      <Text textStyle="xs" color="neutral.10">
                        Rendered at <Code>1em</Code> in{" "}
                        <Code>currentColor</Code>, an icon takes its size and
                        color from wherever it sits.
                      </Text>
                      <Tabs.Root size="sm">
                        <Tabs.List>
                          {usageTabs.map((t) => (
                            <Tabs.Tab key={t.id} id={t.id}>
                              {t.label}
                            </Tabs.Tab>
                          ))}
                        </Tabs.List>
                        <Tabs.Panels>
                          {usageTabs.map((t) => (
                            <Tabs.Panel key={t.id} id={t.id}>
                              <Stack gap="150" pt="300">
                                <CodeBlock
                                  code={t.code}
                                  label={`${t.label.toLowerCase()} usage`}
                                  onCopy={() =>
                                    copy(t.code, `${t.label} usage`)
                                  }
                                />
                                <Text textStyle="xs" color="neutral.10">
                                  {t.caption}
                                </Text>
                              </Stack>
                            </Tabs.Panel>
                          ))}
                        </Tabs.Panels>
                      </Tabs.Root>
                      <Text textStyle="xs" color="neutral.10">
                        Decorative icons are hidden from assistive tech; an
                        icon-only control needs an <Code>aria-label</Code> that
                        describes its action.
                      </Text>
                    </Stack>
                  </Stack>

                  {/* RIGHT — reference rail. A left divider at md, a top divider
                      when it stacks below on a narrow dialog. */}
                  <Stack
                    gap="700"
                    minW="0"
                    borderColor="neutral.3"
                    borderLeft={{ base: "none", md: "solid-25" }}
                    borderTop={{ base: "solid-25", md: "none" }}
                    pl={{ base: "0", md: "600" }}
                    pt={{ base: "600", md: "0" }}
                  >
                    <Stack gap="150">
                      <SectionLabel>Anatomy</SectionLabel>
                      {/* 144 = 6×24, so the 24-unit keyline stays crisp (one px
                          cell per unit) while fitting the narrower rail. */}
                      <KeylineGrid Component={Component} size={144} />
                    </Stack>

                    <Stack gap="300">
                      <Flex
                        justify="space-between"
                        align="center"
                        gap="300"
                        wrap="wrap"
                      >
                        <SectionLabel>Sizes</SectionLabel>
                        {/* One row of sizes on a chosen chip, instead of the old
                            size×surface matrix — the surface is a small toggle. */}
                        <ToggleButtonGroup.Root
                          size="xs"
                          colorPalette="primary"
                          disallowEmptySelection
                          selectedKeys={[sizeSurface]}
                          onSelectionChange={(keys) => {
                            const key = [...keys][0];
                            if (key != null) setSizeSurface(key as Surface);
                          }}
                          aria-label="Size preview surface"
                        >
                          {SURFACE_OPTIONS.map(({ id, label, Icon }) => (
                            <ToggleButtonGroup.Button
                              key={id}
                              id={id}
                              aria-label={label}
                            >
                              <Icon />
                            </ToggleButtonGroup.Button>
                          ))}
                        </ToggleButtonGroup.Root>
                      </Flex>
                      <Flex align="flex-end" gap="400" wrap="wrap">
                        {SIZES.map((px) => (
                          <Stack key={px} gap="150" align="center">
                            <Flex
                              align="center"
                              justify="center"
                              boxSize={`${px + SURFACE_PAD * 2}px`}
                              color="neutral.12"
                              bg={SURFACE_STYLE[sizeSurface].bg}
                              borderRadius={SURFACE_STYLE[sizeSurface].radius}
                            >
                              <Component width={px} height={px} />
                            </Flex>
                            <Text textStyle="xs" color="neutral.10">
                              {px}px
                            </Text>
                          </Stack>
                        ))}
                      </Flex>
                    </Stack>

                    {tags.length > 0 && (
                      <Stack gap="200">
                        <SectionLabel>Tags</SectionLabel>
                        <Flex gap="100" wrap="wrap" align="center">
                          {shownTags.map((t) => (
                            <Badge key={t} size="xs" colorPalette="neutral">
                              {t}
                            </Badge>
                          ))}
                          {tags.length > TAG_CAP && (
                            <Button
                              unstyled
                              cursor="pointer"
                              onPress={() => setShowAllTags((v) => !v)}
                            >
                              <Badge size="xs" colorPalette="primary">
                                {showAllTags
                                  ? "Show less"
                                  : `+${tags.length - TAG_CAP} more`}
                              </Badge>
                            </Button>
                          )}
                        </Flex>
                      </Stack>
                    )}
                  </Stack>
                </Box>

                {/* Similar icons — a full-width strip that turns the dialog into
                    a browsing loop. Hidden until the metadata (tags) has loaded
                    and yielded candidates. */}
                {similar.length > 0 && (
                  <Stack gap="300">
                    <SectionLabel>Similar icons</SectionLabel>
                    <Flex
                      as="nav"
                      aria-label="Similar icons"
                      gap="200"
                      pb="100"
                      css={{ overflowX: "auto" }}
                    >
                      {similar.map((simName) => (
                        <SimilarTile
                          key={simName}
                          name={simName}
                          onOpen={openIcon}
                        />
                      ))}
                    </Flex>
                  </Stack>
                )}
              </Stack>
            </Box>
          ) : null}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};
