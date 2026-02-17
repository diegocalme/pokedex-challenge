"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { PokemonListStatus } from "@pokemon/enums/pokemon-list-status.enum";
import type {
  PokemonListItem,
  UsePokemonListReturn,
} from "@pokemon/types/pokemon-list.types";
import { extractPokemonId, buildSpriteUrl } from "@pokemon/utils/pokemon-id.util";
import { usePokemonListStore } from "@pokemon/store/pokemon-list.store";
import {
  usePokemonListQuery,
  POKEMON_LIST_LIMIT,
} from "@pokemon/api/use-pokemon-list-query.hook";
import { pokemonDetailQueryOptions } from "@pokemon/api/use-pokemon-detail-query.hook";
import { useDebounce } from "@shared/utils/use-debounce.hook";

function usePokemonList(): UsePokemonListReturn {
  const store = usePokemonListStore();

  useEffect(() => {
    usePokemonListStore.persist.rehydrate();
  }, []);

  const listQuery = usePokemonListQuery({ offset: store.currentOffset });

  const pokemonIds = useMemo(() => {
    if (!listQuery.data?.results) return [];
    return listQuery.data.results.map((entry) => extractPokemonId(entry.url));
  }, [listQuery.data?.results]);

  const detailQueries = useQueries({
    queries: pokemonIds.map((id) => pokemonDetailQueryOptions(id)),
  });

  const allDetailsLoaded = useMemo(
    () =>
      pokemonIds.length > 0 &&
      detailQueries.length === pokemonIds.length &&
      detailQueries.every((q) => q.isSuccess),
    [pokemonIds.length, detailQueries]
  );

  const anyDetailError = useMemo(
    () => detailQueries.some((q) => q.isError),
    [detailQueries]
  );

  useEffect(() => {
    if (listQuery.isLoading || (pokemonIds.length > 0 && !allDetailsLoaded && !anyDetailError)) {
      const nextStatus = store.currentOffset > 0
        ? PokemonListStatus.LoadingMore
        : PokemonListStatus.Loading;
      store.setStatus(nextStatus);
      return;
    }

    if (listQuery.isError || anyDetailError) {
      store.setStatus(PokemonListStatus.Error);
      return;
    }

    if (allDetailsLoaded) {
      const items: PokemonListItem[] = detailQueries.map((q) => {
        const detail = q.data;
        return {
          id: detail!.id,
          name: detail!.name,
          spriteUrl: detail!.sprites.front_default ?? buildSpriteUrl(detail!.id),
          types: detail!.types.map((t) => t.type.name),
        };
      });

      if (store.currentOffset === 0) {
        store.setItems(items);
      } else {
        store.appendItems(items);
      }
      store.setTotalCount(listQuery.data?.count ?? 0);
      store.setStatus(PokemonListStatus.Success);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDetailsLoaded, anyDetailError, listQuery.isLoading, listQuery.isError]);

  const debouncedSearchQuery = useDebounce(store.searchQuery, 300);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchQuery) return store.items;
    const query = debouncedSearchQuery.toLowerCase();
    return store.items.filter((item) => item.name.toLowerCase().includes(query));
  }, [store.items, debouncedSearchQuery]);

  const hasNextPage = useMemo(
    () => store.currentOffset + POKEMON_LIST_LIMIT < store.totalCount,
    [store.currentOffset, store.totalCount]
  );

  const isFetchingNextPage = useMemo(
    () => store.status === PokemonListStatus.LoadingMore,
    [store.status]
  );

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      store.setCurrentOffset(store.currentOffset + POKEMON_LIST_LIMIT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextPage, isFetchingNextPage, store.currentOffset]);

  const retry = useCallback(() => {
    listQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listQuery.refetch]);

  return {
    items: filteredItems,
    status: store.status,
    searchQuery: store.searchQuery,
    hasNextPage,
    isFetchingNextPage,
    setSearchQuery: store.setSearchQuery,
    fetchNextPage,
    retry,
  };
}

export { usePokemonList };
