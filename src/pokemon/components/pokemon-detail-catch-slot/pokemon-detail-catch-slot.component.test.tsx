import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePokedexStore } from "@pokedex/store/pokedex.store";
import type { PokemonDetailDisplay } from "@pokemon/types/pokemon-detail.types";
import { PokemonDetailCatchSlot } from "./pokemon-detail-catch-slot.component";

const PIKACHU: PokemonDetailDisplay = {
  id: 25,
  name: "pikachu",
  imageUrl: "https://example.com/pikachu.png",
  types: ["electric"],
};

describe("PokemonDetailCatchSlot", () => {
  beforeEach(() => {
    act(() => {
      usePokedexStore.getState().setCollection([]);
      usePokedexStore.getState().setHydrated(true);
    });
  });

  it("should render the catch button in Uncaught state for an uncaught pokemon", () => {
    render(<PokemonDetailCatchSlot pokemon={PIKACHU} />);
    expect(screen.getByText("Catch Pokémon!")).toBeInTheDocument();
  });

  it("should render the release button for a caught pokemon", () => {
    act(() => {
      usePokedexStore.getState().catchPokemon(PIKACHU);
    });

    render(<PokemonDetailCatchSlot pokemon={PIKACHU} />);
    expect(screen.getByText("Release")).toBeInTheDocument();
  });

  it("should catch a pokemon when the catch button is clicked", async () => {
    const user = userEvent.setup();
    render(<PokemonDetailCatchSlot pokemon={PIKACHU} />);

    await user.click(screen.getByRole("button"));

    expect(usePokedexStore.getState().isCaught(25)).toBe(true);
  });

  it("should release a pokemon when the release button is clicked", async () => {
    const user = userEvent.setup();

    act(() => {
      usePokedexStore.getState().catchPokemon(PIKACHU);
    });

    render(<PokemonDetailCatchSlot pokemon={PIKACHU} />);
    await user.click(screen.getByRole("button"));

    expect(usePokedexStore.getState().isCaught(25)).toBe(false);
  });

  it("should have correct aria-label for catch action", () => {
    render(<PokemonDetailCatchSlot pokemon={PIKACHU} />);
    expect(
      screen.getByLabelText("Catch pikachu")
    ).toBeInTheDocument();
  });

  it("should have correct aria-label for release action", () => {
    act(() => {
      usePokedexStore.getState().catchPokemon(PIKACHU);
    });

    render(<PokemonDetailCatchSlot pokemon={PIKACHU} />);
    expect(
      screen.getByLabelText("Release pikachu")
    ).toBeInTheDocument();
  });
});
