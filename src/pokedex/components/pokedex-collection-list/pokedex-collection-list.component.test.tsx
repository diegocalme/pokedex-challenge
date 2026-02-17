import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CaughtPokemon } from "@pokedex/types/pokedex.types";
import { PokedexCollectionList } from "./pokedex-collection-list.component";

const COLLECTION: CaughtPokemon[] = [
  {
    id: 25,
    name: "pikachu",
    imageUrl: "https://example.com/pikachu.png",
    types: ["electric"],
    caughtAt: "2026-01-15T10:30:00.000Z",
  },
  {
    id: 1,
    name: "bulbasaur",
    imageUrl: "https://example.com/bulbasaur.png",
    types: ["grass"],
    caughtAt: "2026-01-15T11:00:00.000Z",
  },
];

describe("PokedexCollectionList", () => {
  it("should render the 'Recently Caught' section title", () => {
    render(<PokedexCollectionList pokemon={COLLECTION} onRelease={vi.fn()} />);
    expect(screen.getByText("Recently Caught")).toBeInTheDocument();
  });

  it("should render a count badge with total", () => {
    render(<PokedexCollectionList pokemon={COLLECTION} onRelease={vi.fn()} />);
    expect(screen.getByText("2 total")).toBeInTheDocument();
  });

  it("should render all pokemon cards", () => {
    render(<PokedexCollectionList pokemon={COLLECTION} onRelease={vi.fn()} />);
    expect(screen.getByText("pikachu")).toBeInTheDocument();
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
  });

  it("should render an empty slot placeholder", () => {
    render(<PokedexCollectionList pokemon={COLLECTION} onRelease={vi.fn()} />);
    expect(screen.getByText("Catch more!")).toBeInTheDocument();
  });

  it("should call onRelease with correct id when a card release is clicked", async () => {
    const user = userEvent.setup();
    const onRelease = vi.fn();
    render(<PokedexCollectionList pokemon={COLLECTION} onRelease={onRelease} />);

    await user.click(screen.getByLabelText("Release pikachu"));
    expect(onRelease).toHaveBeenCalledWith(25);
  });
});
