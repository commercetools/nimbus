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

/** The palettes, in three groups. */
const GROUPS = [
  {
    id: "semantic",
    label: "Semantic",
    description: "Colors with meaning, used to communicate status or state.",
    palettes: ["primary", "neutral", "info", "positive", "warning", "critical"],
  },
  {
    id: "brand",
    label: "Brand",
    description: "Custom colors, tailored to the brand.",
    palettes: ["ctviolet", "ctteal", "ctyellow"],
  },
  {
    id: "system",
    label: "System",
    description: "Colors available for decoration or reference.",
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

type Group = (typeof GROUPS)[number];

const DEFAULT_PALETTE = "primary";
const PARAM = "palette";

/** Palettes that need a word of explanation. */
const NOTES: Record<string, string> = {
  blackAlpha:
    "Black and white scales do not adapt to the color mode: black is always black. It is shown on a light background. Use `neutral` for a gray that follows the current background.",
  whiteAlpha:
    "Black and white scales do not adapt to the color mode: white is always white. It is shown on a dark background. Use `neutral` for a gray that follows the current background.",
};

const groupOf = (palette: string): Group =>
  GROUPS.find((group) =>
    (group.palettes as readonly string[]).includes(palette)
  ) ?? GROUPS[0];

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

/**
 * Picks one palette out of three groups and shows its scale. The palette is
 * kept in the URL (`?palette=red`), so a view can be shared.
 */
export const ColorPalettes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useColorScaleMode();
  const chips = useRef<(HTMLElement | null)[]>([]);

  const requested = searchParams.get(PARAM) ?? DEFAULT_PALETTE;
  const known = GROUPS.some((group) =>
    (group.palettes as readonly string[]).includes(requested)
  );
  const palette = known ? requested : DEFAULT_PALETTE;
  const group = groupOf(palette);

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

  // Arrow keys move between the chips, as in a radio group.
  const onKeyDown = (event: KeyboardEvent) => {
    const list = group.palettes as readonly string[];
    const index = list.indexOf(palette);
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? (index + 1) % list.length
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (index - 1 + list.length) % list.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? list.length - 1
              : -1;
    if (next < 0) return;
    event.preventDefault();
    select(list[next]);
    chips.current[next]?.focus();
  };

  const note = NOTES[palette];

  return (
    <Stack gap="400" my="600">
      <Flex justify="space-between" align="center" wrap="wrap" gap="300">
        <ToggleButtonGroup.Root
          size="sm"
          colorPalette="primary"
          disallowEmptySelection
          selectedKeys={[group.id]}
          onSelectionChange={(keys) => {
            const key = [...keys][0];
            const target = GROUPS.find((item) => item.id === key);
            if (target) select(target.palettes[0]);
          }}
          aria-label="Group of palettes"
        >
          {GROUPS.map((item) => (
            <ToggleButtonGroup.Button key={item.id} id={item.id}>
              {item.label}
            </ToggleButtonGroup.Button>
          ))}
        </ToggleButtonGroup.Root>
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
          <ToggleButtonGroup.Button id="light">Light</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="dark">Dark</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </Flex>

      <Text color="neutral.11">{group.description}</Text>

      <Flex
        role="radiogroup"
        aria-label={`${group.label} palettes`}
        wrap="wrap"
        gap="200"
        onKeyDown={onKeyDown}
      >
        {group.palettes.map((id, index) => {
          const selected = id === palette;
          return (
            <Box
              as="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              key={id}
              ref={(element: HTMLDivElement | null) => {
                chips.current[index] = element;
              }}
              onClick={() => select(id)}
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
              cursor="pointer"
              _hover={{ bg: selected ? "primary.3" : "neutral.2" }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "primary.9",
                outlineOffset: "2px",
              }}
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
        })}
      </Flex>

      <ColorScale id={palette} />

      {note && (
        <Text color="neutral.11">
          <WithCode text={note} />
        </Text>
      )}
    </Stack>
  );
};
