"use client";

import { useCallback, useMemo } from "react";
import { CatchStatus } from "@pokedex/enums/catch-status.enum";
import { usePokedex } from "@pokedex/hooks/use-pokedex.hook";
import { CatchButton } from "@pokedex/components/catch-button/catch-button.component";
import type { PokemonDetailCatchSlotProps } from "@pokemon/types/pokemon-detail.types";

function PokemonDetailCatchSlot({ pokemon }: PokemonDetailCatchSlotProps) {
  const { collection, catchPokemon, releasePokemon } = usePokedex();

  const status = useMemo(
    () =>
      collection.some((p) => p.id === pokemon.id)
        ? CatchStatus.Caught
        : CatchStatus.Uncaught,
    [collection, pokemon.id]
  );

  const handleCatch = useCallback(() => {
    catchPokemon({
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.imageUrl,
      types: pokemon.types,
    });
  }, [catchPokemon, pokemon]);

  const handleRelease = useCallback(() => {
    releasePokemon(pokemon.id);
  }, [releasePokemon, pokemon.id]);

  const ariaLabel = useMemo(
    () =>
      status === CatchStatus.Caught
        ? `Release ${pokemon.name}`
        : `Catch ${pokemon.name}`,
    [status, pokemon.name]
  );

  return (
    <div className="pb-6 pt-2" aria-label={ariaLabel}>
      <CatchButton
        status={status}
        onCatch={handleCatch}
        onRelease={handleRelease}
      />
    </div>
  );
}

export { PokemonDetailCatchSlot };
