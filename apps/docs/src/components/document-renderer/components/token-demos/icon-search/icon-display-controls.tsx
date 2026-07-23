import {
  Box,
  Flex,
  Stack,
  Text,
  ToggleButtonGroup,
} from "@commercetools/nimbus";
import {
  CropSquare,
  HideSource,
  PanoramaFishEye,
} from "@commercetools/nimbus-icons";

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
 * View controls for the icon grid, rendered pinned at the top of the Icons
 * sidebar (above the scrollable category rail). Owns no state itself — the
 * `iconSize` and `surface` values live in `IconSearch` so both the grid
 * (`IconBrowse`) and these controls stay in sync. Styled to match the rail's
 * `CategoryRail` section (same padding + heading treatment) so the aside reads
 * as one panel.
 */
export const IconDisplayControls = ({
  iconSize,
  onIconSizeChange,
  surface,
  onSurfaceChange,
}: {
  iconSize: number;
  onIconSizeChange: (size: number) => void;
  surface: Surface;
  onSurfaceChange: (surface: Surface) => void;
}) => (
  <Stack gap="400" p="400">
    <Text textStyle="sm" fontWeight="600" color="neutral.11">
      Display
    </Text>

    {/* Icon size — a plain range input, full-width for the narrow rail, with
        the current value shown alongside the label. Resizes every previewed
        glyph live via the grid's --icon-preview-size custom property. */}
    <Stack gap="100">
      <Flex justify="space-between" align="baseline">
        <Text textStyle="sm" color="neutral.11">
          Size
        </Text>
        <Text
          textStyle="xs"
          color="neutral.10"
          css={{ fontVariantNumeric: "tabular-nums" }}
        >
          {iconSize}px
        </Text>
      </Flex>
      <Box
        asChild
        css={{
          width: "100%",
          cursor: "pointer",
          accentColor: "{colors.primary.9}",
        }}
      >
        <input
          type="range"
          min={ICON_SIZE_MIN}
          max={ICON_SIZE_MAX}
          step={ICON_SIZE_STEP}
          value={iconSize}
          aria-label="Icon preview size"
          onChange={(e) => onIconSizeChange(Number(e.target.value))}
        />
      </Box>
    </Stack>

    {/* Surface — a single-select segmented toggle. Each option previews every
        glyph against the shape it most often sits inside: nothing, a
        rounded-square chip, or a circular chip. */}
    <Stack gap="100">
      <Text textStyle="sm" color="neutral.11">
        Surface
      </Text>
      <ToggleButtonGroup.Root
        size="xs"
        colorPalette="primary"
        disallowEmptySelection
        selectedKeys={[surface]}
        onSelectionChange={(keys) => {
          const key = [...keys][0];
          if (key != null) onSurfaceChange(key as Surface);
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
    </Stack>
  </Stack>
);

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
