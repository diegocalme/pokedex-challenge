"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PokemonDetailStatus } from "@pokemon/enums/pokemon-detail-status.enum";
import type {
  PokemonDetailDisplay,
  PokemonSprites,
  UsePokemonDetailReturn,
} from "@pokemon/types/pokemon-detail.types";
import { usePokemonDetailStore } from "@pokemon/store/pokemon-detail.store";
import {
  pokemonDetailByIdOrNameQueryOptions,
  PokemonNotFoundError,
} from "@pokemon/api/use-pokemon-detail-query.hook";
import { resolveOfficialArtworkUrl } from "@pokemon/utils/pokemon-sprite.util";

function usePokemonDetail(idOrName: string | number): UsePokemonDetailReturn {
  const store = usePokemonDetailStore();
  const query = useQuery(pokemonDetailByIdOrNameQueryOptions(idOrName));

  useEffect(() => {
    if (query.isLoading || query.isFetching) {
      store.setStatus(PokemonDetailStatus.Loading);
      return;
    }

    if (query.isError) {
      const isNotFound = query.error instanceof PokemonNotFoundError;
      store.setStatus(
        isNotFound ? PokemonDetailStatus.NotFound : PokemonDetailStatus.Error
      );
      return;
    }

    if (query.isSuccess && query.data) {
      const data = query.data;
      const sprites = data.sprites as unknown as PokemonSprites;
      const detail: PokemonDetailDisplay = {
        id: data.id,
        name: data.name,
        imageUrl: resolveOfficialArtworkUrl(sprites, data.id),
        types: data.types.map((t) => t.type.name),
      };
      store.setCurrentDetail(detail);
      store.setStatus(PokemonDetailStatus.Success);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isLoading, query.isFetching, query.isError, query.isSuccess, query.data]);

  const detail = useMemo(() => store.currentDetail, [store.currentDetail]);
  const status = useMemo(() => store.status, [store.status]);

  const retry = useCallback(() => {
    query.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.refetch]);

  return { detail, status, retry };
}

export { usePokemonDetail };
