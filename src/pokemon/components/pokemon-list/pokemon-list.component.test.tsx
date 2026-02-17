import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PokemonListItem } from "@pokemon/types/pokemon-list.types";
import { PokemonList } from "./pokemon-list.component";

const ITEMS: PokemonListItem[] = [
  {
    id: 1,
    name: "bulbasaur",
    spriteUrl: "https://example.com/1.png",
    types: ["grass", "poison"],
  },
  {
    id: 4,
    name: "charmander",
    spriteUrl: "https://example.com/4.png",
    types: ["fire"],
  },
  {
    id: 7,
    name: "squirtle",
    spriteUrl: "https://example.com/7.png",
    types: ["water"],
  },
];

describe("PokemonList", () => {
  it("should render the correct number of cards", () => {
    render(<PokemonList items={ITEMS} onItemClick={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("should display the empty state when no items", () => {
    render(<PokemonList items={[]} onItemClick={vi.fn()} />);
    expect(screen.getByText("No Pokémon found.")).toBeInTheDocument();
  });

  it("should call onItemClick with the correct ID", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<PokemonList items={ITEMS} onItemClick={handleClick} />);

    await user.click(screen.getByText("charmander"));
    expect(handleClick).toHaveBeenCalledWith(4);
  });
});
