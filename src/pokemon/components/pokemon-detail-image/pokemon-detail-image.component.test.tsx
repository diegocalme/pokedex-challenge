import { render, screen } from "@testing-library/react";
import { PokemonDetailImage } from "./pokemon-detail-image.component";

describe("PokemonDetailImage", () => {
  it("should render an image with correct alt text", () => {
    render(
      <PokemonDetailImage
        imageUrl="https://example.com/pikachu.png"
        altText="pikachu"
      />
    );

    const img = screen.getByRole("img", { name: "pikachu" });
    expect(img).toBeInTheDocument();
  });

  it("should render an image with the correct src", () => {
    render(
      <PokemonDetailImage
        imageUrl="https://example.com/bulbasaur.png"
        altText="bulbasaur"
      />
    );

    const img = screen.getByRole("img", { name: "bulbasaur" });
    expect(img).toHaveAttribute(
      "src",
      "https://example.com/bulbasaur.png"
    );
  });
});
