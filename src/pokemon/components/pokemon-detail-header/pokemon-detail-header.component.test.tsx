import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonDetailHeader } from "./pokemon-detail-header.component";

describe("PokemonDetailHeader", () => {
  const onBack = vi.fn();

  beforeEach(() => {
    onBack.mockClear();
  });

  it("should render the back button with accessible label", () => {
    render(<PokemonDetailHeader name="pikachu" id={25} onBack={onBack} />);

    expect(
      screen.getByRole("button", { name: "Back from pikachu" })
    ).toBeInTheDocument();
  });

  it("should call onBack when back button is clicked", async () => {
    const user = userEvent.setup();

    render(<PokemonDetailHeader name="pikachu" id={25} onBack={onBack} />);

    await user.click(screen.getByRole("button", { name: "Back from pikachu" }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("should render the favorite slot when provided", () => {
    render(
      <PokemonDetailHeader
        name="pikachu"
        id={25}
        onBack={onBack}
        favoriteSlot={<button type="button">Favorite</button>}
      />
    );

    expect(screen.getByRole("button", { name: "Favorite" })).toBeInTheDocument();
  });
});
