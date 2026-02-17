"use client";

import type { UseQueryOptions } from "@tanstack/react-query";
import { apiV2PokemonRetrieve } from "@pokemon/api/generated/sdk.gen";
import type { PokemonDetail } from "@pokemon/api/generated/types.gen";

function pokemonDetailQueryOptions(
  id: number
): UseQueryOptions<PokemonDetail> {
  return {
    queryKey: ["pokemonDetail", id],
    queryFn: async () => {
      const response = await apiV2PokemonRetrieve({
        path: { id: String(id) },
      });
      return response.data as PokemonDetail;
    },
    staleTime: 10 * 60 * 1000,
  };
}

export { pokemonDetailQueryOptions };
