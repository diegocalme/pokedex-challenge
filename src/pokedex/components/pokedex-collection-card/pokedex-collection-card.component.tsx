import { memo, useMemo } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { PokemonTypeBadge } from "@pokemon/components/pokemon-type-badge/pokemon-type-badge.component";
import type { PokedexCollectionCardProps } from "@pokedex/types/pokedex.types";

const PokedexCollectionCard = memo(function PokedexCollectionCard({
  pokemon,
  onRelease,
}: PokedexCollectionCardProps) {
  const formattedNumber = useMemo(
    () => `#${String(pokemon.id).padStart(3, "0")}`,
    [pokemon.id]
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[20px] bg-zinc-100">
      <div className="relative flex h-[120px] items-center justify-center">
        <Image
          src={pokemon.imageUrl}
          alt={pokemon.name}
          width={96}
          height={96}
          className="object-contain"
          unoptimized
        />
        <span className="absolute right-2 top-2 font-body text-[11px] font-semibold text-zinc-400">
          {formattedNumber}
        </span>
        <button
          type="button"
          aria-label={`Release ${pokemon.name}`}
          onClick={onRelease}
          className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200/80 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <X className="h-3.5 w-3.5 text-zinc-500" />
        </button>
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
    </div>
  );
});

export { PokedexCollectionCard };
