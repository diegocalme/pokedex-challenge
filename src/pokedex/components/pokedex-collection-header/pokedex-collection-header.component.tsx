import { memo, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import type { PokedexCollectionHeaderProps } from "@pokedex/types/pokedex.types";

const PokedexCollectionHeader = memo(function PokedexCollectionHeader({
  count,
  total,
}: PokedexCollectionHeaderProps) {
  const progressPercent = useMemo(() => {
    if (total === 0) return 0;
    return Math.min((count / total) * 100, 100);
  }, [count, total]);

  return (
    <div className="flex flex-col gap-5 px-5 pt-14">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[28px] font-extrabold text-zinc-900">
          My Collection
        </h1>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-zinc-100"
          aria-label="Sort collection"
        >
          <ArrowUpDown className="h-5 w-5 text-zinc-400" />
        </button>
      </div>

      <div className="flex flex-col gap-3.5 rounded-[20px] bg-red-500 p-5">
        <div className="flex items-center justify-between">
          <span className="font-body text-sm font-semibold text-white">
            Pokémon Caught
          </span>
          <span className="font-heading text-xl font-extrabold text-white">
            {count} / {total}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={total}
          className="h-2 w-full overflow-hidden rounded-full bg-white/25"
        >
          <div
            data-testid="progress-fill"
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
});

export { PokedexCollectionHeader };
