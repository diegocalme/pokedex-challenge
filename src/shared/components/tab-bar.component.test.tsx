import { render, screen } from "@testing-library/react";
import { TabBar } from "./tab-bar.component";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("TabBar", () => {
  it("should render three tabs", () => {
    render(<TabBar />);
    expect(screen.getByText("Pokédex")).toBeInTheDocument();
    expect(screen.getByText("Collection")).toBeInTheDocument();
  });

  it("should highlight the active tab", () => {
    render(<TabBar />);
    const pokedexTab = screen.getByText("Pokédex").closest("a");
    expect(pokedexTab?.className).toContain("text-red-500");
  });

  it("should not highlight inactive tabs", () => {
    render(<TabBar />);
    const collectionTab = screen.getByText("Collection").closest("a");
    expect(collectionTab?.className).toContain("text-zinc-400");
  });
});
