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
 * Reusable Pokemon option component that displays detailed information.
 * Fetches full Pokemon details on mount and displays sprite, name, types, and stats.
 */
export const PokemonOption = ({ pokemon }: { pokemon: Pokemon }) => {
  const [details, setDetails] = useState<PokemonDetails | null>(null);

  // Fetch detailed Pokemon data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error(`Failed to fetch details for ${pokemon.name}:`, error);
      }
    };
    fetchDetails();
  }, [pokemon.url]);

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
