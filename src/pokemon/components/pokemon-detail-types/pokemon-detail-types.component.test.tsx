import { render, screen } from "@testing-library/react";
import { PokemonDetailTypes } from "./pokemon-detail-types.component";

describe("PokemonDetailTypes", () => {
  it("should render a single type badge", () => {
    render(<PokemonDetailTypes types={["electric"]} />);

    expect(screen.getByText("electric")).toBeInTheDocument();
  });

  it("should render two type badges", () => {
    render(<PokemonDetailTypes types={["grass", "poison"]} />);

    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("poison")).toBeInTheDocument();
  });

  it("should render nothing when types array is empty", () => {
    const { container } = render(<PokemonDetailTypes types={[]} />);

    expect(container.querySelector("[class*='flex']")?.children).toHaveLength(0);
  });
});
