import { useState, useEffect } from "react";
import { Badge, Box, Image, Stack, Text } from "@commercetools/nimbus";
import { ComboBox } from "../combobox";
import type { ComboBoxRootProps } from "../combobox.types";
import { defaultGetTextValue } from "./collection";

export function ComposedComboBox<T extends object>(
  props: ComboBoxRootProps<T>
) {
  return (
    <ComboBox.Root {...props}>
      <ComboBox.Trigger />
      <ComboBox.Popover>
        <ComboBox.ListBox>
          {(item: T) => (
            <ComboBox.Option>{defaultGetTextValue(item)}</ComboBox.Option>
          )}
        </ComboBox.ListBox>
      </ComboBox.Popover>
    </ComboBox.Root>
  );
}

// ============================================================
// ASYNC LOADING - Pokemon API types, Utils, and Option Component
// ============================================================
/** Initial Pokemomn API return type */
export type Pokemon = {
  name: string;
  url: string;
};
/** Pokemon API Details return type */
export type PokemonDetails = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  base_experience: number;
};

/**
 * Mock Pokemon data for testing async behavior without external dependencies.
 * Provides sample data that simulates Pokemon API responses for reliable testing.
 */
export const MOCK_POKEMON: Pokemon[] = [
  { name: "pikachu", url: "mock://pokemon/25" },
  { name: "charmander", url: "mock://pokemon/4" },
  { name: "bulbasaur", url: "mock://pokemon/1" },
  { name: "squirtle", url: "mock://pokemon/7" },
  { name: "eevee", url: "mock://pokemon/133" },
  { name: "mewtwo", url: "mock://pokemon/150" },
  { name: "pichu", url: "mock://pokemon/172" },
  { name: "charizard", url: "mock://pokemon/6" },
  { name: "ivysaur", url: "mock://pokemon/2" },
  { name: "venusaur", url: "mock://pokemon/3" },
  { name: "charmeleon", url: "mock://pokemon/5" },
  { name: "wartortle", url: "mock://pokemon/8" },
  { name: "blastoise", url: "mock://pokemon/9" },
  { name: "caterpie", url: "mock://pokemon/10" },
  { name: "metapod", url: "mock://pokemon/11" },
  { name: "butterfree", url: "mock://pokemon/12" },
];

/**
 * Mock Pokemon details for rendering PokemonOption component.
 * Maps Pokemon names to their detailed information for display.
 */
export const MOCK_POKEMON_DETAILS: Record<string, PokemonDetails> = {
  pikachu: {
    id: 25,
    name: "pikachu",
    sprites: { front_default: "/mock-sprites/pikachu.png" },
    types: [{ type: { name: "electric" } }],
    height: 4,
    weight: 60,
    base_experience: 112,
  },
  charmander: {
    id: 4,
    name: "charmander",
    sprites: { front_default: "/mock-sprites/charmander.png" },
    types: [{ type: { name: "fire" } }],
    height: 6,
    weight: 85,
    base_experience: 62,
  },
  bulbasaur: {
    id: 1,
    name: "bulbasaur",
    sprites: { front_default: "/mock-sprites/bulbasaur.png" },
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
    height: 7,
    weight: 69,
    base_experience: 64,
  },
  squirtle: {
    id: 7,
    name: "squirtle",
    sprites: { front_default: "/mock-sprites/squirtle.png" },
    types: [{ type: { name: "water" } }],
    height: 5,
    weight: 90,
    base_experience: 63,
  },
  eevee: {
    id: 133,
    name: "eevee",
    sprites: { front_default: "/mock-sprites/eevee.png" },
    types: [{ type: { name: "normal" } }],
    height: 3,
    weight: 65,
    base_experience: 65,
  },
  mewtwo: {
    id: 150,
    name: "mewtwo",
    sprites: { front_default: "/mock-sprites/mewtwo.png" },
    types: [{ type: { name: "psychic" } }],
    height: 20,
    weight: 1220,
    base_experience: 306,
  },
  pichu: {
    id: 172,
    name: "pichu",
    sprites: { front_default: "/mock-sprites/pichu.png" },
    types: [{ type: { name: "electric" } }],
    height: 3,
    weight: 20,
    base_experience: 41,
  },
  charizard: {
    id: 6,
    name: "charizard",
    sprites: { front_default: "/mock-sprites/charizard.png" },
    types: [{ type: { name: "fire" } }, { type: { name: "flying" } }],
    height: 17,
    weight: 905,
    base_experience: 240,
  },
  ivysaur: {
    id: 2,
    name: "ivysaur",
    sprites: { front_default: "/mock-sprites/ivysaur.png" },
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
    height: 10,
    weight: 130,
    base_experience: 142,
  },
  venusaur: {
    id: 3,
    name: "venusaur",
    sprites: { front_default: "/mock-sprites/venusaur.png" },
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
    height: 20,
    weight: 1000,
    base_experience: 236,
  },
  charmeleon: {
    id: 5,
    name: "charmeleon",
    sprites: { front_default: "/mock-sprites/charmeleon.png" },
    types: [{ type: { name: "fire" } }],
    height: 11,
    weight: 190,
    base_experience: 142,
  },
  wartortle: {
    id: 8,
    name: "wartortle",
    sprites: { front_default: "/mock-sprites/wartortle.png" },
    types: [{ type: { name: "water" } }],
    height: 10,
    weight: 225,
    base_experience: 142,
  },
  blastoise: {
    id: 9,
    name: "blastoise",
    sprites: { front_default: "/mock-sprites/blastoise.png" },
    types: [{ type: { name: "water" } }],
    height: 16,
    weight: 855,
    base_experience: 239,
  },
  caterpie: {
    id: 10,
    name: "caterpie",
    sprites: { front_default: "/mock-sprites/caterpie.png" },
    types: [{ type: { name: "bug" } }],
    height: 3,
    weight: 29,
    base_experience: 39,
  },
  metapod: {
    id: 11,
    name: "metapod",
    sprites: { front_default: "/mock-sprites/metapod.png" },
    types: [{ type: { name: "bug" } }],
    height: 7,
    weight: 99,
    base_experience: 72,
  },
  butterfree: {
    id: 12,
    name: "butterfree",
    sprites: { front_default: "/mock-sprites/butterfree.png" },
    types: [{ type: { name: "bug" } }, { type: { name: "flying" } }],
    height: 11,
    weight: 320,
    base_experience: 178,
  },
};

/**
 * Creates a mock async load function that simulates API behavior.
 * Uses setTimeout to simulate network latency and respects abort signals.
 *
 * @param data - Array of Pokemon to filter (defaults to MOCK_POKEMON)
 * @param delay - Simulated network delay in milliseconds (defaults to 100ms)
 * @returns Async load function compatible with ComboBox async prop
 */
export const createMockAsyncLoad = (
  data: Pokemon[] = MOCK_POKEMON,
  delay: number = 100
) => {
  return async (
    filterText: string,
    signal: AbortSignal
  ): Promise<Pokemon[]> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Check if request was aborted
    if (signal.aborted) {
      throw new Error("AbortError");
    }

    // Filter data based on search text (case-insensitive)
    return data.filter((p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase())
    );
  };
};

/**
 * Reusable Pokemon option component that displays detailed information.
 * Fetches full Pokemon details on mount and displays sprite, name, types, and stats.
 */
export const PokemonOption = ({ pokemon }: { pokemon: Pokemon }) => {
  const [details, setDetails] = useState<PokemonDetails | null>(null);

  // Fetch detailed Pokemon data
  useEffect(() => {
    const fetchDetails = async () => {
      // Skip fetch for mock or custom URLs
      if (!pokemon.url.startsWith("http")) {
        // Use mock details if available
        const mockDetails = MOCK_POKEMON_DETAILS[pokemon.name];
        if (mockDetails) {
          setDetails(mockDetails);
        }
        return;
      }

      try {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error(`Failed to fetch details for ${pokemon.name}:`, error);
      }
    };
    fetchDetails();
  }, [pokemon.url, pokemon.name]);

  if (!details) {
    return (
      <Stack direction="row" gap="300" alignItems="center" padding="200">
        <Text fontSize="350" textTransform="capitalize">
          {pokemon.name}
        </Text>
      </Stack>
    );
  }

  // Get type colors for badges
  const getTypeColor = (typeName: string) => {
    const typeColors: Record<string, string> = {
      normal: "gray",
      fire: "red",
      water: "blue",
      electric: "yellow",
      grass: "green",
      ice: "cyan",
      fighting: "orange",
      poison: "purple",
      ground: "amber",
      flying: "sky",
      psychic: "pink",
      bug: "lime",
      rock: "bronze",
      ghost: "violet",
      dragon: "indigo",
      dark: "blackAlpha",
      steel: "gray",
      fairy: "pink",
    };
    return typeColors[typeName] || "gray";
  };

  return (
    <Stack
      direction="row"
      gap="300"
      alignItems="center"
      width="100%"
      flexWrap="wrap"
    >
      {/* Pokemon Sprite - Fixed size container ensures consistent dimensions */}
      {details.sprites.front_default && (
        <Box
          width="1100"
          height="1100"
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            width="100%"
            height="100%"
            objectFit="contain"
            src={details.sprites.front_default}
            alt={details.name}
          />
        </Box>
      )}

      {/* Pokemon Info */}
      <Stack direction="column" gap="200" flex="1" minWidth={0}>
        {/* Name and ID */}
        <Stack direction="row" gap="100" alignItems="center">
          <Text fontSize="400" fontWeight="600" textTransform="capitalize">
            {details.name}
          </Text>
          <Text fontSize="350" color="fg.muted">
            #{details.id.toString().padStart(3, "0")}
          </Text>
        </Stack>

        {/* Types */}
        <Stack direction="row" gap="50" flexWrap="wrap">
          {details.types.map((typeInfo) => (
            <Badge
              key={typeInfo.type.name}
              colorPalette={getTypeColor(typeInfo.type.name)}
              size="2xs"
            >
              {typeInfo.type.name}
            </Badge>
          ))}
        </Stack>
      </Stack>

      {/* Stats */}
      <Stack
        direction="column"
        justifySelf="flex-end"
        alignItems="flex-start"
        gap="0"
        mt="auto"
      >
        <Text fontSize="300" lineHeight="400" color="fg.muted">
          H: {(details.height / 10).toFixed(1)}m
        </Text>
        <Text fontSize="300" lineHeight="400" color="fg.muted">
          W: {(details.weight / 10).toFixed(1)}kg
        </Text>
      </Stack>
    </Stack>
  );
};
