import { useState } from "react";
import {
  Box,
  Flex,
  Slider,
  Text,
  ToggleButtonGroup,
} from "@commercetools/nimbus";
import {
  CropSquare,
  HideSource,
  PanoramaFishEye,
} from "@commercetools/nimbus-icons";

import { useIconRouteState } from "./use-icon-route-state";

/** The optional shape drawn behind every previewed glyph. */
export type Surface = "none" | "square" | "circle";

/** Icon-size slider bounds (px). Default 48 = the fontSize "1200" token. */
export const ICON_SIZE_MIN = 24;
export const ICON_SIZE_MAX = 96;
export const ICON_SIZE_STEP = 8;
export const ICON_SIZE_DEFAULT = 48;

/** No surface by default so the grid opens on the bare-glyph look. */
export const DEFAULT_SURFACE: Surface = "none";

/**
 * Display controls of the icon grid, in one row next to the search field:
 * the preview size and the shape drawn behind each icon. Both are URL
 * parameters (`?size=`, `?surface=`), so a shared link shows the same grid.
 *
 * While the slider moves, only this component renders and `onPreviewSize`
 * lets the grid change its CSS custom properties directly. The URL is written
 * once, when the slider is released, so the grid does not render again for
 * every step.
 */
export const IconDisplayControls = ({
  onPreviewSize,
}: {
  /** Called with the size (px) on every slider step, before the URL changes. */
  onPreviewSize?: (size: number) => void;
}) => {
  const { size, setSize, surface, setSurface } = useIconRouteState();
  // The size while the slider is moving. `null` means the URL value is shown.
  const [draft, setDraft] = useState<number | null>(null);
  const shownSize = draft ?? size;

  return (
    <Flex align="center" gap="400" flexShrink={0}>
      {/* The size resizes every glyph through the grid's
          --icon-preview-size custom property (see `onPreviewSize`). */}
      <Flex align="center" gap="200">
        <Text textStyle="sm" color="neutral.11">
          Size
        </Text>
        <Box width="120px">
          <Slider
            aria-label="Icon preview size"
            minValue={ICON_SIZE_MIN}
            maxValue={ICON_SIZE_MAX}
            step={ICON_SIZE_STEP}
            value={shownSize}
            onChange={(value) => {
              setDraft(value);
              onPreviewSize?.(value);
            }}
            onChangeEnd={(value) => {
              setSize(value);
              setDraft(null);
            }}
          />
        </Box>
        <Text
          textStyle="xs"
          color="neutral.10"
          minWidth="4ch"
          css={{ fontVariantNumeric: "tabular-nums" }}
        >
          {shownSize}px
        </Text>
      </Flex>

      {/* Nothing, a rounded square or a circle behind each glyph: the shapes
          an icon most often sits inside. */}
      <ToggleButtonGroup.Root
        size="xs"
        colorPalette="primary"
        disallowEmptySelection
        selectedKeys={[surface]}
        onSelectionChange={(keys) => {
          const key = [...keys][0];
          if (key != null) setSurface(key as Surface);
        }}
        aria-label="Icon surface"
      >
        <ToggleButtonGroup.Button id="none" aria-label="No surface">
          <HideSource />
        </ToggleButtonGroup.Button>
        <ToggleButtonGroup.Button id="square" aria-label="Square surface">
          <CropSquare />
        </ToggleButtonGroup.Button>
        <ToggleButtonGroup.Button id="circle" aria-label="Circle surface">
          <PanoramaFishEye />
        </ToggleButtonGroup.Button>
      </ToggleButtonGroup.Root>
    </Flex>
  );
};

/**
 * Breathing room (px, per side) reserved around every glyph. Applied in ALL
 * surface states — including "none" — so the chip footprint is constant and
 * toggling the surface never resizes a card or the glyph (no layout shift). The
 * chip is painted *within* this reserved box; only its fill/radius change.
 * `* 2` gives the +20 the detail dialog's size matrix uses (`icon-detail.tsx`).
 */
export const SURFACE_PAD = 10;

/**
 * Maps a surface to the fill the grid paints behind each glyph, mirroring the
 * detail dialog's `SIZE_SURFACES` convention (`icon-detail.tsx`) so the grid and
 * the detail matrix render the same chips. `bg`/`radius` are `undefined` for the
 * bare "none" case — the reserved box stays the same size, just unpainted.
 */
export const SURFACE_STYLE: Record<Surface, { bg?: string; radius?: string }> =
  {
    none: { bg: undefined, radius: undefined },
    square: { bg: "neutral.3", radius: "300" },
    circle: { bg: "neutral.3", radius: "full" },
  };
