import { Fragment } from "react";
import type { FC, ReactNode, SVGProps } from "react";
import {
  Box,
  Stack,
  Flex,
  Text,
  Badge,
  IconButton,
  Dialog,
  Tabs,
  useCopyToClipboard,
  toast,
} from "@commercetools/nimbus";
import { ContentCopy } from "@commercetools/nimbus-icons";
import * as icons from "@commercetools/nimbus-icons";
import type { IconMeta } from "@commercetools/nimbus-icons/meta";
import { useNavigate } from "react-router-dom";
// Same highlighter + theme the docs use for fenced code (base-tags/code.tsx),
// so the dialog's snippets match every other code block in the app.
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { slugifyCategory, titleCase } from "./use-icon-data";

/** A raw icon component from `@commercetools/nimbus-icons` (an SVG). */
type Glyph = FC<SVGProps<SVGSVGElement>>;

/** Pixel sizes shown across the size matrix — a compact, representative spread. */
const SIZES = [16, 24, 32, 48];

/**
 * Surface treatments the size matrix previews each icon against: bare on the
 * page, on a rounded-square chip, and on a circular chip (the two shapes icons
 * most often sit inside — buttons/avatars).
 */
const SIZE_SURFACES = [
  { key: "plain", label: "Background", filled: false, radius: undefined },
  { key: "square", label: "Square", filled: true, radius: "300" },
  { key: "circle", label: "Circle", filled: true, radius: "full" },
] as const;

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
 * Shows an icon's detail — a compact spec card — in a controlled Dialog: a hero
 * preview beside the import and JSX usage you copy and how it sizes/colors, then
 * the design anatomy beside a size strip, and the full tag list. Open when
 * `name` is set; `onClose` clears the selection. Rendered once at the icons
 * shell level (not per tile), so there's only ever one dialog instance.
 */
export const IconDetailDialog = ({
  name,
  metadata,
  onClose,
}: {
  name: string | null;
  metadata: Record<string, IconMeta> | null;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const [, copyToClipboard] = useCopyToClipboard();

  const Component = name
    ? (icons[name as keyof typeof icons] as Glyph | undefined)
    : undefined;
  const meta = name ? metadata?.[name] : undefined;
  const categories = meta?.categories ?? [];
  const tags = meta?.tags ?? [];
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
        if (!open) onClose();
      }}
    >
      <Dialog.Content width="3xl" maxWidth="95vw">
        <Dialog.Header>
          <Flex align="center" gap="300" wrap="wrap" flex="1" minW="0">
            <Dialog.Title>{name}</Dialog.Title>
            {categories.length > 0 && (
              <Flex gap="100" wrap="wrap">
                {categories.map((c) => (
                  <Box
                    as="button"
                    key={c}
                    cursor="pointer"
                    onClick={() => {
                      onClose();
                      navigate(`/icons/category/${slugifyCategory(c)}`);
                    }}
                  >
                    <Badge size="xs">{titleCase(c)}</Badge>
                  </Box>
                ))}
              </Flex>
            )}
          </Flex>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          {name && Component ? (
            <Stack gap="800" pb="400">
              {/* Preview + how to use it. Fixed hero height with `start`
                  alignment: the usage tabs beside it change height as you
                  switch tabs, and a stretched hero would jump with them. */}
              <Box
                display="grid"
                gap="600"
                alignItems="start"
                gridTemplateColumns={{
                  base: "1fr",
                  md: "minmax(0, 200px) minmax(0, 1fr)",
                }}
              >
                {/* Hero preview on a soft dot canvas */}
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
                    Rendered at <Code>1em</Code> in <Code>currentColor</Code>,
                    an icon takes its size and color from wherever it sits.
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
                              onCopy={() => copy(t.code, `${t.label} usage`)}
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
              </Box>

              {/* Anatomy + sizes */}
              <Box
                display="grid"
                gap="700"
                alignItems="start"
                gridTemplateColumns={{ base: "1fr", md: "auto minmax(0, 1fr)" }}
              >
                <Stack gap="150">
                  <SectionLabel>Anatomy</SectionLabel>
                  <KeylineGrid Component={Component} size={168} />
                </Stack>

                <Stack gap="300">
                  <SectionLabel>Sizes</SectionLabel>
                  {/* A matrix: each column is a pixel size, each row a surface
                      the icon commonly sits on (bare, square chip, circle
                      chip). Cells share a per-column footprint so the glyphs
                      line up across rows. */}
                  <Box
                    display="grid"
                    alignItems="center"
                    justifyItems="center"
                    justifyContent="start"
                    columnGap="400"
                    rowGap="300"
                    gridTemplateColumns={`auto repeat(${SIZES.length}, auto)`}
                  >
                    {/* Header: empty corner, then a label per size column */}
                    <Box />
                    {SIZES.map((px) => (
                      <Text key={px} textStyle="xs" color="neutral.10">
                        {px}px
                      </Text>
                    ))}

                    {/* One row per surface treatment */}
                    {SIZE_SURFACES.map((s) => (
                      <Fragment key={s.key}>
                        <Text
                          textStyle="xs"
                          color="neutral.10"
                          justifySelf="start"
                          whiteSpace="nowrap"
                        >
                          {s.label}
                        </Text>
                        {SIZES.map((px) => (
                          <Flex
                            key={px}
                            align="center"
                            justify="center"
                            boxSize={`${px + 20}px`}
                            color="neutral.12"
                            bg={s.filled ? "neutral.3" : undefined}
                            borderRadius={s.filled ? s.radius : undefined}
                          >
                            <Component width={px} height={px} />
                          </Flex>
                        ))}
                      </Fragment>
                    ))}
                  </Box>
                </Stack>
              </Box>

              {/* Tags — the full synonym list, wrapping across the dialog. */}
              {tags.length > 0 && (
                <Stack gap="200">
                  <SectionLabel>Tags</SectionLabel>
                  <Flex gap="100" wrap="wrap">
                    {tags.map((t) => (
                      <Badge key={t} size="xs" colorPalette="neutral">
                        {t}
                      </Badge>
                    ))}
                  </Flex>
                </Stack>
              )}
            </Stack>
          ) : null}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};
