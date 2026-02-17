import type { CaughtPokemon } from "@pokedex/types/pokedex.types";

const POKEDEX_STORAGE_KEY = "pokedex-store";
const POKEDEX_SCHEMA_VERSION = 1;

interface PersistedPokedexState {
  collection: CaughtPokemon[];
}

export { POKEDEX_STORAGE_KEY, POKEDEX_SCHEMA_VERSION };
export type { PersistedPokedexState };
