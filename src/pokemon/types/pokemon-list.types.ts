import type { PokemonListStatus } from "@pokemon/enums/pokemon-list-status.enum";

interface PokemonListItem {
  id: number;
  name: string;
  spriteUrl: string;
  types: string[];
}

interface PokemonListStoreState {
  items: PokemonListItem[];
  status: PokemonListStatus;
  searchQuery: string;
  currentOffset: number;
  totalCount: number;
}

interface PokemonListStoreActions {
  setItems: (items: PokemonListItem[]) => void;
  appendItems: (items: PokemonListItem[]) => void;
  setStatus: (status: PokemonListStatus) => void;
  setSearchQuery: (query: string) => void;
  setCurrentOffset: (offset: number) => void;
  setTotalCount: (count: number) => void;
  reset: () => void;
}

type PokemonListStore = PokemonListStoreState & PokemonListStoreActions;

interface UsePokemonListReturn {
  items: PokemonListItem[];
  status: PokemonListStatus;
  searchQuery: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  setSearchQuery: (query: string) => void;
  fetchNextPage: () => void;
  retry: () => void;
}

interface PokemonSearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

interface PokemonListProps {
  items: PokemonListItem[];
  onItemClick: (pokemonId: number) => void;
}

interface PokemonListCardProps {
  pokemon: PokemonListItem;
  onClick: () => void;
}

interface PokemonListStatusIndicatorProps {
  status: PokemonListStatus;
  onRetry: () => void;
}

interface PokemonTypeBadgeProps {
  typeName: string;
}

export type {
  PokemonListItem,
  PokemonListStoreState,
  PokemonListStoreActions,
  PokemonListStore,
  UsePokemonListReturn,
  PokemonSearchBarProps,
  PokemonListProps,
  PokemonListCardProps,
  PokemonListStatusIndicatorProps,
  PokemonTypeBadgeProps,
};
