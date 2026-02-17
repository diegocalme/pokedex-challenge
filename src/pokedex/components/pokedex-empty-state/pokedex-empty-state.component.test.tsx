import { render, screen } from "@testing-library/react";
import { PokedexEmptyState } from "./pokedex-empty-state.component";

describe("PokedexEmptyState", () => {
  it("should render the encouraging message", () => {
    render(<PokedexEmptyState />);
    expect(screen.getByText("Catch more!")).toBeInTheDocument();
  });

  it("should render with a dashed border visual", () => {
    render(<PokedexEmptyState />);
    const container = screen.getByTestId("empty-slot");
    expect(container.className).toContain("border-dashed");
  });
});
