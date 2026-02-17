import { extractPokemonId, buildSpriteUrl } from "./pokemon-id.util";

describe("extractPokemonId", () => {
  it("should extract ID from a standard PokéAPI URL", () => {
    expect(
      extractPokemonId("https://pokeapi.co/api/v2/pokemon/25/")
    ).toBe(25);
  });

  it("should extract ID from URL without trailing slash", () => {
    expect(
      extractPokemonId("https://pokeapi.co/api/v2/pokemon/1")
    ).toBe(1);
  });

  it("should handle large IDs", () => {
    expect(
      extractPokemonId("https://pokeapi.co/api/v2/pokemon/10001/")
    ).toBe(10001);
  });

  it("should throw on an invalid URL", () => {
    expect(() => extractPokemonId("https://pokeapi.co/api/v2/ability/1/")).toThrow(
      "Invalid PokéAPI URL"
    );
  });

  it("should throw on an empty string", () => {
    expect(() => extractPokemonId("")).toThrow("Invalid PokéAPI URL");
  });
});

describe("buildSpriteUrl", () => {
  it("should construct the correct sprite URL", () => {
    expect(buildSpriteUrl(25)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
    );
  });

  it("should handle ID 1", () => {
    expect(buildSpriteUrl(1)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    );
  });
});
