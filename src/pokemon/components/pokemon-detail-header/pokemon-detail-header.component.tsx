import { memo } from "react";
import { ArrowLeft } from "lucide-react";
import type { PokemonDetailHeaderProps } from "@pokemon/types/pokemon-detail.types";

const PokemonDetailHeader = memo(function PokemonDetailHeader({
  name,
  onBack,
}: PokemonDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 pb-2 pt-12">
      <button
        type="button"
        onClick={onBack}
        aria-label={`Back from ${name}`}
        className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    </div>
  );
});

export { PokemonDetailHeader };
