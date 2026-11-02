import {
  Box,
  Code,
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
 * The palettes, in three groups. A group with `labels` shows the name of each
 * palette. The system group shows only the colors, because there are many.
 */
const GROUPS = [
  {
    id: "semantic",
    label: "Semantic",
    description: "Colors with meaning, used to communicate status or state.",
    labels: true,
    palettes: ["primary", "neutral", "info", "positive", "warning", "critical"],
  },
  {
    id: "brand",
    label: "Brand",
    description: "Custom colors, tailored to the brand.",
    labels: true,
    palettes: ["ctviolet", "ctteal", "ctyellow"],
  },
  {
    id: "system",
    label: "System",
    description: "Colors available for decoration or reference.",
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
      "blackAlpha",
      "whiteAlpha",
    ],
  },
] as const;

/** All palettes in page order, for the arrow keys. */
const ALL_PALETTES: readonly string[] = GROUPS.flatMap(
  (group) => group.palettes
);

const DEFAULT_PALETTE = "primary";
const PARAM = "palette";

/** Palettes that need a word of explanation. */
const NOTES: Record<string, string> = {
  blackAlpha:
    "Black and white scales do not adapt to the color mode: black is always black. It is shown on a light background. Use `neutral` for a gray that follows the current background.",
  whiteAlpha:
    "Black and white scales do not adapt to the color mode: white is always white. It is shown on a dark background. Use `neutral` for a gray that follows the current background.",
};

/** Text with `code` parts drawn as code. */
const WithCode = ({ text }: { text: string }) => (
  <>
    {text.split("`").map((part, i) =>
      i % 2 === 1 ? (
        <Code key={i} variant="subtle">
          {part}
        </Code>
      ) : (
        part
      )
    )}
  </>
);

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
        display="inline-flex"
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
      boxSize="800"
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
 * Shows the scale of one palette, and below it all palettes in three groups to
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

  const note = NOTES[palette];

  return (
    <Stack gap="600" my="600">
      <Stack gap="400">
        <Flex justify="flex-end">
          <ToggleButtonGroup.Root
            size="sm"
            colorPalette="primary"
            disallowEmptySelection
            selectedKeys={[mode]}
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

        <ColorScale id={palette} />

        {note && (
          <Text color="neutral.11">
            <WithCode text={note} />
          </Text>
        )}
      </Stack>

      <Stack
        gap="500"
        role="radiogroup"
        aria-label="Color palette"
        onKeyDown={onKeyDown}
      >
        {GROUPS.map((group) => (
          <Stack key={group.id} gap="300">
            <Box>
              <Text fontWeight="600">{group.label}</Text>
              <Text textStyle="sm" color="neutral.11">
                {group.description}
              </Text>
            </Box>
            <Flex wrap="wrap" gap={group.labels ? "200" : "300"}>
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
            </Flex>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
