import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonDetailStatus } from "@pokemon/enums/pokemon-detail-status.enum";
import { PokemonDetailStatusIndicator } from "./pokemon-detail-status-indicator.component";

describe("PokemonDetailStatusIndicator", () => {
  const onRetry = vi.fn();

  beforeEach(() => {
    onRetry.mockClear();
  });

  it("should render loading skeleton when status is Loading", () => {
    render(
      <PokemonDetailStatusIndicator
        status={PokemonDetailStatus.Loading}
        onRetry={onRetry}
      />
    );

    expect(screen.getByTestId("detail-loading-skeleton")).toBeInTheDocument();
  });

  it("should render error message with retry button when status is Error", () => {
    render(
      <PokemonDetailStatusIndicator
        status={PokemonDetailStatus.Error}
        onRetry={onRetry}
      />
    );

    expect(screen.getByText("Failed to load Pokémon data.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  });

  it("should call onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <PokemonDetailStatusIndicator
        status={PokemonDetailStatus.Error}
        onRetry={onRetry}
      />
    );

    await user.click(screen.getByRole("button", { name: "Try Again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("should render not found message when status is NotFound", () => {
    render(
      <PokemonDetailStatusIndicator
        status={PokemonDetailStatus.NotFound}
        onRetry={onRetry}
      />
    );

    expect(screen.getByText("Pokémon not found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Pokédex" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("should render nothing when status is Idle", () => {
    const { container } = render(
      <PokemonDetailStatusIndicator
        status={PokemonDetailStatus.Idle}
        onRetry={onRetry}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render nothing when status is Success", () => {
    const { container } = render(
      <PokemonDetailStatusIndicator
        status={PokemonDetailStatus.Success}
        onRetry={onRetry}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
