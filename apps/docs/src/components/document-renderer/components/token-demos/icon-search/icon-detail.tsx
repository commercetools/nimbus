import type { FC, SVGProps } from "react";
import {
  Box,
  Stack,
  Flex,
  Text,
  Heading,
  Badge,
  Button,
  Dialog,
  useCopyToClipboard,
  toast,
} from "@commercetools/nimbus";
import { ContentCopy } from "@commercetools/nimbus-icons";
import * as icons from "@commercetools/nimbus-icons";
import type { IconMeta } from "@commercetools/nimbus-icons/meta";
import { useNavigate } from "react-router-dom";

import { slugifyCategory, titleCase } from "./use-icon-data";
import { IconInUse } from "./icon-in-use";

/** A raw icon component from `@commercetools/nimbus-icons` (an SVG). */
type Glyph = FC<SVGProps<SVGSVGElement>>;

/** Pixel sizes shown on the size grid. */
const SIZES = [16, 20, 24, 32, 40, 48, 64];

/**
 * The icon centered on its 24×24 keyline grid — the design-spec "anatomy" view.
 * Material icons author against a 24-unit canvas with ~2 units of edge padding
 * (the "live area"), shown here as the dashed keyline.
 */
const KeylineGrid = ({ Component }: { Component: Glyph }) => {
  const UNIT = 8; // px per grid cell
  const UNITS = 24; // icons are authored on a 24×24 canvas
  const PAD = UNIT * 2; // 2 units of edge padding (the live area)
  const SIZE = UNIT * UNITS; // 192px — an exact multiple of 24 so cells align

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
 * Shows an icon's detail — preview at multiple sizes, import statement, and the
 * icon in use inside other Nimbus components — in a controlled Dialog. Open when
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
  const categories = (name && metadata?.[name]?.categories) || [];
  const importStatement = name
    ? `import { ${name} } from '@commercetools/nimbus-icons';`
    : "";

  const onCopy = () => {
    copyToClipboard(importStatement);
    toast.success({
      title: "Copied import to clipboard",
      description: name ?? "",
    });
  };

  return (
    <Dialog.Root
      isOpen={name != null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Content width="5xl" maxWidth="95vw">
        <Dialog.Header>
          <Dialog.Title>{name}</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          {name && Component ? (
            <Stack gap="800" pb="400">
              {/* Hero + categories + copy */}
              <Flex align="center" gap="500" wrap="wrap">
                <Flex
                  align="center"
                  justify="center"
                  boxSize="1600"
                  borderRadius="300"
                  bg="neutral.2"
                  color="neutral.12"
                  flexShrink="0"
                >
                  <Component width={40} height={40} />
                </Flex>
                <Stack gap="300">
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
                  <Flex align="center" gap="300" wrap="wrap">
                    <Button variant="outline" size="xs" onClick={onCopy}>
                      <ContentCopy /> Copy import
                    </Button>
                    <Text
                      textStyle="sm"
                      color="neutral.10"
                      fontFamily="mono"
                      truncate
                      maxWidth="full"
                    >
                      {importStatement}
                    </Text>
                  </Flex>
                </Stack>
              </Flex>

              {/* Keyline grid (icon anatomy) */}
              <Stack gap="400">
                <Heading size="sm">Grid</Heading>
                <KeylineGrid Component={Component} />
              </Stack>

              {/* Size grid */}
              <Stack gap="400">
                <Heading size="sm">Sizes</Heading>
                <Flex gap="700" wrap="wrap" align="flex-end">
                  {SIZES.map((px) => (
                    <Stack key={px} gap="200" align="center">
                      <Flex
                        align="center"
                        justify="center"
                        minH="64px"
                        color="neutral.12"
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

              {/* In use */}
              <Stack gap="400">
                <Heading size="sm">In use</Heading>
                <IconInUse name={name} Component={Component} />
              </Stack>
            </Stack>
          ) : null}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};
