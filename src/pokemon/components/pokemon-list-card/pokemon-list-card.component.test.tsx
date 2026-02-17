import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PokemonListItem } from "@pokemon/types/pokemon-list.types";
import { PokemonListCard } from "./pokemon-list-card.component";

const BULBASAUR: PokemonListItem = {
  id: 1,
  name: "bulbasaur",
  spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  types: ["grass", "poison"],
};

describe("PokemonListCard", () => {
  it("should render the pokemon name", () => {
    render(<PokemonListCard pokemon={BULBASAUR} onClick={vi.fn()} />);
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
  });

  it("should render the formatted pokemon number", () => {
    render(<PokemonListCard pokemon={BULBASAUR} onClick={vi.fn()} />);
    expect(screen.getByText("#001")).toBeInTheDocument();
  });

  it("should render the sprite image", () => {
    render(<PokemonListCard pokemon={BULBASAUR} onClick={vi.fn()} />);
    const img = screen.getByAltText("bulbasaur");
    expect(img).toBeInTheDocument();
  });

  it("should render type badges", () => {
    render(<PokemonListCard pokemon={BULBASAUR} onClick={vi.fn()} />);
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("poison")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<PokemonListCard pokemon={BULBASAUR} onClick={handleClick} />);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
