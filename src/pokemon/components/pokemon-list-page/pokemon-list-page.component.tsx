"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { PokemonListStatus } from "@pokemon/enums/pokemon-list-status.enum";
import { usePokemonList } from "@pokemon/hooks/use-pokemon-list.hook";
import { PokemonSearchBar } from "@pokemon/components/pokemon-search-bar/pokemon-search-bar.component";
import { PokemonList } from "@pokemon/components/pokemon-list/pokemon-list.component";
import { PokemonListStatusIndicator } from "@pokemon/components/pokemon-list-status-indicator/pokemon-list-status-indicator.component";

const LOADING_MORE_SKELETON_COUNT = 2;

function PokemonListPage() {
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const {
    items,
    status,
    searchQuery,
    hasNextPage,
    isFetchingNextPage,
    setSearchQuery,
    fetchNextPage,
    retry,
  } = usePokemonList();

  const handleItemClick = useCallback(
    (pokemonId: number) => {
      router.push(`/pokemon/${pokemonId}`);
    },
    [router]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isContentVisible =
    status === PokemonListStatus.Success ||
    status === PokemonListStatus.LoadingMore ||
    status === PokemonListStatus.Idle;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-zinc-900">
          Pokédex
        </h1>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200"
          aria-label="Filters"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      <PokemonSearchBar value={searchQuery} onChange={setSearchQuery} />

      <PokemonListStatusIndicator status={status} onRetry={retry} />

      {isContentVisible && (
        <>
          <PokemonList items={items} onItemClick={handleItemClick} />

          {isFetchingNextPage && (
            <div className="grid grid-cols-2 gap-[14px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: LOADING_MORE_SKELETON_COUNT }, (_, i) => (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-[20px] bg-zinc-100"
                >
                  <div className="h-[120px] animate-pulse bg-zinc-200" />
                  <div className="flex flex-col gap-2 px-3.5 pb-3 pt-2.5">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div ref={sentinelRef} className="h-1" aria-hidden="true" />
        </>
      )}
    </div>
  );
}

export { PokemonListPage };
