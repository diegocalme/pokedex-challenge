import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CaughtPokemon } from "@pokedex/types/pokedex.types";
import { PokedexCollectionCard } from "./pokedex-collection-card.component";

const PIKACHU: CaughtPokemon = {
  id: 25,
  name: "pikachu",
  imageUrl: "https://example.com/pikachu.png",
  types: ["electric"],
  caughtAt: "2026-01-15T10:30:00.000Z",
};

const CHARIZARD: CaughtPokemon = {
  id: 6,
  name: "charizard",
  imageUrl: "https://example.com/charizard.png",
  types: ["fire", "flying"],
  caughtAt: "2026-01-15T11:00:00.000Z",
};

describe("PokedexCollectionCard", () => {
  it("should render the pokemon name", () => {
    render(<PokedexCollectionCard pokemon={PIKACHU} onRelease={vi.fn()} />);
    expect(screen.getByText("pikachu")).toBeInTheDocument();
  });

  it("should render the formatted pokemon number", () => {
    render(<PokedexCollectionCard pokemon={PIKACHU} onRelease={vi.fn()} />);
    expect(screen.getByText("#025")).toBeInTheDocument();
  });

  it("should render the pokemon image", () => {
    render(<PokedexCollectionCard pokemon={PIKACHU} onRelease={vi.fn()} />);
    const img = screen.getByAltText("pikachu");
    expect(img).toBeInTheDocument();
  });

  it("should render all type badges", () => {
    render(<PokedexCollectionCard pokemon={CHARIZARD} onRelease={vi.fn()} />);
    expect(screen.getByText("fire")).toBeInTheDocument();
    expect(screen.getByText("flying")).toBeInTheDocument();
  });

  it("should call onRelease when release button is clicked", async () => {
    const user = userEvent.setup();
    const onRelease = vi.fn();
    render(<PokedexCollectionCard pokemon={PIKACHU} onRelease={onRelease} />);

    await user.click(screen.getByLabelText("Release pikachu"));
    expect(onRelease).toHaveBeenCalledOnce();
  });
});
