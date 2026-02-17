import type { PokemonListItem } from "@pokemon/types/pokemon-list.types";

const POKEMON_LIST_STORAGE_KEY = "pokemon-list-store";

interface PersistedPokemonListState {
  items: PokemonListItem[];
  currentOffset: number;
  totalCount: number;
}

export { POKEMON_LIST_STORAGE_KEY };
export type { PersistedPokemonListState };
