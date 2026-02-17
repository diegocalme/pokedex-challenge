import { render, screen } from "@testing-library/react";
import { PokedexCollectionHeader } from "./pokedex-collection-header.component";

describe("PokedexCollectionHeader", () => {
  it("should render the title 'My Collection'", () => {
    render(<PokedexCollectionHeader count={0} total={151} />);
    expect(screen.getByText("My Collection")).toBeInTheDocument();
  });

  it("should display count and total in the progress card", () => {
    render(<PokedexCollectionHeader count={3} total={151} />);
    expect(screen.getByText("3 / 151")).toBeInTheDocument();
    expect(screen.getByText("Pokémon Caught")).toBeInTheDocument();
  });

  it("should render the progress bar", () => {
    render(<PokedexCollectionHeader count={3} total={151} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "3");
    expect(progressBar).toHaveAttribute("aria-valuemax", "151");
  });

  it("should calculate correct progress bar width", () => {
    render(<PokedexCollectionHeader count={75} total={150} />);
    const fill = screen.getByTestId("progress-fill");
    expect(fill.style.width).toBe("50%");
  });

  it("should clamp progress at 100%", () => {
    render(<PokedexCollectionHeader count={200} total={151} />);
    const fill = screen.getByTestId("progress-fill");
    expect(fill.style.width).toBe("100%");
  });

  it("should handle zero total gracefully", () => {
    render(<PokedexCollectionHeader count={0} total={0} />);
    const fill = screen.getByTestId("progress-fill");
    expect(fill.style.width).toBe("0%");
  });
});
