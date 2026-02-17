import { memo } from "react";
import type { PokemonDetailImageProps } from "@pokemon/types/pokemon-detail.types";

const PokemonDetailImage = memo(function PokemonDetailImage({
  imageUrl,
  altText,
}: PokemonDetailImageProps) {
  return (
    <div className="relative h-[200px] w-full bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={altText}
        className="h-full w-full object-contain"
      />
    </div>
  );
});

export { PokemonDetailImage };
