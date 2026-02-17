import { PokemonType } from "@pokemon/enums/pokemon-type.enum";

const TYPE_COLOR_MAP: Record<PokemonType, string> = {
  [PokemonType.Normal]: "bg-zinc-400",
  [PokemonType.Fire]: "bg-orange-500",
  [PokemonType.Water]: "bg-blue-500",
  [PokemonType.Electric]: "bg-yellow-400",
  [PokemonType.Grass]: "bg-green-500",
  [PokemonType.Ice]: "bg-cyan-400",
  [PokemonType.Fighting]: "bg-red-700",
  [PokemonType.Poison]: "bg-purple-500",
  [PokemonType.Ground]: "bg-amber-600",
  [PokemonType.Flying]: "bg-indigo-400",
  [PokemonType.Psychic]: "bg-pink-500",
  [PokemonType.Bug]: "bg-lime-500",
  [PokemonType.Rock]: "bg-yellow-700",
  [PokemonType.Ghost]: "bg-violet-600",
  [PokemonType.Dragon]: "bg-indigo-700",
  [PokemonType.Dark]: "bg-zinc-700",
  [PokemonType.Steel]: "bg-slate-400",
  [PokemonType.Fairy]: "bg-pink-300",
};

const FALLBACK_COLOR = "bg-zinc-400";

function getTypeColorClass(typeName: string): string {
  return TYPE_COLOR_MAP[typeName as PokemonType] ?? FALLBACK_COLOR;
}

export { getTypeColorClass };
