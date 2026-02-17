"use client";

import { useQuery } from "@tanstack/react-query";
import { apiV2PokemonList } from "@pokemon/api/generated/sdk.gen";
import type { PaginatedPokemonSummaryList } from "@pokemon/api/generated/types.gen";

const POKEMON_LIST_LIMIT = 20;

interface UsePokemonListQueryOptions {
  offset: number;
  limit?: number;
  enabled?: boolean;
}

function usePokemonListQuery({
  offset,
  limit = POKEMON_LIST_LIMIT,
  enabled = true,
}: UsePokemonListQueryOptions) {
  return useQuery<PaginatedPokemonSummaryList>({
    queryKey: ["pokemonList", offset, limit],
    queryFn: async () => {
      const response = await apiV2PokemonList({
        query: { offset, limit },
      });
      return response.data as PaginatedPokemonSummaryList;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export { usePokemonListQuery, POKEMON_LIST_LIMIT };
export type { UsePokemonListQueryOptions };
