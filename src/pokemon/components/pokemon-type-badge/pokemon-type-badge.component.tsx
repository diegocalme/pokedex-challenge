import { memo } from "react";
import type { PokemonTypeBadgeProps } from "@pokemon/types/pokemon-list.types";
import { getTypeColorClass } from "@pokemon/utils/pokemon-type-color.util";

const PokemonTypeBadge = memo(function PokemonTypeBadge({
  typeName,
}: PokemonTypeBadgeProps) {
  const colorClass = getTypeColorClass(typeName);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-body text-[11px] font-semibold leading-none tracking-wide text-white ${colorClass}`}
    >
      {typeName}
    </span>
  );
});

export { PokemonTypeBadge };
