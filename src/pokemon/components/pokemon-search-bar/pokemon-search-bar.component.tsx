import { memo, useCallback, type ChangeEvent } from "react";
import { Search } from "lucide-react";
import type { PokemonSearchBarProps } from "@pokemon/types/pokemon-list.types";

const PokemonSearchBar = memo(function PokemonSearchBar({
  value,
  onChange,
}: PokemonSearchBarProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div className="flex h-12 items-center gap-2.5 rounded-2xl bg-zinc-100 px-4">
      <Search className="h-5 w-5 shrink-0 text-zinc-400" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search Pokémon"
        className="w-full bg-transparent font-body text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
      />
    </div>
  );
});

export { PokemonSearchBar };
