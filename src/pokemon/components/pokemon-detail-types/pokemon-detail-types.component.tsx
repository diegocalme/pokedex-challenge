import { memo } from "react";
import type { PokemonDetailTypesProps } from "@pokemon/types/pokemon-detail.types";
import { PokemonTypeBadge } from "@pokemon/components/pokemon-type-badge/pokemon-type-badge.component";

const PokemonDetailTypes = memo(function PokemonDetailTypes({
  types,
}: PokemonDetailTypesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((typeName) => (
        <PokemonTypeBadge key={typeName} typeName={typeName} />
      ))}
    </div>
  );
});

export { PokemonDetailTypes };
