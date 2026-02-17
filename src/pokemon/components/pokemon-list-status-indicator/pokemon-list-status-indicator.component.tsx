import { memo } from "react";
import { PokemonListStatus } from "@pokemon/enums/pokemon-list-status.enum";
import type { PokemonListStatusIndicatorProps } from "@pokemon/types/pokemon-list.types";

const SKELETON_COUNT = 8;

const PokemonListStatusIndicator = memo(
  function PokemonListStatusIndicator({
    status,
    onRetry,
  }: PokemonListStatusIndicatorProps) {
    if (status === PokemonListStatus.Loading) {
      return (
        <div className="grid grid-cols-2 gap-[14px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-[20px] bg-zinc-100"
            >
              <div className="h-[120px] animate-pulse bg-zinc-200" />
              <div className="flex flex-col gap-2 px-3.5 pb-3 pt-2.5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (status === PokemonListStatus.Error) {
      return (
        <div className="flex flex-col items-center gap-4 py-12">
          <p className="font-body text-sm text-zinc-500">
            Failed to load Pokémon. Please try again.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-red-500 px-5 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      );
    }

    return null;
  }
);

export { PokemonListStatusIndicator };
