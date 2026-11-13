import {
  Box,
  Flex,
  Stack,
  Text,
  ToggleButtonGroup,
} from "@commercetools/nimbus";
import { useCallback, useRef, type KeyboardEvent } from "react";
// `react-router-dom`, not bare `react-router`: see use-icon-route-state.ts.
import { useSearchParams } from "react-router-dom";
import {
  useColorScaleMode,
  type ColorScaleMode,
} from "@/atoms/color-scale-mode";
import { ColorScale } from "./color-scale.tsx";

/**
 * The palettes, in groups. A group with `labels` shows the name of each
 * palette. The system group shows only the colors, because there are many.
 * `item` names the group of the selected palette.
 */
const GROUPS = [
  {
    id: "semantic",
    label: "Semantic colors",
    item: "Semantic color",
    description: "Colors with a meaning, such as a status or a state.",
    labels: true,
    palettes: ["primary", "neutral", "info", "positive", "warning", "critical"],
  },
  {
    id: "brand",
    label: "Brand colors",
    item: "Brand color",
    description: "The commercetools brand colors.",
    labels: true,
    palettes: ["ctviolet", "ctteal", "ctyellow"],
  },
  {
    id: "system",
    label: "System colors",
    item: "System color",
    description:
      "The full range of hues, for decoration or to tell items apart.",
    labels: false,
    palettes: [
      "tomato",
      "red",
      "ruby",
      "crimson",
      "pink",
      "plum",
      "purple",
      "violet",
      "iris",
      "indigo",
      "blue",
      "cyan",
      "teal",
      "jade",
      "green",
      "grass",
      "bronze",
      "gold",
      "brown",
      "orange",
      "amber",
      "yellow",
      "lime",
      "mint",
      "sky",
    ],
  },
  {
    id: "black-and-white",
    label: "Black and white",
    item: "Black and white",
    description: "Black or white with opacity, the same in both color modes.",
    labels: true,
    palettes: ["blackAlpha", "whiteAlpha"],
  },
] as const;

/** All palettes in page order, for the arrow keys. */
const ALL_PALETTES: readonly string[] = GROUPS.flatMap(
  (group) => group.palettes
);

/**
 * Width of the palettes of a group: 9 dots of 40px, or 3 named palettes of
 * 144px, with 12px between them. So every group ends on the same line.
 */
const PALETTES_WIDTH = "456px";
const SWATCH_COLUMNS = 9;
const SWATCH_SIZE = "40px";
/** Smallest width of a named palette, so that the longest name fits. */
const LABEL_MIN_WIDTH = "120px";
/**
 * Width of the picker from which a group shows its name next to its palettes,
 * not above them: 200px for the name, 24px of space and 416px for 3 palettes.
 */
const TWO_COLUMNS = "@container (min-width: 640px)";

const DEFAULT_PALETTE = "primary";
const PARAM = "palette";

/**
 * Black and white palettes do not change with the color mode. The scale draws
 * them on the opposite background, so that every step can be seen, and the
 * header says why.
 */
const FIXED_PALETTES: Record<
  string,
  { backdrop: ColorScaleMode; note: string }
> = {
  blackAlpha: {
    backdrop: "light",
    note: "Always black, shown on a light background",
  },
  whiteAlpha: {
    backdrop: "dark",
    note: "Always white, shown on a dark background",
  },
};

const FOCUS_RING = {
  outline: "2px solid",
  outlineColor: "primary.9",
  outlineOffset: "2px",
};

type PaletteButtonProps = {
  id: string;
  selected: boolean;
  /** Show the name next to the color. */
  labeled: boolean;
  onSelect: (id: string) => void;
  register: (element: HTMLDivElement | null) => void;
};

/** One palette as a radio button: a color, with or without its name. */
const PaletteButton = ({
  id,
  selected,
  labeled,
  onSelect,
  register,
}: PaletteButtonProps) => {
  const common = {
    as: "button" as const,
    role: "radio",
    "aria-checked": selected,
    "aria-label": id,
    title: id,
    tabIndex: selected ? 0 : -1,
    ref: register,
    onClick: () => onSelect(id),
    cursor: "pointer",
    _focusVisible: FOCUS_RING,
  };

  if (labeled) {
    return (
      <Box
        {...common}
        display="flex"
        width="full"
        alignItems="center"
        gap="150"
        px="300"
        py="100"
        borderRadius="full"
        border="1px solid"
        borderColor={selected ? "primary.9" : "neutral.6"}
        bg={selected ? "primary.3" : "transparent"}
        color="fg"
        textStyle="sm"
        _hover={{ bg: selected ? "primary.3" : "neutral.2" }}
      >
        <Box
          boxSize="300"
          borderRadius="full"
          bg={`${id}.9`}
          border="1px solid"
          borderColor="neutral.6"
          flexShrink={0}
        />
        {id}
      </Box>
    );
  }

  return (
    <Box
      {...common}
      width="full"
      aspectRatio={1}
      borderRadius="full"
      bg={`${id}.9`}
      border="1px solid"
      borderColor="neutral.6"
      // The ring marks the selected color, which has no label.
      outline={selected ? "2px solid" : undefined}
      outlineColor="primary.9"
      outlineOffset="3px"
      transition="transform 0.1s"
      _hover={{ transform: "scale(1.12)" }}
    />
  );
};

/**
 * Shows the scale of one palette, and below it all palettes in four groups to
 * pick from. The palette is kept in the URL (`?palette=red`), so a view can be
 * shared.
 */
export const ColorPalettes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useColorScaleMode();
  const buttons = useRef<(HTMLElement | null)[]>([]);

  const requested = searchParams.get(PARAM) ?? DEFAULT_PALETTE;
  const palette = ALL_PALETTES.includes(requested)
    ? requested
    : DEFAULT_PALETTE;

  const select = useCallback(
    (next: string) => {
      setSearchParams(
        (params) => {
          const updated = new URLSearchParams(params);
          // The default is left out, so a fresh page has a clean URL.
          if (next === DEFAULT_PALETTE) updated.delete(PARAM);
          else updated.set(PARAM, next);
          return updated;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Arrow keys move between the palettes, as in a radio group.
  const onKeyDown = (event: KeyboardEvent) => {
    const last = ALL_PALETTES.length - 1;
    const index = ALL_PALETTES.indexOf(palette);
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    select(ALL_PALETTES[next]);
    buttons.current[next]?.focus();
  };

  const fixed = FIXED_PALETTES[palette];
  const shownMode = fixed?.backdrop ?? mode;
  const selectedGroup =
    GROUPS.find((group) =>
      (group.palettes as readonly string[]).includes(palette)
    ) ?? GROUPS[0];

  return (
    <Stack gap="600" my="600">
      <Stack gap="400">
        <Flex justify="space-between" align="center" wrap="wrap" gap="300">
          {/* The selected palette: its color, its name and its group. */}
          <Flex align="center" gap="300" aria-live="polite">
            <Box
              boxSize="1000"
              borderRadius="full"
              bg={`${palette}.9`}
              border="1px solid"
              borderColor="neutral.6"
              flexShrink={0}
            />
            <Box>
              <Text textStyle="2xl" fontWeight="600" lineHeight="1.1">
                {palette}
              </Text>
              <Text textStyle="sm" color="neutral.11">
                {fixed
                  ? `${selectedGroup.item} · ${fixed.note}`
                  : selectedGroup.item}
              </Text>
            </Box>
          </Flex>
          <ToggleButtonGroup.Root
            size="sm"
            colorPalette="primary"
            disallowEmptySelection
            // A black or white palette looks the same in both modes.
            isDisabled={Boolean(fixed)}
            selectedKeys={[shownMode]}
            onSelectionChange={(keys) => {
              const key = [...keys][0];
              if (key != null) setMode(key as ColorScaleMode);
            }}
            aria-label="Color mode of the scale"
          >
            <ToggleButtonGroup.Button id="light">
              Light
            </ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button id="dark">Dark</ToggleButtonGroup.Button>
          </ToggleButtonGroup.Root>
        </Flex>

        <ColorScale id={palette} mode={shownMode} />
      </Stack>

      <Stack
        gap="500"
        role="radiogroup"
        aria-label="Color palette"
        onKeyDown={onKeyDown}
        // The layout of a group depends on the width of the picker, not of the
        // window: the page can have a navigation and a table of contents.
        css={{ containerType: "inline-size" }}
      >
        {GROUPS.map((group) => (
          <Box
            key={group.id}
            display="grid"
            gridTemplateColumns="minmax(0, 1fr)"
            columnGap="600"
            rowGap="300"
            alignItems="start"
            // Name and description on the left, the palettes on the right.
            css={{
              [TWO_COLUMNS]: { gridTemplateColumns: "200px minmax(0, 1fr)" },
            }}
          >
            <Box>
              <Text textStyle="xl" fontWeight="600">
                {group.label}
              </Text>
              <Text textStyle="sm" color="neutral.11">
                {group.description}
              </Text>
            </Box>
            <Box
              display="grid"
              // Every group is a block of the same width, not a row that
              // wraps unevenly. On a narrow screen the dots get smaller and
              // the named palettes use fewer columns.
              maxWidth={PALETTES_WIDTH}
              gridTemplateColumns={
                group.labels
                  ? `repeat(auto-fill, minmax(${LABEL_MIN_WIDTH}, 1fr))`
                  : `repeat(${SWATCH_COLUMNS}, minmax(0, ${SWATCH_SIZE}))`
              }
              justifyContent="space-between"
              columnGap={group.labels ? "300" : "200"}
              rowGap="300"
            >
              {group.palettes.map((id) => (
                <PaletteButton
                  key={id}
                  id={id}
                  selected={id === palette}
                  labeled={group.labels}
                  onSelect={select}
                  register={(element) => {
                    buttons.current[ALL_PALETTES.indexOf(id)] = element;
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};
