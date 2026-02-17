import { useQueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { QueryProvider } from "@shared/components/query-provider.component";

function QueryClientInspector() {
  const queryClient = useQueryClient();
  const defaults = queryClient.getDefaultOptions();

  return (
    <div>
      <span data-testid="stale-time">
        {String(defaults.queries?.staleTime)}
      </span>
      <span data-testid="retry">{String(defaults.queries?.retry)}</span>
      <span data-testid="refetch-on-focus">
        {String(defaults.queries?.refetchOnWindowFocus)}
      </span>
    </div>
  );
}

describe("QueryProvider", () => {
  it("renders children", () => {
    render(
      <QueryProvider>
        <div>Child content</div>
      </QueryProvider>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("provides QueryClient with correct defaults", () => {
    render(
      <QueryProvider>
        <QueryClientInspector />
      </QueryProvider>,
    );

    expect(screen.getByTestId("stale-time")).toHaveTextContent("300000");
    expect(screen.getByTestId("retry")).toHaveTextContent("2");
    expect(screen.getByTestId("refetch-on-focus")).toHaveTextContent("false");
  });
});
