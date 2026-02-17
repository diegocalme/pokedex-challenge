const POKEMON_URL_ID_PATTERN = /\/pokemon\/(\d+)\/?$/;
const SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

function extractPokemonId(url: string): number {
  const match = POKEMON_URL_ID_PATTERN.exec(url);
  if (!match?.[1]) {
    throw new Error(`Invalid PokéAPI URL: ${url}`);
  }
  return Number(match[1]);
}

function buildSpriteUrl(id: number): string {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export { extractPokemonId, buildSpriteUrl };
