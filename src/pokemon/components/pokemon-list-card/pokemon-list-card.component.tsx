import { memo, useMemo } from "react";
import Image from "next/image";
import type { PokemonListCardProps } from "@pokemon/types/pokemon-list.types";
import { PokemonTypeBadge } from "@pokemon/components/pokemon-type-badge/pokemon-type-badge.component";

function formatPokemonNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

const PokemonListCard = memo(function PokemonListCard({
  pokemon,
  onClick,
}: PokemonListCardProps) {
  const formattedNumber = useMemo(
    () => formatPokemonNumber(pokemon.id),
    [pokemon.id]
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer flex-col overflow-hidden rounded-[20px] bg-zinc-100 text-left transition-shadow hover:shadow-md"
    >
      <div className="relative flex h-[120px] items-center justify-center rounded-t-[20px] bg-zinc-100">
        <Image
          src={pokemon.spriteUrl}
          alt={pokemon.name}
          width={96}
          height={96}
          className="object-contain"
          unoptimized
        />
        <span className="absolute right-2 top-2 font-body text-[11px] font-semibold text-zinc-400">
          {formattedNumber}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 px-3.5 pb-3 pt-2.5">
        <span className="font-heading text-[15px] font-bold capitalize text-zinc-900">
          {pokemon.name}
        </span>
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((typeName) => (
            <PokemonTypeBadge key={typeName} typeName={typeName} />
          ))}
        </div>
      </div>
    </button>
  );
});

export { PokemonListCard };
