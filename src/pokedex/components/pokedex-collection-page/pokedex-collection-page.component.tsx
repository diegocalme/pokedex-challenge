"use client";

import { useCallback, useMemo } from "react";
import { usePokedex } from "@pokedex/hooks/use-pokedex.hook";
import { usePokemonListStore } from "@pokemon/store/pokemon-list.store";
import { PokedexCollectionHeader } from "@pokedex/components/pokedex-collection-header/pokedex-collection-header.component";
import { PokedexCollectionList } from "@pokedex/components/pokedex-collection-list/pokedex-collection-list.component";

const KANTO_DEX_COUNT = 151;

function PokedexCollectionPage() {
  const { collection, count, hydrated, releasePokemon } = usePokedex();
  const totalCount = usePokemonListStore((s) => s.totalCount);

  const total = useMemo(
    () => (totalCount > 0 ? totalCount : KANTO_DEX_COUNT),
    [totalCount]
  );

  const sortedCollection = useMemo(
    () =>
      [...collection].sort(
        (a, b) => new Date(b.caughtAt).getTime() - new Date(a.caughtAt).getTime()
      ),
    [collection]
  );

  const handleRelease = useCallback(
    (pokemonId: number) => {
      releasePokemon(pokemonId);
    },
    [releasePokemon]
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-body text-sm text-zinc-400">
          Loading collection...
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-5 bg-white pb-6">
      <PokedexCollectionHeader count={count} total={total} />
      {count === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-20">
          <span className="font-body text-sm text-zinc-400">
            No Pokémon caught yet
          </span>
          <span className="font-body text-xs text-zinc-300">
            Go explore and catch some Pokémon!
          </span>
        </div>
      ) : (
        <PokedexCollectionList
          pokemon={sortedCollection}
          onRelease={handleRelease}
        />
      )}
    </div>
  );
}

export { PokedexCollectionPage };
