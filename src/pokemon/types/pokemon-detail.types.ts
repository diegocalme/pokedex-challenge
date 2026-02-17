import type { PokemonDetailStatus } from "@pokemon/enums/pokemon-detail-status.enum";

interface PokemonSprites {
  front_default?: string;
  other?: {
    "official-artwork"?: {
      front_default?: string;
    };
  };
}

interface PokemonDetailDisplay {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

interface PokemonDetailStoreState {
  currentDetail: PokemonDetailDisplay | null;
  status: PokemonDetailStatus;
}

interface PokemonDetailStoreActions {
  setCurrentDetail: (detail: PokemonDetailDisplay) => void;
  setStatus: (status: PokemonDetailStatus) => void;
  clearCurrentDetail: () => void;
}

type PokemonDetailStore = PokemonDetailStoreState & PokemonDetailStoreActions;

interface UsePokemonDetailReturn {
  detail: PokemonDetailDisplay | null;
  status: PokemonDetailStatus;
  retry: () => void;
}

interface PokemonDetailHeaderProps {
  name: string;
  id: number;
  onBack: () => void;
}

interface PokemonDetailImageProps {
  imageUrl: string;
  altText: string;
}

interface PokemonDetailTypesProps {
  types: string[];
}

interface PokemonDetailCatchSlotProps {
  pokemon: PokemonDetailDisplay;
}

interface PokemonDetailStatusIndicatorProps {
  status: PokemonDetailStatus;
  onRetry: () => void;
}

interface PokemonDetailPageProps {
  idOrName: string;
}

export type {
  PokemonSprites,
  PokemonDetailDisplay,
  PokemonDetailStoreState,
  PokemonDetailStoreActions,
  PokemonDetailStore,
  UsePokemonDetailReturn,
  PokemonDetailHeaderProps,
  PokemonDetailImageProps,
  PokemonDetailTypesProps,
  PokemonDetailCatchSlotProps,
  PokemonDetailStatusIndicatorProps,
  PokemonDetailPageProps,
};
