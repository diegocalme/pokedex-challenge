import { render, screen } from "@testing-library/react";
import { PokemonTypeBadge } from "./pokemon-type-badge.component";

describe("PokemonTypeBadge", () => {
  it("should render the type name", () => {
    render(<PokemonTypeBadge typeName="grass" />);
    expect(screen.getByText("grass")).toBeInTheDocument();
  });

  it("should apply the correct color class for fire type", () => {
    const { container } = render(<PokemonTypeBadge typeName="fire" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-orange-500");
  });

  it("should apply fallback color for unknown type", () => {
    const { container } = render(<PokemonTypeBadge typeName="unknown" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-zinc-400");
  });
});
