import type { CatchStatus } from "@pokedex/enums/catch-status.enum";

interface CaughtPokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  caughtAt: string;
}

interface PokedexStoreState {
  collection: CaughtPokemon[];
  hydrated: boolean;
}

interface PokedexStoreActions {
  catchPokemon: (pokemon: Omit<CaughtPokemon, "caughtAt">) => void;
  releasePokemon: (pokemonId: number) => void;
  setCollection: (collection: CaughtPokemon[]) => void;
  setHydrated: (hydrated: boolean) => void;
  isCaught: (pokemonId: number) => boolean;
  getCatchStatus: (pokemonId: number) => CatchStatus;
  collectionCount: () => number;
}

type PokedexStore = PokedexStoreState & PokedexStoreActions;

interface UsePokedexReturn {
  collection: CaughtPokemon[];
  count: number;
  hydrated: boolean;
  catchPokemon: (pokemon: Omit<CaughtPokemon, "caughtAt">) => void;
  releasePokemon: (pokemonId: number) => void;
  isCaught: (pokemonId: number) => boolean;
  getCatchStatus: (pokemonId: number) => CatchStatus;
}

interface PokedexCollectionHeaderProps {
  count: number;
  total: number;
}

interface PokedexCollectionListProps {
  pokemon: CaughtPokemon[];
  onRelease: (pokemonId: number) => void;
}

interface PokedexCollectionCardProps {
  pokemon: CaughtPokemon;
  onRelease: () => void;
}

interface CatchButtonProps {
  status: CatchStatus;
  onCatch: () => void;
  onRelease: () => void;
}

export type {
  CaughtPokemon,
  PokedexStoreState,
  PokedexStoreActions,
  PokedexStore,
  UsePokedexReturn,
  PokedexCollectionHeaderProps,
  PokedexCollectionListProps,
  PokedexCollectionCardProps,
  CatchButtonProps,
};
