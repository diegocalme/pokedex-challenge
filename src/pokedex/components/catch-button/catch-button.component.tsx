import { memo, useMemo } from "react";
import { Crosshair, X } from "lucide-react";
import { CatchStatus } from "@pokedex/enums/catch-status.enum";
import type { CatchButtonProps } from "@pokedex/types/pokedex.types";

const CatchButton = memo(function CatchButton({
  status,
  onCatch,
  onRelease,
}: CatchButtonProps) {
  const isCaught = useMemo(
    () => status === CatchStatus.Caught,
    [status]
  );

  return (
    <button
      type="button"
      onClick={isCaught ? onRelease : onCatch}
      className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-[20px] text-white transition-colors ${
        isCaught
          ? "bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
          : "bg-red-500 hover:bg-red-600"
      }`}
    >
      {isCaught ? (
        <>
          <X className="h-5 w-5" />
          <span className="font-heading text-base font-bold">Release</span>
        </>
      ) : (
        <>
          <Crosshair className="h-5 w-5" />
          <span className="font-heading text-base font-bold">
            Catch Pokémon!
          </span>
        </>
      )}
    </button>
  );
});

export { CatchButton };
