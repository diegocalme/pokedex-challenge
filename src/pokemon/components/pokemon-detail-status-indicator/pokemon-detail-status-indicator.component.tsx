import { memo } from "react";
import Link from "next/link";
import { PokemonDetailStatus } from "@pokemon/enums/pokemon-detail-status.enum";
import type { PokemonDetailStatusIndicatorProps } from "@pokemon/types/pokemon-detail.types";

const PokemonDetailStatusIndicator = memo(
  function PokemonDetailStatusIndicator({
    status,
    onRetry,
  }: PokemonDetailStatusIndicatorProps) {
    if (status === PokemonDetailStatus.Loading) {
      return (
        <div
          data-testid="detail-loading-skeleton"
          className="flex flex-1 flex-col"
        >
          <div className="flex items-center justify-between px-5 pt-12 pb-2">
            <div className="h-10 w-10 animate-pulse rounded-[14px] bg-zinc-200" />
            <div className="h-10 w-10 animate-pulse rounded-[14px] bg-zinc-200" />
          </div>
          <div className="h-[200px] w-full animate-pulse bg-zinc-100" />
          <div className="flex flex-col gap-5 rounded-t-[28px] px-6 pt-5">
            <div className="flex items-center justify-between">
              <div className="h-8 w-40 animate-pulse rounded bg-zinc-200" />
              <div className="h-6 w-16 animate-pulse rounded bg-zinc-200" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-200" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-200" />
            </div>
            <div className="h-[52px] w-full animate-pulse rounded-[20px] bg-zinc-200" />
          </div>
        </div>
      );
    }

    if (status === PokemonDetailStatus.Error) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <p className="font-body text-sm text-zinc-500">
            Failed to load Pokémon data.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-red-500 px-5 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (status === PokemonDetailStatus.NotFound) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <p className="font-body text-lg font-semibold text-zinc-700">
            Pokémon not found
          </p>
          <p className="font-body text-sm text-zinc-500">
            The Pokémon you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-red-500 px-5 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            Back to Pokédex
          </Link>
        </div>
      );
    }

    return null;
  }
);

export { PokemonDetailStatusIndicator };
