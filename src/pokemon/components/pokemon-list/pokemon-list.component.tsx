import { memo, useCallback } from "react";
import type { PokemonListProps } from "@pokemon/types/pokemon-list.types";
import { PokemonListCard } from "@pokemon/components/pokemon-list-card/pokemon-list-card.component";

const PokemonList = memo(function PokemonList({
  items,
  onItemClick,
}: PokemonListProps) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center font-body text-sm text-zinc-400">
        No Pokémon found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-[14px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((pokemon) => (
        <PokemonListCardWrapper
          key={pokemon.id}
          pokemon={pokemon}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
});

interface PokemonListCardWrapperProps {
  pokemon: PokemonListProps["items"][number];
  onItemClick: PokemonListProps["onItemClick"];
}

const PokemonListCardWrapper = memo(function PokemonListCardWrapper({
  pokemon,
  onItemClick,
}: PokemonListCardWrapperProps) {
  const handleClick = useCallback(() => {
    onItemClick(pokemon.id);
  }, [onItemClick, pokemon.id]);

  return <PokemonListCard pokemon={pokemon} onClick={handleClick} />;
});

export { PokemonList };
