import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonSearchBar } from "./pokemon-search-bar.component";

describe("PokemonSearchBar", () => {
  it("should render with the placeholder", () => {
    render(<PokemonSearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search Pokémon")).toBeInTheDocument();
  });

  it("should display the controlled value", () => {
    render(<PokemonSearchBar value="pika" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("pika")).toBeInTheDocument();
  });

  it("should call onChange when typing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PokemonSearchBar value="" onChange={handleChange} />);

    await user.type(screen.getByPlaceholderText("Search Pokémon"), "b");
    expect(handleChange).toHaveBeenCalledWith("b");
  });
});
