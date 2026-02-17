import type { PokemonSprites } from "@pokemon/types/pokemon-detail.types";
import { buildSpriteUrl } from "@pokemon/utils/pokemon-id.util";

function resolveOfficialArtworkUrl(
  sprites: PokemonSprites,
  id: number
): string {
  const officialArtwork =
    sprites.other?.["official-artwork"]?.front_default;
  if (officialArtwork) return officialArtwork;

  const frontDefault = sprites.front_default;
  if (frontDefault) return frontDefault;

  return buildSpriteUrl(id);
}

export { resolveOfficialArtworkUrl };
