import { memo, useCallback, useMemo } from "react";
import type { PokedexCollectionListProps } from "@pokedex/types/pokedex.types";
import { PokedexCollectionCard } from "@pokedex/components/pokedex-collection-card/pokedex-collection-card.component";
import { PokedexEmptyState } from "@pokedex/components/pokedex-empty-state/pokedex-empty-state.component";

const PokedexCollectionList = memo(function PokedexCollectionList({
  pokemon,
  onRelease,
}: PokedexCollectionListProps) {
  const totalLabel = useMemo(
    () => `${pokemon.length} total`,
    [pokemon.length]
  );

  const handleRelease = useCallback(
    (pokemonId: number) => () => {
      onRelease(pokemonId);
    },
    [onRelease]
  );

  return (
    <div className="flex flex-col gap-5 px-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-zinc-900">
          Recently Caught
        </h2>
        <span className="rounded-full bg-red-50 px-2.5 py-1 font-body text-xs font-semibold text-red-500">
          {totalLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        {pokemon.map((p) => (
          <PokedexCollectionCard
            key={p.id}
            pokemon={p}
            onRelease={handleRelease(p.id)}
          />
        ))}
        <PokedexEmptyState />
      </div>
    </div>
  );
});

export { PokedexCollectionList };
