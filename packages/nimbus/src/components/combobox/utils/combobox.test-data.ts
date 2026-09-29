/** most basic option */
export type SimpleOption = { name: string; id: number };

export const simpleOptions: SimpleOption[] = [
  { id: 1, name: "Koala" },
  { id: 2, name: "Kangaroo" },
  { id: 3, name: "Platypus" },
  { id: 4, name: "Bald Eagle with a very long name hooray" },
  { id: 5, name: "Bison" },
  { id: 6, name: "Skunk" },
];

// ============================================================
// ASYNC LOADING - Pokemon API types, mock data, and load function
// ============================================================
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
