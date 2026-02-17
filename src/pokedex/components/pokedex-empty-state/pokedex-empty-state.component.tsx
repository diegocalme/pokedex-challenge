import { memo } from "react";
import { CircleDashed } from "lucide-react";

const PokedexEmptyState = memo(function PokedexEmptyState() {
  return (
    <div
      data-testid="empty-slot"
      className="flex h-[185px] flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-zinc-200 bg-zinc-100"
    >
      <CircleDashed className="h-8 w-8 text-zinc-300" />
      <span className="font-body text-[13px] font-medium text-zinc-400">
        Catch more!
      </span>
    </div>
  );
});

export { PokedexEmptyState };
