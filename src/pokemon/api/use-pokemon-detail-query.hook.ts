"use client";

import type { UseQueryOptions } from "@tanstack/react-query";
import { apiV2PokemonRetrieve } from "@pokemon/api/generated/sdk.gen";
import type { PokemonDetail } from "@pokemon/api/generated/types.gen";

const VALID_ID_OR_NAME_PATTERN = /^[a-zA-Z0-9-]+$/;

class PokemonNotFoundError extends Error {
  constructor(idOrName: string | number) {
    super(`Pokemon not found: ${idOrName}`);
    this.name = "PokemonNotFoundError";
  }
}

function isValidIdOrName(value: string | number): boolean {
  const str = String(value).trim();
  return str.length > 0 && VALID_ID_OR_NAME_PATTERN.test(str);
}

function normalizeQueryKey(idOrName: string | number): string | number {
  const str = String(idOrName).trim();
  const asNumber = Number(str);
  return Number.isInteger(asNumber) && asNumber > 0 ? asNumber : str.toLowerCase();
}

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

function pokemonDetailByIdOrNameQueryOptions(
  idOrName: string | number
): UseQueryOptions<PokemonDetail> {
  const valid = isValidIdOrName(idOrName);
  const key = valid ? normalizeQueryKey(idOrName) : idOrName;

  return {
    queryKey: ["pokemonDetail", key],
    queryFn: async () => {
      const response = await apiV2PokemonRetrieve({
        path: { id: String(idOrName).trim().toLowerCase() },
      });

      if (!response.data) {
        throw new PokemonNotFoundError(idOrName);
      }

      return response.data as PokemonDetail;
    },
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof PokemonNotFoundError) return false;
      if (
        error instanceof Error &&
        error.message.includes("404")
      ) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: valid,
  };
}

export {
  pokemonDetailQueryOptions,
  pokemonDetailByIdOrNameQueryOptions,
  PokemonNotFoundError,
};
