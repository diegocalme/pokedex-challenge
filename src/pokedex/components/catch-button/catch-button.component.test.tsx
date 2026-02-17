import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CatchStatus } from "@pokedex/enums/catch-status.enum";
import { CatchButton } from "./catch-button.component";

describe("CatchButton", () => {
  const defaultProps = {
    status: CatchStatus.Uncaught,
    onCatch: vi.fn(),
    onRelease: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render 'Catch Pokémon!' when status is Uncaught", () => {
    render(<CatchButton {...defaultProps} />);
    expect(screen.getByText("Catch Pokémon!")).toBeInTheDocument();
  });

  it("should render 'Release' when status is Caught", () => {
    render(<CatchButton {...defaultProps} status={CatchStatus.Caught} />);
    expect(screen.getByText("Release")).toBeInTheDocument();
  });

  it("should call onCatch when clicked in Uncaught state", async () => {
    const user = userEvent.setup();
    render(<CatchButton {...defaultProps} />);
    await user.click(screen.getByRole("button"));
    expect(defaultProps.onCatch).toHaveBeenCalledOnce();
    expect(defaultProps.onRelease).not.toHaveBeenCalled();
  });

  it("should call onRelease when clicked in Caught state", async () => {
    const user = userEvent.setup();
    render(
      <CatchButton {...defaultProps} status={CatchStatus.Caught} />
    );
    await user.click(screen.getByRole("button"));
    expect(defaultProps.onRelease).toHaveBeenCalledOnce();
    expect(defaultProps.onCatch).not.toHaveBeenCalled();
  });

  it("should apply red styling when Uncaught", () => {
    render(<CatchButton {...defaultProps} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-red-500");
  });

  it("should apply zinc styling when Caught", () => {
    render(<CatchButton {...defaultProps} status={CatchStatus.Caught} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-zinc-200");
  });
});
