"use client";

import { Heart } from "lucide-react";

function PokemonDetailFavoriteSlot() {
  return (
    <button
      type="button"
      aria-label="Favorite"
      className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-zinc-100 text-zinc-400 transition-colors hover:bg-zinc-200"
    >
      <Heart className="h-5 w-5" />
    </button>
  );
}

export { PokemonDetailFavoriteSlot };
