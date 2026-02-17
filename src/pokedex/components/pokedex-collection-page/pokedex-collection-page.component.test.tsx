import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import { usePokedexStore } from "@pokedex/store/pokedex.store";
import { usePokemonListStore } from "@pokemon/store/pokemon-list.store";
import type { CaughtPokemon } from "@pokedex/types/pokedex.types";
import { PokedexCollectionPage } from "./pokedex-collection-page.component";

const PIKACHU: CaughtPokemon = {
  id: 25,
  name: "pikachu",
  imageUrl: "https://example.com/pikachu.png",
  types: ["electric"],
  caughtAt: "2026-01-15T10:30:00.000Z",
};

const BULBASAUR: CaughtPokemon = {
  id: 1,
  name: "bulbasaur",
  imageUrl: "https://example.com/bulbasaur.png",
  types: ["grass"],
  caughtAt: "2026-01-15T09:00:00.000Z",
};

describe("PokedexCollectionPage", () => {
  beforeEach(() => {
    act(() => {
      usePokedexStore.getState().setCollection([]);
      usePokedexStore.getState().setHydrated(false);
      usePokemonListStore.getState().setTotalCount(0);
    });
  });

  it("should show loading state before hydration (E-10)", () => {
    const rehydrateSpy = vi.spyOn(usePokedexStore.persist, "rehydrate").mockImplementation(() => undefined);
    render(<PokedexCollectionPage />);
    expect(screen.getByText("Loading collection...")).toBeInTheDocument();
    rehydrateSpy.mockRestore();
  });

  it("should show empty state when collection is empty (E-3)", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
    });

    render(<PokedexCollectionPage />);
    expect(screen.getByText("My Collection")).toBeInTheDocument();
    expect(screen.getByText("0 / 151")).toBeInTheDocument();
    expect(screen.getByText("No Pokémon caught yet")).toBeInTheDocument();
  });

  it("should show the collection list when pokemon are caught", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
      usePokedexStore.getState().setCollection([PIKACHU, BULBASAUR]);
    });

    render(<PokedexCollectionPage />);
    expect(screen.getByText("pikachu")).toBeInTheDocument();
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("2 / 151")).toBeInTheDocument();
  });

  it("should sort pokemon by caughtAt descending (most recent first)", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
      usePokedexStore.getState().setCollection([BULBASAUR, PIKACHU]);
    });

    render(<PokedexCollectionPage />);
    const names = screen.getAllByRole("img").map((img) => img.getAttribute("alt"));
    expect(names[0]).toBe("pikachu");
    expect(names[1]).toBe("bulbasaur");
  });

  it("should use totalCount from pokemon-list store when available", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
      usePokemonListStore.getState().setTotalCount(1302);
    });

    render(<PokedexCollectionPage />);
    expect(screen.getByText("0 / 1302")).toBeInTheDocument();
  });

  it("should fallback to 151 when totalCount is 0", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
    });

    render(<PokedexCollectionPage />);
    expect(screen.getByText("0 / 151")).toBeInTheDocument();
  });
});
