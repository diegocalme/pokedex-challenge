import type { PokemonSprites } from "@pokemon/types/pokemon-detail.types";
import { resolveOfficialArtworkUrl } from "./pokemon-sprite.util";

const OFFICIAL_ARTWORK_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";
const FRONT_DEFAULT_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";
const FALLBACK_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

describe("resolveOfficialArtworkUrl", () => {
  it("should return official-artwork URL when available", () => {
    const sprites: PokemonSprites = {
      front_default: FRONT_DEFAULT_URL,
      other: {
        "official-artwork": {
          front_default: OFFICIAL_ARTWORK_URL,
        },
      },
    };

    expect(resolveOfficialArtworkUrl(sprites, 25)).toBe(OFFICIAL_ARTWORK_URL);
  });

  it("should fall back to front_default when official-artwork is undefined", () => {
    const sprites: PokemonSprites = {
      front_default: FRONT_DEFAULT_URL,
      other: {
        "official-artwork": {
          front_default: undefined,
        },
      },
    };

    expect(resolveOfficialArtworkUrl(sprites, 25)).toBe(FRONT_DEFAULT_URL);
  });

  it("should fall back to front_default when official-artwork object is missing", () => {
    const sprites: PokemonSprites = {
      front_default: FRONT_DEFAULT_URL,
      other: {},
    };

    expect(resolveOfficialArtworkUrl(sprites, 25)).toBe(FRONT_DEFAULT_URL);
  });

  it("should fall back to front_default when other is undefined", () => {
    const sprites: PokemonSprites = {
      front_default: FRONT_DEFAULT_URL,
    };

    expect(resolveOfficialArtworkUrl(sprites, 25)).toBe(FRONT_DEFAULT_URL);
  });

  it("should fall back to buildSpriteUrl when both sources are missing", () => {
    const sprites: PokemonSprites = {};

    expect(resolveOfficialArtworkUrl(sprites, 25)).toBe(FALLBACK_URL);
  });

  it("should fall back to buildSpriteUrl when sprites are all undefined", () => {
    const sprites: PokemonSprites = {
      front_default: undefined,
      other: {
        "official-artwork": {
          front_default: undefined,
        },
      },
    };

    expect(resolveOfficialArtworkUrl(sprites, 25)).toBe(FALLBACK_URL);
  });
});
